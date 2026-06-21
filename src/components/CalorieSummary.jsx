import { useState, useEffect } from 'react';

function RingChart({ percent, size, stroke, color, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, percent)) / 100) * circ;
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

export default function CalorieSummary({ meals, dailyGoal, onSetGoal }) {
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal || 2000);
  useEffect(() => { setGoalInput(dailyGoal); }, [dailyGoal]);

  const totalKcal    = meals.reduce((s, m) => s + m.kcal, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0).toFixed(1);
  const totalFat     = meals.reduce((s, m) => s + m.fat, 0).toFixed(1);
  const totalCarbs   = meals.reduce((s, m) => s + m.carbs, 0).toFixed(1);
  const remaining    = dailyGoal - totalKcal;
  const percent      = Math.min(100, Math.round((totalKcal / dailyGoal) * 100));
  const isOver       = totalKcal > dailyGoal;
  const color        = isOver ? '#FE492A' : percent > 70 ? '#facc15' : '#4ade80';

  const saveGoal = () => {
    onSetGoal(goalInput);
    setEditing(false);
  };

  return (
    <div className="card whoop-card">
      <div className="summary-header">
        <h2>Калории</h2>
        <div className="goal-display">
          {editing ? (
            <div className="goal-edit-row">
              <input
                type="number" value={goalInput} min="500" max="10000"
                autoFocus
                onChange={e => setGoalInput(e.target.value)}
                onBlur={saveGoal}
                onKeyDown={e => e.key === 'Enter' && saveGoal()}
                className="goal-input-inline"
              />
              <span className="goal-kcal-label">ккал</span>
            </div>
          ) : (
            <button className="goal-text-btn" onClick={() => setEditing(true)} title="Изменить цель">
              Цель: {dailyGoal} ккал
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="whoop-layout">
        <div className="whoop-ring-wrap">
          <RingChart percent={percent} size={160} stroke={12} color={color}>
            <span className="ring-value" style={{ color }}>{percent}%</span>
            <span className="ring-unit">{isOver ? 'перебор' : 'выполнено'}</span>
          </RingChart>
        </div>

        <div className="whoop-stats">
          <div className="whoop-stat">
            <span className="whoop-stat-value" style={{ color }}>{totalKcal}</span>
            <span className="whoop-stat-label">Съедено, ккал</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value" style={{ color: isOver ? '#FE492A' : undefined }}>
              {isOver ? `+${Math.abs(remaining)}` : remaining}
            </span>
            <span className="whoop-stat-label">{isOver ? 'Перебор, ккал' : 'Осталось, ккал'}</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value">{totalProtein}г</span>
            <span className="whoop-stat-label">Белки</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value">{totalFat}г</span>
            <span className="whoop-stat-label">Жиры</span>
          </div>
          <div className="whoop-divider" />
          <div className="whoop-stat">
            <span className="whoop-stat-value">{totalCarbs}г</span>
            <span className="whoop-stat-label">Углеводы</span>
          </div>
        </div>
      </div>
    </div>
  );
}
