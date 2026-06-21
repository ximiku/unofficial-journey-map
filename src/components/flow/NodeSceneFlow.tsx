import { useEffect, useMemo, useState } from 'react';
import { getAnnotationsByNode } from '../../data/annotations';
import { getEvidenceByNode } from '../../data/evidence';
import { getMiniGameById } from '../../data/miniGames';
import { getNodeById, routeNodes } from '../../data/nodes';
import { getAnnotationDelta, hasPlacedAnnotation } from '../../domain/annotationEngine';
import { statDeltaToText } from '../../domain/stats';
import type { AnnotationType, PlacementZone } from '../../domain/types';
import { useGame, useTriggeredReviews } from '../../state/GameContext';

type SceneStep = 'arrival' | 'clues' | 'annotation' | 'review' | 'summary';

const stepLabels: Record<SceneStep, string> = {
  arrival: '抵达',
  clues: '线索',
  annotation: '批注',
  review: '审稿 / 互动',
  summary: '总结',
};

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
  hiddenArchive: '隐档',
  reviewPile: '审稿堆',
  blankSpace: '留白处',
};

function getCurrentProgressIndex(completedNodeIds: string[]) {
  const index = routeNodes.findIndex((node) => !completedNodeIds.includes(node.id));
  return index === -1 ? routeNodes.length - 1 : index;
}

