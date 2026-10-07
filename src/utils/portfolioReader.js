/**
 * Portfolio Reader (v2)
 * ---------------------
 * Reads ANY portfolio HTML with the browser's DOM parser and understands its STRUCTURE:
 *
 *  - every visible piece of text (editable one by one, markup untouched)
 *  - sections (hero, about, skills, projects, experience, ...) detected from tag / id / class / heading
 *  - repeated items (project cards, skill chips, job entries ...) detected by looking for
 *    siblings that share the same tag + classes, so it works with ANY class names
 *  - links and images
 *
 * Fields are identified by position in document order (no ids are written into the HTML).
 * Always re-read after an edit that adds / removes nodes.
 */

const SKIP_PARENTS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'TITLE', 'TEMPLATE', 'OPTION']);
const GROUP_TAGS = new Set(['SECTION', 'HEADER', 'FOOTER', 'NAV', 'ASIDE']);
const BAD_ITEM_TAGS = new Set(['SECTION', 'HEADER', 'FOOTER', 'MAIN', 'NAV', 'ASIDE', 'FORM', 'SCRIPT', 'STYLE', 'BR', 'HR', 'SVG', 'OPTION', 'IMG', 'INPUT']);
const NO_LIST_PARENTS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LABEL', 'BUTTON', 'SPAN', 'A', 'SMALL', 'STRONG', 'B', 'EM', 'I', 'TEXTAREA', 'SELECT', 'TABLE']);
const STATE_CLASS = /^(active|show|shown|visible|hidden|selected|open|current|in-view|is-|has-|animate|aos|fade|reveal|delay)/i;

/** Order matters: first match wins. */
const KIND_RULES = [
  ['skills', /skill|stack|tech|tool|expertise|proficien|competenc|abilit/i],
  ['experience', /experience|career|employment|\bjobs?\b|history|timeline|work.?history/i],
  ['education', /education|school|academic|degree|qualification|certif|course|learning/i],
  ['achievements', /achievement|award|honou?r|recognition|accomplish/i],
  ['projects', /project|portfolio|showcase|featured|case.?stud|my.?work|\bwork\b|creations?/i],
  ['services', /service|what.?i.?do|\boffer/i],
  ['testimonials', /testimonial|review|client|feedback|recommend/i],
  ['blog', /\bblog|article|writing|\bnews/i],
  ['about', /about|\bbio\b|\bwho\b|\bintro|profile|\bstory/i],
  ['contact', /contact|reach|\bhire\b|connect|get.?in.?touch|social/i],
  ['hero', /hero|banner|landing|welcome|\bhome\b/i]
];

export const KIND_LABELS = {
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  achievements: 'Achievements',
  projects: 'Projects',
  services: 'Services',
  testimonials: 'Testimonials',
  blog: 'Blog / Articles',
  about: 'About',
  contact: 'Contact',
  hero: 'Hero / Intro',
  nav: 'Navigation',
  footer: 'Footer',
  header: 'Header',
  page: 'Page',
  other: 'Section'
};

const isFullDocument = (html) => /<html[\s>]/i.test(html || '');
const parse = (html) => new DOMParser().parseFromString(html || '', 'text/html');

function serialize(doc, originalHtml) {
  if (isFullDocument(originalHtml)) {
    const doctype = /^\s*<!doctype/i.test(originalHtml) ? '<!DOCTYPE html>\n' : '';
    return doctype + doc.documentElement.outerHTML;
  }
  return doc.body.innerHTML;
}

const classOf = (el) => (typeof el.className === 'string' ? el.className : '');
const tagOf = (el) => el.tagName.toUpperCase();

/* ------------------------------------------------------------------ */
/* Text nodes                                                          */
/* ------------------------------------------------------------------ */

/** All visible, non-empty text nodes in document order. */
function getTextNodes(doc) {
  const nodes = [];
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const parent = n.parentElement;
    if (!parent) continue;
    if (SKIP_PARENTS.has(tagOf(parent))) continue;
    if (parent.closest('svg, select, template, noscript')) continue;
    if (!n.nodeValue.trim()) continue;
    nodes.push(n);
  }
  return nodes;
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const hasSectionClass = (el) => classOf(el).split(/\s+/).some((c) => /^(section|sec|block)$/i.test(c));

