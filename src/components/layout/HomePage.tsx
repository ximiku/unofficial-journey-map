import { routeNodes } from '../../data/nodes';
import { useGame } from '../../state/GameContext';

export function HomePage() {
  const { state, dispatch } = useGame();

  return (
    <section className="home-page">
      <div className="home-copy">
        <p className="seal-line">西行路线整理局 · 取经路线复核案</p>
        <h1>取经路线非官方注释</h1>
        <p className="home-kicker">
          唐僧师徒已经抵达灵山。现在，轮到你整理他们路上没有被写进路线图的东西。
        </p>
        <div className="home-brief" aria-label="玩家设定">
          <p>
            你被“三界地理与功德校勘署”临时雇用，任务是重绘一张从长安到灵山的取经路线图。
            但档案边缘不断冒出异样材料：双叉岭无名随从、白龙马口供、火焰山灾后记录、狮驼岭亡者名册，以及灵山无字经的退件意见。
          </p>
          <p>
            你不是取经人，而是临时档案员。每一次把批注放进正文、边栏、隐档、审稿堆或留白，都会改变这张地图如何记住西游世界。
          </p>
        </div>
        <p className="home-note">
          小猪妖档案员交接纸条：英雄已经走过，路边的人还在等一个位置。
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
      <div className="home-scroll" aria-label="取经路线复核案卷">
        <div className="scroll-caption">
          <span>案卷 玄字第十三号</span>
          <strong>长安至灵山路线复核中</strong>
        </div>
        <svg className="home-route-map" viewBox="0 0 620 300" aria-hidden="true">
          <path className="home-route-shadow" d="M48 170 C122 96 178 210 250 142 S382 92 448 150 544 230 594 132" />
          <path className="home-route-main" d="M48 170 C122 96 178 210 250 142 S382 92 448 150 544 230 594 132" />
          <path className="home-route-branch" d="M146 154 C128 198 104 218 70 236" />
          <path className="home-route-branch" d="M474 166 C504 118 534 92 584 88" />
        </svg>
        <div className="home-route-nodes" aria-hidden="true">
          <span className="home-route-node node-changan">长安</span>
          <span className="home-route-node node-shuangcha">双叉岭</span>
          <span className="home-route-node node-wuxing">五行山</span>
          <span className="home-route-node node-huoyan">火焰山</span>
          <span className="home-route-node node-shituo">狮驼岭</span>
          <span className="home-route-node node-lingshan">灵山</span>
        </div>
        <span className="home-evidence evidence-one">随从二名</span>
        <span className="home-evidence evidence-two">白龙马口供</span>
        <span className="home-evidence evidence-three">亡者名册</span>
        <span className="home-evidence evidence-four">无字经</span>
        <span className="home-seal">不宜展开</span>
      </div>
      <footer className="home-footer">
        <span>{routeNodes.length} 处取经节点</span>
        <span>70+ 张非官方批注</span>
        <span>审稿 / 留白 / 多结局</span>
      </footer>
    </section>
  );
}
