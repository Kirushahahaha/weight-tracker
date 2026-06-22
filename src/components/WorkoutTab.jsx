import { useState } from 'react';
import { PROGRAMS, EXERCISES, DIFFICULTIES, buildProgram } from '../data/exercises';
import { useWorkoutData } from '../hooks/useWorkoutData';
import WorkoutPlayer from './WorkoutPlayer';

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];

function programMeta(p) {
  const totalSec = p.items.reduce((s, it) => s + (it.time || 0), 0) + p.rest * (p.items.length - 1);
  return { mins: Math.round(totalSec / 60), count: p.items.length };
}

function ProgramCard({ program, diff, onStart }) {
  const [open, setOpen] = useState(false);
  const adjusted = buildProgram(program, diff);
  const { mins, count } = programMeta(adjusted);

  return (
    <div className="program-card">
      <div className="program-head" onClick={() => setOpen(o => !o)}>
        <div className="program-head-main">
          <h3>{program.name}</h3>
          <p>{program.desc}</p>
          <div className="program-meta">
            <span>{count} упр.</span>
            <span>~{mins} мин</span>
          </div>
        </div>
        <span className={`program-chevron ${open ? 'open' : ''}`}>⌄</span>
      </div>

      {open && (
        <div className="program-exercises">
          {adjusted.items.map((it, i) => {
            const ex = EXERCISES[it.ex];
            return (
              <div className="program-ex-row" key={i}>
                <img src={ex.imgs[0]} alt="" className="program-ex-thumb" draggable={false} />
                <div className="program-ex-info">
                  <span className="program-ex-name">{ex.name}</span>
                  <span className="program-ex-muscle">{ex.muscle}</span>
                </div>
                <span className="program-ex-time">{it.time}с</span>
              </div>
            );
          })}
        </div>
      )}

      <button className="btn-primary program-start" onClick={() => onStart(adjusted)}>
        Начать тренировку
      </button>
    </div>
  );
}

function HistoryCard({ history, onDelete }) {
  if (!history.length) {
    return (
      <div className="card">
        <h2>История тренировок</h2>
        <p className="muted">Завершите первую тренировку — она появится здесь</p>
      </div>
    );
  }
  return (
    <div className="card">
      <h2>История тренировок</h2>
      <div className="workout-history">
        {history.map(h => {
          const d = new Date(h.date + 'T00:00:00');
          const mins = Math.round(h.durationSec / 60);
          return (
            <div className="workout-history-row" key={h.id}>
              <div className="wh-date">
                <span className="wh-day">{d.getDate()}</span>
                <span className="wh-month">{MONTHS[d.getMonth()]}</span>
              </div>
              <div className="wh-info">
                <span className="wh-name">{h.name}</span>
                <span className="wh-meta">{h.exercises} упр · {mins || '<1'} мин</span>
              </div>
              <button className="btn-delete" onClick={() => onDelete(h.id)} title="Удалить">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkoutTab({ user }) {
  const { history, addSession, deleteSession } = useWorkoutData(user);
  const [active, setActive] = useState(null);
  const [diff, setDiff] = useState('medium');

  return (
    <>
      <div className="card">
        <h2>Сложность</h2>
        <div className="difficulty-select">
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              className={`diff-btn ${diff === d.id ? 'active' : ''}`}
              onClick={() => setDiff(d.id)}
            >
              {d.label}
              {d.rounds > 1 && <span className="diff-rounds">{d.rounds} круга</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="card section-gap">
        <h2>Программы тренировок</h2>
        <div className="program-list">
          {PROGRAMS.map(p => (
            <ProgramCard key={p.id} program={p} diff={diff} onStart={setActive} />
          ))}
        </div>
      </div>

      <div className="section-gap">
        <HistoryCard history={history} onDelete={deleteSession} />
      </div>

      {active && (
        <WorkoutPlayer
          program={active}
          onFinish={addSession}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
