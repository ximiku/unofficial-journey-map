import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { routeNodes } from '../../data/nodes';
import { reviews } from '../../data/reviews';
import type { LayerId } from '../../domain/types';
import { useGame, useTriggeredReviews } from '../../state/GameContext';

const STAGE_WIDTH = 940;
const STAGE_HEIGHT = 360;
const NODE_SPACING = 150;
const ROUTE_PADDING_X = 96;
const VIRTUAL_WIDTH = ROUTE_PADDING_X * 2 + (routeNodes.length - 1) * NODE_SPACING;
const MAX_VIEW_X = Math.max(0, VIRTUAL_WIDTH - STAGE_WIDTH);

type LayerVisual = {
  label: string;
  className: string;
  mark: string;
  description: string;
};

const layerVisuals: Record<LayerId, LayerVisual> = {
  novel: { label: '小说路线', className: 'layer-novel', mark: '圆点', description: '墨色实心圆' },
  history: { label: '历史幽灵', className: 'layer-history', mark: '虚环', description: '蓝灰空心环' },
  unofficial: { label: '非官方旁注', className: 'layer-unofficial', mark: '裂点', description: '朱砂裂纹点' },
  heaven: { label: '天庭灵山', className: 'layer-heaven', mark: '方印', description: '蓝黑方印' },
  underworld: { label: '地下妖洞', className: 'layer-underworld', mark: '洞纹', description: '深灰双环' },
  dream: { label: '梦境层', className: 'layer-dream', mark: '梦斑', description: '淡紫水纹' },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function pointForNode(index: number) {
  const node = routeNodes[index];
  return {
    x: ROUTE_PADDING_X + index * NODE_SPACING,
    y: clamp(188 + (node.mapPosition.y - 220) * 0.52, 86, 286),
  };
}

export function JourneyMap() {
  const { state, dispatch } = useGame();
  const triggered = useTriggeredReviews();
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const selectedIndex = Math.max(
    0,
    routeNodes.findIndex((node) => node.id === state.selectedNodeId),
  );
  const [viewX, setViewX] = useState(() => clamp(pointForNode(selectedIndex).x - STAGE_WIDTH * 0.35, 0, MAX_VIEW_X));
  const pendingNodeIds = new Set(triggered.map((review) => review.nodeId).filter(Boolean));
  const handledReviewIds = new Set(state.reviewDecisions.map((decision) => decision.reviewId));
  const completedNodeIds = new Set(state.completedNodeIds);
  const points = useMemo(() => routeNodes.map((_, index) => pointForNode(index)), []);
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const crackPath = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `C ${point.x - 52} ${point.y - 72}, ${point.x - 20} ${point.y + 76}, ${point.x} ${point.y}`,
    )
    .join(' ');

  useEffect(() => {
    setViewX(clamp(pointForNode(selectedIndex).x - STAGE_WIDTH * 0.35, 0, MAX_VIEW_X));
  }, [selectedIndex]);

  const viewPercent = viewX / Math.max(1, MAX_VIEW_X);

  function setViewFromClientX(clientX: number) {
    const rect = sliderTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const percent = clamp((clientX - rect.left) / rect.width, 0, 1);
    setViewX(Math.round((percent * MAX_VIEW_X) / 8) * 8);
  }

  function moveView(delta: number) {
    setViewX((current) => clamp(Math.round((current + delta) / 8) * 8, 0, MAX_VIEW_X));
  }

  function handleSliderKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveView(160);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveView(-160);
      return;
    }
    if (event.key === 'PageDown') {
      event.preventDefault();
      moveView(480);
      return;
    }
    if (event.key === 'PageUp') {
      event.preventDefault();
      moveView(-480);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setViewX(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      setViewX(MAX_VIEW_X);
    }
  }

  return (
    <section className="map-panel">
      <div className="map-panel-head">
        <div>
          <p className="file-code">取经路视野 {Math.round(viewPercent * 100)}%</p>
          <h2>取经路长卷</h2>
        </div>
        <p className="map-head-note">滑动可远望后方山川；未抵达的地点只作路标，不可直接进入。</p>
      </div>

      <div className="segmented-map continuous-map" role="region" aria-label="可滑动取经路线地图" tabIndex={0}>
        <svg className="route-svg" viewBox={`${viewX} 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden="true">
          <defs>
            <linearGradient id="routePaperFade" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(166,50,37,0.16)" />
              <stop offset="50%" stopColor="rgba(36,26,18,0.08)" />
              <stop offset="100%" stopColor="rgba(51,75,104,0.14)" />
            </linearGradient>
            <pattern id="pilgrimDashes" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 2 12 L 8 6 M 10 13 L 16 7" stroke="rgba(36,26,18,0.16)" strokeWidth="1.4" />
            </pattern>
          </defs>
          <rect className="route-background-scroll" x={viewX + 12} y="22" width={STAGE_WIDTH - 24} height="306" rx="18" />
          <path className="route-mountain-wash" d={`M ${viewX + 18} 70 C ${viewX + 170} 20, ${viewX + 276} 88, ${viewX + 430} 52 S ${viewX + 700} 84, ${viewX + 918} 42`} />
          <path className="route-footprints" d={path} />
          <path className="route-shadow" d={path} />
          <path className="route-main" d={path} />
          {state.stats.contradiction >= 5 && <path className="route-crack" d={crackPath} />}
          {state.stats.residualVoice >= 5 &&
            points.slice(1, -1).map((point, index) => (
              <path
                key={routeNodes[index + 1].id}
                className="route-branch"
                d={`M ${point.x} ${point.y} q ${index % 2 === 0 ? 36 : -36} ${index % 2 === 0 ? -70 : 70} 112 ${index % 2 === 0 ? -112 : 112}`}
              />
            ))}
        </svg>

        <div className="map-node-layer" aria-label="路线节点">
          {routeNodes.map((node, index) => {
            const point = points[index];
            const left = ((point.x - viewX) / STAGE_WIDTH) * 100;
            const top = (point.y / STAGE_HEIGHT) * 100;
            const active = state.selectedNodeId === node.id;
            const completed = completedNodeIds.has(node.id);
            const reachable = active || completed;
            const visible = left > -8 && left < 108;
            const pending = reachable && pendingNodeIds.has(node.id);
            const nodeReviews = reviews.filter((review) => review.nodeId === node.id);
            const reviewed = nodeReviews.some((review) => handledReviewIds.has(review.id));
            if (!visible) return null;

            return (
              <button
                key={node.id}
                type="button"
                className={[
                  'map-node-button',
                  layerVisuals[node.mapPosition.layer].className,
                  active ? 'active' : '',
                  completed ? 'completed' : '',
                  !reachable ? 'locked' : '',
                  pending ? 'pending-review' : '',
                  reviewed ? 'reviewed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ left: `${left}%`, top: `${top}%` }}
                aria-label={`${node.title}，第 ${node.chapterRange[0]} 至 ${node.chapterRange[1]} 回${reachable ? '' : '，未抵达'}`}
                onClick={() => reachable && dispatch({ type: 'SELECT_NODE', nodeId: node.id })}
                disabled={!reachable}
                title={reachable ? node.title : `${node.title}：未抵达`}
              >
                <span className="node-dot" aria-hidden="true" />
                <span className="node-label">{node.shortTitle ?? node.title}</span>
                {pending && <span className="node-seal">审</span>}
                {state.stats.blankSense >= 6 && completed && <span className="blank-plaque" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <label className="route-slider">
        <span>沿取经路远望</span>
        <span className="route-slider-control">
          <input
            type="range"
            min={0}
            max={MAX_VIEW_X}
            step={8}
            value={viewX}
            aria-hidden="true"
            tabIndex={-1}
            onChange={(event) => setViewX(Number(event.currentTarget.value))}
          />
          <span
            ref={sliderTrackRef}
            className="route-slider-track"
            role="slider"
            aria-label="滑动查看后续地图节点"
            aria-valuemin={0}
            aria-valuemax={MAX_VIEW_X}
            aria-valuenow={viewX}
            tabIndex={0}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture?.(event.pointerId);
              setViewFromClientX(event.clientX);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1) setViewFromClientX(event.clientX);
            }}
            onKeyDown={handleSliderKeyDown}
          >
            <span className="route-slider-fill" style={{ width: `${viewPercent * 100}%` }} />
            <span className="route-slider-thumb" style={{ left: `${viewPercent * 100}%` }} />
          </span>
        </span>
      </label>

      <div className="route-legend" aria-label="地图分类图例">
        {(Object.keys(layerVisuals) as LayerId[]).map((layer) => (
          <span key={layer} className={`legend-item ${layerVisuals[layer].className}`}>
            <i aria-hidden="true" />
            {layerVisuals[layer].label}：{layerVisuals[layer].description}
          </span>
        ))}
      </div>
    </section>
  );
}
