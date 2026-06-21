import { statLabels } from '../../domain/stats';
import type { GameStats } from '../../domain/types';

export function StatLedger({ stats }: { stats: GameStats }) {
  return (
    <section className="stat-ledger" aria-label="全局数值">
      {(Object.keys(stats) as Array<keyof GameStats>).map((key) => (
        <div className="stat-cell" key={key} title={statLabels[key].description}>
          <span>{statLabels[key].label}</span>
          <meter min={0} max={12} value={stats[key]} aria-label={statLabels[key].label} />
          <strong>{stats[key]}</strong>
        </div>
      ))}
    </section>
  );
}
