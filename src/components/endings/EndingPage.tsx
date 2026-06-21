import { annotations } from '../../data/annotations';
import { endings } from '../../data/endings';
import { resolveEnding } from '../../domain/endingResolver';
import { statLabels } from '../../domain/stats';
import { useGame } from '../../state/GameContext';

export function EndingPage() {
  const { state, dispatch } = useGame();
  const ending = endings.find((item) => item.id === state.endingId) ?? resolveEnding(state, endings, annotations);
  const report = [
    `结局：${ending.title}`,
    ending.subtitle,
    `地图转化：${ending.mapTransformation}`,
    `数值：${Object.entries(state.stats)
      .map(([key, value]) => `${statLabels[key as keyof typeof state.stats].label}${value}`)
      .join('，')}`,
  ].join('\n');

  return (
    <section className="ending-page">
      <article className="ending-scroll">
        <p className="seal-line">最终审稿回执</p>
        <h1>{ending.title}</h1>
        <p className="ending-subtitle">{ending.subtitle}</p>
        {ending.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="ending-map-note">{ending.mapTransformation}</div>
        <dl className="final-stats">
          {Object.entries(state.stats).map(([key, value]) => (
            <div key={key}>
              <dt>{statLabels[key as keyof typeof state.stats].label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="home-actions">
          <button className="primary-button" type="button" onClick={() => dispatch({ type: 'RETURN_TO_MAP' })}>
            回到地图
          </button>
          <button className="secondary-button" type="button" onClick={() => navigator.clipboard?.writeText(report)}>
            复制路线报告
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              if (window.confirm('确认重新开始？')) dispatch({ type: 'RESET' });
            }}
          >
            重新开始
          </button>
        </div>
      </article>
    </section>
  );
}
