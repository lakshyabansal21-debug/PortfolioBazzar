import React from 'react';
import { Check, Copy } from 'lucide-react';

/** Editor sidebar tab "Raw Code": edit the HTML, CSS and JS text directly. */
export default function CodeTab({ codeTab, setCodeTab, html, css, js, onChangeHtml, onChangeCss, onChangeJs, copiedTab, onCopy }) {
  return (
    <div className="h-full flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-paper-2 p-0.5 rounded-lg border border-line">
          {['html', 'css', 'js'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCodeTab(tab)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                codeTab === tab ? 'bg-white text-ink font-bold shadow-2xs' : 'text-pencil hover:text-ink'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => onCopy(codeTab === 'html' ? html : codeTab === 'css' ? css : js, codeTab)}
          className="flex items-center gap-1 text-[11px] font-semibold text-soft hover:text-ink cursor-pointer"
        >
          {copiedTab === codeTab ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>Copy {codeTab.toUpperCase()}</span>
        </button>
      </div>

      <div className="flex-1 min-h-[400px] rounded-xl bg-ink p-3 overflow-hidden flex flex-col border border-zinc-800">
        {codeTab === 'html' && (
          <textarea
            value={html}
            onChange={(e) => onChangeHtml(e.target.value)}
            className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none p-1 leading-relaxed"
            spellCheck={false}
          />
        )}
        {codeTab === 'css' && (
          <textarea
            value={css}
            onChange={(e) => onChangeCss(e.target.value)}
            className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none p-1 leading-relaxed"
            spellCheck={false}
          />
        )}
        {codeTab === 'js' && (
          <textarea
            value={js}
            onChange={(e) => onChangeJs(e.target.value)}
            className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none p-1 leading-relaxed"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
