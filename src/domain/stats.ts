import type { GameStats, StatDelta } from './types';

export const statLabels: Record<keyof GameStats, { label: string; description: string }> = {
  officialness: { label: '正本度', description: '官方路线与机构可接受程度。' },
  marginalia: { label: '旁注度', description: '非官方声音在地图边缘的密度。' },
  residualVoice: { label: '余声', description: '无名者、遗物和未被纳入者留下的痕迹。' },
  contradiction: { label: '驳杂', description: '不兼容叙述共同存在的程度。' },
  reviewRisk: { label: '审稿风险', description: '被退回、删改或要求改写的概率。' },
  blankSense: { label: '留白感', description: '保留沉默而不强行解释的能力。' },
  compassion: { label: '慈悲', description: '对他者的非工具性注意。' },
  routeClarity: { label: '路线清晰度', description: '地图作为交付物的可读性。' },
};

export const initialStats: GameStats = {
  officialness: 4,
  marginalia: 1,
  residualVoice: 1,
  contradiction: 1,
  reviewRisk: 0,
  blankSense: 1,
  compassion: 2,
  routeClarity: 5,
};

export function clampStat(value: number): number {
  return Math.max(0, Math.min(12, value));
}

export function applyDelta(stats: GameStats, delta: StatDelta): GameStats {
  return (Object.keys(stats) as Array<keyof GameStats>).reduce<GameStats>(
    (next, key) => {
      next[key] = clampStat(stats[key] + (delta[key] ?? 0));
      return next;
    },
    { ...stats },
  );
}

export function statDeltaToText(delta: StatDelta): string {
  return Object.entries(delta)
    .map(([key, value]) => `${statLabels[key as keyof GameStats].label}${value && value > 0 ? '+' : ''}${value}`)
    .join('，');
}
