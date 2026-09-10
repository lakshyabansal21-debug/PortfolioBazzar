import React from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function ExperienceSection() {
  const { experience } = DEVELOPER_DATA;

  return (
    <section id="experience" className="py-20 sm:py-28 border-t border-[#E6E1D6]/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#D97706]">
            <span>// 04 · Experience</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#18181B] tracking-tight">
            Work History & Engineering Leadership
          </h2>
          <p className="text-sm sm:text-base text-[#52525B] max-w-xl">
            A chronological timeline of systems architecture, team mentorship, and high-velocity shipping.
          </p>
        </div>

        {/* Structured Timeline */}
        <div className="relative border-l border-[#E6E1D6] ml-3 sm:ml-4 space-y-12 pl-6 sm:pl-8">
          {experience.map((item, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline Bullet Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#18181B] group-hover:border-[#D97706] group-hover:scale-110 transition-all duration-150" />

              {/* Card Container */}
              <div className="bg-white rounded-xl border border-[#E6E1D6] p-6 sm:p-7 shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:border-[#D1CBC0] transition-colors">
                
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E6E1D6]/80">
                  <div>
                    <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
                      {item.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] mt-0.5">
                      <span className="font-semibold text-[#18181B]">{item.company}</span>
                      <span className="text-[#A1A1AA]">·</span>
                      <span className="flex items-center gap-1 text-[#71717A]">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                      <span className="text-[#A1A1AA]">·</span>
                      <span className="text-[#71717A]">{item.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1D6] text-xs font-mono font-medium text-[#18181B]">
                      {item.period}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#52525B] font-medium mb-4">
                  {item.summary}
                </p>

                {/* Key Accomplishments */}
                <div className="space-y-2 mb-6">
                  {item.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#52525B]">
                      <span className="text-[#D97706] font-bold select-none mt-0.5">›</span>
                      <span className="leading-relaxed">{ach}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies used pill list */}
                <div className="pt-4 border-t border-[#F3EFE6] flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#71717A] mr-1">Stack:</span>
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[11px] font-mono text-[#52525B] bg-[#FAF8F5] border border-[#E6E1D6] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