/** Nearest section-like ancestor (tag or "section" class), else nearest ancestor with an id. */
function findGroupEl(el, body) {
  let cur = el;
  while (cur && cur !== body) {
    if (GROUP_TAGS.has(tagOf(cur)) || hasSectionClass(cur)) return cur;
    cur = cur.parentElement;
  }
  cur = el;
  while (cur && cur !== body) {
    if (cur.id) return cur;
    cur = cur.parentElement;
  }
  return body;
}

function classifyKind(el, body) {
  if (el === body) return 'page';
  const tag = tagOf(el);
  if (tag === 'NAV') return 'nav';
  if (tag === 'FOOTER') return 'footer';
  const own = `${el.id} ${classOf(el)}`;
  for (const [kind, re] of KIND_RULES) if (re.test(own)) return kind;
  const heading = el.querySelector('h1,h2,h3,h4');
  if (heading) for (const [kind, re] of KIND_RULES) if (re.test(heading.textContent)) return kind;
  if (tag === 'HEADER') return 'header';
  return 'other';
}

function sectionLabel(el, kind, body) {
  if (el === body) return 'Page';
  if (kind !== 'other' && KIND_LABELS[kind]) return KIND_LABELS[kind];
  const heading = el.querySelector('h1,h2,h3');
  if (heading && heading.textContent.trim()) return heading.textContent.trim().slice(0, 32);
  if (el.id) return el.id.replace(/[-_]/g, ' ');
  return KIND_LABELS.other;
}

/* ------------------------------------------------------------------ */
/* Repeated items (cards, chips, entries)                              */
/* ------------------------------------------------------------------ */

function signature(el) {
  const cls = classOf(el)
    .trim()
    .split(/\s+/)
    .filter((c) => c && !STATE_CLASS.test(c))
    .sort()
    .join('.');
  return `${tagOf(el)}.${cls}`;
}

function textNodesIn(el) {
  const out = [];
  const w = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    if (n.nodeValue.trim() && !SKIP_PARENTS.has(tagOf(n.parentElement))) out.push(n);
  }
  return out;
}

/**
 * Finds groups of 2+ sibling elements that look the same (same tag + classes).
 * Returns { lists, itemEls } where itemEls is the flat, document-ordered list of items.
 */
function detectLists(doc) {
  const body = doc.body;
  const found = [];

  body.querySelectorAll('*').forEach((parent) => {
    if (NO_LIST_PARENTS.has(tagOf(parent))) return;
    if (parent.closest('nav, footer, svg, script, style, select, template, noscript')) return;

    const groups = new Map();
    [...parent.children].forEach((c) => {
      if (BAD_ITEM_TAGS.has(tagOf(c)) || c.id) return;
      const text = c.textContent.trim();
      if (!text || text.length > 800 || c.querySelector('section')) return;
      const sig = signature(c);
      if (!groups.has(sig)) groups.set(sig, []);
      groups.get(sig).push(c);
    });

    groups.forEach((items) => {
      if (items.length < 2) return;
      // an in-page menu (every item is a short "#anchor" link) is navigation, not content
      const isMenu = items.every(
        (it) => it.querySelector('a[href^="#"]') && it.textContent.trim().length <= 24
      );
      if (isMenu) return;
      found.push({ parent, items });
    });
  });

  // keep the outermost lists: drop a list that lives inside an item of another list
  const lists = found.filter(
    (L) => !found.some((M) => M !== L && M.items.some((it) => it.contains(L.parent)))
  );

  const itemEls = [];
  lists.forEach((L, id) => {
    L.id = id;
    L.flatStart = itemEls.length;
    L.items.forEach((it) => itemEls.push(it));
  });
  return { lists, itemEls };
}

const matchKind = (text) => {
  for (const [kind, re] of KIND_RULES) if (re.test(text)) return kind;
  return null;
};

/** Last heading inside the section that appears before the list (e.g. "Technical Skills"). */
function precedingHeading(list, sectionEl, body) {
  if (!sectionEl || sectionEl === body) return null;
  let last = null;
  sectionEl.querySelectorAll('h1,h2,h3,h4').forEach((h) => {
    if (list.items.some((it) => it.contains(h))) return;
    if (h.compareDocumentPosition(list.parent) & 4 /* parent FOLLOWS h */ || h === list.parent) last = h;
  });
  return last;
}

