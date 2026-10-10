/**
 * JS Data
 * -------
 * Many portfolios keep their content in JavaScript and build the page from it:
 *
 *   const projects = [ { title: 'App', description: '...', tags: ['React'] }, ... ];
 *   const skills   = ['React', 'Node.js', 'Python'];
 *
 * The HTML reader cannot see that content (it only exists after the script runs), so this module
 * finds those array literals in the script and lets the editor change them.
 *
 * SAFETY: the script is NEVER executed. Arrays are read with a small literal parser (strings,
 * numbers, booleans, null, arrays, objects). Anything else (function calls, variables, template
 * expressions ...) makes that array "not editable" and it is simply skipped.
 */

class LiteralError extends Error {}

/* ---------- tiny literal parser ---------- */

function skipWs(src, i) {
  for (;;) {
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] === '/' && src[i + 1] === '/') {
      const e = src.indexOf('\n', i);
      i = e === -1 ? src.length : e + 1;
    } else if (src[i] === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      i = e === -1 ? src.length : e + 2;
    } else return i;
  }
}

const ESC = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' };

function parseString(src, i) {
  const q = src[i];
  let out = '';
  i++;
  while (i < src.length) {
    const c = src[i];
    if (c === q) return { value: out, end: i + 1, quote: q };
    if (c === '\\') {
      const n = src[i + 1];
      if (n === 'u') {
        out += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16));
        i += 6;
      } else if (n === 'x') {
        out += String.fromCharCode(parseInt(src.slice(i + 2, i + 4), 16));
        i += 4;
      } else if (n === '\n') {
        i += 2;
      } else {
        out += n in ESC ? ESC[n] : n;
        i += 2;
      }
      continue;
    }
    if (q === '`' && c === '$' && src[i + 1] === '{') throw new LiteralError('template expression');
    if (q !== '`' && c === '\n') throw new LiteralError('newline in string');
    out += c;
    i++;
  }
  throw new LiteralError('unterminated string');
}

function parseValue(src, i, ctx) {
  i = skipWs(src, i);
  const c = src[i];

  if (c === '[') {
    const arr = [];
    i = skipWs(src, i + 1);
    while (src[i] !== ']') {
      if (i >= src.length) throw new LiteralError('unterminated array');
      const r = parseValue(src, i, ctx);
      arr.push(r.value);
      i = skipWs(src, r.end);
      if (src[i] === ',') i = skipWs(src, i + 1);
      else if (src[i] !== ']') throw new LiteralError('bad array');
    }
    return { value: arr, end: i + 1 };
  }

  if (c === '{') {
    const obj = {};
    i = skipWs(src, i + 1);
    while (src[i] !== '}') {
      if (i >= src.length) throw new LiteralError('unterminated object');
      let key;
      if (src[i] === '"' || src[i] === "'") {
        const k = parseString(src, i);
        key = k.value;
        i = k.end;
      } else {
        const m = /^[A-Za-z_$][\w$]*|^\d+/.exec(src.slice(i, i + 80));
        if (!m) throw new LiteralError('bad key');
        key = m[0];
        i += key.length;
      }
      i = skipWs(src, i);
      if (src[i] !== ':') throw new LiteralError('shorthand / method / spread not supported');
      const r = parseValue(src, i + 1, ctx);
      obj[key] = r.value;
      i = skipWs(src, r.end);
      if (src[i] === ',') i = skipWs(src, i + 1);
      else if (src[i] !== '}') throw new LiteralError('bad object');
    }
    return { value: obj, end: i + 1 };
  }

  if (c === '"' || c === "'" || c === '`') {
    const s = parseString(src, i);
    if (!ctx.quote && c !== '`') ctx.quote = c;
    return { value: s.value, end: s.end };
  }

  const num = /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(src.slice(i, i + 40));
  if (num) return { value: Number(num[0]), end: i + num[0].length };

  const word = /^(true|false|null)(?![\w$])/.exec(src.slice(i, i + 8));
  if (word) return { value: word[1] === 'true' ? true : word[1] === 'false' ? false : null, end: i + word[1].length };

  throw new LiteralError('unsupported value');
}

/* ---------- finding arrays in a script ---------- */

function skipStringLiteral(src, i) {
  const q = src[i];
  i++;
  while (i < src.length) {
    if (src[i] === '\\') i += 2;
    else if (src[i] === q) return i + 1;
    else i++;
  }
  return src.length;
}

