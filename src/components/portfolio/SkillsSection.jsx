import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Database, 
  Cloud, 
  Cpu, 
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function SkillsSection() {
  const { categories } = DEVELOPER_DATA.skills;
  const [activeCategory, setActiveCategory] = useState('all');

  const categoryIcons = {
    frontend: Code2,
    backend: Server,
    databases: Database,
    cloud: Cloud,
    ai: Cpu
  };

  const displayedCategories = activeCategory === 'all'
    ? categories
    : categories.filter(c => c.id === activeCategory);

  return (
    <section id="skills" className="py-20 sm:py-28 border-t border-line/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            <span>// 03 · Skills & Stack</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight">
            Technical Stack & Core Domains
          </h2>
          <p className="text-sm sm:text-base text-soft max-w-xl">
            Grouped by architectural layer. Focused on composable primitives, memory safety, and high-frequency rendering.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-ink text-white shadow-2xs'
                : 'bg-white border border-line text-soft hover:text-ink hover:bg-paper-2'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Layers;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-ink text-white shadow-2xs'
                    : 'bg-white border border-line text-soft hover:text-ink hover:bg-paper-2'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Layers;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-line p-6 shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:border-line-2 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-line">
                    <div className="w-8 h-8 rounded-lg bg-paper border border-line flex items-center justify-center text-ink">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{cat.name}</h3>
                      <p className="text-[11px] text-pencil leading-tight mt-0.5">{cat.description}</p>
                    </div>
                  </div>

                  {/* Individual Skills Pills */}
                  <div className="space-y-2.5">
                    {cat.items.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-2.5 rounded-lg bg-paper border border-line/70 flex items-center justify-between gap-2 text-xs hover:border-line-2 transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-ink block">{skill.name}</span>
                          <span className="text-[11px] text-pencil">{skill.note}</span>
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-line text-soft shrink-0">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-paper-2 flex items-center justify-between text-[11px] text-pencil">
                  <span>{cat.items.length} tools & patterns</span>
                  <span className="text-emerald-600 font-mono text-[10px]">Production ready</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