/**
 * What is this list? Looks at the closest clues first:
 * container class/id -> item classes -> heading above the list -> enclosing section.
 */
function classifyList(list, sectionEl, body) {
  let el = list.parent;
  while (el && el !== body && el !== sectionEl) {
    const k = matchKind(`${el.id} ${classOf(el)}`);
    if (k) return { kind: k, heading: null };
    el = el.parentElement;
  }
  const itemKind = matchKind(classOf(list.items[0]));
  if (itemKind) return { kind: itemKind, heading: null };
  const heading = precedingHeading(list, sectionEl, body);
  if (heading) {
    const k = matchKind(heading.textContent);
    if (k) return { kind: k, heading };
  }
  return { kind: null, heading };
}

function itemLabel(el) {
  const h = el.querySelector('h1,h2,h3,h4,h5,h6,strong,b');
  const t = (h ? h.textContent : el.textContent).replace(/\s+/g, ' ').trim();
  return t.length > 38 ? t.slice(0, 36) + '…' : t;
}

/* ------------------------------------------------------------------ */
/* Read                                                                */
/* ------------------------------------------------------------------ */

/**
 * @returns {{ pageTitle, fields, sections, links, images }}
 * sections[]: { key, label, kind, fields[], lists[] }
 * lists[]:    { id, kind: 'chips' | 'cards', label, items[] }
 * items[]:    { index, label, fields[] }
 */
export function readPortfolio(html) {
  const doc = parse(html);
  const body = doc.body;
  const nodes = getTextNodes(doc);
  const { lists, itemEls } = detectLists(doc);

  const fields = nodes.map((node, i) => {
    const parent = node.parentElement;
    const text = node.nodeValue.trim();
    return {
      index: i,
      text,
      tag: parent.tagName.toLowerCase(),
      long: text.length > 70,
      itemIndex: itemEls.findIndex((el) => el.contains(node))
    };
  });

  /* ---- sections ---- */
  const sectionMap = new Map(); // groupEl -> section
  const getSection = (groupEl) => {
    if (!sectionMap.has(groupEl)) {
      const kind = classifyKind(groupEl, body);
      sectionMap.set(groupEl, {
        key: groupEl === body ? 'page' : groupEl.id || `s${sectionMap.size}`,
        el: groupEl,
        kind,
        label: sectionLabel(groupEl, kind, body),
        fields: [],
        lists: []
      });
    }
    return sectionMap.get(groupEl);
  };

  nodes.forEach((node, i) => {
    if (fields[i].itemIndex !== -1) return; // item text is shown inside its list
    getSection(findGroupEl(node.parentElement, body)).fields.push(fields[i]);
  });

  lists.forEach((L) => {
    const section = getSection(findGroupEl(L.parent, body));
    const chips = L.items.every((it) => {
      const t = textNodesIn(it);
      return t.length === 1 && it.textContent.trim().length <= 30;
    });
    const ctx = classifyList(L, section.el, body);
    let kind = ctx.kind || section.kind;
    const unknown = kind === 'other' || kind === 'page' || kind === 'header';
    // short repeated chips in an unlabeled section are almost always skills / tags
    if (chips && unknown) kind = 'skills';
    // unlabeled cards that carry links or images are almost always projects
    if (!chips && unknown) {
      const rich = L.items.filter((it) => it.querySelector('a[href], img')).length;
      if (rich >= L.items.length / 2) kind = 'projects';
    }

    const listItems = L.items.map((el, j) => {
      const index = L.flatStart + j;
      return { index, label: itemLabel(el), fields: fields.filter((f) => f.itemIndex === index) };
    });

    const heading = ctx.heading || (section.el !== body && section.el.querySelector('h1,h2,h3'));
    section.lists.push({
      id: L.id,
      kind: chips ? 'chips' : 'cards',
      sectionKind: kind,
      label:
        kind !== 'other' && kind !== 'page' && KIND_LABELS[kind]
          ? KIND_LABELS[kind]
          : heading
            ? heading.textContent.trim().slice(0, 32)
            : 'Items',
      items: listItems
    });
    // a section that only held items takes the list's kind for its badge
    if (section.kind === 'other' || section.kind === 'page') section.kind = kind;
  });

  const sections = [...sectionMap.values()]
    .sort((a, b) => {
      if (a.el === b.el) return 0;
      return a.el.compareDocumentPosition(b.el) & 4 /* FOLLOWING */ ? -1 : 1;
    })
    .map(({ el, ...rest }) => rest);

  const links = [...body.querySelectorAll('a[href]')].map((a, i) => ({
    index: i,
    text: a.textContent.trim().slice(0, 40) || a.getAttribute('aria-label') || '(icon link)',
    href: a.getAttribute('href')
  }));

  const images = [...body.querySelectorAll('img[src]')].map((img, i) => ({
    index: i,
    alt: img.getAttribute('alt') || '',
    src: img.getAttribute('src')
  }));

  return { pageTitle: doc.title || '', fields, sections, links, images };
}

