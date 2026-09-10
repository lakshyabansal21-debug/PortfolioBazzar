import { createClient } from '@supabase/supabase-js';

// Resolve project URL, extracting project reference from JWT if needed
function resolveSupabaseUrl(rawUrl, anonKey) {
  let url = (rawUrl || '').trim();
  if (anonKey) {
    try {
      const parts = anonKey.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload?.ref) {
          if (!url || !url.includes(payload.ref)) {
            url = `https://${payload.ref}.supabase.co`;
          }
        }
      }
    } catch (e) {
      // fallback to provided url
    }
  }
  return url;
}

// Retrieve from localStorage if user configured custom connection in-app, or fall back to env vars
const savedCustomUrl = typeof window !== 'undefined' ? localStorage.getItem('portfoliohub_supabase_url') : null;
const savedCustomAnonKey = typeof window !== 'undefined' ? localStorage.getItem('portfoliohub_supabase_anon_key') : null;

const rawUrl = (
  savedCustomUrl || 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
  ''
).trim();

const rawAnonKey = (
  savedCustomAnonKey || 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
  ''
).trim();

export const supabaseUrl = resolveSupabaseUrl(rawUrl, rawAnonKey);
export const supabaseAnonKey = rawAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Graceful client creation that prevents unhandled crashes if env vars are placeholders
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'portfoliohub-supabase-auth',
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
      },
    });

// Save custom Supabase credentials from UI dialog
export function saveCustomSupabase(url, anonKey) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('portfoliohub_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('portfoliohub_supabase_anon_key', anonKey.trim());
  }
}

// Reset custom Supabase credentials
export function clearCustomSupabase() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('portfoliohub_supabase_url');
    localStorage.removeItem('portfoliohub_supabase_anon_key');
  }
}

// Diagnostics check on Supabase connection
export async function testSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Supabase credentials are not configured.' };
  }

  try {
    const t0 = performance.now();
    // Test auth settings endpoint or profiles table
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const latency = Math.round(performance.now() - t0);

    if (error && error.code !== 'PGRST116') {
      return { 
        ok: false, 
        message: `Connected to Supabase, but profiles table error: ${error.message}`, 
        latency 
      };
    }

    return { 
      ok: true, 
      message: `Successfully connected to Supabase (${latency}ms latency).`, 
      url: supabaseUrl,
      latency 
    };
  } catch (err) {
    return { ok: false, message: `Connection failed: ${err.message}` };
  }
}

export default supabase;
