/**
 * HeroStack.jsx: Landing hero: three template "sheets" stacked in 3D. Click a sheet to bring it to the front.
 */
import React, { useState } from 'react';
import useTilt from '../../hooks/useTilt.js';

/**
 * HeroStack: three template "sheets" stacked in 3D.
 * - the whole stack leans toward the mouse (useTilt)
 * - click a sheet to bring it to the front; click the front one to send it to the back
 * The sheets are small drawings made from divs (no images, no iframes), so they load instantly.
 */
const SHEETS = [
  { name: 'Terminal' },
  { name: 'Editorial' },
  { name: 'Bento' }
];

function TerminalSheet() {
  return (
    <div className="h-full bg-ink text-hl font-mono text-[11px] leading-relaxed p-4 rounded-xl">
      <div className="text-mist">~/portfolio</div>
      <div><span className="text-white">$</span> whoami</div>
      <div className="text-white">riya-menon</div>
      <div className="mt-2"><span className="text-white">$</span> cat skills.txt</div>
      <div className="text-white">python  react  postgres</div>
      <div className="mt-2"><span className="text-white">$</span> ls projects/</div>
      <div className="text-white">exam-planner/  bus-tracker/</div>
      <div className="mt-2"><span className="text-white">$</span> <span className="inline-block w-2 h-3.5 bg-hl align-middle" /></div>
    </div>
  );
}

function EditorialSheet() {
  return (
    <div className="h-full bg-white p-5 rounded-xl">
      <div className="font-display text-3xl font-extrabold text-ink leading-none">Riya<br />Menon</div>
      <div className="mt-2 text-[11px] text-pencil">Backend developer, Pune</div>
      <div className="mt-4 h-px bg-ink" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <div className="h-1.5 rounded bg-line" />
          <div className="h-1.5 rounded bg-line w-4/5" />
          <div className="h-1.5 rounded bg-line w-11/12" />
          <div className="h-1.5 rounded bg-line w-2/3" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded bg-line w-3/4" />
          <div className="h-1.5 rounded bg-line" />
          <div className="h-1.5 rounded bg-line w-5/6" />
        </div>
      </div>
    </div>
  );
}

function BentoSheet() {
  return (
    <div className="h-full bg-paper-2 p-3 rounded-xl grid grid-cols-3 grid-rows-3 gap-2">
      <div className="col-span-2 row-span-2 rounded-lg bg-hl border border-ink p-3">
        <div className="font-display text-xl font-extrabold text-ink leading-tight">Riya Menon</div>
        <div className="text-[11px] text-ink mt-1">Builds APIs people actually use</div>
      </div>
      <div className="rounded-lg bg-ink text-white text-[11px] p-2 flex items-end">4 projects</div>
      <div className="rounded-lg bg-white border border-line text-[11px] text-ink p-2 flex items-end">React</div>
      <div className="rounded-lg bg-white border border-line text-[11px] text-ink p-2 flex items-end">Postgres</div>
      <div className="col-span-3 rounded-lg bg-white border border-line text-[11px] text-pencil p-2">riya@example.com</div>
    </div>
  );
}

const BODIES = [TerminalSheet, EditorialSheet, BentoSheet];

export default function HeroStack() {
  const tiltRef = useTilt(7);
  // order[0] is the sheet at the front
  const [order, setOrder] = useState([0, 1, 2]);

  const choose = (index) => {
    setOrder((prev) => {
      if (prev[0] === index) return [...prev.slice(1), prev[0]]; // front sheet goes to the back
      return [index, ...prev.filter((i) => i !== index)];        // chosen sheet comes to the front
    });
  };

  return (
    <div className="w-full max-w-[28rem] mx-auto lg:mx-0 pt-16 pr-16 pb-2">
      <div className="hero-stage">
        <div
          ref={tiltRef}
          className="tilt relative aspect-[4/3]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {SHEETS.map((sheet, index) => {
            const pos = order.indexOf(index);
            const Body = BODIES[index];
            return (
              <div
                key={sheet.name}
                role="button"
                tabIndex={0}
                aria-label={pos === 0 ? `${sheet.name} template, click to send to back` : `Show ${sheet.name} template`}
                onClick={() => choose(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    choose(index);
                  }
                }}
                className="hero-sheet rounded-xl border-[1.5px] border-ink"
                style={{
                  zIndex: 10 - pos,
                  transform: `translate3d(${pos * 34}px, ${pos * -30}px, ${pos * -60}px) rotate(${pos * 3}deg)`,
                  boxShadow: pos === 0
                    ? '0 2px 0 0 #0F1A2B, 0 28px 40px -18px rgba(36,89,201,0.35)'
                    : '0 2px 0 0 #0F1A2B, 0 14px 24px -14px rgba(15,26,43,0.35)'
                }}
              >
                <span className="absolute -top-[26px] left-3 px-3 py-1 rounded-t-md border-[1.5px] border-b-0 border-ink bg-white text-xs font-semibold text-ink">
                  {sheet.name}
                </span>
                <Body />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-accent">
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
          <path d="M3 4c8 14 16 15 26 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 6l6 6-8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hand text-xl leading-none">click a sheet to flip through</span>
      </div>
    </div>
  );
}
