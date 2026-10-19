/**
 * Editable Fields
 * ---------------
 * The person UPLOADING a template declares which parts are meant to be replaced by
 * whoever uses it, and what the current ("old") value of each part is, e.g.
 *
 *   { id: 'name', label: 'Your name', type: 'text', old: 'Alex Rivera' }
 *
 * The definitions are stored INSIDE the template's html_code as a JSON <script> block,
 * so they travel with the template (database, local storage, remixes) without any
 * database change. They are stripped again when the portfolio is downloaded.
 *
 * Types: text | textarea | email | link | image
 */

const TAG_ID = 'ph-editable-fields';
const BLOCK_RE = new RegExp(`\\s*<script[^>]*id=["']${TAG_ID}["'][^>]*>[\\s\\S]*?<\\/script>`, 'gi');
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'TEMPLATE']);

export const FIELD_TYPES = [
  { value: 'text', label: 'Short text' },
  { value: 'textarea', label: 'Long text' },
  { value: 'email', label: 'Email' },
  { value: 'link', label: 'Link (URL)' },
  { value: 'image', label: 'Image (URL)' }
];

const isFullDocument = (html) => /<html[\s>]/i.test(html || '');
const parse = (html) => new DOMParser().parseFromString(html || '', 'text/html');
const serialize = (doc, original) =>
  isFullDocument(original)
    ? (/^\s*<!doctype/i.test(original) ? '<!DOCTYPE html>\n' : '') + doc.documentElement.outerHTML
    : doc.body.innerHTML;

/* ---------- store / read the definitions ---------- */

export function readFieldDefs(html) {
  if (!html) return [];
  const m = new RegExp(`<script[^>]*id=["']${TAG_ID}["'][^>]*>([\\s\\S]*?)<\\/script>`, 'i').exec(html);
  if (!m) return [];
  try {
    const list = JSON.parse(m[1]);
    return Array.isArray(list) ? list.filter((f) => f && f.id && f.old) : [];
  } catch {
    return [];
  }
}

export function stripFieldDefs(html) {
  return (html || '').replace(BLOCK_RE, '');
}

export function embedFieldDefs(html, defs) {
  const clean = stripFieldDefs(html);
  const valid = (defs || []).filter((f) => f.label?.trim() && f.old?.trim());
  if (valid.length === 0) return clean;
  const json = JSON.stringify(
    valid.map(({ id, label, type, old }) => ({ id, label: label.trim(), type: type || 'text', old: old.trim() }))
  ).replace(/</g, '\\u003c');
  const block = `\n<script type="application/json" id="${TAG_ID}">${json}</script>\n`;
  const idx = clean.toLowerCase().lastIndexOf('</body>');
  return idx === -1 ? clean + block : clean.slice(0, idx) + block + clean.slice(idx);
}

/* ---------- find / replace ---------- */

function textNodes(doc) {
  const out = [];
  const roots = [doc.body, doc.head].filter(Boolean);
  roots.forEach((root) => {
    const w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName.toUpperCase())) continue;
      // <title> lives in <head> and is allowed; other head text is ignored
      if (root === doc.head && p.tagName.toUpperCase() !== 'TITLE') continue;
      out.push(n);
    }
  });
  return out;
}

const attrFor = (type) => (type === 'image' ? 'src' : 'href');
const usesText = (type) => type === 'text' || type === 'textarea' || type === 'email';
const usesAttr = (type) => type === 'link' || type === 'image' || type === 'email';

const occurrences = (str, sub) => (sub ? str.split(sub).length - 1 : 0);

function countInDoc(doc, def) {
  let count = 0;
  if (usesText(def.type)) textNodes(doc).forEach((n) => (count += occurrences(n.nodeValue, def.old)));
  if (usesAttr(def.type)) {
    const attr = attrFor(def.type);
    doc.querySelectorAll(`[${attr}]`).forEach((el) => (count += occurrences(el.getAttribute(attr), def.old)));
  }
  return count;
}

