import { useState, useEffect, useRef, useCallback } from 'react';
import { EXERCISES } from '../data/exercises';
import ExerciseGif from './ExerciseGif';

const READY_SECONDS = 5;

export default function WorkoutPlayer({ program, onFinish, onClose }) {
  const items = program.items;
  const [index, setIndex]     = useState(0);
  const [phase, setPhase]     = useState('ready'); // 'ready' | 'exercise' | 'rest' | 'done'
  const [secLeft, setSecLeft] = useState(READY_SECONDS);
  const [paused, setPaused]   = useState(false);
  const elapsedRef = useRef(0);

  const current = items[index];
  const phaseTotal =
    phase === 'ready' ? READY_SECONDS :
    phase === 'exercise' ? current.time :
    phase === 'rest' ? program.rest : 0;

  // Advance to the next phase when the timer runs out.
  const next = useCallback(() => {
    if (phase === 'ready') {
      setPhase('exercise'); setSecLeft(items[index].time);
    } else if (phase === 'exercise') {
      if (index >= items.length - 1) {
        setPhase('done');
      } else {
        setPhase('rest'); setSecLeft(program.rest);
      }
    } else if (phase === 'rest') {
      const ni = index + 1;
      setIndex(ni); setPhase('exercise'); setSecLeft(items[ni].time);
    }
  }, [phase, index, items, program.rest]);

  // Tick every second.
  useEffect(() => {
    if (paused || phase === 'done') return;
    const id = setInterval(() => {
      setSecLeft(s => {
        if (phase === 'exercise' || phase === 'rest') elapsedRef.current += 1;
        return s <= 1 ? 0 : s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, phase]);

  // When the countdown reaches 0, move on.
  useEffect(() => {
    if (secLeft === 0 && phase !== 'done') {
      const t = setTimeout(next, 200);
      return () => clearTimeout(t);
    }
  }, [secLeft, phase, next]);

  // Save the session once when finished.
  useEffect(() => {
    if (phase === 'done') {
      onFinish({
        name: program.name,
        durationSec: elapsedRef.current,
        exercises: items.length,
      });
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const skip = () => { setSecLeft(0); };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── Done screen ──
  if (phase === 'done') {
    const mins = Math.round(elapsedRef.current / 60);
    return (
      <div className="workout-player">
        <div className="wp-done">
          <div className="wp-done-check">✓</div>
          <h2>Тренировка завершена!</h2>
          <div className="wp-done-stats">
            <div><span className="wp-done-num">{items.length}</span><span className="wp-done-lbl">упражнений</span></div>
            <div><span className="wp-done-num">{mins || '<1'}</span><span className="wp-done-lbl">минут</span></div>
            <div><span className="wp-done-num">{program.name}</span><span className="wp-done-lbl">программа</span></div>
          </div>
          <button className="btn-primary wp-done-btn" onClick={onClose}>Готово</button>
        </div>
      </div>
    );
  }

  const ex = EXERCISES[current.ex];
  const nextEx = index < items.length - 1 ? EXERCISES[items[index + 1].ex] : null;
  const pct = phaseTotal ? ((phaseTotal - secLeft) / phaseTotal) * 100 : 0;
  const R = 130, C = 2 * Math.PI * R;
  const isRest = phase === 'rest';
  const isReady = phase === 'ready';

  return (
    <div className="workout-player">
      <div className="wp-top">
        <button className="wp-close" onClick={onClose}>✕</button>
        <span className="wp-progress-text">{index + 1} / {items.length}</span>
        <span className="wp-elapsed">{fmt(elapsedRef.current)}</span>
      </div>

      <div className="wp-body">
        {isRest ? (
          <div className="wp-rest-label">ОТДЫХ</div>
        ) : isReady ? (
          <div className="wp-rest-label">ПРИГОТОВЬСЯ</div>
        ) : null}

        <div className="wp-gif-wrap">
          {isRest && nextEx ? (
            <ExerciseGif gif={nextEx.gif} imgs={nextEx.imgs} paused={paused} className="wp-gif-rest" />
          ) : (
            <ExerciseGif gif={ex.gif} imgs={ex.imgs} paused={paused || isReady} />
          )}

          <svg className="wp-ring" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r={R} className="wp-ring-bg" />
            <circle
              cx="150" cy="150" r={R}
              className={`wp-ring-fill ${isRest ? 'rest' : ''}`}
              strokeDasharray={C}
              strokeDashoffset={C - (pct / 100) * C}
            />
          </svg>

          <div className="wp-timer">{secLeft}</div>
        </div>

        <div className="wp-info">
          <h2 className="wp-ex-name">
            {isRest && nextEx ? `Далее: ${nextEx.name}` : ex.name}
          </h2>
          <p className="wp-ex-muscle">
            {isRest && nextEx ? nextEx.muscle : ex.muscle}
          </p>
          {!isRest && !isReady && <p className="wp-ex-tips">{ex.tips}</p>}
        </div>
      </div>

      <div className="wp-controls">
        <button className="wp-ctrl-btn" onClick={() => setPaused(p => !p)}>
          {paused ? 'Продолжить' : 'Пауза'}
        </button>
        <button className="wp-ctrl-btn wp-skip" onClick={skip}>
          Пропустить
        </button>
      </div>
    </div>
  );
}
