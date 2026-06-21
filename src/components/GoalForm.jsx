import { useState, useEffect } from 'react';

export default function GoalForm({ goal, height, onSetGoal, onSetHeight }) {
  const [goalInput, setGoalInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (goal) setGoalInput(String(goal)); }, [goal]);
  useEffect(() => { if (height) setHeightInput(String(height)); }, [height]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalInput) onSetGoal(goalInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleHeightSave = () => {
    if (heightInput) onSetHeight(heightInput);
    setOpen(false);
  };

  return (
    <div className="card">
      <div className="goal-header">
        <h2>Цель</h2>
        <button className="settings-btn" onClick={() => setOpen(v => !v)} title="Настройки профиля">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-row">
        <div className="field">
          <label>Целевой вес (кг)</label>
          <input
            type="number" step="0.1" min="1" max="500"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            placeholder="70"
          />
        </div>
        <button type="submit" className="btn-secondary">Сохранить</button>
      </form>
      {saved && <p className="success">Сохранено ✓</p>}

      {open && (
        <div className="profile-panel">
          <div className="profile-panel-header">
            <span>Профиль</span>
            <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="field">
            <label>Рост (см)</label>
            <input
              type="number" step="0.1" min="50" max="250"
              value={heightInput}
              onChange={e => setHeightInput(e.target.value)}
              placeholder="175"
            />
          </div>
          <button className="btn-primary" style={{ marginTop: 12, width: '100%' }} onClick={handleHeightSave}>
            Сохранить
          </button>
        </div>
      )}
    </div>
  );
}