function prevSignificant(src, i) {
  let j = i - 1;
  while (j >= 0 && /\s/.test(src[j])) j--;
  return { ch: src[j], pos: j };
}

function nameBefore(src, pos) {
  // pos points at "=" or ":"; walk back over whitespace and read the identifier / quoted key
  let j = pos - 1;
  while (j >= 0 && /\s/.test(src[j])) j--;
  if (src[j] === '"' || src[j] === "'") {
    const q = src[j];
    const s = src.lastIndexOf(q, j - 1);
    return s >= 0 ? src.slice(s + 1, j) : '';
  }
  let e = j + 1;
  while (j >= 0 && /[\w$.]/.test(src[j])) j--;
  return src.slice(j + 1, e).split('.').pop();
}

/** An array worth showing in the editor: 2+ strings, or 2+ plain objects that contain text. */
function isUseful(arr) {
  if (!Array.isArray(arr) || arr.length < 2 || arr.length > 80) return null;
  if (arr.every((x) => typeof x === 'string' && x.trim())) return 'strings';
  if (
    arr.every((x) => x && typeof x === 'object' && !Array.isArray(x)) &&
    arr.every((x) => Object.values(x).some((v) => typeof v === 'string' && v.trim().length > 1))
  ) {
    return 'objects';
  }
  return null;
}

/**
 * Finds editable data arrays in a script.
 * @returns [{ index, name, kind: 'strings'|'objects', value, start, end, quote, indent }]
 */
export function readJsData(js) {
  const src = js || '';
  const found = [];
  let i = 0;
  while (i < src.length && found.length < 12) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      const e = src.indexOf('\n', i);
      i = e === -1 ? src.length : e + 1;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      i = e === -1 ? src.length : e + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      i = skipStringLiteral(src, i);
      continue;
    }
    if (c === '[') {
      const prev = prevSignificant(src, i);
      const before = src[prev.pos - 1];
      const assignment = prev.ch === '=' && !'=!<>'.includes(before || ' ');
      if (assignment || prev.ch === ':') {
        try {
          const ctx = {};
          const { value, end } = parseValue(src, i, ctx);
          const kind = isUseful(value);
          if (kind) {
            const lineStart = src.lastIndexOf('\n', i) + 1;
            const indent = /^[ \t]*/.exec(src.slice(lineStart, i))[0];
            found.push({
              index: found.length,
              name: nameBefore(src, prev.pos) || 'data',
              kind,
              value,
              start: i,
              end,
              quote: ctx.quote || "'",
              indent
            });
            i = end;
            continue;
          }
        } catch (e) {
          if (!(e instanceof LiteralError)) throw e;
        }
      }
    }
    i++;
  }
  return found;
}

/* ---------- writing it back ---------- */

const IDENT = /^[A-Za-z_$][\w$]*$/;

function quoteString(s, q) {
  const body = s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(q === "'" ? /'/g : /"/g, `\\${q}`);
  return q + body + q;
}

function stringify(v, q, indent, depth) {
  if (typeof v === 'string') return quoteString(v, q);
  if (v === null || typeof v !== 'object') return String(v);
  const pad = indent + '  '.repeat(depth + 1);
  const end = indent + '  '.repeat(depth);

  if (Array.isArray(v)) {
    const parts = v.map((x) => stringify(x, q, indent, depth + 1));
    const flat = `[${parts.join(', ')}]`;
    const simple = v.every((x) => x === null || typeof x !== 'object');
    if (simple && flat.length <= 76) return flat;
    return `[\n${parts.map((p) => pad + p).join(',\n')}\n${end}]`;
  }

  const entries = Object.entries(v).map(
    ([k, x]) => `${IDENT.test(k) ? k : quoteString(k, q)}: ${stringify(x, q, indent, depth + 1)}`
  );
  const flat = `{ ${entries.join(', ')} }`;
  const simple = Object.values(v).every((x) => x === null || typeof x !== 'object');
  if (simple && flat.length <= 76) return flat;
  return `{\n${entries.map((e) => pad + e).join(',\n')}\n${end}}`;
}

/** Replace data array number `index` (as returned by readJsData) with a new value. */
export function writeJsData(js, index, newValue) {
  const ds = readJsData(js).find((d) => d.index === index);
  if (!ds) return js;
  return js.slice(0, ds.start) + stringify(newValue, ds.quote, ds.indent, 0) + js.slice(ds.end);
}
