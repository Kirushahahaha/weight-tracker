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

async function decodeImage(img) {
  if ('BarcodeDetector' in window) {
    try {
      const detector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_e', 'code_128', 'code_39', 'qr_code', 'pdf417', 'data_matrix']
      });
      // Try full-size image first — barcode might be small in the frame
      const bitmapFull = await createImageBitmap(img);
      const full = await detector.detect(bitmapFull);
      bitmapFull.close();
      if (full.length > 0) return full[0].rawValue;
    } catch { /* fallthrough */ }
  }

  // ZXing fallback — scale to 2000px to keep barcode readable
  const MAX = 2000;
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth  * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);

  const { BrowserMultiFormatReader } = await import('@zxing/browser');
  const reader = new BrowserMultiFormatReader();
  const result = await reader.decodeFromCanvas(canvas);
  return result.getText();
}

export default function BarcodeScanner({ onResult, onClose }) {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const rafRef     = useRef(null);
  const photoRef   = useRef(null);
  const [mode, setMode]     = useState('camera'); // 'camera' | 'manual'
  const [status, setStatus] = useState('starting');
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

  // Photo capture — самый надёжный способ на iOS
  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setStatus('loading');
    setError('');
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const code = await decodeImage(img);
      URL.revokeObjectURL(img.src);
      lookup(code);
    } catch {
      URL.revokeObjectURL(photoRef.current?.value);
      setStatus('error');
      setError('Штрихкод не распознан. Попробуй ещё раз или введи вручную.');
      setMode('manual');
      if (photoRef.current) photoRef.current.value = '';
    }
  };

  useEffect(() => {
    if (mode !== 'camera') return;

    let cancelled = false;

    const startNative = async () => {
      const detector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']
      });
      const tick = async () => {
        if (cancelled || !videoRef.current) return;
        const v = videoRef.current;
        if (v.readyState === v.HAVE_ENOUGH_DATA) {
          try {
            const barcodes = await detector.detect(v);
            if (barcodes.length > 0 && !cancelled) { lookup(barcodes[0].rawValue); return; }
          } catch { /* miss */ }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const startZxing = async () => {
      const { BrowserMultiFormatReader, NotFoundException } = await import('@zxing/browser');
      if (cancelled) return;
      const reader = new BrowserMultiFormatReader();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let lastTick = 0;
      const tick = async (ts) => {
        if (cancelled || !videoRef.current) return;
        // throttle to ~5fps — ZXing чаще не нужен, только грузит
        if (ts - lastTick < 200) { rafRef.current = requestAnimationFrame(tick); return; }
        lastTick = ts;
        const v = videoRef.current;
        if (v.readyState === v.HAVE_ENOUGH_DATA) {
          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;
          ctx.drawImage(v, 0, 0);
          try {
            const result = await reader.decodeFromCanvas(canvas);
            if (!cancelled) { lookup(result.getText()); return; }
          } catch (e) {
            if (!(e instanceof NotFoundException) && e?.name !== 'NotFoundException') { /* ignore */ }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('scanning');
        if ('BarcodeDetector' in window) {
          await startNative();
        } else {
          await startZxing();
        }
      } catch {
        if (!cancelled) { setStatus('error'); setError('Камера недоступна.'); setMode('manual'); }
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 16px' }}>
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handlePhoto}
              />
              <button
                className="btn-primary"
                onClick={() => photoRef.current?.click()}
              >
                Сфотографировать штрихкод
              </button>
              <button className="barcode-switch-btn" onClick={() => { stopCamera(); setMode('manual'); }}>
                Ввести вручную
              </button>
            </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', padding: '0 16px' }}>
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handlePhoto}
              />
              <button
                className="btn-primary"
                onClick={() => photoRef.current?.click()}
              >
                Сфотографировать штрихкод
              </button>
            </div>
            <div className="barcode-manual">
              <input
                type="number"
                value={manual}
                onChange={e => setManual(e.target.value)}
                placeholder="4600000000000"
                onKeyDown={e => e.key === 'Enter' && lookup(manual)}
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
