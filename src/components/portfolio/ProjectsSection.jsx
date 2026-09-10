import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Github, 
  Layers, 
  Cpu, 
  Database, 
  Globe, 
  Activity, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function ProjectsSection() {
  const { projects } = DEVELOPER_DATA;
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'systems', label: 'Systems & Edge' },
    { id: 'apps', label: 'Web Applications' },
    { id: 'data', label: 'Data & Telemetry' }
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'systems') return project.tags.includes('Rust') || project.tags.includes('Go') || project.category.includes('Systems');
    if (filter === 'apps') return project.tags.includes('React') || project.category.includes('Web Applications');
    if (filter === 'data') return project.tags.includes('ClickHouse') || project.category.includes('Analytics');
    return true;
  });

  const flagship = projects.find(p => p.id === 'hyperscale') || projects[0];
  const gridProjects = filteredProjects.filter(p => p.id !== flagship.id);

  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-[#E6E1D6]/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#D97706]">
              <span>// 02 · Product Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#18181B] tracking-tight">
              Selected Engineering Works
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] max-w-xl">
              Production systems, distributed infrastructure, and interactive client engines built with strict performance budgets.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E6E1D6] rounded-lg self-start md:self-auto shadow-2xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filter === cat.id
                    ? 'bg-[#18181B] text-white shadow-2xs'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F3EFE6]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flagship Showcase Card (Full-width spotlight for maximum visual impact) */}
        {(filter === 'all' || filter === 'systems') && (
          <div className="group mb-10 bg-white rounded-2xl border border-[#E6E1D6] overflow-hidden shadow-[0_2px_8px_rgba(24,24,27,0.03)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.07)] hover:border-[#D1CBC0] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Details (6 cols) */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E6E1D6] text-[11px] font-mono font-semibold text-[#D97706]">
                      {flagship.badge}
                    </span>
                    <span className="text-xs text-[#71717A]">{flagship.category}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18181B] tracking-tight group-hover:text-[#D97706] transition-colors">
                    {flagship.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#52525B] mt-1 mb-4">
                    {flagship.tagline}
                  </p>

                  <p className="text-sm text-[#52525B] leading-relaxed mb-6">
                    {flagship.description}
                  </p>

                  {/* Highlight Metrics */}
                  {flagship.metrics && (
                    <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl mb-6">
                      {flagship.metrics.map((m, i) => (
                        <div key={i} className="text-center sm:text-left">
                          <span className="block text-xs font-bold text-[#18181B] font-mono">{m.value}</span>
                          <span className="block text-[10px] text-[#71717A] uppercase tracking-wider">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {flagship.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-mono font-medium text-[#52525B] bg-[#F3EFE6] border border-[#E6E1D6] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E6E1D6]">
                  <a
                    href={flagship.live}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#18181B] text-white text-xs font-semibold hover:bg-[#27272A] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Live Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <a
                    href={flagship.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-white border border-[#E6E1D6] text-[#18181B] text-xs font-medium hover:bg-[#F3EFE6] transition-colors flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Source</span>
                  </a>
                </div>

              </div>

              {/* Right Media Preview (6 cols) */}
              <div className="lg:col-span-6 relative overflow-hidden bg-[#18181B] min-h-[280px] sm:min-h-[380px] flex items-center justify-center p-6 sm:p-10">
                <img
                  src={flagship.image}
                  alt={flagship.title}
                  className="w-full h-full object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-103 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/40 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>
          </div>
        )}

        {/* Secondary Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl border border-[#E6E1D6] overflow-hidden shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.06)] hover:-translate-y-0.5 hover:border-[#D1CBC0] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-[#F3EFE6] border-b border-[#E6E1D6]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-104"
                    loading="lazy"
                  />
                  {project.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#E6E1D6] text-[10px] font-mono font-semibold text-[#18181B]">
                      {project.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#18181B] group-hover:text-[#D97706] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#52525B] font-medium mt-0.5">
                      {project.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-[#71717A] leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-mono text-[#52525B] bg-[#FAF8F5] border border-[#E6E1D6] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 sm:px-6 py-4 bg-[#FAF8F5]/80 border-t border-[#E6E1D6] flex items-center justify-between">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#52525B] hover:text-[#18181B] flex items-center gap-1 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#18181B] hover:text-[#D97706] flex items-center gap-1 transition-colors"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
