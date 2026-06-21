import type { AnnotationCard, Ending, GameState } from './types';

function statsMatch(state: GameState, ending: Ending): boolean {
  const above = Object.entries(ending.conditions.statAbove ?? {}).every(
    ([key, value]) => state.stats[key as keyof typeof state.stats] >= value,
  );
  const below = Object.entries(ending.conditions.statBelow ?? {}).every(
    ([key, value]) => state.stats[key as keyof typeof state.stats] <= value,
  );
  return above && below;
}

function contentMatch(state: GameState, ending: Ending, annotations: AnnotationCard[]): boolean {
  const nodeMatch = (ending.conditions.requiredNodes ?? []).every((id) => state.visitedNodeIds.includes(id));
  const placedTypes = state.placedAnnotations
    .map((placed) => annotations.find((annotation) => annotation.id === placed.annotationId)?.type)
    .filter(Boolean);
  const typeMatch = (ending.conditions.requiredAnnotationTypes ?? []).every((type) => placedTypes.includes(type));
  return nodeMatch && typeMatch;
}

export function resolveEnding(state: GameState, endings: Ending[], annotations: AnnotationCard[]): Ending {
  const matched = endings.find((ending) => statsMatch(state, ending) && contentMatch(state, ending, annotations));
  return matched ?? endings.find((ending) => ending.unlockedByDefault) ?? endings[0];
}

export function getReachableEndings(state: GameState, endings: Ending[], annotations: AnnotationCard[]): Ending[] {
  return endings.filter((ending) => statsMatch(state, ending) && contentMatch(state, ending, annotations));
}
