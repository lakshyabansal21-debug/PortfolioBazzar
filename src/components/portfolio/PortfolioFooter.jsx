import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp, Layers } from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function PortfolioFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#E6E1D6] bg-[#FAF8F5] py-12 sm:py-16 text-xs text-[#71717A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-[#E6E1D6]/80">
          
          {/* Identity & Mission */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#18181B] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                LB
              </div>
              <span className="font-bold text-sm text-[#18181B] tracking-tight">
                {DEVELOPER_DATA.personal.name}
              </span>
            </div>
            <p className="text-xs text-[#52525B] max-w-sm leading-relaxed">
              Architecting high-throughput distributed systems and refined web applications.
            </p>
          </div>

          {/* Quick Section Navigation */}
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-[#52525B]">
            <a href="#about" className="hover:text-[#18181B] transition-colors">About</a>
            <a href="#projects" className="hover:text-[#18181B] transition-colors">Projects</a>
            <a href="#skills" className="hover:text-[#18181B] transition-colors">Skills</a>
            <a href="#experience" className="hover:text-[#18181B] transition-colors">Experience</a>
            <a href="#achievements" className="hover:text-[#18181B] transition-colors">Achievements</a>
            <a href="#contact" className="hover:text-[#18181B] transition-colors">Contact</a>
            <Link to="/explore" className="text-[#D97706] hover:text-[#B45309] font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Studio & Templates</span>
            </Link>
          </nav>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href={DEVELOPER_DATA.personal.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white border border-[#E6E1D6] text-[#52525B] hover:text-[#18181B] transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={DEVELOPER_DATA.personal.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white border border-[#E6E1D6] text-[#52525B] hover:text-[#18181B] transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${DEVELOPER_DATA.personal.email}`}
              className="p-2 rounded-lg bg-white border border-[#E6E1D6] text-[#52525B] hover:text-[#18181B] transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white border border-[#E6E1D6] text-[#52525B] hover:text-[#18181B] transition-colors cursor-pointer ml-2"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Legal & Colophon */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#A1A1AA]">
          <div>
            © {new Date().getFullYear()} {DEVELOPER_DATA.personal.name}. All rights reserved.
          </div>
          <div>
            Engineered with React, Vite & Tailwind CSS · Designed for human developers
          </div>
        </div>

      </div>
    </footer>
  );
}
