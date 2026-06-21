import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { annotations } from '../data/annotations';
import { endings } from '../data/endings';
import { defaultNodeId, routeNodes } from '../data/nodes';
import { reviews } from '../data/reviews';
import { applyAnnotationPlacement } from '../domain/annotationEngine';
import { resolveEnding } from '../domain/endingResolver';
import { clearGameState, loadGameState, saveGameState } from '../domain/persistence';
import { applyDelta, initialStats } from '../domain/stats';
import type { GameState, LayerId, PlacementZone, StatDelta } from '../domain/types';
import { applyReviewChoice, getTriggeredReviews } from '../domain/reviewEngine';

type Action =
  | { type: 'START' }
  | { type: 'GO_HOME' }
  | { type: 'OPEN_ARCHIVE' }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'SELECT_NODE'; nodeId: string }
  | { type: 'SET_LAYER'; layer: LayerId }
  | { type: 'PLACE_ANNOTATION'; annotationId: string; zone: PlacementZone }
  | { type: 'DECIDE_REVIEW'; reviewId: string; choiceId: string }
  | { type: 'DECIDE_MINIGAME'; miniGameId: string; choiceId: string; effects: StatDelta }
  | { type: 'COMPLETE_NODE'; nodeId: string }
  | { type: 'FINISH' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_PRESENTATION' };

const freshState: GameState = {
  view: 'home',
  started: false,
  selectedNodeId: defaultNodeId,
  activeLayer: 'novel',
  stats: initialStats,
  visitedNodeIds: [],
  completedNodeIds: getCompletedBefore(defaultNodeId),
  placedAnnotations: [],
  reviewDecisions: [],
  miniGameDecisions: [],
  presentationMode: false,
};

function getCompletedBefore(nodeId: string): string[] {
  const nodeIndex = routeNodes.findIndex((node) => node.id === nodeId);
  return nodeIndex > 0 ? routeNodes.slice(0, nodeIndex).map((node) => node.id) : [];
}

function normalizeState(state: GameState): GameState {
  if (state.completedNodeIds.length > 0) return state;
  return {
    ...state,
    completedNodeIds: getCompletedBefore(state.selectedNodeId || defaultNodeId),
  };
}

function addVisited(state: GameState, nodeId: string): string[] {
  return state.visitedNodeIds.includes(nodeId) ? state.visitedNodeIds : [...state.visitedNodeIds, nodeId];
}

function getCurrentProgressNodeId(state: GameState): string {
  return routeNodes.find((node) => !state.completedNodeIds.includes(node.id))?.id ?? routeNodes[routeNodes.length - 1].id;
}

function canSelectNode(state: GameState, nodeId: string): boolean {
  return nodeId === state.selectedNodeId || nodeId === getCurrentProgressNodeId(state) || state.completedNodeIds.includes(nodeId);
}

function addCompleted(state: GameState, nodeId: string): string[] {
  return state.completedNodeIds.includes(nodeId) ? state.completedNodeIds : [...state.completedNodeIds, nodeId];
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        view: 'map',
        started: true,
        selectedNodeId: state.selectedNodeId || defaultNodeId,
        visitedNodeIds: addVisited(state, state.selectedNodeId || defaultNodeId),
      };
    case 'GO_HOME':
      return { ...state, view: 'home' };
    case 'OPEN_ARCHIVE':
      return { ...state, view: 'archive' };
    case 'RETURN_TO_MAP':
      return { ...state, view: 'map' };
    case 'SELECT_NODE':
      if (!canSelectNode(state, action.nodeId)) return state;
      return {
        ...state,
        view: 'map',
        selectedNodeId: action.nodeId,
        visitedNodeIds: addVisited(state, action.nodeId),
      };
    case 'SET_LAYER':
      return { ...state, activeLayer: action.layer };
    case 'PLACE_ANNOTATION': {
      if (state.placedAnnotations.some((item) => item.annotationId === action.annotationId)) return state;
      const annotation = annotations.find((item) => item.id === action.annotationId);
      if (!annotation) return state;
      return {
        ...state,
        stats: applyAnnotationPlacement(state.stats, annotation, action.zone),
        placedAnnotations: [
          ...state.placedAnnotations,
          {
            annotationId: action.annotationId,
            nodeId: annotation.nodeId,
            zone: action.zone,
            placedAt: new Date().toISOString(),
          },
        ],
      };
    }
    case 'DECIDE_REVIEW': {
      const review = reviews.find((item) => item.id === action.reviewId);
      if (!review || state.reviewDecisions.some((item) => item.reviewId === action.reviewId)) return state;
      return applyReviewChoice(state, review, action.choiceId);
    }
    case 'DECIDE_MINIGAME':
      if (state.miniGameDecisions.some((item) => item.miniGameId === action.miniGameId)) return state;
      return {
        ...state,
        stats: applyDelta(state.stats, action.effects),
        miniGameDecisions: [
          ...state.miniGameDecisions,
          { miniGameId: action.miniGameId, choiceId: action.choiceId, decidedAt: new Date().toISOString() },
        ],
      };
    case 'COMPLETE_NODE': {
      if (action.nodeId !== state.selectedNodeId || action.nodeId !== getCurrentProgressNodeId(state)) return state;
      const nodeIndex = routeNodes.findIndex((node) => node.id === action.nodeId);
      const nextNode = nodeIndex >= 0 ? routeNodes[nodeIndex + 1] : undefined;
      const completedNodeIds = addCompleted(state, action.nodeId);
      return {
        ...state,
        selectedNodeId: nextNode?.id ?? state.selectedNodeId,
        visitedNodeIds: nextNode ? addVisited(state, nextNode.id) : state.visitedNodeIds,
        completedNodeIds,
      };
    }
    case 'FINISH': {
      const ending = resolveEnding(state, endings, annotations);
      return { ...state, view: 'ending', endingId: ending.id };
    }
    case 'RESET':
      clearGameState();
      return freshState;
    case 'TOGGLE_PRESENTATION':
      return { ...state, presentationMode: !state.presentationMode };
    default:
      return state;
  }
}

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, freshState, (base) => normalizeState(loadGameState() ?? base));

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return context;
}

export function useTriggeredReviews() {
  const { state } = useGame();
  return getTriggeredReviews(state, reviews, annotations);
}
