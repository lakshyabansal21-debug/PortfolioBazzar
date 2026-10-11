/**
 * url.js: safe handling of web addresses typed by users.
 *
 * A user can type anything into a "website" box, including "javascript:alert(1)". If we put that
 * in an <a href>, clicking it would run code. These helpers only let http(s) links through.
 */

/**
 * Returns a safe https/http URL, or '' if the text is empty or not a normal web address.
 * "github.com/me" becomes "https://github.com/me".
 */
export function safeUrl(input) {
  const text = String(input || '').trim();
  if (!text) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}
