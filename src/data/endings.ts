import type { Ending } from '../domain/types';

export const endings: Ending[] = [
  {
    id: 'ten-thousand-notes',
    title: '万注本',
    subtitle: '地图拥挤到不可阅读，许多人终于在其中找到自己。',
    conditions: {
      statAbove: { marginalia: 8, residualVoice: 7, contradiction: 6 },
      requiredAnnotationTypes: ['marginal-note', 'counter-note'],
    },
    body: [
      '终页没有空处。线绳缠住山，朱印压住水，旁注从边缘长回正文。',
      '整理局退回你的图，说比例尺已不具备行政价值。路边的人却说，第一次看见自己的鞋也在图上。',
    ],
    mapTransformation: '主路线变成密集边档，阅读困难，但余声强烈。',
  },
  {
    id: 'blank-map',
    title: '无字图',
    subtitle: '你理解何时应留下空白。',
    conditions: {
      statAbove: { blankSense: 8, compassion: 5 },
      requiredAnnotationTypes: ['blank-note'],
    },
    body: [
      '你没有替他们说完。你只在他们消失的地方，留下纸的呼吸。',
      '审稿人问空白是什么意思。你回答：它不是缺页，是拒绝把沉默加工成可交付结论。',
    ],
    mapTransformation: '地图出现空白牌位，终点不再吞没未完成的声音。',
  },
  {
    id: 'langlang-archive',
    title: '浪浪山档案馆',
    subtitle: '小妖没有抵达灵山，却建起路边档案馆。',
    conditions: {
      statAbove: { residualVoice: 6, compassion: 6 },
      requiredNodes: ['gaolaozhuang', 'huoyanshan'],
    },
    body: [
      '小猪妖把退稿信按日期夹好，蛤蟆精把画歪的路线挂在门口，黄鼠狼负责口述登记，猿猴临摹员练习写“不必成为英雄”。',
      '他们没有取到经，却把经过的人留下来。路因此不再只是通向灵山，也通向一间愿意听错话的小屋。',
    ],
    mapTransformation: '地图边缘长出浪浪山支线，成为新的阅读入口。',
  },
  {
    id: 'review-failure',
    title: '审稿失败',
    subtitle: '地图因过于驳杂被退回，而退稿成为另一种流传。',
    conditions: {
      statAbove: { reviewRisk: 8, contradiction: 7 },
    },
    body: [
      '退稿章盖得很重，像一处新伤。意见写得礼貌：材料多处不宜展开，建议重绘。',
      '你把退稿意见也收进档案。后来有人传抄的不是正图，而是那份密密麻麻的退稿。',
    ],
    mapTransformation: '所有审稿意见成为红蓝叠印，地图被退回但开始流传。',
  },
  {
    id: 'merit-ledger',
    title: '功德账本',
    subtitle: '你优化了官方功德，却发现功德核算取代了慈悲。',
    conditions: {
      statAbove: { officialness: 8, routeClarity: 8 },
      statBelow: { compassion: 3 },
      requiredAnnotationTypes: ['ledger-note'],
    },
    body: [
      '账目漂亮，路线清楚，损耗被合并到可接受范围。功德像数字一样上升。',
      '你翻到最后一页，发现慈悲没有栏位。系统提示：无此字段。',
    ],
    mapTransformation: '地图变成账本，节点以可核算功德排序。',
  },
  {
    id: 'ghost-route',
    title: '幽灵路线',
    subtitle: '历史路线与小说路线无法重合，生成幽灵地理。',
    conditions: {
      statAbove: { contradiction: 6, blankSense: 5 },
      requiredNodes: ['changan', 'lingshan'],
      requiredAnnotationTypes: ['map-note'],
    },
    body: [
      '你打开历史层，发现它没有义务配合小说。两个长安互相偏移，两个灵山互相沉默。',
      '地图没有坏。它只是拒绝把文学、历史和愿望强行压成同一条线。',
    ],
    mapTransformation: '历史幽灵层显影，与小说路线平行漂移。',
  },
  {
    id: 'deleted-residue',
    title: '删余声',
    subtitle: '终页清晰、权威而闹鬼。',
    conditions: {
      statAbove: { officialness: 8, routeClarity: 8 },
      statBelow: { residualVoice: 2, marginalia: 2 },
    },
    body: [
      '你的路线图被接受。没有多余鞋印，没有支线，没有异议，连风都被整理成向西。',
      '夜里纸页轻响。你以为是虫蛀，后来发现是被删掉的名字在学会呼吸。',
    ],
    mapTransformation: '地图清洁，空白处出现无法点击的阴影。',
  },
  {
    id: 'official-map',
    title: '正经图',
    subtitle: '地图干净、被接受，但精神上空洞。',
    conditions: {
      statAbove: { officialness: 6, routeClarity: 6 },
    },
    body: [
      '路线从长安到灵山，笔直、清楚、易于汇报。审稿人说：此图可用。',
      '你也知道它可用。只是每当有人问双叉岭还有谁，你发现图上没有地方回答。',
    ],
    mapTransformation: '主路线获得朱印批准，边缘支线被淡化。',
    unlockedByDefault: true,
  },
];
