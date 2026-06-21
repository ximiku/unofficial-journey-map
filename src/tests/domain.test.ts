import { describe, expect, it } from 'vitest';
import { annotations } from '../data/annotations';
import { endings } from '../data/endings';
import { reviews } from '../data/reviews';
import { applyAnnotationPlacement } from '../domain/annotationEngine';
import { resolveEnding } from '../domain/endingResolver';
import { loadGameState, saveGameState, type StorageLike } from '../domain/persistence';
import { initialStats } from '../domain/stats';
import type { GameState } from '../domain/types';
import { getTriggeredReviews } from '../domain/reviewEngine';

function makeState(partial: Partial<GameState> = {}): GameState {
  return {
    view: 'map',
    started: true,
    selectedNodeId: 'shuangchaling',
    activeLayer: 'novel',
    stats: initialStats,
    visitedNodeIds: ['shuangchaling'],
    completedNodeIds: [],
    placedAnnotations: [],
    reviewDecisions: [],
    miniGameDecisions: [],
    presentationMode: false,
    ...partial,
  };
}

class MemoryStorage implements StorageLike {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

describe('annotationEngine', () => {
  it('raises residual voice when a corpse note is placed in the margin', () => {
    const corpse = annotations.find((annotation) => annotation.type === 'corpse-note');
    expect(corpse).toBeDefined();
    const next = applyAnnotationPlacement(initialStats, corpse!, 'margin');
    expect(next.residualVoice).toBeGreaterThan(initialStats.residualVoice);
    expect(next.marginalia).toBeGreaterThan(initialStats.marginalia);
  });
});

describe('reviewEngine', () => {
  it('triggers node review after visiting that node', () => {
    const state = makeState({ visitedNodeIds: ['shuangchaling'] });
    const triggered = getTriggeredReviews(state, reviews, annotations);
    expect(triggered.some((review) => review.id === 'review-shuangchaling')).toBe(true);
  });
});

describe('endingResolver', () => {
  it('resolves blank map for high blank sense plus blank note', () => {
    const state = makeState({
      stats: { ...initialStats, blankSense: 10, compassion: 8 },
      placedAnnotations: [
        {
          annotationId: 'ann-lingshan-blank',
          nodeId: 'lingshan',
          zone: 'blankSpace',
          placedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
    expect(resolveEnding(state, endings, annotations).id).toBe('blank-map');
  });
});

describe('persistence', () => {
  it('saves and hydrates versioned state', () => {
    const storage = new MemoryStorage();
    const state = makeState({ selectedNodeId: 'huoyanshan' });
    saveGameState(state, storage);
    expect(loadGameState(storage)?.selectedNodeId).toBe('huoyanshan');
  });

  it('hydrates older saves without completed node progress', () => {
    const storage = new MemoryStorage();
    const legacyState: Partial<GameState> = makeState({ selectedNodeId: 'shuangchaling' });
    delete legacyState.completedNodeIds;
    storage.setItem('unofficial-journey-map-save-v1', JSON.stringify({ version: 1, state: legacyState }));
    expect(loadGameState(storage)?.completedNodeIds).toEqual([]);
  });
});
