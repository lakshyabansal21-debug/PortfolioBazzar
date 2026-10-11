/**
 * scripts/check.mjs: the project's real "lint". Run it with:  npm run check
 *
 * (The old `npm run lint` only printed "passed" and checked nothing.)
 * It fails (exit code 1) when it finds:
 *   1. a relative import that points to a file that does not exist
 *   2. an import of an npm package that is not listed in package.json
 *   3. a file that is not reachable from src/main.jsx (dead code)
 *   4. an unused import / variable, or a name that is not defined (uses the TypeScript checker)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const declared = new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]);

const problems = [];
const rel = (file) => path.relative(root, file).replaceAll('\\', '/');

/** every .js / .jsx file under src */
function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return /\.jsx?$/.test(entry.name) ? [full] : [];
  });
}
const files = listFiles(srcDir);

/** all module names a file imports: import x from 'a', import('a'), export ... from 'a' */
function importsOf(text) {
  const found = [];
  const patterns = [/\bfrom\s+['"]([^'"]+)['"]/g, /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, /^\s*import\s+['"]([^'"]+)['"]/gm];
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) found.push(match[1]);
  return found;
}

function resolveRelative(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx')];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

// ---- 1, 2: resolve imports, and build the import graph for step 3
const graph = new Map();
for (const file of files) {
  const edges = [];
  for (const spec of importsOf(fs.readFileSync(file, 'utf8'))) {
    if (spec.startsWith('.')) {
      const target = resolveRelative(file, spec);
      if (!target) problems.push(`${rel(file)}: cannot find "${spec}"`);
      else if (/\.jsx?$/.test(target)) edges.push(target);
    } else if (!spec.startsWith('node:')) {
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (!declared.has(name)) problems.push(`${rel(file)}: "${name}" is imported but not listed in package.json`);
    }
  }
  graph.set(file, edges);
}

// ---- 3: files that nothing reaches from main.jsx
const entry = path.join(srcDir, 'main.jsx');
const reached = new Set();
const stack = [entry];
while (stack.length) {
  const current = stack.pop();
  if (reached.has(current)) continue;
  reached.add(current);
  stack.push(...(graph.get(current) || []));
}
for (const file of files) if (!reached.has(file)) problems.push(`${rel(file)}: dead code, nothing imports it`);

// ---- 4: unused names and undefined names (TypeScript checks plain JS too)
const program = ts.createProgram(files, {
  allowJs: true,
  checkJs: true,
  noEmit: true,
  jsx: ts.JsxEmit.Preserve,
  noUnusedLocals: true,
  skipLibCheck: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  types: []
});
const WANTED = new Set([6133, 6192, 6196, 6198, 2304, 2552]); // unused ..., cannot find name
for (const diagnostic of ts.getPreEmitDiagnostics(program)) {
  if (!diagnostic.file || !WANTED.has(diagnostic.code)) continue;
  const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  problems.push(`${rel(diagnostic.file.fileName)}:${line + 1} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) found:\n`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}
console.log(`OK: ${files.length} files checked. No missing imports, no undeclared packages, no dead files, no unused names.`);
