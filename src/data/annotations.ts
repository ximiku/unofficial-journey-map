import type { AnnotationCard, AnnotationType, PlacementZone, StatDelta } from '../domain/types';
import { routeNodes } from './nodes';

const placementOptions: PlacementZone[] = ['mainText', 'margin', 'hiddenArchive', 'reviewPile', 'blankSpace'];

const marginalTypeCycle: AnnotationType[] = [
  'marginal-note',
  'counter-note',
  'mistaken-note',
  'dream-note',
  'ledger-note',
  'corpse-note',
  'translation-note',
  'map-note',
];

const baseEffects: Partial<Record<PlacementZone, StatDelta>> = {
  mainText: { officialness: 2, routeClarity: 1, marginalia: -1, contradiction: -1 },
  margin: { marginalia: 2, residualVoice: 1, contradiction: 1, officialness: -1 },
  hiddenArchive: { residualVoice: 1, reviewRisk: -1, routeClarity: -1 },
  reviewPile: { officialness: 1, routeClarity: 1, reviewRisk: 1 },
  blankSpace: { blankSense: 2, residualVoice: 1, routeClarity: -1, officialness: -1 },
};

const typeEffects: Partial<Record<AnnotationType, StatDelta>> = {
  'corpse-note': { residualVoice: 1, compassion: 1, reviewRisk: 1 },
  'counter-note': { contradiction: 1, marginalia: 1 },
  'mistaken-note': { contradiction: 2, routeClarity: -1 },
  'dream-note': { blankSense: 1, contradiction: 1 },
  'ledger-note': { officialness: 1, routeClarity: 1, compassion: -1 },
  'translation-note': { contradiction: 1, compassion: 1 },
  'map-note': { marginalia: 1, routeClarity: -1 },
  'blank-note': { blankSense: 1, residualVoice: 1 },
};

const specificMarginalText: Record<string, string> = {
  shuangchaling:
    '这里是取经路真正开始的地方。官方路线写唐僧遇难，山风写三个人上路，一个人被救。二名不是名字，随从也不是人生。',
  wuxingshan:
    '山被移开，箍却留在皮肤附近。系统称之为归正，我在边上写下：控制也能穿成救赎的衣服。',
  yingchoujian:
    '地图图标把龙折成马。若交通工具不再说话，路线就会显得顺滑许多。',
  gaolaozhuang:
    '村里每个人都说自己只是听说。听说最终变成了判词，把劳动、婚姻和饥饿一并推给怪物。',
  baiguling:
    '证据在这里不是白的，骨头也不是。三次识破与三次杀戮之间，有一条地图不愿标出的线。',
  nverguo:
    '外来者把制度叫作情关，把法律叫作诱惑。入境表安静地反驳：你们不是唯一会命名身体的人。',
  'zhenjia-meihouwang':
    '如果两条路线都记得同一场暴力，谁有权说其中一条是假？',
  huoyanshan:
    '官方地图只画一座红山。村民地图画井、坟、迁徙线和卖水的人。路要过去，可路过去以后，山还热不热？',
  shituoling:
    '系统建议将三万七千个名字合并为“妖氛甚重”。我点击撤销。系统提示：撤销失败，地图空间不足。',
  lingshan:
    '你没有替他们说完。你只在他们消失的地方，留下纸的呼吸。',
};

function mergeDelta(...deltas: Array<StatDelta | undefined>): StatDelta {
  return deltas.reduce<StatDelta>((merged, delta) => {
    Object.entries(delta ?? {}).forEach(([key, value]) => {
      const statKey = key as keyof StatDelta;
      merged[statKey] = (merged[statKey] ?? 0) + (value ?? 0);
    });
    return merged;
  }, {});
}

function withTypeEffects(type: AnnotationType): Partial<Record<PlacementZone, StatDelta>> {
  return Object.fromEntries(
    placementOptions.map((zone) => [zone, mergeDelta(baseEffects[zone], typeEffects[type])]),
  ) as Partial<Record<PlacementZone, StatDelta>>;
}

function riskForType(type: AnnotationType): AnnotationCard['reviewRisk'] {
  if (type === 'corpse-note' || type === 'counter-note') return 'high';
  if (type === 'ledger-note' || type === 'map-note' || type === 'mistaken-note') return 'medium';
  return 'low';
}

export const annotations: AnnotationCard[] = routeNodes.flatMap((node, index) => {
  const marginalType = marginalTypeCycle[index % marginalTypeCycle.length];
  return [
    {
      id: `ann-${node.id}-official`,
      nodeId: node.id,
      type: 'official-note',
      title: `${node.shortTitle ?? node.title}正注`,
      speaker: '西行路线整理局',
      text: `${node.officialSummary} 建议归入主路线，保持回目清楚、节点连续、损耗从简。`,
      placementOptions,
      effectsByPlacement: withTypeEffects('official-note'),
      reviewRisk: 'low',
      tags: ['正本', '路线', '可交付'],
    },
    {
      id: `ann-${node.id}-marginal`,
      nodeId: node.id,
      type: marginalType,
      title: `${node.shortTitle ?? node.title}旁注`,
      speaker: index % 4 === 0 ? '小猪妖档案员' : index % 4 === 1 ? '蛤蟆精测绘员' : index % 4 === 2 ? '黄鼠狼传闻员' : '猿猴临摹员',
      text:
        specificMarginalText[node.id] ??
        `${node.literaryNote} 这张卡请求在地图边缘保留问题：“${node.unofficialQuestion}”`,
      placementOptions,
      effectsByPlacement: withTypeEffects(marginalType),
      reviewRisk: riskForType(marginalType),
      tags: ['旁证', '小妖批注', node.thresholdTypes[0]],
    },
    {
      id: `ann-${node.id}-blank`,
      nodeId: node.id,
      type: 'blank-note',
      title: `${node.shortTitle ?? node.title}留白注`,
      speaker: '无名者档案馆',
      text: `此处不替沉默者说完。只在“${node.title}”旁留一块空白名牌，让问题继续呼吸：${node.unofficialQuestion}`,
      placementOptions,
      effectsByPlacement: withTypeEffects('blank-note'),
      reviewRisk: 'medium',
      tags: ['留白', '余声', '伦理克制'],
    },
  ];
});

export function getAnnotationsByNode(nodeId: string): AnnotationCard[] {
  return annotations.filter((annotation) => annotation.nodeId === nodeId);
}
