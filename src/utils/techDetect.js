/**
 * techDetect.js: guesses which libraries / frameworks an uploaded portfolio uses,
 * so they can be added as tags (and found by search, for example "tailwind").
 */
const TECH = [
  ['Tailwind', /cdn\.tailwindcss\.com|tailwindcss|@tailwind\s/i],
  ['Bootstrap', /bootstrap(?:\.min)?\.(?:css|js)|cdn\.jsdelivr\.net\/npm\/bootstrap/i],
  ['React', /react(?:\.production|\.development)?(?:\.min)?\.js|react-dom|ReactDOM\./i],
  ['Vue', /vue(?:\.global)?(?:\.prod)?(?:\.min)?\.js|Vue\.createApp|createApp\(/i],
  ['Alpine.js', /alpinejs|\bx-data=/i],
  ['GSAP', /gsap(?:\.min)?\.js|TweenMax|ScrollTrigger/i],
  ['Three.js', /three(?:\.module)?(?:\.min)?\.js|\bTHREE\./i],
  ['jQuery', /jquery(?:\.min)?\.js|\$\(document\)/i]
];

/** Returns the names of the technologies found in the code, for example ['Tailwind', 'GSAP']. */
export function detectTech(html = '', css = '', js = '') {
  const code = `${html}\n${css}\n${js}`;
  return TECH.filter(([, re]) => re.test(code)).map(([name]) => name);
}

/** Your tags first, then detected ones that are not there yet (case-insensitive), at most `max`. */
export function mergeTags(tags, detected, max = 10) {
  const result = [...tags];
  detected.forEach((name) => {
    if (result.length < max && !result.some((t) => t.toLowerCase() === name.toLowerCase())) result.push(name);
  });
  return result.slice(0, max);
}
