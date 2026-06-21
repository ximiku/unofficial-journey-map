import type { EvidenceItem } from '../domain/types';
import { routeNodes } from './nodes';

const kinds: EvidenceItem['kind'][] = ['document', 'relic', 'testimony', 'ledger', 'map', 'body', 'ritual', 'voice'];

export const evidenceItems: EvidenceItem[] = routeNodes.flatMap((node, index) => [
  {
    id: `ev-${node.id}-1`,
    nodeId: node.id,
    title: `${node.shortTitle ?? node.title}旁证甲`,
    kind: kinds[index % kinds.length],
    description: `一件来自“${node.title}”的档案物：${node.artCue}。它不证明全部事实，只证明官方摘要之外仍有未被安放的材料。`,
  },
  {
    id: `ev-${node.id}-2`,
    nodeId: node.id,
    title: `${node.shortTitle ?? node.title}旁证乙`,
    kind: kinds[(index + 3) % kinds.length],
    description: `附在节点边缘的二级证据，记录问题：“${node.unofficialQuestion}”`,
  },
]);

export function getEvidenceByNode(nodeId: string): EvidenceItem[] {
  return evidenceItems.filter((item) => item.nodeId === nodeId);
}
