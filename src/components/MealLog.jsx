export default function MealLog({ meals, onDelete }) {
  if (!meals.length) {
    return (
      <div className="card">
        <h2>Приёмы пищи за день</h2>
        <p className="muted">Добавьте первый продукт через поиск выше</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Приёмы пищи за день</h2>
      <div className="table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Продукт</th>
              <th>Граммы</th>
              <th>Ккал</th>
              <th>Б</th>
              <th>Ж</th>
              <th>У</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal.id}>
                <td className="meal-name">{meal.name}</td>
                <td>{meal.grams}г</td>
                <td><strong>{meal.kcal}</strong></td>
                <td className="macro">{meal.protein}г</td>
                <td className="macro">{meal.fat}г</td>
                <td className="macro">{meal.carbs}г</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(meal.id)}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
