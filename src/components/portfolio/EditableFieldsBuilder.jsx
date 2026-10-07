import React, { useMemo } from 'react';
import { Plus, Trash2, Wand2, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import { FIELD_TYPES, suggestFields, countOccurrences } from '../../utils/editableFields.js';

const inputCls =
  'w-full px-2.5 py-1.5 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent';

/**
 * Lets the person uploading a template choose which parts can be edited by the next
 * user, and what the current ("old") text of each part is.
 * Props: html (template html), fields (array), onChange(fieldsArray)
 */
export default function EditableFieldsBuilder({ html, fields, onChange }) {
  const counts = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.id, countOccurrences(html, f)])),
    [html, fields]
  );

  const update = (id, patch) => onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const remove = (id) => onChange(fields.filter((f) => f.id !== id));

  const addBlank = () =>
    onChange([...fields, { id: `field_${Date.now().toString(36)}`, label: '', type: 'text', old: '' }]);

  // Quick way to add a link field (GitHub, a project link, a live demo ...)
  const addLink = () =>
    onChange([...fields, { id: `link_${Date.now().toString(36)}`, label: '', type: 'link', old: '' }]);

  const autoSuggest = () => {
    const suggested = suggestFields(html);
    // keep what the uploader already defined, add only new ids
    const merged = [...fields, ...suggested.filter((s) => !fields.some((f) => f.id === s.id || f.old === s.old))];
    onChange(merged);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-soft max-w-md">
          Tell us what the next person should be able to change, and the text that is currently in your
          template for each. Example: <span className="font-mono text-ink">Your name</span> →{' '}
          <span className="font-mono text-ink">Alex Rivera</span>.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={autoSuggest}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-paper hover:bg-paper-2 border border-line text-ink cursor-pointer transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-accent" /> Auto-detect from my HTML
          </button>
          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-paper hover:bg-paper-2 border border-line text-ink cursor-pointer transition-colors"
          >
            <Link2 className="w-3.5 h-3.5 text-accent" /> Add link
          </button>
          <button
            type="button"
            onClick={addBlank}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-ink hover:bg-ink-2 text-white cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add field
          </button>
        </div>
      </div>

      {fields.length === 0 && (
        <div className="p-4 text-center text-xs text-pencil rounded-lg bg-paper border border-dashed border-line">
          No editable fields yet. Click <b>Auto-detect</b> to get suggestions, or <b>Add field</b>.
          Without fields, users can still edit your template in the Content tab.
        </div>
      )}

      <div className="space-y-2">
        {fields.map((f) => {
          const n = counts[f.id] ?? 0;
          const filled = f.old.trim().length > 0;
          return (
            <div key={f.id} className="grid grid-cols-12 gap-2 items-start p-2.5 rounded-lg border border-line bg-paper">
              <div className="col-span-12 sm:col-span-3">
                <input
                  type="text"
                  value={f.label}
                  onChange={(e) => update(f.id, { label: e.target.value })}
                  placeholder="Label, e.g. Your name"
                  className={inputCls}
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <select value={f.type} onChange={(e) => update(f.id, { type: e.target.value })} className={inputCls}>
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 sm:col-span-6">
                {f.type === 'textarea' ? (
                  <textarea
                    rows={2}
                    value={f.old}
                    onChange={(e) => update(f.id, { old: e.target.value })}
                    placeholder="Current text in your template"
                    className={inputCls + ' resize-y'}
                  />
                ) : (
                  <input
                    type="text"
                    value={f.old}
                    onChange={(e) => update(f.id, { old: e.target.value })}
                    placeholder={
                      f.type === 'link' || f.type === 'image'
                        ? 'Current link in your template, e.g. https://github.com/yourname'
                        : 'Current text in your template'
                    }
                    className={inputCls}
                  />
                )}
                {filled && (
                  <div
                    className={`mt-1 flex items-center gap-1 text-[10px] font-mono ${
                      n > 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {n > 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {n > 0
                      ? `Found ${n}× in your HTML — all will be replaced`
                      : 'Not found in your HTML. Copy it exactly as it appears.'}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  title="Remove field"
                  className="p-1.5 rounded text-pencil hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
