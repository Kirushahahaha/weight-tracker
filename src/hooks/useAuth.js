import { useState, useEffect } from 'react';
import { supabase, isCloudEnabled } from '../supabaseClient';

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(isCloudEnabled);

  useEffect(() => {
    if (!isCloudEnabled) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // Session present → confirmation is off, logged in immediately.
    // No session → confirmation required, a link was emailed.
    return data.session ? { ok: true } : { needsConfirm: true };
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message || null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}
