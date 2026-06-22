import { useState, useEffect, useRef } from 'react';
import { supabase, isCloudEnabled } from '../supabaseClient';

const TABLE = 'profiles_data';

// Offline-first state that lives in localStorage and, when the user is logged
// in, syncs with a Supabase jsonb column. `column` is one of: weight, calories,
// workouts.
export function useSyncedState(column, storageKey, defaultValue, user) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Becomes true once the initial cloud pull is done, so we don't push stale
  // data over fresh cloud data on login.
  const pulled = useRef(false);

  // Always persist locally.
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [storageKey, data]);

  // React to auth changes: load the right user's data, never leak between accounts.
  useEffect(() => {
    pulled.current = false;
    if (!isCloudEnabled) return;

    // Signed out — wipe local state so the next account starts clean.
    if (!user) {
      setData(defaultValue);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data: row } = await supabase
        .from(TABLE)
        .select(column)
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (row && row[column] != null) {
        setData(row[column]);                 // existing account → its cloud data
      } else {
        // Fresh account → start empty (do NOT inherit previous account's data).
        setData(defaultValue);
        await supabase.from(TABLE).upsert({ user_id: user.id, [column]: defaultValue });
      }
      pulled.current = true;
    })();

    return () => { cancelled = true; };
  }, [column, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // On change while logged in: push to the cloud (debounced).
  useEffect(() => {
    if (!isCloudEnabled || !user || !pulled.current) return;
    const t = setTimeout(() => {
      supabase.from(TABLE).upsert({
        user_id: user.id,
        [column]: data,
        updated_at: new Date().toISOString(),
      });
    }, 700);
    return () => clearTimeout(t);
  }, [column, data, user]);

  return [data, setData];
}
