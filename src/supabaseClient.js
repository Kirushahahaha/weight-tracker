import { createClient } from '@supabase/supabase-js';

// ⬇⬇⬇ ВСТАВЬ СЮДА ДВА ЗНАЧЕНИЯ ИЗ SUPABASE (Settings → API) ⬇⬇⬇
// Project URL  →  SUPABASE_URL
// anon public  →  SUPABASE_ANON_KEY
const SUPABASE_URL      = process.env.REACT_APP_SUPABASE_URL      || 'https://ixkmmvshmergydylesrv.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_4g5gLdTHRWS6vI5hts6mZg_e2KogToY';

// True only when real credentials are present — lets the app fall back to
// offline-only (localStorage) mode if Supabase isn't configured yet.
export const isCloudEnabled =
  SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20;

export const supabase = isCloudEnabled
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
