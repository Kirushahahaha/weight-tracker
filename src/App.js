import { useState } from 'react';
import './App.css';
import { useWeightData } from './hooks/useWeightData';
import { useCalorieData } from './hooks/useCalorieData';
import WeightForm from './components/WeightForm';
import GoalForm from './components/GoalForm';
import ProgressBar from './components/ProgressBar';
import WeightChart from './components/WeightChart';
import BMICalculator from './components/BMICalculator';
import HistoryTable from './components/HistoryTable';
import FoodSearch from './components/FoodSearch';
import MealLog from './components/MealLog';
import CalorieSummary from './components/CalorieSummary';

const DAYS   = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

function CalendarBadge({ date }) {
  const d = new Date(date + 'T00:00:00');
  return (
    <div className="cal-badge">
      <span className="cal-month">{MONTHS[d.getMonth()]}</span>
      <span className="cal-day">{d.getDate()}</span>
      <span className="cal-weekday">{DAYS[d.getDay()]}</span>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('weight');
  const weight   = useWeightData();
  const calories = useCalorieData();

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = calories.getMealsByDate(today);

  return (
    <div className="app">
      <div className="grain" />

      <header className="app-header">
        <h1>Weight Tracker</h1>
        <CalendarBadge date={today} />
      </header>

      <nav className="tabs">
        <button className={`tab ${tab === 'weight' ? 'tab-active' : ''}`} onClick={() => setTab('weight')}>
          <span className="tab-num">01</span>
          <span>Weight</span>
        </button>
        <button className={`tab ${tab === 'calories' ? 'tab-active' : ''}`} onClick={() => setTab('calories')}>
          <span className="tab-num">02</span>
          <span>Nutrition</span>
        </button>
      </nav>

      <main>
        {tab === 'weight' && (
          <>
            <div className="grid-top">
              <WeightForm onAdd={weight.addEntry} entries={weight.entries} />
              <GoalForm goal={weight.goal} height={weight.height} onSetGoal={weight.setGoal} onSetHeight={weight.setHeight} />
            </div>
            <ProgressBar entries={weight.entries} goal={weight.goal} />
            <WeightChart entries={weight.entries} goal={weight.goal} />
            <div className="grid-bottom section-gap">
              <BMICalculator entries={weight.entries} height={weight.height} />
              <HistoryTable entries={weight.entries} onDelete={weight.deleteEntry} />
            </div>
          </>
        )}

        {tab === 'calories' && (
          <>
            <CalorieSummary meals={todayMeals} dailyGoal={calories.dailyGoal} onSetGoal={calories.setDailyGoal} />
            <FoodSearch onAdd={calories.addMeal} selectedDate={today} />
            <MealLog meals={todayMeals} onDelete={calories.deleteMeal} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
