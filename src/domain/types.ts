export type GameStats = {
  officialness: number;
  marginalia: number;
  residualVoice: number;
  contradiction: number;
  reviewRisk: number;
  blankSense: number;
  compassion: number;
  routeClarity: number;
};

export type StatKey = keyof GameStats;

export type LayerId = 'novel' | 'history' | 'unofficial' | 'heaven' | 'underworld' | 'dream';

export type ThresholdType =
  | 'border'
  | 'death'
  | 'incorporation'
  | 'body'
  | 'gender'
  | 'bureaucracy'
  | 'ecology'
  | 'language'
  | 'identity'
  | 'violence'
  | 'labor'
  | 'memory'
  | 'blankness';

export type RouteNode = {
  id: string;
  title: string;
  shortTitle?: string;
  chapterRange: [number, number];
  officialChapterTitle: string;
  mapPosition: { x: number; y: number; layer: LayerId };
  thresholdTypes: ThresholdType[];
  officialSummary: string;
  unofficialQuestion: string;
  literaryNote: string;
  voices: string[];
  evidenceIds: string[];
  annotationIds: string[];
  reviewIds: string[];
  miniGameId?: string;
  sourceRefs: string[];
  artCue: string;
  unlockAfter?: string[];
};

export type AnnotationType =
  | 'official-note'
  | 'marginal-note'
  | 'counter-note'
  | 'mistaken-note'
  | 'dream-note'
  | 'ledger-note'
  | 'corpse-note'
  | 'translation-note'
  | 'map-note'
  | 'blank-note';

export type PlacementZone = 'mainText' | 'margin' | 'hiddenArchive' | 'reviewPile' | 'blankSpace';

export type StatDelta = Partial<Record<StatKey, number>>;

export type AnnotationCard = {
  id: string;
  nodeId: string;
  type: AnnotationType;
  title: string;
  speaker: string;
  text: string;
  placementOptions: PlacementZone[];
  effectsByPlacement: Partial<Record<PlacementZone, StatDelta>>;
  reviewRisk: 'low' | 'medium' | 'high';
  tags: string[];
};

export type ReviewAgency =
  | '西行路线整理局'
  | '灵山经卷流通处'
  | '天庭绩效考核司'
  | '大唐通关文牒署'
  | '地方山神土地联席会'
  | '无名者档案馆';

export type ReviewChoice = {
  id: string;
  label: string;
  description: string;
  effects: StatDelta;
  convertsAnnotationTo?: AnnotationType;
};

export type ReviewEvent = {
  id: string;
  nodeId?: string;
  trigger: {
    statAbove?: Partial<Record<StatKey, number>>;
    statBelow?: Partial<Record<StatKey, number>>;
    annotationTypesPlaced?: AnnotationType[];
    visitedNodeIds?: string[];
  };
  agency: ReviewAgency;
  comment: string;
  choices: ReviewChoice[];
};

export type Ending = {
  id: string;
  title: string;
  subtitle: string;
  conditions: {
    statAbove?: Partial<Record<StatKey, number>>;
    statBelow?: Partial<Record<StatKey, number>>;
    requiredNodes?: string[];
    requiredAnnotationTypes?: AnnotationType[];
  };
  body: string[];
  mapTransformation: string;
  unlockedByDefault?: boolean;
};

export type SourceRef = {
  id: string;
  title: string;
  type: 'primary' | 'historical' | 'scholarly' | 'adaptation' | 'design-reference';
  note: string;
  url?: string;
};

export type EvidenceItem = {
  id: string;
  nodeId: string;
  title: string;
  kind: 'relic' | 'testimony' | 'ledger' | 'document' | 'map' | 'body' | 'ritual' | 'voice';
  description: string;
};

export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
};

export type MiniGameDefinition = {
  id: string;
  nodeId: string;
  title: string;
  prompt: string;
  choices: Array<{
    id: string;
    label: string;
    description: string;
    effects: StatDelta;
    unlocksVoice?: string;
  }>;
};

export type PlacedAnnotation = {
  annotationId: string;
  nodeId: string;
  zone: PlacementZone;
  placedAt: string;
};

export type ReviewDecision = {
  reviewId: string;
  choiceId: string;
  decidedAt: string;
};

export type MiniGameDecision = {
  miniGameId: string;
  choiceId: string;
  decidedAt: string;
};

export type GameView = 'home' | 'map' | 'archive' | 'ending';

export type GameState = {
  view: GameView;
  started: boolean;
  selectedNodeId: string;
  activeLayer: LayerId;
  stats: GameStats;
  visitedNodeIds: string[];
  completedNodeIds: string[];
  placedAnnotations: PlacedAnnotation[];
  reviewDecisions: ReviewDecision[];
  miniGameDecisions: MiniGameDecision[];
  endingId?: string;
  presentationMode: boolean;
};
