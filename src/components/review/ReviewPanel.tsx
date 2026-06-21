import type { ReviewEvent } from '../../domain/types';
import { statDeltaToText } from '../../domain/stats';
import { useGame } from '../../state/GameContext';

export function ReviewPanel({ reviews }: { reviews: ReviewEvent[] }) {
  const { dispatch } = useGame();
  const review = reviews[0];

  return (
    <section className="review-panel" aria-label="审稿意见">
      <p className="file-code">{review.agency}</p>
      <h2>审稿意见</h2>
      <p className="review-comment">{review.comment}</p>
      <div className="review-choices">
        {review.choices.map((choice) => (
          <button
            type="button"
            key={choice.id}
            className="review-choice"
            onClick={() => dispatch({ type: 'DECIDE_REVIEW', reviewId: review.id, choiceId: choice.id })}
          >
            <strong>{choice.label}</strong>
            <span>{choice.description}</span>
            <em>{statDeltaToText(choice.effects)}</em>
          </button>
        ))}
      </div>
      {reviews.length > 1 && <p className="empty-note">另有 {reviews.length - 1} 条审稿意见等待处理。</p>}
    </section>
  );
}
