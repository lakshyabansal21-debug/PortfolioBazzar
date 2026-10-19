/**
 * generate-sitemap.mjs: writes public/sitemap.xml and the "Sitemap:" line of public/robots.txt.
 *
 *   npm run sitemap          (also runs automatically before `npm run build`)
 *
 * It lists the public pages, the 24 built-in templates and (when Supabase is configured and
 * reachable) every approved community template. It NEVER fails the build: if something is
 * missing it prints a note and carries on.
 *
 * The site address is read from, in this order: SITE_URL, VITE_SITE_URL (environment or .env),
 * Vercel's VERCEL_PROJECT_PRODUCTION_URL. Without an address nothing is written, because a sitemap
 * needs full URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Reads KEY=value lines of a .env file (no extra package needed). */
function readDotEnv() {
  const out = {};
  for (const name of ['.env', '.env.production', '.env.local']) {
    try {
      fs.readFileSync(path.join(root, name), 'utf8').split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
      });
    } catch {
      /* file not there: fine */
    }
  }
  return out;
}

const dot = readDotEnv();
const get = (key) => process.env[key] || dot[key] || '';

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '';
const base = (get('SITE_URL') || get('VITE_SITE_URL') || vercel).trim().replace(/\/+$/, '');

if (!base) {
  console.log('[sitemap] skipped: set VITE_SITE_URL (for example https://yourdomain.com) to generate sitemap.xml');
  process.exit(0);
}

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const day = (value) => {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
};

const urls = new Map(); // loc -> { lastmod, changefreq, priority }
const add = (pathname, { lastmod = '', changefreq = 'weekly', priority = '0.5' } = {}) => {
  const loc = `${base}${pathname}`;
  if (!urls.has(loc)) urls.set(loc, { lastmod, changefreq, priority });
};

// 1) public pages
add('/', { changefreq: 'weekly', priority: '1.0' });
add('/explore', { changefreq: 'daily', priority: '0.9' });
add('/generator', { changefreq: 'monthly', priority: '0.7' });
add('/upload', { changefreq: 'monthly', priority: '0.5' });

// 2) category listing pages
try {
  const { TEMPLATE_CATEGORIES } = await import(pathToFileURL(path.join(root, 'src/data/categories.js')).href);
  TEMPLATE_CATEGORIES.forEach((c) => add(`/explore?category=${encodeURIComponent(c)}`, { changefreq: 'weekly', priority: '0.6' }));
} catch (e) {
  console.log('[sitemap] note: categories not read:', e.message);
}

// 3) built-in templates
try {
  const { SEED_TEMPLATES } = await import(pathToFileURL(path.join(root, 'src/data/seedTemplates.js')).href);
  SEED_TEMPLATES.forEach((t) => add(`/template/${encodeURIComponent(t.id)}`, { lastmod: day(t.updated_at || t.created_at), priority: '0.8' }));
} catch (e) {
  console.log('[sitemap] note: built-in templates not read:', e.message);
}

// 4) community templates from Supabase (public, approved rows only; the anon key is public by design)
const supaUrl = get('VITE_SUPABASE_URL').replace(/\/+$/, '');
const supaKey = get('VITE_SUPABASE_ANON_KEY');
if (supaUrl && supaKey) {
  try {
    const query = 'select=id,created_at,updated_at&is_approved=eq.true&is_public=eq.true&order=created_at.desc&limit=5000';
    const res = await fetch(`${supaUrl}/rest/v1/templates?${query}`, {
      headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    rows.forEach((r) => add(`/template/${encodeURIComponent(r.id)}`, { lastmod: day(r.updated_at || r.created_at), priority: '0.7' }));
    console.log(`[sitemap] ${rows.length} community templates added from Supabase`);
  } catch (e) {
    console.log('[sitemap] note: Supabase templates not added:', e.message);
  }
}

// 5) write sitemap.xml (the 50,000 URL limit of one sitemap file is far away; stop there to be safe)
const entries = [...urls.entries()].slice(0, 50000).map(([loc, v]) => {
  const parts = [`    <loc>${esc(loc)}</loc>`];
  if (v.lastmod) parts.push(`    <lastmod>${v.lastmod}</lastmod>`);
  parts.push(`    <changefreq>${v.changefreq}</changefreq>`, `    <priority>${v.priority}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
});
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);

// 6) robots.txt: keep the rules, make sure exactly one Sitemap line with the real address exists
const robotsPath = path.join(root, 'public/robots.txt');
let robots = '';
try {
  robots = fs.readFileSync(robotsPath, 'utf8');
} catch {
  robots = 'User-agent: *\nAllow: /\n';
}
robots = robots.split(/\r?\n/).filter((l) => !/^\s*sitemap:/i.test(l)).join('\n').trimEnd();
fs.writeFileSync(robotsPath, `${robots}\n\nSitemap: ${base}/sitemap.xml\n`);

console.log(`[sitemap] public/sitemap.xml written with ${entries.length} URLs for ${base}`);
