import { useState, useRef, useEffect } from 'react';

const LOCAL_DB = [
  { name: 'Гречка варёная', kcal_per_100: 92, protein_per_100: 3.4, fat_per_100: 0.6, carbs_per_100: 19.9 },
  { name: 'Гречка сухая', kcal_per_100: 329, protein_per_100: 12.6, fat_per_100: 3.3, carbs_per_100: 62.1 },
  { name: 'Рис варёный', kcal_per_100: 130, protein_per_100: 2.7, fat_per_100: 0.3, carbs_per_100: 28.2 },
  { name: 'Овсянка варёная', kcal_per_100: 88, protein_per_100: 3.0, fat_per_100: 1.7, carbs_per_100: 15.0 },
  { name: 'Куриная грудка варёная', kcal_per_100: 165, protein_per_100: 31.0, fat_per_100: 3.6, carbs_per_100: 0 },
  { name: 'Куриное бедро варёное', kcal_per_100: 185, protein_per_100: 21.3, fat_per_100: 11.0, carbs_per_100: 0 },
  { name: 'Говядина варёная', kcal_per_100: 254, protein_per_100: 25.9, fat_per_100: 16.8, carbs_per_100: 0 },
  { name: 'Яйцо куриное', kcal_per_100: 157, protein_per_100: 12.7, fat_per_100: 11.5, carbs_per_100: 0.7 },
  { name: 'Творог 5%', kcal_per_100: 121, protein_per_100: 17.2, fat_per_100: 5.0, carbs_per_100: 1.8 },
  { name: 'Творог 0%', kcal_per_100: 71, protein_per_100: 16.5, fat_per_100: 0.0, carbs_per_100: 1.3 },
  { name: 'Молоко 2.5%', kcal_per_100: 52, protein_per_100: 2.8, fat_per_100: 2.5, carbs_per_100: 4.7 },
  { name: 'Кефир 1%', kcal_per_100: 40, protein_per_100: 3.6, fat_per_100: 1.0, carbs_per_100: 4.1 },
  { name: 'Греческий йогурт', kcal_per_100: 59, protein_per_100: 10.0, fat_per_100: 0.4, carbs_per_100: 3.6 },
  { name: 'Хлеб белый', kcal_per_100: 265, protein_per_100: 7.9, fat_per_100: 3.2, carbs_per_100: 49.0 },
  { name: 'Хлеб чёрный', kcal_per_100: 201, protein_per_100: 6.8, fat_per_100: 1.3, carbs_per_100: 39.5 },
  { name: 'Картофель варёный', kcal_per_100: 82, protein_per_100: 2.0, fat_per_100: 0.4, carbs_per_100: 17.0 },
  { name: 'Банан', kcal_per_100: 89, protein_per_100: 1.1, fat_per_100: 0.3, carbs_per_100: 22.8 },
  { name: 'Яблоко', kcal_per_100: 52, protein_per_100: 0.3, fat_per_100: 0.2, carbs_per_100: 13.8 },
  { name: 'Апельсин', kcal_per_100: 43, protein_per_100: 0.9, fat_per_100: 0.2, carbs_per_100: 8.1 },
  { name: 'Огурец', kcal_per_100: 15, protein_per_100: 0.8, fat_per_100: 0.1, carbs_per_100: 2.5 },
  { name: 'Помидор', kcal_per_100: 18, protein_per_100: 0.9, fat_per_100: 0.2, carbs_per_100: 3.7 },
  { name: 'Масло оливковое', kcal_per_100: 884, protein_per_100: 0, fat_per_100: 100, carbs_per_100: 0 },
  { name: 'Масло сливочное', kcal_per_100: 748, protein_per_100: 0.5, fat_per_100: 82.5, carbs_per_100: 0.8 },
  { name: 'Лосось', kcal_per_100: 208, protein_per_100: 20.0, fat_per_100: 13.0, carbs_per_100: 0 },
  { name: 'Тунец в воде', kcal_per_100: 96, protein_per_100: 21.5, fat_per_100: 0.7, carbs_per_100: 0 },
  { name: 'Макароны варёные', kcal_per_100: 158, protein_per_100: 5.5, fat_per_100: 0.9, carbs_per_100: 30.9 },
  { name: 'Орехи грецкие', kcal_per_100: 654, protein_per_100: 15.2, fat_per_100: 65.2, carbs_per_100: 7.0 },
  { name: 'Арахис', kcal_per_100: 567, protein_per_100: 25.8, fat_per_100: 49.2, carbs_per_100: 7.7 },
  { name: 'Мёд', kcal_per_100: 304, protein_per_100: 0.3, fat_per_100: 0, carbs_per_100: 82.4 },
  { name: 'Сахар', kcal_per_100: 387, protein_per_100: 0, fat_per_100: 0, carbs_per_100: 100 },
];

