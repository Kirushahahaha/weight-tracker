export default function HistoryTable({ entries, onDelete }) {
  if (!entries.length) {
    return (
      <div className="card">
        <h2>История</h2>
        <p className="muted">Записей пока нет</p>
      </div>
    );
  }

  const sorted = [...entries].reverse();

  return (
    <div className="card">
      <h2>История</h2>
      <div className="table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Вес</th>
              <th>Изменение</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, i) => {
              const prev = sorted[i + 1];
              const diff = prev ? (entry.weight - prev.weight) : null;
              return (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.weight} кг</td>
                  <td>
                    {diff !== null ? (
                      <span className={diff < 0 ? 'diff-down' : diff > 0 ? 'diff-up' : 'diff-none'}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => onDelete(entry.id)} title="Удалить">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
