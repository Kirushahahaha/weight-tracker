function RingChart({ percent, size = 140, stroke = 10, color, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
        {children}
      </div>
    </div>
  );
}

function getColor(percent) {
  if (percent >= 80) return '#4ade80';
  if (percent >= 40) return '#facc15';
  return '#FE492A';
}

export default function ProgressBar({ entries, goal }) {
  if (!entries.length) {
    return (
      <div className="card whoop-card">
        <h2>Прогресс</h2>
        <p className="muted">Добавьте первое взвешивание</p>
      </div>
    );
  }

  const current = entries[entries.length - 1].weight;
  const start   = entries[0].weight;

  if (!goal) {
    return (
      <div className="card whoop-card">
        <h2>Прогресс</h2>
        <div className="whoop-center">
          <RingChart percent={0} size={160} stroke={12} color="#B1BFE2">
            <span className="ring-value">{current}</span>
            <span className="ring-unit">кг сейчас</span>
          </RingChart>
          <p className="muted" style={{ marginTop: 16 }}>Укажите целевой вес</p>
        </div>
      </div>
    );
  }

  const totalToLose   = Math.abs(start - goal);
  const lost          = Math.abs(start - current);
  const remaining     = Math.abs(current - goal);
  const percent       = totalToLose === 0 ? 100 : Math.min(100, Math.round((lost / totalToLose) * 100));
  const isGoalReached = (goal < start && current <= goal) || (goal > start && current >= goal);
  const color         = isGoalReached ? '#4ade80' : getColor(percent);

  return (
    <div className="card whoop-card">
      <h2>Прогресс</h2>
      <div className="whoop-layout">
        <div className="whoop-ring-wrap">
          <RingChart percent={percent} size={160} stroke={12} color={color}>
            <span className="ring-value" style={{ color }}>{percent}%</span>
            <span className="ring-unit">до цели</span>
          </RingChart>
          {isGoalReached && <div className="goal-reached">Цель достигнута ✓</div>}
        </div>
        <div className="whoop-stats">
          <div className="whoop-stat">
            <span className="whoop-stat-value">{start}</span>
            <span className="whoop-stat-label">Старт, кг</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value" style={{ color }}>{current}</span>
            <span className="whoop-stat-label">Сейчас, кг</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value">{goal}</span>
            <span className="whoop-stat-label">Цель, кг</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value" style={{ color: '#FE492A' }}>{remaining.toFixed(1)}</span>
            <span className="whoop-stat-label">Осталось, кг</span>
          </div>
        </div>
      </div>
    </div>
  );
}
