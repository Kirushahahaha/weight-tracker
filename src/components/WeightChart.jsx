import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from 'recharts';

export default function WeightChart({ entries, goal }) {
  if (entries.length < 2) {
    return (
      <div className="card chart-empty">
        <div className="chart-empty-inner">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#44445A" strokeWidth="1.2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <p className="muted">Добавьте 2+ записи — появится график</p>
        </div>
      </div>
    );
  }

  const data = entries.map(e => ({
    date: e.date,
    вес: e.weight,
  }));

  const weights = entries.map(e => e.weight);
  const minW = Math.min(...weights, goal || Infinity) - 2;
  const maxW = Math.max(...weights, goal || 0) + 2;

  return (
    <div className="card">
      <h2>График веса</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[minW, maxW]} tick={{ fontSize: 12 }} unit=" кг" />
          <Tooltip formatter={(val) => [`${val} кг`, 'Вес']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="вес"
            stroke="#4caf50"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          {goal && (
            <ReferenceLine
              y={goal}
              stroke="#ff7043"
              strokeDasharray="5 5"
              label={{ value: `Цель: ${goal} кг`, position: 'right', fontSize: 12, fill: '#ff7043' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
