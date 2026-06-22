import { useSyncedState } from './useSyncedState';

const STORAGE_KEY = 'weight_tracker_data';

const defaultData = {
  entries: [],
  goal: '',
  height: '',
};

export function useWeightData(user) {
  const [data, setData] = useSyncedState('weight', STORAGE_KEY, defaultData, user);

  const addEntry = (weight, date) => {
    const entry = {
      id: Date.now(),
      weight: parseFloat(weight),
      date: date || new Date().toISOString().split('T')[0],
    };
    setData(prev => ({
      ...prev,
      entries: [...prev.entries, entry].sort((a, b) => new Date(a.date) - new Date(b.date)),
    }));
  };

  const deleteEntry = (id) => {
    setData(prev => ({ ...prev, entries: prev.entries.filter(e => e.id !== id) }));
  };

  const setGoal = (goal) => {
    setData(prev => ({ ...prev, goal: parseFloat(goal) || '' }));
  };

  const setHeight = (height) => {
    setData(prev => ({ ...prev, height: parseFloat(height) || '' }));
  };

  return {
    entries: data.entries,
    goal: data.goal,
    height: data.height,
    addEntry,
    deleteEntry,
    setGoal,
    setHeight,
  };
}
