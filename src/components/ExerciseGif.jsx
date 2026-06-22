import { useState, useEffect } from 'react';

// Shows a full-motion looping GIF when available; if the GIF fails to load (or
// none is provided), falls back to alternating two position photos so the user
// never sees a blank white frame.
export default function ExerciseGif({ gif, imgs, speed = 650, paused = false, className = '' }) {
  const [frame, setFrame] = useState(0);
  const [gifFailed, setGifFailed] = useState(false);

  // Reset failure state when the source changes.
  useEffect(() => { setGifFailed(false); }, [gif]);

  const useGif = gif && !gifFailed;

  useEffect(() => {
    if (useGif || paused || !imgs || imgs.length < 2) return;
    const id = setInterval(() => setFrame(f => (f === 0 ? 1 : 0)), speed);
    return () => clearInterval(id);
  }, [useGif, paused, imgs, speed]);

  if (useGif) {
    return (
      <div className={`exercise-gif ${className}`}>
        <img
          src={gif}
          alt=""
          className="exercise-gif-frame"
          draggable={false}
          onError={() => setGifFailed(true)}
        />
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
