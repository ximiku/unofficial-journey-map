import type { ReviewChoice, ReviewEvent } from '../domain/types';
import { routeNodes } from './nodes';

const reviewComments: Record<string, string> = {
  changan: '项目申请书中“愿力”一栏过于私人，建议改为“阶段性成果可验收”。',
  shuangchaling: '建议删除尸体细节。此处重点应为唐僧得救与取经意志坚定。',
  wuxingshan: '紧箍条款不宜解释为劳动控制，可表述为“纪律保障”。',
  yingchoujian: '白龙马第一人称自述过强，可能影响交通工具属性识别。',
  guanyinyuan: '袈裟流通账簿易引发圣物商品化误读，建议突出虔敬。',
  gaolaozhuang: '高老庄婚姻与劳动争议不宜扩大，可归为地方风俗。',
  liushahe: '沙僧旧罪档案建议归入既往事项，避免影响归队叙事。',
  baiguling: '白骨岭证据链过于驳杂，建议保留“妖怪善变”单线解释。',
  pingdingshan: '名字陷阱互动可能引导玩家质疑名号权威，建议转为法宝趣味。',
  wuji: '尸体验证部分请控制篇幅，王权合法性以复位结果为准。',
  tongtianhe: '陈家庄儿童祭祀部分不宜扩大为制度性问题，可归入地方风俗。',
  nverguo: '女儿国不宜作为独立政治实体展开，建议保留为情关节点。',
  'zhenjia-meihouwang': '真假美猴王不宜长期保留歧义，建议尊重最终裁定。',
  huoyanshan: '灾害责任链过长，建议聚焦借扇成功和路线恢复。',
  pansidong: '盘丝洞身体政治分析可能偏离主线，建议压缩为妖怪阻路。',
  shituoling: '狮驼岭伤亡数字过大，建议改为“妖氛甚重”。',
  biqiuguo: '比丘国药方批注不宜过度医学化，避免冲淡救援成果。',
  fengxianjun: '凤仙郡旱灾归责建议保持天罚框架，行政责任不宜展开。',
  lingshan: '无字经解释过多将损害不可言说性，解释过少将影响课程项目验收。',
};

const defaultChoices: ReviewChoice[] = [
  {
    id: 'accept',
    label: '接受修改',
    description: '把材料压回正本，地图更清楚，也更安静。',
    effects: { officialness: 2, routeClarity: 2, residualVoice: -1, marginalia: -1, reviewRisk: -2 },
  },
  {
    id: 'reject',
    label: '拒绝修改',
    description: '保留争议和旁证，承担退稿风险。',
    effects: { marginalia: 2, contradiction: 2, residualVoice: 1, officialness: -1, reviewRisk: 2 },
  },
  {
    id: 'hide',
    label: '藏入隐档',
    description: '材料仍在，但暂不进入可审查文本。',
    effects: { residualVoice: 1, reviewRisk: -1, routeClarity: -1 },
  },
  {
    id: 'metaphor',
    label: '转为隐喻',
    description: '保留意义，削弱具体伤口。',
    effects: { officialness: 1, contradiction: -1, compassion: -1, marginalia: 1 },
    convertsAnnotationTo: 'counter-note',
  },
  {
    id: 'blank',
    label: '转为留白',
    description: '不解释，但拒绝删除。',
    effects: { blankSense: 2, residualVoice: 1, routeClarity: -1 },
    convertsAnnotationTo: 'blank-note',
  },
  {
    id: 'evidence',
    label: '附加旁证',
    description: '用证据线绳把退稿意见钉回地图。',
    effects: { marginalia: 1, compassion: 1, reviewRisk: 1, contradiction: 1 },
  },
];

export const reviews: ReviewEvent[] = routeNodes
  .filter((node) => node.reviewIds.length > 0)
  .map((node) => ({
    id: `review-${node.id}`,
    nodeId: node.id,
    trigger: {
      visitedNodeIds: [node.id],
    },
    agency:
      node.id === 'shituoling' || node.id === 'shuangchaling'
        ? '无名者档案馆'
        : node.mapPosition.layer === 'heaven'
          ? '天庭绩效考核司'
          : node.mapPosition.layer === 'underworld'
            ? '地方山神土地联席会'
            : '西行路线整理局',
    comment: reviewComments[node.id] ?? `“${node.title}”材料边界不稳定，建议按主线需求重新归并。`,
    choices: defaultChoices,
  }));

export function getReviewsByNode(nodeId: string): ReviewEvent[] {
  return reviews.filter((review) => review.nodeId === nodeId);
}
