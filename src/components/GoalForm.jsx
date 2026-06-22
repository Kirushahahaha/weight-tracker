import { useState, useEffect } from 'react';

export default function GoalForm({ goal, onSetGoal }) {
  const [goalInput, setGoalInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (goal) setGoalInput(String(goal)); }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalInput) onSetGoal(goalInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card">
      <h2>Цель</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Целевой вес (кг)</label>
          <input type="number" step="0.1" min="1" max="500"
            value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder="70" />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: 12, width: '100%' }}>
          Сохранить
        </button>
      </form>
      {saved && <p className="success">Сохранено ✓</p>}
    </div>
  );
}
