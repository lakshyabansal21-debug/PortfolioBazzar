import React from 'react';
import { 
  GraduationCap, 
  Compass, 
  Target, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  MapPin, 
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function AboutSection() {
  const { about, education } = DEVELOPER_DATA;

  return (
    <section id="about" className="py-20 sm:py-28 border-t border-line/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Eyebrow & Title */}
        <div className="space-y-2 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            <span>// 01 · Background</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight">
            Building software with mathematical restraint & human care.
          </h2>
        </div>

        {/* Asymmetrical 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Narrative Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-soft leading-relaxed text-sm sm:text-base">
            {about.paragraphs.map((p, idx) => (
              <p key={idx} className={idx === 0 ? 'text-ink font-medium text-base sm:text-lg leading-normal' : ''}>
                {p}
              </p>
            ))}

            {/* Core Architectural Principles */}
            <div className="pt-4 border-t border-line">
              <h3 className="text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-3">
                Core Architectural Principles
              </h3>
              <div className="space-y-3">
                {about.corePrinciples.map((principle) => (
                  <div key={principle.title} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-xs text-ink block">{principle.title}</span>
                      <span className="text-xs text-pencil">{principle.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Structured Cards Column (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Current Focus Card */}
            <div className="bg-white rounded-xl border border-line p-6 shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:border-line-2 transition-colors">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-line/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Target className="w-4 h-4 text-accent" />
                  <span>Current Technical Focus (2026)</span>
                </div>
                <span className="text-[11px] font-mono text-pencil">Active R&D</span>
              </div>
              <ul className="space-y-3">
                {about.currentFocus.map((focus, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 text-xs">
                    <span className="font-medium text-ink shrink-0">{focus.label}</span>
                    <span className="text-pencil text-right">{focus.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Card */}
            {education.map((edu, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-line p-6 shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:border-line-2 transition-colors">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-line/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                    <GraduationCap className="w-4 h-4 text-accent" />
                    <span>Education & Academic Background</span>
                  </div>
                  <span className="text-[11px] font-mono text-pencil">{edu.period}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-ink">{edu.degree}</h4>
                  <div className="text-xs text-soft mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="font-medium">{edu.institution}</span>
                    <span className="text-mist">·</span>
                    <span className="text-accent font-semibold">{edu.gpa}</span>
                  </div>
                  
                  <ul className="mt-4 space-y-1.5 border-t border-paper-2 pt-3">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-pencil flex items-start gap-2">
                        <span className="text-mist select-none">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Developer Metadata Pill Box */}
            <div className="bg-paper-2/70 rounded-xl border border-line p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-soft">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pencil" />
                <span>San Francisco, California</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-pencil" />
                <span>Open Source & Distributed Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-ink">Active on GitHub</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