/** How many times the old value appears in the template (used to validate while uploading). */
export function countOccurrences(html, def) {
  if (!def?.old?.trim()) return 0;
  return countInDoc(parse(stripFieldDefs(html)), { ...def, old: def.old.trim() });
}

/**
 * Core find/replace on explicit definitions (does not touch the embedded block).
 * values: { [fieldId]: newValue }.  Empty / unchanged values are skipped.
 * Returns { html, applied, missing, defs } where defs carry the NEW values as "old".
 */
export function replaceInHtml(html, defs, values) {
  const doc = parse(stripFieldDefs(html));
  const applied = [];
  const missing = [];
  const updated = (defs || []).map((d) => ({ ...d }));

  // longest old values first, so "Alex Rivera" is handled before "Alex"
  [...updated]
    .sort((a, b) => b.old.length - a.old.length)
    .forEach((def) => {
      const next = (values[def.id] ?? '').trim();
      if (!next || next === def.old) return;

      if (countInDoc(doc, def) === 0) {
        missing.push(def.id);
        return;
      }
      if (usesText(def.type)) {
        textNodes(doc).forEach((n) => {
          if (n.nodeValue.includes(def.old)) n.nodeValue = n.nodeValue.split(def.old).join(next);
        });
      }
      if (usesAttr(def.type)) {
        const attr = attrFor(def.type);
        doc.querySelectorAll(`[${attr}]`).forEach((el) => {
          const v = el.getAttribute(attr);
          if (v.includes(def.old)) el.setAttribute(attr, v.split(def.old).join(next));
        });
      }
      // Other fields may contain this value (e.g. the bio mentions the name): keep their
      // stored "old" text in sync with what is now on the page.
      const replaced = def.old;
      updated.forEach((other) => {
        if (other !== def && other.old.includes(replaced)) other.old = other.old.split(replaced).join(next);
      });
      def.old = next;
      applied.push(def.id);
    });

  return { html: serialize(doc, stripFieldDefs(html)), applied, missing, defs: updated };
}

/**
 * Apply new values to a template that carries creator-defined fields, and rewrite the
 * stored definitions so the NEW value becomes the "old" value for the next edit.
 */
export function applyFieldValues(html, values) {
  const r = replaceInHtml(html, readFieldDefs(html), values);
  return { html: embedFieldDefs(r.html, r.defs), applied: r.applied, missing: r.missing };
}

/* ---------- auto-suggest for the uploader ---------- */

