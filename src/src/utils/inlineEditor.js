/**
 * Inline (click-on-the-preview) editor.
 *
 * `INLINE_EDITOR_SCRIPT` runs INSIDE the preview iframe while "Edit on page" is on.
 * It works together with `tagForEditing()` from portfolioReader.js, which wraps every text
 * node in <span data-ph-t="N"> and marks repeated items with data-ph-item="N".
 *
 *  - click any text      -> it becomes editable in place (Enter saves, Esc cancels)
 *  - hover a card / chip -> a small toolbar appears: move up / down, duplicate, delete
 *  - everything is reported to the parent window with postMessage:
 *        { source: 'ph-editor', type: 'text', index, value }
 *        { source: 'ph-editor', type: 'item', action: 'dup' | 'del' | 'up' | 'down', index }
 *
 * The page's own clicks / links are blocked while editing so nothing navigates away.
 */
/**
 * The preview iframe is sandboxed (opaque origin), so it cannot read its parent's origin.
 * We bake the site's own origin into the script so messages go ONLY to this site, not to '*'.
 * (Falls back to '*' when the origin is not http(s), e.g. file://.)
 */
function withParentOrigin(script) {
  const origin = typeof window !== 'undefined' && /^https?:/.test(window.location.origin)
    ? window.location.origin
    : '*';
  return script.split('__PH_ORIGIN__').join(origin);
}

const INLINE_EDITOR_SCRIPT = String.raw`
(function () {
  if (window.__phEditor) return;
  window.__phEditor = true;

  var style = document.createElement('style');
  style.textContent =
    '[data-ph-t]{cursor:text}' +
    '[data-ph-t]:hover{outline:1.5px dashed #F59E0B;outline-offset:2px;background:rgba(245,158,11,.10)}' +
    '[data-ph-t][contenteditable="true"]{outline:2px solid #F59E0B!important;outline-offset:2px;background:rgba(245,158,11,.16)!important;' +
      'cursor:text;-webkit-user-select:text!important;user-select:text!important;text-overflow:clip!important}' +
    '[data-ph-item].ph-hot{outline:1.5px dotted rgba(24,24,27,.45);outline-offset:3px}' +
    '#ph-bar{position:absolute;z-index:2147483647;display:none;align-items:center;gap:2px;padding:3px;background:#18181B;' +
      'border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.28);white-space:nowrap;font:600 11px/1 system-ui,sans-serif;color:#fff}' +
    '#ph-bar button{all:unset;cursor:pointer;padding:6px 8px;border-radius:5px;color:#fff;font:600 11px/1 system-ui,sans-serif}' +
    '#ph-bar button:hover{background:#3F3F46}' +
    '#ph-bar button.ph-del:hover{background:#DC2626}' +
    '#ph-bar .ph-lbl{padding:0 8px 0 6px;color:#A1A1AA;font:500 10px/1 ui-monospace,monospace;max-width:90px;overflow:hidden;text-overflow:ellipsis}';
  document.head.appendChild(style);

  var editing = null;
  var original = '';
  var current = -1;
  var hot = null;
  var hideTimer = null;

  function post(msg) {
    msg.source = 'ph-editor';
    parent.postMessage(msg, '__PH_ORIGIN__');
  }
  function up(el, sel) {
    return el && el.closest ? el.closest(sel) : null;
  }

  /* ---------- item toolbar ---------- */
  var bar = document.createElement('div');
  bar.id = 'ph-bar';
  bar.innerHTML =
    '<span class="ph-lbl">item</span>' +
    '<button data-a="up" title="Move up">&#8593;</button>' +
    '<button data-a="down" title="Move down">&#8595;</button>' +
    '<button data-a="dup" title="Duplicate">&#10697; Duplicate</button>' +
    '<button data-a="del" class="ph-del" title="Delete">&#10005; Delete</button>';
  document.body.appendChild(bar);

  function hideBar() {
    bar.style.display = 'none';
    if (hot) hot.classList.remove('ph-hot');
    hot = null;
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideBar, 260);
  }
  function showBar(item) {
    clearTimeout(hideTimer);
    if (hot && hot !== item) hot.classList.remove('ph-hot');
    hot = item;
    item.classList.add('ph-hot');
    current = parseInt(item.getAttribute('data-ph-item'), 10);
    bar.querySelector('.ph-lbl').textContent = (item.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 14) || 'item';

    bar.style.display = 'flex';
    var r = item.getBoundingClientRect();
    var sx = window.pageXOffset, sy = window.pageYOffset;
    var bw = bar.offsetWidth, bh = bar.offsetHeight;
    var top = r.top + sy - bh - 6;
    if (r.top < bh + 10) top = r.top + sy + 6;
    var left = r.right + sx - bw;
    var maxLeft = document.documentElement.clientWidth + sx - bw - 6;
    left = Math.max(sx + 6, Math.min(left, maxLeft));
    bar.style.top = top + 'px';
    bar.style.left = left + 'px';
  }

  document.addEventListener('mouseover', function (e) {
    if (editing) return;
    if (up(e.target, '#ph-bar')) { clearTimeout(hideTimer); return; }
    var item = up(e.target, '[data-ph-item]');
    if (item) showBar(item); else scheduleHide();
  }, true);
  document.addEventListener('mouseleave', scheduleHide);

  bar.addEventListener('click', function (e) {
    var b = up(e.target, 'button');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    post({ type: 'item', action: b.getAttribute('data-a'), index: current });
    hideBar();
  }, true);

  /* ---------- text editing ---------- */
  function finish(commit) {
    var s = editing;
    if (!s) return;
    editing = null;
    s.removeAttribute('contenteditable');
    var value = s.textContent.replace(/\s+/g, ' ').trim();
    var before = original.replace(/\s+/g, ' ').trim();
    if (!commit || !value) { s.textContent = original; return; }   // empty text is not allowed
    if (value !== before) post({ type: 'text', index: parseInt(s.getAttribute('data-ph-t'), 10), value: value });
  }

  function start(s, e) {
    if (editing === s) return;
    if (editing) finish(true);
    editing = s;
    original = s.textContent;
    hideBar();
    s.setAttribute('contenteditable', 'true');
    s.spellcheck = false;
    s.focus();

    var range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      var p = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (p) { range = document.createRange(); range.setStart(p.offsetNode, p.offset); range.collapse(true); }
    }
    var sel = window.getSelection();
    if (!range || !s.contains(range.startContainer)) {
      range = document.createRange();
      range.selectNodeContents(s);
    }
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Block the page's own clicks (links, buttons, menus) while editing
  window.addEventListener('click', function (e) {
    if (up(e.target, '#ph-bar')) return;
    e.preventDefault();
    e.stopPropagation();
    var s = up(e.target, '[data-ph-t]');
    if (s) start(s, e);
    else if (editing) finish(true);
  }, true);

  document.addEventListener('focusout', function (e) {
    if (editing && e.target === editing) finish(true);
  }, true);

  window.addEventListener('keydown', function (e) {
    if (!editing) return;
    e.stopPropagation();                       // keep the page's own shortcuts from firing
    if (e.key === 'Enter') { e.preventDefault(); editing.blur(); }
    else if (e.key === 'Escape') { e.preventDefault(); var s = editing; finish(false); s.blur(); }
  }, true);

  document.addEventListener('paste', function (e) {
    if (!editing) return;
    e.preventDefault();
    var t = (e.clipboardData || window.clipboardData).getData('text') || '';
    document.execCommand('insertText', false, t.replace(/\s+/g, ' '));
  }, true);

  document.addEventListener('beforeinput', function (e) {
    if (editing && (/^format/.test(e.inputType || '') || e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak')) {
      e.preventDefault();
    }
  }, true);

  post({ type: 'ready' });
})();
`;

