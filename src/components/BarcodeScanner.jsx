import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function BarcodeScanner({ onResult, onClose }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader.decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
      if (!result) return;
      reader.reset();
      setLoading(true);
      try {
        const code = result.getText();
        const res  = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
        const data = await res.json();
        if (data.status === 1) {
          const p = data.product;
          const n = p.nutriments;
          onResult({
            name:    p.product_name || p.product_name_ru || 'Неизвестный продукт',
            kcal:    Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
            protein: Math.round((n.proteins_100g    || 0) * 10) / 10,
            fat:     Math.round((n.fat_100g         || 0) * 10) / 10,
            carbs:   Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          });
        } else {
          setError('Продукт не найден в базе');
          setLoading(false);
        }
      } catch {
        setError('Ошибка подключения');
        setLoading(false);
      }
    }).catch(() => setError('Нет доступа к камере'));

    return () => { try { reader.reset(); } catch {} };
  }, [onResult]);

  return (
    <div className="barcode-overlay">
      <div className="barcode-modal">
        <div className="barcode-header">
          <span>Наведи камеру на штрихкод</span>
          <button className="btn-delete" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="barcode-loading">
            <div className="barcode-spinner" />
            <p>Ищем продукт...</p>
          </div>
        ) : (
          <div className="barcode-video-wrap">
            <video ref={videoRef} className="barcode-video" autoPlay muted playsInline />
            <div className="barcode-aim" />
          </div>
        )}

        {error && <p className="error" style={{ padding: '12px 16px' }}>{error}</p>}
      </div>
    </div>
  );
}
