import { useState } from 'react';
import { getAnnotationsByNode } from '../../data/annotations';
import { getNodeById, routeNodes } from '../../data/nodes';
import { hasPlacedAnnotation } from '../../domain/annotationEngine';
import { useGame, useTriggeredReviews } from '../../state/GameContext';
import { StatLedger } from '../common/StatLedger';
import { NodeSceneFlow } from '../flow/NodeSceneFlow';
import { JourneyMap } from '../map/JourneyMap';
import type { PlacementZone } from '../../domain/types';

const guideSteps = [
  '抵达本站',
  '读一段故事',
  '查看关键线索',
  '处理一张批注',
  '完成审稿或互动',
  '总结后进入下一站',
];

const placementZoneLabels: Record<PlacementZone, string> = {
  mainText: '正文',
  margin: '边注',
  hiddenArchive: '隐藏档案',
  reviewPile: '审稿堆',
  blankSpace: '留白处',
};

export function MapPage() {
  const { state, dispatch } = useGame();
  const triggered = useTriggeredReviews();
  const [guideCollapsed, setGuideCollapsed] = useState(false);
  const node = getNodeById(state.selectedNodeId) ?? routeNodes[0];
  const nodeIndex = Math.max(0, routeNodes.findIndex((item) => item.id === node.id));
  const annotations = getAnnotationsByNode(node.id);
  const availableAnnotations = annotations.filter((annotation) => !hasPlacedAnnotation(state.placedAnnotations, annotation.id));
  const nodeReviews = triggered.filter((review) => !review.nodeId || review.nodeId === node.id);
  const shouldShowExpandedGuide = !guideCollapsed && state.placedAnnotations.length === 0;
  const latestPlacement = state.placedAnnotations[state.placedAnnotations.length - 1];
  const latestNode = latestPlacement ? getNodeById(latestPlacement.nodeId) : undefined;
  const currentProgressIndex = routeNodes.findIndex((item) => !state.completedNodeIds.includes(item.id));
  const progressIndex = currentProgressIndex === -1 ? routeNodes.length - 1 : currentProgressIndex;
  const completed = state.completedNodeIds.includes(node.id);
  const nextStep = nodeReviews.length > 0
    ? '在本站流程里处理审稿意见，决定是否配合删改。'
    : availableAnnotations.length > 0
      ? '继续本站流程，选择一张批注并决定它进入哪里。'
      : completed
        ? '本站已完成，可以回看；最新进度会在地图上保持可进入。'
        : '继续本站流程，完成总结后进入下一站。';

  return (
    <section className="map-page">
      <header className="topbar">
        <div>
          <button className="text-button" type="button" onClick={() => dispatch({ type: 'GO_HOME' })}>
            取经路线非官方注释
          </button>
          <p>临时档案员：请在清晰路线与不可归并的余声之间作出选择。</p>
        </div>
        <div className="topbar-actions">
          <button type="button" className="secondary-button" onClick={() => dispatch({ type: 'OPEN_ARCHIVE' })}>
            档案馆
          </button>
          <button type="button" className="secondary-button" onClick={() => dispatch({ type: 'TOGGLE_PRESENTATION' })}>
            {state.presentationMode ? '退出演示' : '演示模式'}
          </button>
          <button type="button" className="primary-button" onClick={() => dispatch({ type: 'FINISH' })}>
            结束旅程
          </button>
        </div>
      </header>
      <StatLedger stats={state.stats} />
      <ArchivistGuide expanded={shouldShowExpandedGuide} onCollapse={() => setGuideCollapsed(true)} />
      <div className="journey-workspace">
        <section className="map-column" aria-label="分段路线地图">
          <JourneyMap />
        </section>
        <aside className="task-summary" aria-label="当前任务摘要">
          <p className="file-code">当前任务 {String(nodeIndex + 1).padStart(2, '0')}</p>
          <h2>{node.title}</h2>
          <p className="task-question">{node.unofficialQuestion}</p>
          <div className="task-next-step">
            <strong>下一步</strong>
            <span>{nextStep}</span>
          </div>
          <dl className="task-metrics">
            <div>
              <dt>待处理批注</dt>
              <dd>{availableAnnotations.length}</dd>
            </div>
            <div>
              <dt>本节点审稿</dt>
              <dd>{nodeReviews.length}</dd>
            </div>
            <div>
              <dt>路线进度</dt>
              <dd>{Math.min(progressIndex + 1, routeNodes.length)}/{routeNodes.length}</dd>
            </div>
          </dl>
          <div className="summary-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => document.getElementById('node-scene-flow')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              继续本站流程
            </button>
            <button type="button" className="secondary-button" onClick={() => dispatch({ type: 'OPEN_ARCHIVE' })}>
              到档案馆查完整材料
            </button>
          </div>
          {latestPlacement && latestNode && (
            <p className="recent-action">
              最近纸痕：{latestNode.shortTitle ?? latestNode.title} 有一张批注进入{placementZoneLabels[latestPlacement.zone]}。
            </p>
          )}
          <p className="small-archivist-note">
            小猪妖档案员：先别急着把所有东西展开。路要一段一段看，旁注也要一张一张放。
          </p>
        </aside>
      </div>
      <section className="detail-workbench" aria-label="路线整理工作台">
        <div id="node-scene-flow">
          <NodeSceneFlow />
        </div>
      </section>
    </section>
  );
}

function ArchivistGuide({ expanded, onCollapse }: { expanded: boolean; onCollapse: () => void }) {
  return (
    <section className={expanded ? 'archivist-guide expanded' : 'archivist-guide compact'} aria-label="新任档案员交接单">
      <div className="guide-intro">
        <p className="file-code">新任档案员交接单</p>
        <h2>{expanded ? '这张地图该怎么玩' : '整理提示'}</h2>
      </div>
      {expanded ? (
        <>
          <ol className="guide-steps">
            {guideSteps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <button type="button" className="ghost-button" onClick={onCollapse}>
            收起交接单
          </button>
        </>
      ) : (
        <p>每站按“抵达、线索、批注、审稿 / 互动、总结”推进；未来地点只能远望，不能跳过去。</p>
      )}
    </section>
  );
}
