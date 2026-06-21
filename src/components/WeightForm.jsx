import { useState } from 'react';

function pad(v) { return String(v).padStart(2, '0'); }

function todayParts() {
  const d = new Date();
  return { day: pad(d.getDate()), month: pad(d.getMonth() + 1), year: String(d.getFullYear()).slice(2) };
}

function expandYear(y) {
  const n = parseInt(y);
  if (!n) return n;
  return n >= 0 && n <= 99 ? 2000 + n : n;
}

function isValidDate(day, month, year) {
  const d = parseInt(day), m = parseInt(month), y = expandYear(year);
  if (!d || !m || !y || y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) return false;
  return date <= new Date();
}

export default function WeightForm({ onAdd, entries }) {
  const init = todayParts();
  const [weight, setWeight] = useState('');
  const [day, setDay]     = useState(init.day);
  const [month, setMonth] = useState(init.month);
  const [year, setYear]   = useState(init.year);
  const [error, setError] = useState('');

  const monthRef = { current: null };
  const yearRef  = { current: null };

  const handleSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w <= 0 || w > 500) { setError('Введите корректный вес (1–500 кг)'); return; }
    if (!isValidDate(day, month, year)) { setError('Введите корректную дату (не в будущем)'); return; }
    const isoDate = `${expandYear(year)}-${pad(month)}-${pad(day)}`;
    if (entries && entries.some(e => e.date === isoDate)) { setError('Запись на эту дату уже существует'); return; }
    onAdd(w, isoDate);
    setWeight(''); setError('');
    const t = todayParts();
    setDay(t.day); setMonth(t.month); setYear(t.year);
  };

  return (
    <div className="card">
      <h2>Взвешивание</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label>Вес (кг)</label>
            <input type="number" step="0.1" min="1" max="500" value={weight}
              onChange={e => setWeight(e.target.value)} placeholder="75.5" />
          </div>
          <div className="field">
            <label>Дата</label>
            <div className="date-fields">
              <input type="number" className="date-part" placeholder="ДД" min="1" max="31" value={day}
                onChange={e => { const v = e.target.value.slice(0,2); setDay(v); if (v.length === 2) monthRef.current?.focus(); }} />
              <span className="date-sep">/</span>
              <input type="number" className="date-part" placeholder="ММ" min="1" max="12" value={month}
                ref={el => monthRef.current = el}
                onChange={e => { const v = e.target.value.slice(0,2); setMonth(v); if (v.length === 2) yearRef.current?.focus(); }} />
              <span className="date-sep">/</span>
              <input type="number" className="date-part date-year" placeholder="ГГ" min="0" max="99" value={year}
                ref={el => yearRef.current = el}
                onChange={e => setYear(e.target.value.slice(0,2))} />
            </div>
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: 12, width: '100%' }}>Добавить</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