/** Insert the editor script at the end of an assembled preview document. */
export function injectInlineEditor(docHtml) {
  const tag = `<script>${withParentOrigin(INLINE_EDITOR_SCRIPT)}</script>`;
  const idx = docHtml.toLowerCase().lastIndexOf('</body>');
  return idx === -1 ? docHtml + tag : docHtml.slice(0, idx) + tag + docHtml.slice(idx);
}

/**
 * Scroll bridge: the preview iframe is sandboxed WITHOUT same-origin access (so uploaded
 * code can never read the visitor's login). The editor therefore cannot read or set the
 * iframe's scroll position directly; this tiny script reports it and restores it via postMessage.
 */
const SCROLL_BRIDGE_SCRIPT = String.raw`
(function () {
  var t;
  window.addEventListener('scroll', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      parent.postMessage({ source: 'ph-scroll', type: 'pos', y: window.scrollY || 0 }, '__PH_ORIGIN__');
    }, 60);
  }, { passive: true });
  window.addEventListener('message', function (e) {
    if (e.source !== parent) return;
    var d = e.data;
    if (d && d.source === 'ph-scroll' && d.type === 'restore') window.scrollTo(0, Number(d.y) || 0);
  });
})();
`;

/** Insert the scroll bridge at the end of an assembled preview document. */
export function injectScrollBridge(docHtml) {
  const tag = `<script>${withParentOrigin(SCROLL_BRIDGE_SCRIPT)}</script>`;
  const idx = docHtml.toLowerCase().lastIndexOf('</body>');
  return idx === -1 ? docHtml + tag : docHtml.slice(0, idx) + tag + docHtml.slice(idx);
}
