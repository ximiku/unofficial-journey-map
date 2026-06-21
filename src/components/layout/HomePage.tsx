import { routeNodes } from '../../data/nodes';
import { useGame } from '../../state/GameContext';

export function HomePage() {
  const { state, dispatch } = useGame();

  return (
    <section className="home-page">
      <div className="home-copy">
        <p className="seal-line">西行路线整理局 临时档案员界面</p>
        <h1>取经路线非官方注释</h1>
        <p className="home-thesis">
          你受雇整理一张取经路线图。你的地图越清楚，世界越贫乏；你的旁注越完整，地图越不可交付。
        </p>
        <div className="home-actions">
          <button className="primary-button" type="button" onClick={() => dispatch({ type: 'START' })}>
            {state.started ? '继续整理' : '开始整理'}
          </button>
          <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'OPEN_ARCHIVE' })}>
            档案馆
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              if (window.confirm('确认重置所有本地进度？')) dispatch({ type: 'RESET' });
            }}
          >
            重置进度
          </button>
        </div>
      </div>
      <div className="home-scroll" aria-label="作品概览">
        <div className="scroll-route" />
        <p>长安</p>
        <p>双叉岭</p>
        <p>五行山</p>
        <p>火焰山</p>
        <p>狮驼岭</p>
        <p>灵山</p>
        <span className="home-seal">不宜展开</span>
      </div>
      <footer className="home-footer">
        <span>{routeNodes.length} 个路线节点</span>
        <span>批注 / 审稿 / 留白 / 多结局</span>
        <span>自包含静态站点</span>
      </footer>
    </section>
  );
}