/* ------------------------------------------------------------------ */
/* Edits                                                               */
/* ------------------------------------------------------------------ */

/** Change the text of one text field (keeps surrounding whitespace & markup). */
export function updateText(html, index, value) {
  const doc = parse(html);
  const node = getTextNodes(doc)[index];
  if (!node) return html;
  const m = node.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/);
  node.nodeValue = `${m[1]}${value}${m[2]}`;
  return serialize(doc, html);
}

/** Change the page <title>. */
export function updateTitle(html, value) {
  const doc = parse(html);
  doc.title = value;
  return serialize(doc, html);
}

/** Change a link's href or an image's src. kind: 'link' | 'image' */
export function updateAttr(html, kind, index, value) {
  const doc = parse(html);
  const list = kind === 'link' ? doc.body.querySelectorAll('a[href]') : doc.body.querySelectorAll('img[src]');
  const el = list[index];
  if (!el) return html;
  el.setAttribute(kind === 'link' ? 'href' : 'src', value);
  return serialize(doc, html);
}

function cloneItem(doc, el) {
  const clone = el.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  clone.removeAttribute('data-ph-item');
  clone.querySelectorAll('[data-ph-item]').forEach((n) => n.removeAttribute('data-ph-item'));
  return clone;
}

/** Duplicate an item (project card, skill chip, job entry ...) right after itself. */
export function duplicateItem(html, itemIndex) {
  const doc = parse(html);
  const el = detectLists(doc).itemEls[itemIndex];
  if (!el) return html;
  const clone = cloneItem(doc, el);
  el.after(clone);
  el.after(doc.createTextNode('\n'));
  return serialize(doc, html);
}

/** Remove an item completely. */
export function removeItem(html, itemIndex) {
  const doc = parse(html);
  const el = detectLists(doc).itemEls[itemIndex];
  if (!el) return html;
  el.remove();
  return serialize(doc, html);
}

/** Move an item up (-1) or down (+1) inside its list. */
export function moveItem(html, itemIndex, dir) {
  const doc = parse(html);
  const { lists, itemEls } = detectLists(doc);
  const el = itemEls[itemIndex];
  if (!el) return html;
  const list = lists.find((L) => L.items.includes(el));
  const pos = list.items.indexOf(el);
  const other = list.items[pos + dir];
  if (!other) return html;
  if (dir < 0) el.parentNode.insertBefore(el, other);
  else el.parentNode.insertBefore(other, el);
  return serialize(doc, html);
}

/** Add a new chip (skill / tag) to a list by cloning its last item and setting the text. */
export function addChip(html, listId, value) {
  const doc = parse(html);
  const { lists } = detectLists(doc);
  const list = lists.find((L) => L.id === listId);
  const text = (value || '').trim();
  if (!list || !text) return html;
  const last = list.items[list.items.length - 1];
  const clone = cloneItem(doc, last);
  const t = textNodesIn(clone)[0];
  if (t) t.nodeValue = text;
  else clone.textContent = text;
  last.after(clone);
  last.after(doc.createTextNode('\n'));
  return serialize(doc, html);
}

/* ------------------------------------------------------------------ */
/* Click-to-edit support                                               */
/* ------------------------------------------------------------------ */

/**
 * Prepares HTML for the inline (click-on-the-preview) editor:
 *  - every text node is wrapped in <span data-ph-t="N"> (N = same index used by updateText)
 *  - every repeated item gets data-ph-item="N" (N = same index used by duplicateItem etc.)
 * Used for the PREVIEW only. It is never saved or exported.
 */
