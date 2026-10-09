<<<<<<< HEAD
=======
/**
 * ContentEditor.jsx: Editor tab "Content & Skills": edit text, links, images, skills and project cards of any template.
 */
>>>>>>> a6a0a74 (Update website content and layout)
import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Plus,
  X,
  Link2,
  Image as ImageIcon,
  Type,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  User,
  Mail,
  FolderOpen,
  Quote,
  Sparkles,
  Compass,
  Layers,
  Code2
} from 'lucide-react';
import {
  readPortfolio,
  updateText,
  updateTitle,
  updateAttr,
  duplicateItem,
  removeItem,
  moveItem,
  addChip
} from '../../utils/portfolioReader.js';
import { readJsData, writeJsData } from '../../utils/jsData.js';

const inputCls =
  'w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent';

const KIND_ICONS = {
  skills: Wrench,
  experience: Briefcase,
  education: GraduationCap,
  achievements: Award,
  projects: FolderOpen,
  services: Layers,
  testimonials: Quote,
  about: User,
  contact: Mail,
  hero: Sparkles,
  nav: Compass,
  header: Sparkles
};

/**
 * Text input that keeps its own draft (so typing spaces isn't swallowed by re-parsing)
 * and waits for a short pause before saving (so the preview doesn't reload on every key).
 */
function DraftInput({ value, onCommit, multiline = false, placeholder }) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  const timer = useRef(null);
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;

  useEffect(() => {
    if (!focused.current) setDraft(value);
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const props = {
    value: draft,
    placeholder,
    className: inputCls + (multiline ? ' resize-y leading-relaxed' : ''),
    onFocus: () => (focused.current = true),
    onBlur: () => {
      focused.current = false;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        commitRef.current(draft);
      }
    },
    onChange: (e) => {
      const v = e.target.value;
      setDraft(v);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        timer.current = null;
        commitRef.current(v);
      }, 350);
    }
  };
  return multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />;
}

