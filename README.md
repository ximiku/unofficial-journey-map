# 取经路线非官方注释

《取经路线非官方注释》是一个浏览器端互动文学游戏 / 数字人文作品。玩家扮演临时档案员，被要求整理一张清楚、可审查的取经路线图；真正的选择，是决定那些无法被官方路线容纳的尸体、传闻、小妖、遗物、梦境和空白如何存在。

## 运行

```bash
npm install
npm run dev
```

开发服务器默认使用 `http://127.0.0.1:5173`。作品不需要后端，构建后可作为静态站点运行。

## 构建与测试

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## 如何扩展内容

- 新增路线节点：在 `src/data/nodes.ts` 增加 `RouteNode`，并补齐 `annotationIds`、`reviewIds`、`sourceRefs`。
- 新增批注：在 `src/data/annotations.ts` 增加 `AnnotationCard`，为每个可放置区域声明 `effectsByPlacement`。
- 新增审稿事件：在 `src/data/reviews.ts` 增加 `ReviewEvent`，用数值、访问节点或批注类型触发。
- 新增结局：在 `src/data/endings.ts` 增加 `Ending`，由 `src/domain/endingResolver.ts` 按条件解析。
- 新增小游戏：在 `src/data/miniGames.ts` 登记元数据，并在 `src/miniGames/index.tsx` 补充对应组件。

## 课程展示说明

首版包含 26 个路线节点、70+ 张批注卡、18+ 个审稿事件、8 个结局、10 个互动模块、档案馆、存档/重置和 presentation mode。主地图采用“连续取经路 + 横向滑条”：玩家可以滑动远望后续地点，但不能直接跳到未来节点；每个地点通过“抵达、线索、批注、审稿 / 互动、总结”的小流程推进，完成本站后进入下一站。视觉方向保留古籍卷轴与官僚档案系统，同时允许更明显的朱印、线绳、地图裂痕和小妖档案员提示。

## 已知限制

- 首版批注放置采用点击式交互，不做拖拽，以保证移动端和测试稳定性。
- 资料引用以章节和研究线索为主，未嵌入长篇原文。
- 互动模块优先表达文学机制，不追求动作游戏复杂度。