export function NodeSceneFlow() {
  const { state, dispatch } = useGame();
  const triggeredReviews = useTriggeredReviews();
  const [step, setStep] = useState<SceneStep>('arrival');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | undefined>();
  const node = getNodeById(state.selectedNodeId) ?? routeNodes[0];
  const nodeIndex = routeNodes.findIndex((item) => item.id === node.id);
  const evidence = getEvidenceByNode(node.id);
  const annotations = getAnnotationsByNode(node.id);
  const availableAnnotations = annotations.filter((annotation) => !hasPlacedAnnotation(state.placedAnnotations, annotation.id));
  const selectedAnnotation = useMemo(
    () => availableAnnotations.find((annotation) => annotation.id === selectedAnnotationId) ?? availableAnnotations[0],
    [availableAnnotations, selectedAnnotationId],
  );
  const review = triggeredReviews.find((item) => !item.nodeId || item.nodeId === node.id);
  const miniGame = getMiniGameById(node.miniGameId);
  const miniGameDecision = miniGame
    ? state.miniGameDecisions.find((decision) => decision.miniGameId === miniGame.id)
    : undefined;
  const completed = state.completedNodeIds.includes(node.id);
  const currentProgressIndex = getCurrentProgressIndex(state.completedNodeIds);
  const currentProgressNode = routeNodes[currentProgressIndex];
  const nextNode = routeNodes[nodeIndex + 1];

  useEffect(() => {
    setStep('arrival');
    setSelectedAnnotationId(undefined);
  }, [node.id]);

  const story = `${node.officialSummary} 但是档案边缘留下另一个问题：${node.unofficialQuestion} ${node.literaryNote}`;
  const voice = node.voices[0] ?? '此处暂时无声。';
  const clue = evidence[0];
  const canComplete = node.id === currentProgressNode.id && !completed;

  return (
    <section className="scene-flow" aria-label={`${node.title}地点流程`}>
      <header className="scene-flow-head">
        <div>
          <p className="file-code">地点流程 {String(nodeIndex + 1).padStart(2, '0')} / {routeNodes.length}</p>
          <h2>{node.title}</h2>
        </div>
        <ol className="scene-steps" aria-label="本站流程">
          {(Object.keys(stepLabels) as SceneStep[]).map((item) => (
            <li key={item} className={item === step ? 'active' : ''}>{stepLabels[item]}</li>
          ))}
        </ol>
      </header>

      {completed && (
        <div className="scene-completed-note">
          本站已经整理完毕。你可以回看纸面痕迹，但最新进度在“{currentProgressNode.title}”。
        </div>
      )}

      {step === 'arrival' && (
        <article className="scene-card">
          <p className="scene-kicker">抵达记录</p>
          <p className="scene-story">{story}</p>
          <button type="button" className="primary-button" onClick={() => setStep('clues')}>
            继续整理本站
          </button>
        </article>
      )}

      {step === 'clues' && (
        <article className="scene-card clue-card">
          <p className="scene-kicker">关键线索</p>
          <blockquote>{voice}</blockquote>
          {clue && (
            <p>
              旁证：<strong>{clue.title}</strong>。{clue.description}
            </p>
          )}
          <button type="button" className="primary-button" onClick={() => setStep('annotation')}>
            选择本站批注
          </button>
        </article>
      )}

      {step === 'annotation' && (
        <article className="scene-card annotation-scene">
          <p className="scene-kicker">批注选择</p>
          {selectedAnnotation ? (
            <>
              <div className="scene-annotation-picker" aria-label="可选批注">
                {availableAnnotations.map((annotation) => (
                  <button
                    key={annotation.id}
                    type="button"
                    className={selectedAnnotation.id === annotation.id ? 'active' : ''}
                    onClick={() => setSelectedAnnotationId(annotation.id)}
                  >
                    {typeLabels[annotation.type]} · {annotation.title}
                  </button>
                ))}
              </div>
              <div className="scene-paper">
                <strong>{selectedAnnotation.speaker}</strong>
                <p>{selectedAnnotation.text}</p>
              </div>
              <div className="scene-choice-grid" aria-label="批注放置动作">
                {selectedAnnotation.placementOptions.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    className="scene-choice"
                    onClick={() => {
                      dispatch({ type: 'PLACE_ANNOTATION', annotationId: selectedAnnotation.id, zone });
                      setStep('review');
                    }}
                  >
                    <strong>把这条批注放入{zoneLabels[zone]}</strong>
                    <span>{statDeltaToText(getAnnotationDelta(selectedAnnotation, zone))}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>本站可处理的批注已经放置完毕，纸面暂时安静。</p>
              <button type="button" className="primary-button" onClick={() => setStep('review')}>
                进入审稿 / 互动
              </button>
            </>
          )}
        </article>
      )}

      {step === 'review' && (
        <article className="scene-card review-scene">
          <p className="scene-kicker">审稿 / 互动</p>
          {review ? (
            <>
              <p className="review-comment">{review.agency}：{review.comment}</p>
              <div className="scene-choice-grid">
                {review.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className="scene-choice"
                    onClick={() => dispatch({ type: 'DECIDE_REVIEW', reviewId: review.id, choiceId: choice.id })}
                  >
                    <strong>{choice.label}</strong>
                    <span>{choice.description}</span>
                    <em>{statDeltaToText(choice.effects)}</em>
                  </button>
                ))}
              </div>
            </>
          ) : miniGame && !miniGameDecision ? (
            <>
              <h3>{miniGame.title}</h3>
              <p>{miniGame.prompt}</p>
              <div className="scene-choice-grid">
                {miniGame.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className="scene-choice"
                    onClick={() => {
                      dispatch({
                        type: 'DECIDE_MINIGAME',
                        miniGameId: miniGame.id,
                        choiceId: choice.id,
                        effects: choice.effects,
                      });
                      setStep('summary');
                    }}
                  >
                    <strong>{choice.label}</strong>
                    <span>{choice.description}</span>
                    <em>{statDeltaToText(choice.effects)}</em>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>本站暂无新的审稿意见或互动场景。档案员可以进入总结。</p>
              <button type="button" className="primary-button" onClick={() => setStep('summary')}>
                进入本站总结
              </button>
            </>
          )}
        </article>
      )}

      {step === 'summary' && (
        <article className="scene-card summary-scene">
          <p className="scene-kicker">本站总结</p>
          <p>
            这一次整理保留了“{node.unofficialQuestion}”这个问题。地图没有因此更干净，
            但它开始承认路边仍有人说话。
          </p>
          {canComplete ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                dispatch({ type: 'COMPLETE_NODE', nodeId: node.id });
                if (!nextNode) dispatch({ type: 'FINISH' });
              }}
            >
              {nextNode ? `完成本站，前往${nextNode.shortTitle ?? nextNode.title}` : '完成本站，生成路线报告'}
            </button>
          ) : currentProgressNode.id !== node.id ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => dispatch({ type: 'SELECT_NODE', nodeId: currentProgressNode.id })}
            >
              回到最新地点：{currentProgressNode.shortTitle ?? currentProgressNode.title}
            </button>
          ) : (
            <button type="button" className="primary-button" onClick={() => dispatch({ type: 'FINISH' })}>
              生成路线报告
            </button>
          )}
        </article>
      )}
    </section>
  );
}