export function tagForEditing(html) {
  const doc = parse(html);
  const { itemEls } = detectLists(doc);
  const nodes = getTextNodes(doc);
  itemEls.forEach((el, i) => el.setAttribute('data-ph-item', String(i)));
  nodes.forEach((node, i) => {
    const span = doc.createElement('span');
    span.setAttribute('data-ph-t', String(i));
    node.parentNode.replaceChild(span, node);
    span.appendChild(node);
  });
  return serialize(doc, html);
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

/**
 * Build ONE self-contained .html file: inlines style.css / script.js
 * (removes relative <link>/<script src> tags that would break once downloaded alone).
 */
export function buildSingleFileHtml(html, css = '', js = '') {
  const source = html && html.trim() ? html : '<!DOCTYPE html><html><head></head><body></body></html>';
  const doc = parse(
    isFullDocument(source)
      ? source
      : `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Portfolio</title></head><body>${source}</body></html>`
  );

  const fieldBlock = doc.getElementById('ph-editable-fields');
  if (fieldBlock) fieldBlock.remove();

  const isRelative = (u) => u && !/^(https?:)?\/\//i.test(u) && !/^data:/i.test(u);
  doc.querySelectorAll('link[rel~="stylesheet"]').forEach((l) => {
    if (isRelative(l.getAttribute('href'))) l.remove();
  });
  doc.querySelectorAll('script[src]').forEach((s) => {
    if (isRelative(s.getAttribute('src'))) s.remove();
  });

  if (!doc.querySelector('meta[charset]')) {
    const m = doc.createElement('meta');
    m.setAttribute('charset', 'UTF-8');
    doc.head.prepend(m);
  }
  if (css && css.trim()) {
    const style = doc.createElement('style');
    style.textContent = `\n${css.trim()}\n`;
    doc.head.appendChild(style);
  }
  if (js && js.trim()) {
    const script = doc.createElement('script');
    script.textContent = `\n${js.trim().replace(/<\/script/gi, '<\\/script')}\n`;
    doc.body.appendChild(script);
  }
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

/* ------------------------------------------------------------------ */
/* Page blocks (Sections tab): reorder / hide the big parts of a page */
/* ------------------------------------------------------------------ */
const BLOCK_SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT', 'TEMPLATE', 'META']);

/** The top-level parts of the page (header, hero, skills, projects, footer ...). */
function pageBlockEls(doc) {
  const body = doc.body;
  const kids = [...body.children].filter((el) => !BLOCK_SKIP.has(tagOf(el)));
  // a single wrapper (<main>, <div id="app">) that holds the real sections
  if (kids.length === 1) {
    const inner = [...kids[0].children].filter((el) => !BLOCK_SKIP.has(tagOf(el)));
    if (inner.length >= 2) return inner;
  }
  return kids;
}

export function listPageBlocks(html) {
  const doc = parse(html);
  const body = doc.body;
  return pageBlockEls(doc).map((el, index) => {
    const kind = classifyKind(el, body);
    return {
      index,
      kind,
      label: sectionLabel(el, kind, body),
      hidden: el.hasAttribute('data-ph-hidden')
    };
  });
}

/** Move one page block up (dir = -1) or down (dir = 1). */
export function moveBlock(html, index, dir) {
  const doc = parse(html);
  const els = pageBlockEls(doc);
  const el = els[index];
  const other = els[index + dir];
  if (!el || !other) return html;
  if (dir < 0) other.parentElement.insertBefore(el, other);
  else other.parentElement.insertBefore(el, other.nextSibling);
  return serialize(doc, html);
}

/** Hide / show one page block (adds display:none to the element, so the exported site hides it too). */
export function toggleBlock(html, index) {
  const doc = parse(html);
  const el = pageBlockEls(doc)[index];
  if (!el) return html;
  if (el.hasAttribute('data-ph-hidden')) {
    const prev = el.getAttribute('data-ph-prev-style') || '';
    el.removeAttribute('data-ph-hidden');
    el.removeAttribute('data-ph-prev-style');
    if (prev) el.setAttribute('style', prev);
    else el.removeAttribute('style');
  } else {
    const prev = el.getAttribute('style') || '';
    el.setAttribute('data-ph-hidden', '1');
    el.setAttribute('data-ph-prev-style', prev);
    el.setAttribute('style', `${prev}${prev && !prev.trim().endsWith(';') ? ';' : ''}display:none !important`);
  }
  return serialize(doc, html);
}
