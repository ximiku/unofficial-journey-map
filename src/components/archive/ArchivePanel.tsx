import { annotations } from '../../data/annotations';
import { endings } from '../../data/endings';
import { evidenceItems } from '../../data/evidence';
import { glossary } from '../../data/glossary';
import { routeNodes } from '../../data/nodes';
import { reviews } from '../../data/reviews';
import { sources } from '../../data/sources';
import { statLabels } from '../../domain/stats';
import { useGame } from '../../state/GameContext';
import { StatLedger } from '../common/StatLedger';

export function ArchivePanel() {
  const { state, dispatch } = useGame();
  const visited = routeNodes.filter((node) => state.visitedNodeIds.includes(node.id));
  const placed = state.placedAnnotations
    .map((placement) => ({
      placement,
      annotation: annotations.find((item) => item.id === placement.annotationId),
    }))
    .filter((item) => item.annotation);
  const visitedEvidence = evidenceItems.filter((item) => state.visitedNodeIds.includes(item.nodeId));

  return (
    <section className="archive-page">
      <header className="topbar">
        <div>
          <button className="text-button" type="button" onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}>
            返回地图
          </button>
          <p>档案馆显示所有已解锁文本。隐藏不等于删除。</p>
        </div>
        <button className="primary-button" type="button" onClick={() => dispatch({ type: 'FINISH' })}>
          生成路线报告
        </button>
      </header>
      <StatLedger stats={state.stats} />
      <div className="archive-grid">
        <section className="archive-section">
          <h2>已访问节点</h2>
          {visited.map((node) => (
            <button key={node.id} type="button" onClick={() => dispatch({ type: 'SELECT_NODE', nodeId: node.id })}>
              {node.title}
            </button>
          ))}
        </section>
        <section className="archive-section">
          <h2>已放置批注</h2>
          {placed.map(({ annotation, placement }) => (
            <article key={placement.annotationId} className="archive-note">
              <strong>{annotation!.title}</strong>
              <span>放置区：{placement.zone}</span>
              <p>{annotation!.text}</p>
            </article>
          ))}
          {placed.length === 0 && <p className="empty-note">尚无批注进入档案。</p>}
        </section>
        <section className="archive-section">
          <h2>证据对象</h2>
          {visitedEvidence.slice(0, 16).map((item) => (
            <article key={item.id} className="archive-note">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
        <section className="archive-section">
          <h2>审稿历史</h2>
          {state.reviewDecisions.map((decision) => {
            const review = reviews.find((item) => item.id === decision.reviewId);
            const choice = review?.choices.find((item) => item.id === decision.choiceId);
            return review && choice ? (
              <article key={decision.reviewId} className="archive-note">
                <strong>{review.agency}</strong>
                <span>{choice.label}</span>
                <p>{review.comment}</p>
              </article>
            ) : null;
          })}
          {state.reviewDecisions.length === 0 && <p className="empty-note">尚未处理审稿意见。</p>}
        </section>
        <section className="archive-section">
          <h2>术语表</h2>
          {glossary.map((entry) => (
            <article key={entry.id} className="archive-note">
              <strong>{entry.term}</strong>
              <p>{entry.definition}</p>
            </article>
          ))}
        </section>
        <section className="archive-section">
          <h2>资料线索</h2>
          {sources.map((source) => (
            <article key={source.id} className="archive-note">
              <strong>{source.title}</strong>
              <span>{source.type}</span>
              <p>{source.note}</p>
            </article>
          ))}
        </section>
        <section className="archive-section wide">
          <h2>玩家路线报告</h2>
          <p>
            已访问 {visited.length} / {routeNodes.length} 站，已放置 {placed.length} 张批注，已处理{' '}
            {state.reviewDecisions.length} 条审稿意见。当前最高数值：
            {Object.entries(state.stats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([key, value]) => `${statLabels[key as keyof typeof state.stats].label}${value}`)
              .join('、')}
            。
          </p>
          <p>当前可达结局候选：{endings.map((ending) => ending.title).join(' / ')}</p>
        </section>
      </div>
    </section>
  );
}
