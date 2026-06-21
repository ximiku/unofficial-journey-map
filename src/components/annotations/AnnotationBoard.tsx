import { useMemo, useState } from 'react';
import { getAnnotationsByNode } from '../../data/annotations';
import { getAnnotationDelta, hasPlacedAnnotation } from '../../domain/annotationEngine';
import { statDeltaToText } from '../../domain/stats';
import type { AnnotationCard, AnnotationType, PlacementZone } from '../../domain/types';
import { useGame } from '../../state/GameContext';

const typeLabels: Record<AnnotationType, string> = {
  'official-note': '正注',
  'marginal-note': '旁注',
  'counter-note': '反注',
  'mistaken-note': '误注',
  'dream-note': '梦注',
  'ledger-note': '账簿注',
  'corpse-note': '尸体注',
  'translation-note': '译注',
  'map-note': '地图注',
  'blank-note': '留白注',
};

const zoneLabels: Record<PlacementZone, string> = {
  mainText: '正文',
  margin: '边注',
  hiddenArchive: '隐藏档案',
  reviewPile: '审稿堆',
  blankSpace: '留白处',
};

export function AnnotationBoard() {
  const { state, dispatch } = useGame();
  const annotations = getAnnotationsByNode(state.selectedNodeId);
  const available = annotations.filter((annotation) => !hasPlacedAnnotation(state.placedAnnotations, annotation.id));
  const [selectedId, setSelectedId] = useState<string | undefined>(available[0]?.id);
  const selected = useMemo<AnnotationCard | undefined>(
    () => available.find((annotation) => annotation.id === selectedId) ?? available[0],
    [available, selectedId],
  );

  return (
    <section className="annotation-board" aria-label="批注板">
      <header>
        <div>
          <p className="file-code">批注处理台</p>
          <h2>先选纸片，再决定它进入哪里</h2>
        </div>
        <span>{available.length} 张待处理 / {annotations.length} 张总计</span>
      </header>

      {selected ? (
        <div className="annotation-workflow">
          <div className="annotation-selector" aria-label="待处理批注">
            {annotations.map((annotation) => {
              const placed = hasPlacedAnnotation(state.placedAnnotations, annotation.id);
              return (
                <button
                  key={annotation.id}
                  type="button"
                  className={[
                    'annotation-row',
                    selected.id === annotation.id ? 'active' : '',
                    placed ? 'placed' : '',
                    `risk-${annotation.reviewRisk}`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => !placed && setSelectedId(annotation.id)}
                  disabled={placed}
                >
                  <span className="annotation-type">{typeLabels[annotation.type]}</span>
                  <strong>{annotation.title}</strong>
                  <em>{placed ? '已放置' : annotation.speaker}</em>
                </button>
              );
            })}
          </div>

          <article className={`annotation-preview risk-${selected.reviewRisk}`} aria-label="当前批注">
            <div>
              <span className="annotation-type">{typeLabels[selected.type]}</span>
              <h3>{selected.title}</h3>
              <p className="annotation-speaker">{selected.speaker}</p>
            </div>
            <p>{selected.text}</p>
            <div className="tag-row">
              {selected.tags.map((tag) => (
                <span className="tag" key={tag}>{tag}</span>
              ))}
            </div>
          </article>

          <div className="placement-zones" aria-label="放置区域">
            {selected.placementOptions.map((zone) => (
              <button
                key={zone}
                type="button"
                className="placement-zone"
                onClick={() => dispatch({ type: 'PLACE_ANNOTATION', annotationId: selected.id, zone })}
              >
                <strong>{zoneLabels[zone]}</strong>
                <span>{statDeltaToText(getAnnotationDelta(selected, zone))}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="empty-note">本节点批注已处理完。档案并未因此变得完整。</p>
      )}
    </section>
  );
}
