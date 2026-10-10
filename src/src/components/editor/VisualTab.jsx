import React from 'react';

/** Editor sidebar tab "Visual": accent colour and font. null means "keep the template's own look". */
export default function VisualTab({ accentColor, setAccentColor, customFont, setCustomFont }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink mb-1.5">Color Accent Token</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={accentColor || '#F59E0B'}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-9 h-9 rounded-lg border border-line cursor-pointer p-0.5 bg-white"
          />
          <input
            type="text"
            value={accentColor || ''}
            placeholder="Template default"
            onChange={(e) => setAccentColor(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-line font-mono uppercase text-ink focus:outline-none focus:border-accent"
          />
        </div>
        {/* Preset color chips */}
        <div className="flex items-center gap-1.5 pt-2">
          {['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#18181B'].map(col => (
            <button
              key={col}
              type="button"
              onClick={() => setAccentColor(col)}
              style={{ backgroundColor: col }}
              className="w-5 h-5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform"
              title={col}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink mb-1.5">Primary Typography</label>
        <select
          value={customFont || ''}
          onChange={(e) => setCustomFont(e.target.value || null)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white cursor-pointer focus:outline-none focus:border-accent"
        >
          <option value="">Template default font</option>
          <option value="Plus Jakarta Sans">Plus Jakarta Sans (Balanced Humanist)</option>
          <option value="Inter">Inter (Technical Precision)</option>
          <option value="Geist">Geist (Developer Sans)</option>
          <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
          <option value="JetBrains Mono">JetBrains Mono (CLI Code)</option>
        </select>
      </div>
    </div>
  );
}
