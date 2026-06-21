import { useRef, useState, useEffect } from 'react';

async function fetchProduct(code) {
  const res  = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
  const data = await res.json();
  if (data.status !== 1) return null;
  const p = data.product;
  const n = p.nutriments;
  return {
    name:    p.product_name || p.product_name_ru || 'Неизвестный продукт',
    kcal:    Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
    protein: Math.round((n.proteins_100g       || 0) * 10) / 10,
    fat:     Math.round((n.fat_100g            || 0) * 10) / 10,
    carbs:   Math.round((n.carbohydrates_100g  || 0) * 10) / 10,
  };
}

export default function BarcodeScanner({ onResult, onClose }) {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const rafRef     = useRef(null);
  const readerRef  = useRef(null);
  const [mode, setMode]     = useState('camera'); // 'camera' | 'manual'
  const [status, setStatus] = useState('starting'); // 'starting' | 'scanning' | 'loading' | 'error'
  const [error, setError]   = useState('');
  const [manual, setManual] = useState('');

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const lookup = async (code) => {
    stopCamera();
    setStatus('loading');
    setError('');
    try {
      const product = await fetchProduct(code.trim());
      if (product) {
        onResult(product);
      } else {
        setStatus('error');
        setError('Продукт не найден. Введи номер вручную.');
        setMode('manual');
      }
    } catch {
      setStatus('error');
      setError('Ошибка подключения.');
      setMode('manual');
    }
  };

  useEffect(() => {
    if (mode !== 'camera') return;

    let cancelled = false;

    const start = async () => {
      try {
        const { BrowserMultiFormatReader, NotFoundException } = await import('@zxing/browser');
        if (cancelled) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        const canvas = document.createElement('canvas');
        const ctx    = canvas.getContext('2d');

        setStatus('scanning');

        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          const v = videoRef.current;
          if (v.readyState === v.HAVE_ENOUGH_DATA) {
            canvas.width  = v.videoWidth;
            canvas.height = v.videoHeight;
            ctx.drawImage(v, 0, 0);
            try {
              const result = await reader.decodeFromCanvas(canvas);
              if (!cancelled) lookup(result.getText());
              return;
            } catch (e) {
              if (!(e instanceof NotFoundException) && e?.name !== 'NotFoundException') {
                // ignore decode miss, keep scanning
              }
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) {
          setStatus('error');
          setError('Камера недоступна.');
          setMode('manual');
        }
      }
    };

    start();
    return () => { cancelled = true; stopCamera(); };
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => { stopCamera(); onClose(); };

  return (
    <div className="barcode-overlay">
      <div className="barcode-modal">
        <div className="barcode-header">
          <span>Поиск по штрихкоду</span>
          <button className="btn-delete" onClick={handleClose}>✕</button>
        </div>

        {status === 'loading' && (
          <div className="barcode-photo-ui">
            <div className="barcode-loading">
              <div className="barcode-spinner" />
              <p>Ищем продукт...</p>
            </div>
          </div>
        )}

        {status !== 'loading' && mode === 'camera' && (
          <div className="barcode-video-ui">
            <div className="barcode-viewfinder">
              <video ref={videoRef} playsInline muted className="barcode-video" />
              <div className="barcode-crosshair" />
              {status === 'starting' && <p className="barcode-hint">Запускаем камеру...</p>}
              {status === 'scanning' && <p className="barcode-hint">Наведи на штрихкод</p>}
            </div>
            <button className="barcode-switch-btn" onClick={() => { stopCamera(); setMode('manual'); }}>
              Ввести вручную
            </button>
          </div>
        )}

        {status !== 'loading' && mode === 'manual' && (
          <div className="barcode-photo-ui">
            <div className="barcode-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#B1BFE2" strokeWidth="1.2">
                <path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4"/>
                <line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/>
                <line x1="13" y1="8" x2="13" y2="16"/><line x1="16" y1="8" x2="16" y2="16"/>
              </svg>
            </div>
            {error && <p className="error" style={{ textAlign: 'center', marginBottom: 8 }}>{error}</p>}
            <div className="barcode-manual">
              <input
                type="number"
                value={manual}
                onChange={e => setManual(e.target.value)}
                placeholder="4600000000000"
                onKeyDown={e => e.key === 'Enter' && lookup(manual)}
                autoFocus
              />
              <button className="btn-primary" onClick={() => lookup(manual)}>→</button>
            </div>
            <button className="barcode-switch-btn" onClick={() => { setError(''); setMode('camera'); }}>
              Открыть камеру
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
