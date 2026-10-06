import React, { useEffect, useMemo, useState } from 'react';
import { Check, UserCheck } from 'lucide-react';
import { readFieldDefs, applyFieldValues } from '../../utils/editableFields.js';
import { useToast } from '../../context/ToastContext.jsx';

const inputCls =
  'w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]';

/**
 * Shows the fields the template's creator marked as editable.
 * The user types new values, presses "Apply", and every old value in the
 * template is replaced.
 * Props: html (current html incl. stored field definitions), onChange(newHtml)
 */
export default function FillDetailsForm({ html, onChange }) {
  const { addToast } = useToast();
  const defs = useMemo(() => readFieldDefs(html), [html]);
  const [values, setValues] = useState({});

  // (Re)start the form from the values currently stored in the template
  const signature = defs.map((d) => `${d.id}:${d.old}`).join('|');
  useEffect(() => {
    setValues(Object.fromEntries(defs.map((d) => [d.id, d.old])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const dirty = defs.some((d) => (values[d.id] ?? d.old).trim() !== d.old);

  const handleApply = () => {
    const { html: next, applied, missing } = applyFieldValues(html, values);
    if (applied.length > 0) {
      onChange(next);
      addToast(`Updated ${applied.length} field${applied.length > 1 ? 's' : ''} in your portfolio`, 'success');
    }
    if (missing.length > 0) {
      const names = defs.filter((d) => missing.includes(d.id)).map((d) => d.label).join(', ');
      addToast(`Couldn't find the original text for: ${names}. Use the Raw Code tab for those.`, 'error');
    }
    if (applied.length === 0 && missing.length === 0) {
      addToast('Nothing changed yet. Edit a field first.', 'info');
    }
  };

  if (defs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl flex items-start gap-3">
        <UserCheck className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
        <p className="text-xs text-[#52525B]">
          The template's creator marked these details as yours to change. Replace them with your own and press{' '}
          <b>Apply</b>. Everywhere the old text appears will be updated.
        </p>
      </div>

      <div className="space-y-3">
        {defs.map((d) => (
          <div key={d.id}>
            <label className="block text-[11px] font-semibold text-[#18181B] mb-1">{d.label}</label>
            {d.type === 'textarea' ? (
              <textarea
                rows={4}
                value={values[d.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [d.id]: e.target.value }))}
                className={inputCls + ' resize-y leading-relaxed'}
              />
            ) : (
              <input
                type={d.type === 'email' ? 'email' : 'text'}
                value={values[d.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [d.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className={inputCls}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleApply}
        disabled={!dirty}
        className="w-full px-4 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Check className="w-3.5 h-3.5" />
        Apply my details
      </button>
    </div>
  );
}
