function RingChart({ percent, size = 140, stroke = 10, color, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, percent)) / 100) * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        {children}
      </div>
    </div>
  );
}

function getBMIInfo(bmi) {
  if (bmi < 18.5) return { label: 'Дефицит',  color: '#60a5fa', percent: Math.round((bmi / 18.5) * 40) };
  if (bmi < 25)   return { label: 'Норма',     color: '#4ade80', percent: Math.round(40 + ((bmi - 18.5) / 6.5) * 30) };
  if (bmi < 30)   return { label: 'Избыток',   color: '#facc15', percent: Math.round(70 + ((bmi - 25) / 5) * 20) };
  return           { label: 'Ожирение',         color: '#f97316', percent: 100 };
}

export default function BMICalculator({ entries, height }) {
  if (!entries.length || !height || height < 50 || height > 250) {
    return (
      <div className="card whoop-card">
        <h2>BMI</h2>
        <p className="muted">
          {!height || height < 50
            ? 'Укажите рост в настройках'
            : 'Добавьте взвешивание'}
        </p>
      </div>
    );
  }

  const currentWeight = entries[entries.length - 1].weight;
  const heightM = height / 100;
  const bmi = currentWeight / (heightM * heightM);

  if (!isFinite(bmi) || isNaN(bmi) || bmi <= 0) {
    return (
      <div className="card whoop-card">
        <h2>BMI</h2>
        <p className="muted">Проверьте данные о росте</p>
      </div>
    );
  }

  const { label, color, percent } = getBMIInfo(bmi);

  return (
    <div className="card whoop-card">
      <h2>BMI</h2>
      <div className="whoop-center">
        <RingChart percent={percent} size={160} stroke={12} color={color}>
          <span className="ring-value" style={{ color }}>{bmi.toFixed(1)}</span>
          <span className="ring-unit" style={{ color }}>{label}</span>
        </RingChart>

        <div className="bmi-scale" style={{ marginTop: 16 }}>
          <span style={{ color: '#60a5fa' }}>&lt;18.5</span>
          <span style={{ color: '#4ade80' }}>18–25</span>
          <span style={{ color: '#facc15' }}>25–30</span>
          <span style={{ color: '#f97316' }}>&gt;30</span>
        </div>
        <p className="bmi-meta">{currentWeight} кг · {height} см</p>
      </div>
    </div>
  );
}
