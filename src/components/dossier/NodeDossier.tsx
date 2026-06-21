import { getAnnotationsByNode } from '../../data/annotations';
import { getEvidenceByNode } from '../../data/evidence';
import { getMiniGameById } from '../../data/miniGames';
import { getNodeById, routeNodes } from '../../data/nodes';
import { sources } from '../../data/sources';
import { statDeltaToText } from '../../domain/stats';
import { useGame } from '../../state/GameContext';
import { MiniGamePanel } from '../../miniGames';

const thresholdLabels: Record<string, string> = {
  border: '边界',
  death: '死亡',
  incorporation: '收编',
  body: '身体',
  gender: '性别',
  bureaucracy: '官僚',
  ecology: '生态',
  language: '语言',
  identity: '身份',
  violence: '暴力',
  labor: '劳动',
  memory: '记忆',
  blankness: '留白',
};

type NodeDossierProps = {
  includeMiniGame?: boolean;
};

export function NodeDossier({ includeMiniGame = true }: NodeDossierProps = {}) {
  const { state } = useGame();
  const node = getNodeById(state.selectedNodeId) ?? routeNodes[0];
  const nodeIndex = routeNodes.findIndex((item) => item.id === node.id);
  const previous = routeNodes[nodeIndex - 1];
  const next = routeNodes[nodeIndex + 1];
  const evidence = getEvidenceByNode(node.id);
  const annotations = getAnnotationsByNode(node.id);
  const placed = new Set(state.placedAnnotations.map((item) => item.annotationId));
  const miniGame = getMiniGameById(node.miniGameId);

  return (
    <article className="dossier-panel" aria-label={`${node.title}档案`}>
      <header>
        <p className="file-code">档案 {String(nodeIndex + 1).padStart(2, '0')} / {routeNodes.length}</p>
        <h2>{node.title}</h2>
        <p>第 {node.chapterRange[0]}-{node.chapterRange[1]} 回 · {node.officialChapterTitle}</p>
      </header>

      <section>
        <h3>正本</h3>
        <p>{node.officialSummary}</p>
      </section>

      <section>
        <h3>路线</h3>
        <p>
          前站：{previous?.shortTitle ?? '无'}。后站：{next?.shortTitle ?? '无'}。当前图层：
          {node.mapPosition.layer}。
        </p>
      </section>

      <section>
        <h3>门槛</h3>
        <div className="tag-row">
          {node.thresholdTypes.map((type) => (
            <span className="tag" key={type}>{thresholdLabels[type]}</span>
          ))}
        </div>
      </section>

      <section className="question-block">
        <h3>非官方问题</h3>
        <p>{node.unofficialQuestion}</p>
      </section>

      <section>
        <h3>文学注解</h3>
        <p>{node.literaryNote}</p>
      </section>

      <section>
        <h3>旁证</h3>
        <ul className="evidence-list">
          {evidence.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>声音</h3>
        <ul className="voice-list">
          {node.voices.map((voice) => (
            <li key={voice}>{voice}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>批注状态</h3>
        <ul className="compact-list">
          {annotations.map((annotation) => (
            <li key={annotation.id}>
              {placed.has(annotation.id) ? '已放置' : '待处理'} · {annotation.title}
            </li>
          ))}
        </ul>
      </section>

      {includeMiniGame && miniGame && <MiniGamePanel game={miniGame} />}

      <section>
        <h3>资料线索</h3>
        <ul className="compact-list">
          {node.sourceRefs.map((sourceId) => {
            const source = sources.find((item) => item.id === sourceId);
            return source ? <li key={source.id}>{source.title}：{source.note}</li> : null;
          })}
        </ul>
      </section>

      <footer className="dossier-footnote">
        选择批注放置区时，系统会改变数值；例如留白通常增加留白感，正文通常增加正本度。
        {state.placedAnnotations.length > 0 && (
          <span>最近一次放置影响：{statDeltaToText({ residualVoice: 1 })}（示意）。</span>
        )}
      </footer>
    </article>
  );
}
