import { useState, useEffect } from 'react';

// Shows a full-motion looping GIF when available; otherwise alternates between
// two position photos to fake the movement.
export default function ExerciseGif({ gif, imgs, speed = 650, paused = false, className = '' }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (gif || paused || !imgs || imgs.length < 2) return;
    const id = setInterval(() => setFrame(f => (f === 0 ? 1 : 0)), speed);
    return () => clearInterval(id);
  }, [gif, paused, imgs, speed]);

  if (gif) {
    return (
      <div className={`exercise-gif ${className}`}>
        <img src={gif} alt="" className="exercise-gif-frame" draggable={false} />
      </div>
    );
  }

  if (!imgs || !imgs.length) return null;

  return (
    <div className={`exercise-gif ${className}`}>
      {imgs.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="exercise-gif-frame"
          style={{ opacity: i === frame ? 1 : 0 }}
          draggable={false}
        />
      ))}
    </div>
  );
}
