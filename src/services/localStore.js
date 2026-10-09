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
  comments: 'portfoliohub_comments'         // { [templateId]: [comment, ...] }
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
