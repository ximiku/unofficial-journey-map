import type { MiniGameDefinition } from '../domain/types';
import { statDeltaToText } from '../domain/stats';
import { useGame } from '../state/GameContext';

export function MiniGamePanel({ game }: { game: MiniGameDefinition }) {
  const { state, dispatch } = useGame();
  const decision = state.miniGameDecisions.find((item) => item.miniGameId === game.id);
  const selected = game.choices.find((choice) => choice.id === decision?.choiceId);

  return (
    <section className="mini-game-panel">
      <h3>{game.title}</h3>
      <p>{game.prompt}</p>
      {decision && selected ? (
        <div className="mini-result">
          <strong>已选择：{selected.label}</strong>
          <span>{selected.description}</span>
        </div>
      ) : (
        <div className="mini-choice-grid">
          {game.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="mini-choice"
              onClick={() =>
                dispatch({
                  type: 'DECIDE_MINIGAME',
                  miniGameId: game.id,
                  choiceId: choice.id,
                  effects: choice.effects,
                })
              }
            >
              <strong>{choice.label}</strong>
              <span>{choice.description}</span>
              <em>{statDeltaToText(choice.effects)}</em>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
