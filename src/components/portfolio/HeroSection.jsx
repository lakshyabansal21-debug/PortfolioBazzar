import React from 'react';
import { 
  ArrowRight, 
  Mail, 
  FileText, 
  Github, 
  Linkedin, 
  MapPin, 
  Clock, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import TerminalCard from './TerminalCard.jsx';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function HeroSection({ onOpenResume, onOpenContact }) {
  const scrollToProjects = (e) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    if (onOpenContact) {
      onOpenContact();
    } else {
      const target = document.querySelector('#contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two-Column Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Core Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E6E1D6] shadow-[0_1px_2px_rgba(24,24,27,0.03)] text-xs text-[#52525B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[#18181B]">{DEVELOPER_DATA.personal.statusShort}</span>
              <span className="text-[#A1A1AA]">·</span>
              <span className="text-[#71717A] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A1A1AA]" />
                {DEVELOPER_DATA.personal.location.split('&')[0]}
              </span>
            </div>

            {/* Main Confident Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#18181B] tracking-tight leading-[1.12]">
                Architecting high-throughput systems & refined web products.
              </h1>
              <p className="text-base sm:text-lg text-[#52525B] max-w-2xl leading-relaxed font-normal">
                Hi, I'm <span className="text-[#18181B] font-semibold">{DEVELOPER_DATA.personal.name}</span> — a {DEVELOPER_DATA.personal.role}. I design distributed architectures, low-latency telemetry pipelines, and fast, human-centered digital experiences.
              </p>
            </div>

            {/* Key Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="group px-5 py-2.5 rounded-lg bg-[#18181B] text-white text-xs sm:text-sm font-semibold hover:bg-[#27272A] transition-all duration-150 flex items-center gap-2 shadow-xs cursor-pointer hover:shadow-sm"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 text-[#FAF8F5] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                onClick={scrollToContact}
                className="px-5 py-2.5 rounded-lg bg-white border border-[#E6E1D6] text-[#18181B] text-xs sm:text-sm font-medium hover:bg-[#F3EFE6] hover:border-[#D1CBC0] transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#71717A]" />
                <span>Contact Me</span>
              </button>

              <button
                onClick={onOpenResume}
                className="px-4 py-2.5 rounded-lg bg-transparent text-[#52525B] hover:text-[#18181B] hover:bg-[#F3EFE6] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Resume</span>
              </button>
            </div>

            {/* Subtle Social Links & Meta */}
            <div className="pt-4 border-t border-[#E6E1D6]/80 flex flex-wrap items-center justify-between gap-4 text-xs text-[#71717A]">
              <div className="flex items-center gap-3">
                <span className="text-[#A1A1AA]">Connect:</span>
                <a
                  href={DEVELOPER_DATA.personal.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1 font-medium"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <span className="text-[#E6E1D6]">/</span>
                <a
                  href={DEVELOPER_DATA.personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1 font-medium"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <span className="text-[#E6E1D6]">/</span>
                <a
                  href={`mailto:${DEVELOPER_DATA.personal.email}`}
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
                <Clock className="w-3 h-3" />
                <span>Timezone: {DEVELOPER_DATA.personal.timezone}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Developer Terminal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative">
              {/* Subtle accent border corner highlight */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#D97706]/10 rounded-full blur-xl pointer-events-none" />
              <TerminalCard />
            </div>
          </div>

        </div>

        {/* Subtle Scroll Down Prompt */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <a
            href="#about"
            className="flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-[#18181B] transition-colors p-2"
          >
            <span>Learn more about my background</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}
