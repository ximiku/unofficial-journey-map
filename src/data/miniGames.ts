import type { MiniGameDefinition } from '../domain/types';

export const miniGames: MiniGameDefinition[] = [
  {
    id: 'permit-form',
    nodeId: 'changan',
    title: '取经项目申请书',
    prompt: '整理出发文书时，你要把“愿力”写成什么？',
    choices: [
      { id: 'mission', label: '阶段性成果', description: '让愿望进入可验收语言。', effects: { officialness: 2, routeClarity: 1, compassion: -1 } },
      { id: 'vow', label: '私人誓愿', description: '保留愿望的非制度部分。', effects: { compassion: 1, contradiction: 1, officialness: -1 } },
      { id: 'translation', label: '待译字段', description: '承认出发本身需要翻译。', effects: { blankSense: 1, marginalia: 1 } },
    ],
  },
  {
    id: 'relic-sorting',
    nodeId: 'shuangchaling',
    title: '遗物整理',
    prompt: '破鞋、干粮、家书、骨片和空白名牌摆在行囊里。你如何归档？',
    choices: [
      { id: 'two-followers', label: '归档为随从二名', description: '路线更清楚，死亡更小。', effects: { officialness: 2, routeClarity: 2, residualVoice: -2 } },
      { id: 'unknown', label: '保存为未知者', description: '不发明姓名，但拒绝合并。', effects: { residualVoice: 2, compassion: 1, routeClarity: -1 } },
      { id: 'blank-plaque', label: '留下空白纪念牌', description: '让空白承担记忆。', effects: { blankSense: 3, residualVoice: 1, officialness: -1 } },
    ],
  },
  {
    id: 'golden-hoop-contract',
    nodeId: 'wuxingshan',
    title: '紧箍合约',
    prompt: '你可以编辑紧箍合约的核心条款。',
    choices: [
      { id: 'strict', label: '严格服从条款', description: '路线稳定，反叛被吸收。', effects: { routeClarity: 2, officialness: 2, compassion: -1 } },
      { id: 'appeal', label: '保留申诉权', description: '任务更慢，但身体不只是工具。', effects: { compassion: 2, contradiction: 1, routeClarity: -1 } },
      { id: 'violence-log', label: '记录暴力责任', description: '把保护和伤害一并登记。', effects: { marginalia: 1, residualVoice: 1, reviewRisk: 1 } },
    ],
  },
  {
    id: 'dragon-icon',
    nodeId: 'yingchoujian',
    title: '白龙马图标选择',
    prompt: '地图要求你选择白龙马的图标。',
    choices: [
      { id: 'horse', label: '马', description: '交通工具识别稳定。', effects: { routeClarity: 2, officialness: 1, residualVoice: -1 } },
      { id: 'dragon', label: '龙', description: '保留变形前的主体。', effects: { residualVoice: 2, contradiction: 1, routeClarity: -1 }, unlocksVoice: '白龙马：我曾经有鳞。' },
      { id: 'fifth', label: '沉默的第五位', description: '不替他说话，但不把他删成坐骑。', effects: { blankSense: 2, residualVoice: 1 } },
    ],
  },
  {
    id: 'kasaya-ledger',
    nodeId: 'guanyinyuan',
    title: '袈裟流通账簿',
    prompt: '账簿要求你记录圣物经过谁的手、以什么理由被观看和占有。',
    choices: [
      { id: 'devotion', label: '记为供奉', description: '保留虔敬名义，压低欲望痕迹。', effects: { officialness: 2, routeClarity: 1, contradiction: -1 } },
      { id: 'commodity', label: '记为流通', description: '承认圣物也进入占有和交换。', effects: { contradiction: 2, marginalia: 1, reviewRisk: 1 } },
      { id: 'burnt-ledger', label: '保留焦边', description: '让火灾成为证据，而不只是情节。', effects: { residualVoice: 1, blankSense: 1, compassion: 1 } },
    ],
  },
  {
    id: 'testimony-stitch',
    nodeId: 'gaolaozhuang',
    title: '证词拼接',
    prompt: '高家、村民、八戒、雇工和传闻员给出互相抵触的说法。',
    choices: [
      { id: 'family-version', label: '高家版本', description: '村庄秩序恢复，但怪物性被固定。', effects: { officialness: 2, routeClarity: 1, residualVoice: -1 } },
      { id: 'labor-version', label: '雇工版本', description: '把劳动和婚姻经济放回叙事。', effects: { marginalia: 2, compassion: 1, contradiction: 1 } },
      { id: 'rumor-version', label: '传闻并置', description: '不合并矛盾，让谣言暴露社会关系。', effects: { contradiction: 2, marginalia: 1, reviewRisk: 1 } },
    ],
  },
  {
    id: 'name-trap',
    nodeId: 'pingdingshan',
    title: '名字陷阱',
    prompt: '葫芦口喊出许多名字。你要回应哪一个？',
    choices: [
      { id: 'qitian', label: '齐天大圣', description: '英雄名号响亮，也最容易被收摄。', effects: { officialness: 1, reviewRisk: 1, contradiction: 1 } },
      { id: 'silence', label: '不回应', description: '拒绝让名字替你签字。', effects: { blankSense: 2, routeClarity: -1 } },
      { id: 'many', label: '列出多个名字', description: '承认身份不是单一字段。', effects: { contradiction: 2, marginalia: 1 } },
    ],
  },
  {
    id: 'fire-mountain',
    nodeId: 'huoyanshan',
    title: '火焰山风向谜题',
    prompt: '芭蕉扇可以开路，也可能把火推向村庄。',
    choices: [
      { id: 'west', label: '西风开路', description: '路线可行，村庄损耗不计。', effects: { routeClarity: 2, officialness: 1, compassion: -1 } },
      { id: 'upwind', label: '上风揭档', description: '吹开天庭事故记录。', effects: { contradiction: 2, marginalia: 1, reviewRisk: 1 } },
      { id: 'slow', label: '减火后通行', description: '路线变慢，村庄留下。', effects: { compassion: 2, residualVoice: 1, routeClarity: -1 } },
    ],
  },
  {
    id: 'death-register',
    nodeId: 'shituoling',
    title: '亡者名册',
    prompt: '系统正在把“姓名不详 37”压缩为“无名者若干”。',
    choices: [
      { id: 'compress', label: '接受合并', description: '地图空间恢复，死亡被压缩。', effects: { officialness: 2, routeClarity: 2, residualVoice: -2 } },
      { id: 'resist', label: '逐条抵抗', description: '名册难读，但名字不被吞掉。', effects: { residualVoice: 3, marginalia: 2, reviewRisk: 2 } },
      { id: 'blank-memorial', label: '留白纪念', description: '承认无法代表全部死亡。', effects: { blankSense: 3, compassion: 1, routeClarity: -1 } },
    ],
  },
  {
    id: 'blank-sutra',
    nodeId: 'lingshan',
    title: '无字经校验',
    prompt: '终点给出空白页。你如何解释？',
    choices: [
      { id: 'fraud', label: '欺骗', description: '要求可读文本，拒绝神秘化。', effects: { contradiction: 2, reviewRisk: 1 } },
      { id: 'beyond', label: '超越', description: '让空白归入神圣解释。', effects: { officialness: 2, blankSense: -1 } },
      { id: 'ethical-blank', label: '伦理留白', description: '不解释所有沉默。', effects: { blankSense: 3, compassion: 2, routeClarity: -1 } },
    ],
  },
];

export function getMiniGameById(id: string | undefined): MiniGameDefinition | undefined {
  return miniGames.find((game) => game.id === id);
}
