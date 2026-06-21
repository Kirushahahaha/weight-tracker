import { useState, useEffect } from 'react';

const STORAGE_KEY = 'calorie_tracker_data';

const defaultData = {
  meals: [],
  dailyGoal: 2000,
};

export function useCalorieData() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addMeal = (product, grams, date) => {
    const kcalPer100 = product.kcal_per_100 || 0;
    const proteinPer100 = product.protein_per_100 || 0;
    const fatPer100 = product.fat_per_100 || 0;
    const carbsPer100 = product.carbs_per_100 || 0;

    const meal = {
      id: Date.now(),
      name: product.name,
      grams: parseFloat(grams),
      kcal: Math.round((kcalPer100 * grams) / 100),
      protein: Math.round((proteinPer100 * grams) / 100 * 10) / 10,
      fat: Math.round((fatPer100 * grams) / 100 * 10) / 10,
      carbs: Math.round((carbsPer100 * grams) / 100 * 10) / 10,
      date: date || new Date().toISOString().split('T')[0],
    };

    setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
  };

  const deleteMeal = (id) => {
    setData(prev => ({ ...prev, meals: prev.meals.filter(m => m.id !== id) }));
  };

  const setDailyGoal = (goal) => {
    setData(prev => ({ ...prev, dailyGoal: parseInt(goal) || 2000 }));
  };

  const getMealsByDate = (date) => {
    return data.meals.filter(m => m.date === date);
  };

  return {
    meals: data.meals,
    dailyGoal: data.dailyGoal,
    addMeal,
    deleteMeal,
    setDailyGoal,
    getMealsByDate,
  };
}
