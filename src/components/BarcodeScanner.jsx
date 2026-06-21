import { useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

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
  const inputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError]   = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('loading');
    setError('');
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);

      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromCanvas(canvas);
      const code   = result.getText();

      const product = await fetchProduct(code);
      if (product) {
        onResult(product);
      } else {
        setStatus('error');
        setError('Продукт не найден. Попробуй другой штрихкод.');
      }
    } catch {
      setStatus('error');
      setError('Штрихкод не распознан. Сфотографируй чётче при хорошем освещении.');
    }
    e.target.value = '';
  };

  return (
    <div className="barcode-overlay">
      <div className="barcode-modal">
        <div className="barcode-header">
          <span>Сканер штрихкода</span>
          <button className="btn-delete" onClick={onClose}>✕</button>
        </div>

        <div className="barcode-photo-ui">
          {status === 'loading' ? (
            <div className="barcode-loading">
              <div className="barcode-spinner" />
              <p>Ищем продукт...</p>
            </div>
          ) : (
            <>
              <div className="barcode-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B1BFE2" strokeWidth="1.2">
                  <path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4"/>
                  <line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/>
                  <line x1="13" y1="8" x2="13" y2="16"/><line x1="16" y1="8" x2="16" y2="16"/>
                </svg>
              </div>
              <p className="barcode-hint">Сфотографируй штрихкод на упаковке</p>
              <button className="btn-primary barcode-photo-btn" onClick={() => inputRef.current?.click()}>
                📷 Открыть камеру
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleFile}
              />
            </>
          )}

          {status === 'error' && (
            <>
              <p className="error" style={{ textAlign: 'center', marginTop: 12 }}>{error}</p>
              <button className="btn-primary barcode-photo-btn" style={{ marginTop: 8 }} onClick={() => { setStatus('idle'); setError(''); inputRef.current?.click(); }}>
                Попробовать снова
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