function IconBtn({ title, onClick, children, danger, disabled }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded text-pencil cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger ? 'hover:text-red-500 hover:bg-red-50' : 'hover:text-ink hover:bg-paper-2'
      }`}
    >
      {children}
    </button>
  );
}

function SectionBox({ icon: Icon, title, badge, defaultOpen = false, children }) {
  return (
    <details open={defaultOpen} className="group border border-line rounded-xl bg-white overflow-hidden">
      <summary className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none list-none bg-paper hover:bg-paper-2 transition-colors">
        <ChevronRight className="w-3.5 h-3.5 text-pencil transition-transform group-open:rotate-90" />
        <Icon className="w-3.5 h-3.5 text-accent" />
        <span className="text-xs font-bold text-ink">{title}</span>
        {badge && <span className="ml-auto text-[10px] font-mono text-pencil">{badge}</span>}
      </summary>
      <div className="p-3 space-y-3">{children}</div>
    </details>
  );
}

function ChipEditor({ chips, onRemove, onAdd, placeholder = 'Add one…' }) {
  const [value, setValue] = useState('');
  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {chips.map((c) => (
          <span
            key={c.key}
            className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-md text-xs font-mono bg-paper border border-line text-ink"
          >
            {c.label}
            <button
              type="button"
              title={`Remove ${c.label}`}
              onClick={() => onRemove(c)}
              className="p-0.5 rounded text-pencil hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className={inputCls}
        />
        <button
          type="button"
          onClick={submit}
          className="px-3 rounded-lg bg-ink text-white text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-ink-2 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

function ItemCard({ title, index, count, position, onMove, onDuplicate, onRemove, children }) {
  return (
    <details className="group/item border border-line rounded-lg bg-paper/60">
      <summary className="flex items-center gap-1 px-2.5 py-2 cursor-pointer select-none list-none">
        <ChevronRight className="w-3 h-3 text-pencil transition-transform group-open/item:rotate-90" />
        <span className="text-[11px] font-semibold text-ink truncate flex-1 ml-1">{title || `Item ${index + 1}`}</span>
        <span onClick={(e) => e.preventDefault()} className="flex items-center">
          <IconBtn title="Move up" onClick={() => onMove(-1)} disabled={position === 0}>
            <ChevronUp className="w-3.5 h-3.5" />
          </IconBtn>
          <IconBtn title="Move down" onClick={() => onMove(1)} disabled={position === count - 1}>
            <ChevronDown className="w-3.5 h-3.5" />
          </IconBtn>
          <IconBtn title="Duplicate" onClick={onDuplicate}>
            <Copy className="w-3.5 h-3.5" />
          </IconBtn>
          <IconBtn title="Delete" onClick={onRemove} danger>
            <Trash2 className="w-3.5 h-3.5" />
          </IconBtn>
        </span>
      </summary>
      <div className="px-2.5 pb-2.5 pt-1 space-y-2">{children}</div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Data that lives in the JavaScript file                              */
/* ------------------------------------------------------------------ */

function JsDataEditor({ js, onChangeJs }) {
  const datasets = useMemo(() => readJsData(js), [js]);
  if (datasets.length === 0) return null;

  const mutate = (ds, fn) => {
    const value = structuredClone(ds.value);
    fn(value);
    onChangeJs(writeJsData(js, ds.index, value));
  };

  return (
    <SectionBox icon={Code2} title="Data in your JavaScript" badge={`${datasets.length} found`} defaultOpen>
      <p className="text-[11px] text-pencil">
        These lists are written in your script (not in the HTML), so the page builds itself from them. Editing them
        updates the script.
      </p>

      {datasets.map((ds) => (
        <div key={ds.index} className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-pencil">
            {ds.name} · {ds.value.length} items
          </div>

          {ds.kind === 'strings' ? (
            <ChipEditor
              chips={ds.value.map((v, i) => ({ key: `${i}-${v}`, label: v, i }))}
              onRemove={(c) => ds.value.length > 1 && mutate(ds, (arr) => arr.splice(c.i, 1))}
              onAdd={(text) => mutate(ds, (arr) => arr.push(text))}
            />
          ) : (
            <div className="space-y-2">
              {ds.value.map((obj, i) => {
                const firstText = Object.values(obj).find((v) => typeof v === 'string');
                return (
                  <ItemCard
                    key={i}
                    title={firstText}
                    index={i}
                    count={ds.value.length}
                    position={i}
                    onMove={(dir) =>
                      mutate(ds, (arr) => {
                        const j = i + dir;
                        if (j < 0 || j >= arr.length) return;
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                      })
                    }
                    onDuplicate={() => mutate(ds, (arr) => arr.splice(i + 1, 0, structuredClone(arr[i])))}
                    onRemove={() => ds.value.length > 1 && mutate(ds, (arr) => arr.splice(i, 1))}
                  >
                    {Object.entries(obj).map(([key, val]) => {
                      const isStringArray = Array.isArray(val) && val.every((x) => typeof x === 'string');
                      if (typeof val === 'string' || typeof val === 'number' || isStringArray) {
                        const shown = isStringArray ? val.join(', ') : String(val);
                        return (
                          <div key={key}>
                            <div className="text-[10px] font-mono text-mist mb-0.5">
                              {key}
                              {isStringArray ? ' (comma separated)' : ''}
                            </div>
                            <DraftInput
                              value={shown}
                              multiline={typeof val === 'string' && val.length > 70}
                              onCommit={(text) =>
                                mutate(ds, (arr) => {
                                  if (isStringArray) {
                                    arr[i][key] = text.split(',').map((s) => s.trim()).filter(Boolean);
                                  } else if (typeof val === 'number') {
                                    const n = Number(text);
                                    if (text.trim() !== '' && !Number.isNaN(n)) arr[i][key] = n;
                                  } else {
                                    arr[i][key] = text;
                                  }
                                })
                              }
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </ItemCard>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </SectionBox>
  );
}

/* ------------------------------------------------------------------ */
/* Main editor                                                         */
/* ------------------------------------------------------------------ */

/**
 * Edits the text, skills, projects, links and images of ANY portfolio.
 * Props: html, js, onChangeHtml(newHtml), onChangeJs(newJs)
 */
export default function ContentEditor({ html, js = '', onChangeHtml, onChangeJs }) {
  const data = useMemo(() => readPortfolio(html), [html]);
  const edit = (next) => onChangeHtml(next);

  const listCount = data.sections.reduce((n, s) => n + s.lists.reduce((m, l) => m + l.items.length, 0), 0);

  return (
    <div className="space-y-4">
      <p className="text-xs text-soft">
        Detected <b>{data.sections.length}</b> sections and <b>{listCount}</b> repeated items (skills, projects,
        experience…). Tip: use <b>Edit on page</b> above the preview to click and type directly on the website.
      </p>

      {/* Page title */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-pencil mb-1.5">
          <Type className="w-3 h-3 text-accent" /> Browser tab title
        </div>
        <DraftInput value={data.pageTitle} onCommit={(v) => edit(updateTitle(html, v))} />
      </div>

      <JsDataEditor js={js} onChangeJs={onChangeJs} />

      {/* Sections */}
      {data.sections.map((section, si) => {
        const Icon = KIND_ICONS[section.kind] || Type;
        const itemTotal = section.lists.reduce((n, l) => n + l.items.length, 0);
        const badge = [
          section.fields.length ? `${section.fields.length} text` : '',
          itemTotal ? `${itemTotal} items` : ''
        ]
          .filter(Boolean)
          .join(' · ');
        return (
          <SectionBox
            key={`${section.key}-${si}`}
            icon={Icon}
            title={section.label}
            badge={badge}
            defaultOpen={section.lists.length > 0 && (section.kind === 'skills' || section.kind === 'projects')}
          >
            {/* repeated items first: skills / projects / experience */}
            {section.lists.map((list) => (
              <div key={list.id} className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-pencil">
                  {list.label} · {list.items.length}
                </div>

                {list.kind === 'chips' ? (
                  <ChipEditor
                    chips={list.items.map((it) => ({ key: it.index, label: it.label, index: it.index }))}
                    onRemove={(c) => list.items.length > 1 && edit(removeItem(html, c.index))}
                    onAdd={(text) => edit(addChip(html, list.id, text))}
                    placeholder={`Add to ${list.label.toLowerCase()}…`}
                  />
                ) : (
                  <>
                    {list.items.map((item, pos) => (
                      <ItemCard
                        key={item.index}
                        title={item.label}
                        index={pos}
                        count={list.items.length}
                        position={pos}
                        onMove={(dir) => edit(moveItem(html, item.index, dir))}
                        onDuplicate={() => edit(duplicateItem(html, item.index))}
                        onRemove={() => list.items.length > 1 && edit(removeItem(html, item.index))}
                      >
                        {item.fields.map((f) => (
                          <div key={f.index}>
                            <div className="text-[10px] font-mono text-mist mb-0.5">&lt;{f.tag}&gt;</div>
                            <DraftInput
                              value={f.text}
                              multiline={f.long}
                              onCommit={(v) => edit(updateText(html, f.index, v))}
                            />
                          </div>
                        ))}
                      </ItemCard>
                    ))}
                    <button
                      type="button"
                      onClick={() => edit(duplicateItem(html, list.items[list.items.length - 1].index))}
                      className="w-full py-2 rounded-lg border border-dashed border-line-2 text-xs font-semibold text-soft hover:text-ink hover:border-accent hover:bg-paper flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add another {list.label.toLowerCase().replace(/s$/, '')}
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* the rest of the section's text */}
            {section.fields.length > 0 && (
              <div className="space-y-2">
                {section.lists.length > 0 && (
                  <div className="text-[10px] font-mono uppercase tracking-wider text-pencil">Other text</div>
                )}
                {section.fields.map((f) => (
                  <div key={f.index}>
                    <div className="text-[10px] font-mono text-mist mb-0.5">&lt;{f.tag}&gt;</div>
                    <DraftInput
                      value={f.text}
                      multiline={f.long}
                      onCommit={(v) => edit(updateText(html, f.index, v))}
                    />
                  </div>
                ))}
              </div>
            )}
          </SectionBox>
        );
      })}

      {/* Links */}
      {data.links.length > 0 && (
        <SectionBox icon={Link2} title="Links" badge={`${data.links.length}`}>
          <div className="space-y-2">
            {data.links.map((l) => (
              <div key={l.index}>
                <div className="text-[10px] font-mono text-mist mb-0.5 truncate">{l.text}</div>
                <DraftInput value={l.href} onCommit={(v) => edit(updateAttr(html, 'link', l.index, v))} />
              </div>
            ))}
          </div>
        </SectionBox>
      )}

      {/* Images */}
      {data.images.length > 0 && (
        <SectionBox icon={ImageIcon} title="Images" badge={`${data.images.length}`}>
          <div className="space-y-2">
            {data.images.map((img) => (
              <div key={img.index}>
                <div className="text-[10px] font-mono text-mist mb-0.5 truncate">{img.alt || 'image'}</div>
                <DraftInput
                  value={img.src.startsWith('data:') ? '(embedded image)' : img.src}
                  onCommit={(v) => !v.startsWith('(embedded') && edit(updateAttr(html, 'image', img.index, v))}
                />
              </div>
            ))}
          </div>
        </SectionBox>
      )}
    </div>
  );
}
