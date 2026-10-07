import React, { useState } from 'react';
import { Terminal as TerminalIcon, Copy, Check, Sparkles } from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function TerminalCard() {
  const [activeTab, setActiveTab] = useState('status');
  const [copied, setCopied] = useState(false);

  const snippets = {
    status: {
      cmd: 'curl -s https://api.lakshya.dev/v1/status',
      output: `{\n  "engineer": "Lakshya Bansal",\n  "role": "Senior Full Stack & Systems",\n  "availability": "Open to contracts & roles",\n  "location": "San Francisco, CA",\n  "timezone": "PST (UTC-8)"\n}`
    },
    stack: {
      cmd: 'cargo check && go test ./internal/distributed/...',
      output: `✓ Rust (HyperScale Router) ... PASS [4.2ms]\n✓ Go (Raft consensus) ........ PASS [6.1ms]\n✓ WebGPU Shaders (Canvas) .... PASS [60 FPS]\n✓ TypeScript Strict API ...... COMPILED (0 errors)`
    },
    philosophy: {
      cmd: 'cat ~/.config/engineering_principles.md',
      output: `# Core Architecture Standards\n- Sub-16ms interactive latency budget\n- Strict compile-time type boundaries\n- Human craftsmanship over generic templates`
    }
  };

  const handleCopy = () => {
    const text = `${snippets[activeTab].cmd}\n${snippets[activeTab].output}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-ink text-line rounded-xl border border-ink-2 shadow-xl overflow-hidden font-mono text-xs">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-ink border-b border-ink-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-ink-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-ink-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-ink-2" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-[11px] text-mist">
            <TerminalIcon className="w-3 h-3 text-accent" />
            <span>dev-terminal · zsh</span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1">
          {Object.keys(snippets).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab 
                  ? 'bg-ink-2 text-white font-medium' 
                  : 'text-pencil hover:text-line-2'
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={handleCopy}
            className="ml-1 p-1 text-pencil hover:text-white rounded transition-colors cursor-pointer"
            title="Copy command & output"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 space-y-3 font-mono leading-relaxed bg-ink">
        {/* Command line prompt */}
        <div className="flex items-start gap-2 text-[11px]">
          <span className="text-emerald-400 select-none">➜</span>
          <span className="text-mist select-none">~</span>
          <span className="text-white font-medium break-all">{snippets[activeTab].cmd}</span>
        </div>

        {/* Response block */}
        <pre className="text-[11px] text-mist whitespace-pre-wrap bg-ink/60 p-3 rounded-md border border-ink-2/70 overflow-x-auto">
          {snippets[activeTab].output}
        </pre>

        {/* Status footer line */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-pencil border-t border-ink-2/50">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Production node: sf-edge-01 (100% health)</span>
          </div>
          <span className="font-mono text-[9px] text-soft">latency: 4.8ms</span>
        </div>
      </div>
    </div>
  );
}
