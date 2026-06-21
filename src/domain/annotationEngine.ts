import type { AnnotationCard, GameStats, PlacedAnnotation, PlacementZone, StatDelta } from './types';
import { applyDelta } from './stats';

const riskDelta: Record<AnnotationCard['reviewRisk'], StatDelta> = {
  low: {},
  medium: { reviewRisk: 1 },
  high: { reviewRisk: 2 },
};

export function getAnnotationDelta(annotation: AnnotationCard, zone: PlacementZone): StatDelta {
  const placementDelta = annotation.effectsByPlacement[zone] ?? {};
  if (zone === 'reviewPile') {
    return { ...placementDelta, ...riskDelta[annotation.reviewRisk] };
  }
  return placementDelta;
}

export function applyAnnotationPlacement(
  stats: GameStats,
  annotation: AnnotationCard,
  zone: PlacementZone,
): GameStats {
  if (!annotation.placementOptions.includes(zone)) {
    throw new Error(`Annotation ${annotation.id} cannot be placed in ${zone}`);
  }
  return applyDelta(stats, getAnnotationDelta(annotation, zone));
}

export function hasPlacedAnnotation(placed: PlacedAnnotation[], annotationId: string): boolean {
  return placed.some((item) => item.annotationId === annotationId);
}
