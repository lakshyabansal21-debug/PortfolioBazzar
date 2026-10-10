/**
 * GeneratorPage.jsx: 5-step wizard that builds a portfolio from a form: style, profile, projects, skills, export.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Download,
  Code2,
  Plus,
  Trash2,
  Check,
  Layers,
  User,
  Briefcase,
  Cpu,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TEMPLATE_CATEGORIES, 
  DEFAULT_USER_DATA, 
  generatePortfolioCode 
} from '../services/templateEngines.js';
import { assemblePreviewHtml } from '../utils/previewHelper.js';
import { downloadPortfolioZip } from '../utils/zipExport.js';
import { useToast } from '../context/ToastContext.jsx';

export default function GeneratorPage() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const initialTemplate = searchParams.get('template') || 'Minimal';
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [activeStep, setActiveStep] = useState(1); // 1: Style, 2: Profile, 3: Projects, 4: Skills, 5: Export
  const [viewport, setViewport] = useState('desktop');
  const [isExporting, setIsExporting] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Form State initialized with rich defaults
  const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA });

  useEffect(() => {
    const t = searchParams.get('template');
    if (t && TEMPLATE_CATEGORIES.some(c => c.toLowerCase() === t.toLowerCase())) {
      setSelectedTemplate(t);
    }
  }, [searchParams]);

  // Generate live code
  const generatedCode = useMemo(() => {
    return generatePortfolioCode(selectedTemplate, userData);
  }, [selectedTemplate, userData]);

  const iframeSrcDoc = useMemo(() => {
    return assemblePreviewHtml(generatedCode.html, generatedCode.css, generatedCode.js, {
      fallbackCategory: selectedTemplate,
      userData
    });
  }, [generatedCode, selectedTemplate, userData]);

  // Handlers for Personal Info
  const handlePersonalChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  // Handlers for Projects
  const handleAddProject = () => {
    const newProj = {
      id: Date.now(),
      title: 'New Featured Project',
      description: 'High-performance application built with modern architecture and accessible web standards.',
      tags: ['TypeScript', 'React', 'Tailwind'],
      live: 'https://example.com',
      github: 'https://github.com/example',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'
    };
    setUserData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    addToast('Added new project slot', 'info');
  };

  const handleUpdateProject = (index, field, value) => {
    const updated = [...userData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setUserData(prev => ({ ...prev, projects: updated }));
  };

  const handleRemoveProject = (index) => {
    const updated = userData.projects.filter((_, i) => i !== index);
    setUserData(prev => ({ ...prev, projects: updated }));
    addToast('Project removed', 'info');
  };

  // Handlers for Skills
  const [skillInput, setSkillInput] = useState('');
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const current = userData.skills?.technical || [];
    if (!current.includes(skillInput.trim())) {
      setUserData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          technical: [...current, skillInput.trim()]
        }
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: (prev.skills?.technical || []).filter(s => s !== skillToRemove)
      }
    }));
  };

  // Export Action
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadPortfolioZip({
        html: generatedCode.html,
        css: generatedCode.css,
        js: generatedCode.js,
        zipName: `${(userData.personal.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]/g, '-')}-portfolio.zip`,
        authorName: userData.personal.name || 'Developer'
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      addToast('Portfolio ZIP downloaded successfully', 'success');
    } catch (err) {
      addToast('Export failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    setUserData({ ...DEFAULT_USER_DATA });
    addToast('Reset to default sample content', 'info');
  };

  const steps = [
    { num: 1, label: 'Style Engine', icon: Layers },
    { num: 2, label: 'Profile Bio', icon: User },
    { num: 3, label: 'Projects', icon: Briefcase },
    { num: 4, label: 'Skills & Stack', icon: Cpu },
    { num: 5, label: 'Export ZIP', icon: Download }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP HEADER & WORKSPACE TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Portfolio Generator
          </h1>
          <p className="text-xs text-soft mt-1">
            Step-by-step guided creator with real-time responsive preview and instant static download.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-soft hover:text-ink hover:bg-paper-2 border border-line transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Reset to default sample content"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pencil" />
            <span>Reset data</span>
          </button>

          <Link
            to={`/editor?template=${selectedTemplate}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-ink bg-white border border-line hover:bg-paper-2 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Code2 className="w-3.5 h-3.5 text-accent" />
            <span>Open in code editor</span>
          </Link>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging ZIP...' : 'Download ZIP'}</span>
          </button>
        </div>
      </div>

      {/* 2. STEP INDICATOR BAR */}
      <div className="flex items-center gap-1 p-1 bg-white border border-line rounded-xl overflow-x-auto scrollbar-none shadow-2xs">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          const isDone = activeStep > step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-ink text-white shadow-2xs'
                  : isDone
                  ? 'text-ink hover:bg-paper-2'
                  : 'text-pencil hover:bg-paper'
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
              ) : (
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-hl' : 'text-pencil'}`} />
              )}
              <span>{step.num}. {step.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SPLIT PANEL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT FORM PANEL (5 columns on desktop) */}
        <div className="lg:col-span-5 bg-white border border-line rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
          
          {/* STEP 1: STYLE */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink">Choose Portfolio Engine</h2>
                <p className="text-xs text-soft mt-0.5">Select from {TEMPLATE_CATEGORIES.length} hand-crafted responsive architectures with rich CSS transforms and animations.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                {TEMPLATE_CATEGORIES.map((cat) => {
                  const isSelected = selectedTemplate.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedTemplate(cat)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? 'border-accent bg-hl-soft/40 ring-2 ring-hl/20 scale-[1.01]'
                          : 'border-line bg-white hover:bg-paper hover:border-line-2 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">{cat}</span>
                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-accent" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-line" />
                        )}
                      </div>
                      <span className="text-[11px] text-pencil mt-1 block line-clamp-1">
                        {cat === 'Bento' ? 'Modular 3D grid layout' :
                         cat === 'Terminal' ? 'Interactive UNIX CLI' :
                         cat === 'Neumorphic' ? 'Soft UI extruded clay' :
                         cat === 'Retro Arcade' ? '8-bit scanlines & CRT' :
                         cat === 'Editorial' ? 'Monochrome Swiss serif' :
                         cat === 'Aurora' ? 'Iridescent flowing gradients' :
                         cat === 'Blueprint' ? 'Architectural drafting grid' :
                         cat === 'Kinetic' ? 'Variable typography ticker' :
                         cat === 'Card Deck' ? '3D fanned card stack' :
                         cat === 'Holographic' ? 'Prismatic gyro tilt foil' :
                         cat === 'Deep Space' ? 'Interactive cosmic canvas' :
                         cat === 'Origami' ? 'Folded papercraft sheets' :
                         cat === 'Developer' ? 'Bento engineering grid' :
                         cat === 'Minimal' ? 'Swiss high-contrast' :
                         cat === 'Creative' ? 'Bold expressive layout' :
                         cat === 'Student' ? 'Coursework & honors' :
                         cat === 'Corporate' ? 'Executive metrics' :
                         `${cat} engine`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink">Personal Profile</h2>
                <p className="text-xs text-soft mt-0.5">Enter your public bio, social links, and credentials.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userData.personal.name}
                    onChange={(e) => handlePersonalChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Professional Title / Headline</label>
                  <input
                    type="text"
                    value={userData.personal.profession || userData.personal.title}
                    onChange={(e) => {
                      handlePersonalChange('title', e.target.value);
                      handlePersonalChange('profession', e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Bio / Headline Summary</label>
                  <textarea
                    rows={2}
                    value={userData.personal.bio}
                    onChange={(e) => handlePersonalChange('bio', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Detailed About Me</label>
                  <textarea
                    rows={3}
                    value={userData.personal.about}
                    onChange={(e) => handlePersonalChange('about', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Location</label>
                    <input
                      type="text"
                      value={userData.personal.location || 'San Francisco, CA'}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.personal.email || ''}
                      placeholder="you@example.com"
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={userData.personal.github || ''}
                      placeholder="https://github.com/yourname"
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={userData.personal.linkedin || ''}
                      placeholder="https://linkedin.com/in/yourname"
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Avatar Photo URL</label>
                  <input
                    type="text"
                    value={userData.personal.avatar}
                    onChange={(e) => handlePersonalChange('avatar', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROJECTS */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-ink">Featured Projects</h2>
                  <p className="text-xs text-soft mt-0.5">Add, edit, or reorder your engineering showcases.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-2 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-hl" />
                  <span>Add project</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {userData.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-4 rounded-xl border border-line bg-paper space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink">Project 0{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                    />

                    <textarea
                      rows={2}
                      placeholder="Project Description"
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Live Demo URL"
                        value={proj.live}
                        onChange={(e) => handleUpdateProject(idx, 'live', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        placeholder="GitHub URL"
                        value={proj.github}
                        onChange={(e) => handleUpdateProject(idx, 'github', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: SKILLS */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink">Technical Skills & Stack</h2>
                <p className="text-xs text-soft mt-0.5">List your core languages, frameworks, cloud, and developer tools.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. TypeScript, React, Go, Docker, PostgreSQL..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-white border border-line text-ink focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-2 transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {(userData.skills?.technical || []).map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-paper border border-line text-ink"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk)}
                      className="text-pencil hover:text-red-600 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: EXPORT */}
          {activeStep === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-bold text-ink">Ready for Export</h2>
                <p className="text-xs text-soft mt-0.5">Download your complete, production-ready static portfolio website.</p>
              </div>

              <div className="p-4 rounded-xl bg-paper border border-line space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-pencil">Active Style Engine:</span>
                  <span className="font-bold text-ink">{selectedTemplate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pencil">Featured Projects:</span>
                  <span className="font-bold text-ink">{userData.projects.length} showcases</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pencil">Technical Skills:</span>
                  <span className="font-bold text-ink">{(userData.skills?.technical || []).length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pencil">Package Contents:</span>
                  <span className="font-mono text-soft">index.html · style.css · script.js</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full py-2.5 px-4 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Generating ZIP...' : 'Download Production ZIP'}</span>
                </button>

                <Link
                  to={`/editor?template=${selectedTemplate}`}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-paper-2 border border-line text-ink text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Code2 className="w-4 h-4 text-accent" />
                  <span>Fine-tune in split code editor</span>
                </Link>
              </div>
            </div>
          )}

          {/* BOTTOM STEP CONTROLS */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            <button
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-line text-xs font-semibold text-soft hover:text-ink hover:bg-paper-2 disabled:opacity-30 cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <span>Next step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="px-4 py-1.5 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ZIP</span>
              </button>
            )}
          </div>

        </div>

        {/* RIGHT LIVE PREVIEW PANEL (7 columns on desktop - sticky) */}
        <div className="lg:col-span-7 bg-white border border-line rounded-xl overflow-hidden sticky top-20 shadow-2xs">
          
          {/* Preview Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-paper">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-ink">{selectedTemplate} Engine Preview</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Viewport controls */}
              <div className="flex items-center bg-paper-2 p-0.5 rounded-md border border-line">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'desktop' ? 'bg-white text-ink shadow-2xs' : 'text-pencil hover:text-ink'}`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'tablet' ? 'bg-white text-ink shadow-2xs' : 'text-pencil hover:text-ink'}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'mobile' ? 'bg-white text-ink shadow-2xs' : 'text-pencil hover:text-ink'}`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Refresh Preview */}
              <button
                onClick={() => setPreviewKey(prev => prev + 1)}
                className="p-1.5 text-pencil hover:text-ink rounded cursor-pointer hover:bg-paper-2"
                title="Refresh preview canvas"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preview Canvas Container */}
          <div className="bg-paper-2 p-4 flex justify-center items-center overflow-hidden min-h-[520px]">
            <div 
              className={`bg-white rounded-lg border border-line shadow-sm overflow-hidden transition-all duration-200 h-[580px] ${
                viewport === 'mobile' ? 'w-[375px]' :
                viewport === 'tablet' ? 'w-[680px]' :
                'w-full'
              }`}
            >
              <iframe
                key={previewKey}
                title="Generator Live Preview"
                srcDoc={iframeSrcDoc}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-forms"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
