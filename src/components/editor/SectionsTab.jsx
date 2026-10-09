import React from 'react';
import { Check, MoveUp, MoveDown } from 'lucide-react';

/** Editor sidebar tab "Sections": reorder or hide the main parts of the page. Works on any template because it reads the real HTML. */
export default function SectionsTab({ pageBlocks, onMove, onToggle }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-soft">
        Reorder or hide the main parts of this page. Changes apply to the preview and to your download.
      </p>

      {pageBlocks.length < 2 && (
        <div className="p-3 rounded-xl border border-line bg-paper text-xs text-soft">
          No separate sections were found in this HTML (the page may be built by JavaScript). Use the Raw Code tab to edit it.
        </div>
      )}

      <div className="space-y-2">
        {pageBlocks.map((blk, idx) => (
          <div
            key={`${blk.index}-${blk.label}`}
            className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper"
          >
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onToggle(blk.index)}
                title={blk.hidden ? 'Show section' : 'Hide section'}
                className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                  !blk.hidden ? 'bg-ink border-ink text-white' : 'bg-white border-line'
                }`}
              >
                {!blk.hidden && <Check className="w-3 h-3 font-bold" />}
              </button>
              <span className={`text-xs font-semibold ${!blk.hidden ? 'text-ink' : 'text-pencil line-through'}`}>
                {blk.label}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onMove(blk.index, -1)}
                disabled={idx === 0}
                className="p-1 text-pencil hover:text-ink disabled:opacity-30 cursor-pointer hover:bg-paper-2 rounded"
                title="Move section up"
              >
                <MoveUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onMove(blk.index, 1)}
                disabled={idx === pageBlocks.length - 1}
                className="p-1 text-pencil hover:text-ink disabled:opacity-30 cursor-pointer hover:bg-paper-2 rounded"
                title="Move section down"
              >
                <MoveDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
