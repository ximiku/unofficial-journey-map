import { describe, expect, it } from 'vitest';
import { annotations } from '../data/annotations';
import { endings } from '../data/endings';
import { evidenceItems } from '../data/evidence';
import { miniGames } from '../data/miniGames';
import { routeNodes } from '../data/nodes';
import { reviews } from '../data/reviews';
import { sources } from '../data/sources';

describe('data integrity', () => {
  it('contains the required content volume', () => {
    expect(routeNodes).toHaveLength(26);
    expect(annotations.length).toBeGreaterThanOrEqual(70);
    expect(reviews.length).toBeGreaterThanOrEqual(18);
    expect(endings).toHaveLength(8);
    expect(miniGames.length).toBeGreaterThanOrEqual(7);
  });

  it('keeps route references resolvable', () => {
    const annotationIds = new Set(annotations.map((annotation) => annotation.id));
    const reviewIds = new Set(reviews.map((review) => review.id));
    const evidenceIds = new Set(evidenceItems.map((evidence) => evidence.id));
    const sourceIds = new Set(sources.map((source) => source.id));
    const miniGameIds = new Set(miniGames.map((game) => game.id));

    routeNodes.forEach((node) => {
      expect(node.annotationIds.every((id) => annotationIds.has(id))).toBe(true);
      expect(node.reviewIds.every((id) => reviewIds.has(id))).toBe(true);
      expect(node.evidenceIds.every((id) => evidenceIds.has(id))).toBe(true);
      expect(node.sourceRefs.every((id) => sourceIds.has(id))).toBe(true);
      if (node.miniGameId) expect(miniGameIds.has(node.miniGameId)).toBe(true);
      expect(node.unofficialQuestion.length).toBeGreaterThan(8);
      expect(node.literaryNote.length).toBeGreaterThan(18);
    });
  });
});
