import React from 'react';
import { Save } from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '../../data/categories.js';

/** Editor sidebar tab "Template Info": rename the template, change the author, category and description, then save. */
export default function TemplateInfoTab({ templateMeta, setTemplateMeta, onSave, saving }) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-paper border border-line rounded-xl">
        <h3 className="text-xs font-bold text-ink">Template Settings</h3>
        <p className="text-[11px] text-soft">
          Rename this template, change author attribution, or update the catalog description.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink mb-1">
          Template Title <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          value={templateMeta.title}
          onChange={(e) => setTemplateMeta({ ...templateMeta, title: e.target.value })}
          placeholder="e.g. Modern Developer Showcase"
          className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink mb-1">
          Creator / Author Name
        </label>
        <input
          type="text"
          value={templateMeta.creator_name}
          onChange={(e) => setTemplateMeta({ ...templateMeta, creator_name: e.target.value })}
          placeholder="e.g. Lakshya Bansal"
          className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink mb-1">
          Template Category
        </label>
        <select
          value={templateMeta.category}
          onChange={(e) => setTemplateMeta({ ...templateMeta, category: e.target.value })}
          className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white cursor-pointer focus:outline-none focus:border-accent"
        >
          {TEMPLATE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink mb-1">
          Catalog Description
        </label>
        <textarea
          rows={3}
          value={templateMeta.description}
          onChange={(e) => setTemplateMeta({ ...templateMeta, description: e.target.value })}
          placeholder="Describe what makes this portfolio template standout..."
          className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent resize-y"
        />
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="w-full py-2 px-3 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
      >
        <Save className="w-3.5 h-3.5 text-hl" />
        <span>{saving ? 'Saving Changes...' : 'Save Template Settings'}</span>
      </button>
    </div>
  );
}
