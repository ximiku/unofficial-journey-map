import type { SourceRef } from '../domain/types';

export const sources: SourceRef[] = [
  {
    id: 'xyj',
    title: '《西游记》通行本章节线索',
    type: 'primary',
    note: '用于确定节点章节范围和官方事件骨架。游戏文本为转述与原创批注，不复制长篇原文。',
  },
  {
    id: 'datang-xiyu',
    title: '《大唐西域记》历史地理幽灵线',
    type: 'historical',
    note: '作为小说路线之外的历史参照，提醒玩家真实地理与文学地理无法完全重合。',
  },
  {
    id: 'journey-scholarship',
    title: '西游研究与宗教文学研究线索',
    type: 'scholarly',
    note: '用于支持身份、性别、仪式、帝国授权和神怪叙事的解释框架。',
  },
  {
    id: 'minor-retelling',
    title: '小人物重述与当代改编影响',
    type: 'adaptation',
    note: '作为小妖批注队、边缘档案和非英雄视角的设计影响。',
  },
  {
    id: 'archive-design',
    title: '档案 UI、古籍装帧与文书系统视觉参考',
    type: 'design-reference',
    note: '用于纸纹、印章、线绳、批改痕迹和长卷地图的低美术成本实现。',
  },
];