function searchLocal(query) {
  const q = query.toLowerCase();
  return LOCAL_DB.filter(p => p.name.toLowerCase().includes(q));
}

async function searchAPI(query) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8&fields=product_name,nutriments,brands`;
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    return (data.products || [])
      .filter(p => p.product_name && p.nutriments?.['energy-kcal_100g'])
      .map(p => ({
        name: [p.product_name, p.brands].filter(Boolean).join(' — '),
        kcal_per_100: Math.round(p.nutriments['energy-kcal_100g'] || 0),
        protein_per_100: p.nutriments['proteins_100g'] || 0,
        fat_per_100: p.nutriments['fat_100g'] || 0,
        carbs_per_100: p.nutriments['carbohydrates_100g'] || 0,
      }));
  } finally {
    clearTimeout(timeout);
  }
}

export default function FoodSearch({ onAdd, selectedDate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [grams, setGrams] = useState('');
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const doSearch = (q) => {
    clearTimeout(timerRef.current);
    setSelected(null);
    if (q.length < 2) { setResults([]); setApiStatus(''); return; }

    const local = searchLocal(q);
    if (local.length > 0) {
      setResults(local);
      setApiStatus('');
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const api = await searchAPI(q);
        if (api.length > 0) {
          const merged = [...local];
          api.forEach(a => {
            if (!merged.find(l => l.name.toLowerCase() === a.name.toLowerCase())) {
              merged.push(a);
            }
          });
          setResults(merged.slice(0, 10));
          setApiStatus('');
        } else if (local.length === 0) {
          setApiStatus('Не найдено. Попробуйте на английском.');
        }
      } catch {
        if (local.length === 0) {
          setApiStatus('Нет интернета — используется локальная база');
        }
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setError('');
    doSearch(val);
  };

  const handleSelect = (product) => {
    setSelected(product);
    setResults([]);
    setQuery(product.name);
  };

  const handleAdd = () => {
    if (!selected) { setError('Выберите продукт из списка'); return; }
    const g = parseFloat(grams);
    if (!g || g <= 0 || g > 5000) { setError('Введите корректные граммы'); return; }
    onAdd(selected, g, selectedDate);
    setQuery('');
    setGrams('');
    setSelected(null);
    setResults([]);
    setError('');
    setApiStatus('');
  };

  const kcalPreview = selected
    ? Math.round((selected.kcal_per_100 * parseFloat(grams || 0)) / 100)
    : null;

  return (
    <div className="card">
      <h2>Добавить еду</h2>

      <div className="food-search-wrap">
        <div className="field search-field">
          <label>Поиск продукта</label>
          <div className="input-with-hint">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Например: гречка, курица, яблоко..."
              autoComplete="off"
            />
            {loading && <span className="spin" />}
          </div>
          {apiStatus && <span className="api-status">{apiStatus}</span>}

          {results.length > 0 && (
            <ul className="search-results">
              {results.map((r, i) => (
                <li key={i} onClick={() => handleSelect(r)}>
                  <span className="result-name">{r.name}</span>
                  <span className="result-kcal">{r.kcal_per_100} ккал/100г</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="field grams-field">
          <label>Граммы</label>
          <input
            type="number"
            min="1"
            max="5000"
            value={grams}
            placeholder="г"
            onChange={e => setGrams(e.target.value)}
          />
        </div>

        <div className="add-btn-wrap">
          {kcalPreview !== null && grams && (
            <span className="kcal-preview">{kcalPreview} ккал</span>
          )}
          <button className="btn-primary" onClick={handleAdd}>
            Добавить
          </button>
        </div>
      </div>

      {selected && (
        <div className="product-info">
          <span>Белки <strong>{((selected.protein_per_100 * parseFloat(grams || 0)) / 100).toFixed(1)}г</strong></span>
          <span>Жиры <strong>{((selected.fat_per_100 * parseFloat(grams || 0)) / 100).toFixed(1)}г</strong></span>
          <span>Углеводы <strong>{((selected.carbs_per_100 * parseFloat(grams || 0)) / 100).toFixed(1)}г</strong></span>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
