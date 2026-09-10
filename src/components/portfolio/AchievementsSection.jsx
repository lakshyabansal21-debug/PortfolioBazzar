import React from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  BookOpen, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function AchievementsSection() {
  const { stats, awards } = DEVELOPER_DATA.achievements;

  return (
    <section id="achievements" className="py-20 sm:py-28 border-t border-[#E6E1D6]/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#D97706]">
            <span>// 05 · Recognition</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#18181B] tracking-tight">
            Key Metrics & Notable Honors
          </h2>
          <p className="text-sm sm:text-base text-[#52525B] max-w-xl">
            Quantifiable scale benchmarks and competitive engineering recognitions.
          </p>
        </div>

        {/* Large Typography Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E6E1D6] p-6 text-center sm:text-left shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:border-[#D1CBC0] transition-colors"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18181B] font-mono tracking-tight mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#18181B] mb-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#71717A]">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Honors & Awards Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((award, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E6E1D6] p-6 shadow-[0_1px_3px_rgba(24,24,27,0.03)] hover:border-[#D1CBC0] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E1D6]">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6] flex items-center justify-center text-[#D97706]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#71717A] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1D6]">
                    {award.year}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#18181B] mb-1">
                  {award.title}
                </h3>
                <p className="text-xs font-medium text-[#D97706] mb-3">
                  {award.organization}
                </p>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  {award.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F3EFE6] flex items-center gap-1.5 text-[11px] text-[#52525B]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified award</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
