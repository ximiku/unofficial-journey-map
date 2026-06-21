import type { AnnotationCard, GameState, ReviewEvent } from './types';
import { applyDelta } from './stats';

function statTriggerMatches(state: GameState, review: ReviewEvent): boolean {
  const { statAbove, statBelow } = review.trigger;
  const above = Object.entries(statAbove ?? {}).every(
    ([key, value]) => state.stats[key as keyof typeof state.stats] >= value,
  );
  const below = Object.entries(statBelow ?? {}).every(
    ([key, value]) => state.stats[key as keyof typeof state.stats] <= value,
  );
  return above && below;
}

function listTriggerMatches(state: GameState, review: ReviewEvent, annotations: AnnotationCard[]): boolean {
  const requiredNodes = review.trigger.visitedNodeIds ?? [];
  const nodeMatch = requiredNodes.every((id) => state.visitedNodeIds.includes(id));

  const requiredTypes = review.trigger.annotationTypesPlaced ?? [];
  const placedTypes = state.placedAnnotations
    .map((placed) => annotations.find((annotation) => annotation.id === placed.annotationId)?.type)
    .filter(Boolean);
  const typeMatch = requiredTypes.every((type) => placedTypes.includes(type));

  return nodeMatch && typeMatch;
}

export function getTriggeredReviews(
  state: GameState,
  reviews: ReviewEvent[],
  annotations: AnnotationCard[],
): ReviewEvent[] {
  const handled = new Set(state.reviewDecisions.map((decision) => decision.reviewId));
  return reviews.filter((review) => {
    if (handled.has(review.id)) return false;
    if (review.nodeId && !state.visitedNodeIds.includes(review.nodeId)) return false;
    return statTriggerMatches(state, review) && listTriggerMatches(state, review, annotations);
  });
}

export function applyReviewChoice(state: GameState, review: ReviewEvent, choiceId: string): GameState {
  const choice = review.choices.find((item) => item.id === choiceId);
  if (!choice) {
    throw new Error(`Review choice ${choiceId} not found in ${review.id}`);
  }

  return {
    ...state,
    stats: applyDelta(state.stats, choice.effects),
    reviewDecisions: [
      ...state.reviewDecisions,
      { reviewId: review.id, choiceId, decidedAt: new Date().toISOString() },
    ],
  };
}
