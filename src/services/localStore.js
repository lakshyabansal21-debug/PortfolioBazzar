/**
 * localStore.js: every localStorage key used by the data layer, plus safe read/write helpers.
 *
 * Before, dbService repeated try/catch + JSON.parse in many places. Now it lives here.
 */
export const KEYS = {
  templates: 'portfoliohub_templates',
  storeVersion: 'portfoliohub_store_version',
  likes: 'portfoliohub_user_likes',        // { [userId]: [templateId, ...] }
  favorites: 'portfoliohub_user_favorites', // { [userId]: [templateId, ...] }
  comments: 'portfoliohub_comments',        // { [templateId]: [comment, ...] }
  authUser: 'portfoliohub_auth_user',       // demo-mode login (only used when Supabase is not configured)
  authReturnUrl: 'portfoliohub_auth_return_url', // page to come back to after Google / GitHub login
  supabaseUrl: 'portfoliohub_supabase_url',
  supabaseAnonKey: 'portfoliohub_supabase_anon_key',
  recentSearches: 'ph_recent_searches'
};

/** Read JSON from localStorage. Returns `fallback` if anything goes wrong. */
export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Write JSON to localStorage. Returns false if it fails (storage full or blocked). */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('localStorage write failed:', e);
    return false;
  }
}

/** Read a plain text value. Returns null if storage is blocked (for example private mode or a sandboxed frame). */
export function readText(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write a plain text value. Returns false if storage is blocked. */
export function writeText(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Remove a value. Does nothing if storage is blocked. */
export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage blocked: nothing to remove */
  }
}