const SOCIALS = [
  // "profile" = only accept a link to the person's profile (github.com/name), not a repo (github.com/name/repo)
  { id: 'github', label: 'GitHub profile link', re: /github\.com/i, profile: /github\.com\/[^/?#]+\/?$/i },
  { id: 'linkedin', label: 'LinkedIn link', re: /linkedin\.com/i },
  { id: 'twitter', label: 'X / Twitter link', re: /(^|\/\/|\.)(twitter|x)\.com/i },
  { id: 'instagram', label: 'Instagram link', re: /instagram\.com/i },
  { id: 'youtube', label: 'YouTube link', re: /youtube\.com/i },
  { id: 'leetcode', label: 'LeetCode link', re: /leetcode\.com/i },
  { id: 'medium', label: 'Medium link', re: /medium\.com/i },
  { id: 'behance', label: 'Behance link', re: /behance\.net/i },
  { id: 'dribbble', label: 'Dribbble link', re: /dribbble\.com/i },
  { id: 'codepen', label: 'CodePen link', re: /codepen\.io/i }
];

const hrefOf = (a) => (a.getAttribute('href') || '').trim();
const isWebLink = (h) => /^https?:\/\//i.test(h);
const shortText = (el, max = 28) => {
  const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
};

/** Looks at the uploaded HTML and proposes fields (name, role, bio, email, links, photo). */
export function suggestFields(rawHtml) {
  const doc = parse(stripFieldDefs(rawHtml));
  const body = doc.body;
  const out = [];
  const add = (f) => f.old && f.old.trim() && !out.some((o) => o.id === f.id) && out.push({ ...f, old: f.old.trim() });

  // Name: the highlighted part of the <h1>, otherwise the whole <h1>
  const h1 = body.querySelector('h1');
  if (h1) {
    const inner = h1.querySelector('span,strong,em,b');
    const txt = (inner ? inner.textContent : h1.textContent).replace(/\s+/g, ' ').trim();
    add({ id: 'name', label: 'Your name', type: 'text', old: txt });
  }

  // Headline / role
  const roleEl =
    body.querySelector('[class*="subtitle"],[class*="role"],[class*="tagline"],[class*="headline"]') ||
    (h1 && h1.parentElement && h1.parentElement.querySelector('p'));
  if (roleEl) add({ id: 'headline', label: 'Headline / role', type: 'text', old: roleEl.textContent.replace(/\s+/g, ' ') });

  // Bio: longest paragraph in an about section, else the longest paragraph on the page
  const aboutScope = body.querySelector('#about, [class*="about"]') || body;
  const paras = [...aboutScope.querySelectorAll('p')]
    .map((p) => p.textContent.replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 50)
    .sort((a, b) => b.length - a.length);
  if (paras[0]) add({ id: 'bio', label: 'About / bio', type: 'textarea', old: paras[0] });

  // Email
  const mail = body.querySelector('a[href^="mailto:"]');
  if (mail) add({ id: 'email', label: 'Email address', type: 'email', old: mail.getAttribute('href').replace(/^mailto:/i, '').split('?')[0] });

  // Social links
  const anchors = [...body.querySelectorAll('a[href]')];
  SOCIALS.forEach((s) => {
    const matches = anchors.filter((x) => s.re.test(hrefOf(x)) && isWebLink(hrefOf(x)));
    const a = s.profile ? matches.find((x) => s.profile.test(hrefOf(x))) : matches[0];
    if (a) add({ id: s.id, label: s.label, type: 'link', old: hrefOf(a) });
  });

  // Resume / CV link
  const resume = anchors.find((x) => /\.pdf($|[?#])/i.test(hrefOf(x)) || /\b(resume|cv)\b/i.test(x.textContent));
  if (resume && hrefOf(resume) && hrefOf(resume) !== '#') {
    add({ id: 'resume', label: 'Resume / CV link', type: 'link', old: hrefOf(resume) });
  }

  // Project links: links that live inside a project / featured card
  const used = new Set(out.map((o) => o.old));
  const projectScope = '[id*="project" i], [class*="project" i], [id*="featured" i], [class*="featured" i]';
  let projectCount = 0;
  anchors.forEach((a) => {
    const h = hrefOf(a);
    if (projectCount >= 8 || !h || used.has(h) || !a.closest(projectScope)) return;
    if (/^(#|mailto:|tel:|javascript:)/i.test(h)) return;
    const card = a.closest('article, li, [class*="card" i]') || a.parentElement;
    const heading = card && card.querySelector('h1,h2,h3,h4,h5,h6');
    projectCount++;
    used.add(h);
    const name = heading ? shortText(heading) : shortText(a);
    add({ id: `project_${projectCount}`, label: `Project ${projectCount} link${name ? ` (${name})` : ''}`, type: 'link', old: h });
  });

  // Other website links (portfolio site, blog, live demo ...) that are not social / project links
  let otherCount = 0;
  anchors.forEach((a) => {
    const h = hrefOf(a);
    if (otherCount >= 3 || !isWebLink(h) || used.has(h) || a.closest('nav, footer')) return;
    otherCount++;
    used.add(h);
    const name = shortText(a);
    add({ id: `link_${otherCount}`, label: `Other link ${otherCount}${name ? ` (${name})` : ''}`, type: 'link', old: h });
  });

  // Profile photo
  const img = body.querySelector('img[class*="avatar"], img[class*="profile"], img[class*="photo"], img[alt]');
  if (img && !img.getAttribute('src').startsWith('data:')) {
    add({ id: 'photo', label: 'Profile photo URL', type: 'image', old: img.getAttribute('src') });
  }

  return out;
}
