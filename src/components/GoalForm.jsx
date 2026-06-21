import { useState, useEffect } from 'react';

export default function GoalForm({ goal, height, onSetGoal, onSetHeight }) {
  const [goalInput,   setGoalInput]   = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (goal)   setGoalInput(String(goal));     }, [goal]);
  useEffect(() => { if (height) setHeightInput(String(height)); }, [height]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalInput)   onSetGoal(goalInput);
    if (heightInput) onSetHeight(heightInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card">
      <h2>Цель</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label>Целевой вес (кг)</label>
            <input type="number" step="0.1" min="1" max="500"
              value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder="70" />
          </div>
          <div className="field">
            <label>Рост (см)</label>
            <input type="number" step="1" min="50" max="250"
              value={heightInput} onChange={e => setHeightInput(e.target.value)} placeholder="175" />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: 12, width: '100%' }}>
          Сохранить
        </button>
      </form>
      {saved && <p className="success">Сохранено ✓</p>}
    </div>
  );
}
