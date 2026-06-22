import { useSyncedState } from './useSyncedState';

const STORAGE_KEY = 'workout_tracker_data';

const defaultData = {
  history: [], // { id, date, name, durationSec, exercises }
};

export function useWorkoutData(user) {
  const [data, setData] = useSyncedState('workouts', STORAGE_KEY, defaultData, user);

  const addSession = ({ name, durationSec, exercises }) => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      name,
      durationSec,
      exercises,
    };
    setData(prev => ({ ...prev, history: [entry, ...prev.history] }));
  };

  const deleteSession = (id) => {
    setData(prev => ({ ...prev, history: prev.history.filter(h => h.id !== id) }));
  };

  return {
    history: data.history,
    addSession,
    deleteSession,
  };
}
