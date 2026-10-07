import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ExternalLink, 
  Check, 
  Briefcase, 
  GraduationCap, 
  Award,
  Mail,
  MapPin,
  Globe
} from 'lucide-react';
import { DEVELOPER_DATA } from '../../data/portfolioData.js';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-line shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-ink" />
            <h3 className="text-sm font-bold text-ink tracking-tight">
              Curriculum Vitae · {DEVELOPER_DATA.personal.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-medium text-ink hover:bg-paper-2 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-pencil" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-pencil hover:text-ink hover:bg-line/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Document Content (Printable and Scrollable) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-ink font-sans">
          
          {/* Header */}
          <div className="border-b border-line pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                {DEVELOPER_DATA.personal.name}
              </h1>
              <p className="text-sm font-medium text-accent mt-0.5">
                {DEVELOPER_DATA.personal.role}
              </p>
              <p className="text-xs text-pencil mt-2 max-w-xl">
                {DEVELOPER_DATA.personal.shortBio}
              </p>
            </div>
            <div className="text-xs text-soft space-y-1 sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-pencil" />
                <span>{DEVELOPER_DATA.personal.email}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pencil" />
                <span>{DEVELOPER_DATA.personal.location}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Globe className="w-3.5 h-3.5 text-pencil" />
                <span>github.com/lakshyabansal</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Professional Experience</span>
            </h2>
            <div className="space-y-6">
              {DEVELOPER_DATA.experience.map((exp, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-ink">{exp.role} · <span className="font-semibold text-soft">{exp.company}</span></span>
                    <span className="font-mono text-xs text-pencil">{exp.period}</span>
                  </div>
                  <p className="text-xs text-soft italic">{exp.summary}</p>
                  <ul className="list-disc list-inside text-xs text-soft space-y-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-relaxed">{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4 border-t border-line pt-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </h2>
            {DEVELOPER_DATA.education.map((edu, i) => (
              <div key={i} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-ink">{edu.degree} · <span className="font-medium text-soft">{edu.institution}</span></span>
                  <span className="font-mono text-xs text-pencil">{edu.period}</span>
                </div>
                <p className="text-xs font-semibold text-accent">GPA: {edu.gpa}</p>
                <div className="flex flex-wrap gap-2 text-xs text-pencil pt-1">
                  {edu.highlights.map((h, idx) => (
                    <span key={idx}>• {h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Strengths */}
          <div className="space-y-3 border-t border-line pt-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              Key Technologies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-soft">
              <div>
                <span className="font-semibold text-ink block mb-1">Systems & Backend:</span>
                <span>Go, Rust, Node.js, Express, Raft Consensus, WebSockets, Kafka, Microservices</span>
              </div>
              <div>
                <span className="font-semibold text-ink block mb-1">Frontend & Client:</span>
                <span>React, Next.js, TypeScript, Tailwind CSS, WebGPU, Canvas API, Framer Motion</span>
              </div>
              <div>
                <span className="font-semibold text-ink block mb-1">Storage & Data:</span>
                <span>PostgreSQL, ClickHouse, Redis, Supabase, Vector Embeddings (pgvector)</span>
              </div>
              <div>
                <span className="font-semibold text-ink block mb-1">DevOps & Cloud:</span>
                <span>Docker, Kubernetes, Cloudflare Workers, GitHub Actions, AWS, Linux</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-line bg-paper flex items-center justify-between text-xs text-pencil">
          <span>Verified developer resume · Updated 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ink text-white font-medium hover:bg-ink-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
