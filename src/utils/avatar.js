/**
 * avatar.js: returns an avatar image for a user.
 *
 * Before, one stock-photo URL was hard-coded in many files, so every user without a photo
 * looked the same. Now: use the real photo URL if there is one, otherwise draw a small
 * SVG with the user's initials.
 */
const PALETTE = ['#131A33', '#3347D6', '#2434A8', '#46506F', '#0F7B53'];

function initialsOf(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** @param url  real photo URL (may be empty)   @param name  used for the initials */
export function getAvatarUrl(url, name = '') {
  if (url) return url;
  const text = initialsOf(name);
  // pick a colour from the name (same name = same colour)
  let hash = 0;
  for (const ch of String(name)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const bg = PALETTE[hash % PALETTE.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
    `<rect width="96" height="96" fill="${bg}"/>` +
    `<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" ` +
    `font-family="system-ui, sans-serif" font-size="38" font-weight="700" fill="#DDF247">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
