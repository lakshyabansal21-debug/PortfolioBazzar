/**
 * LandingPage.jsx: Home page: hero, live demo preview with style tabs, and featured templates.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  ChevronRight,
  Shield,
  Zap,
  FileCode2,
  Sliders,
  Wand2
} from 'lucide-react';
import { dbService } from '../services/dbService.js';
import { TEMPLATE_CATEGORIES, generatePortfolioCode, DEFAULT_USER_DATA } from '../services/templateEngines.js';
import { assemblePreviewHtml } from '../utils/previewHelper.js';
import TemplateCard, { CATEGORY_BADGE_STYLES } from '../components/common/TemplateCard.jsx';
import HeroStack from '../components/common/HeroStack.jsx';
import { getSiteHost } from '../config/siteConfig.js';

export default function LandingPage() {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Hero Preview State
  const previewOptions = [
    { 
      key: 'Developer', 
      label: 'Developer Bento', 
      tag: 'Modular Layout', 
      author: 'IIT BBS WebND', 
      stack: 'Semantic HTML · CSS Grid · Vanilla JS',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      key: 'Minimal', 
      label: 'Minimal Clean', 
      tag: 'Swiss Editorial', 
      author: 'PortfolioHub Core', 
      stack: 'Pure Typography · 0KB Overhead',
      color: 'bg-zinc-100 text-zinc-800 border-zinc-200'
    },
    { 
      key: 'Terminal', 
      label: 'Terminal CLI', 
      tag: 'Interactive Shell', 
      author: 'Kernel Dev', 
      stack: 'Interactive Bash Emulator · JS',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    { 
      key: 'Creative', 
      label: 'Creative Studio', 
      tag: 'Visual Showcase', 
      author: 'Design Guild', 
      stack: 'High-Impact CSS · Project Grids',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
  ];
  const [selectedPreview, setSelectedPreview] = useState(previewOptions[0]);
  const [previewViewport, setPreviewViewport] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobile' : 'desktop';
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const featRes = await dbService.getTemplates({ limit: 6, sort: 'popular' });
        setFeaturedTemplates(featRes.templates || []);
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Generate live HTML string for the preview iframe
  const previewHtml = useMemo(() => {
    const generated = generatePortfolioCode(selectedPreview.key, DEFAULT_USER_DATA);
    return assemblePreviewHtml(generated.html, generated.css, generated.js, {
      fallbackCategory: selectedPreview.key
    });
  }, [selectedPreview]);

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      
      {/* 1. HERO SECTION - ASYMMETRIC, EDITORIAL, HUMAN */}
      <section className="pt-12 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-6 pb-12">

          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-ink leading-[1.04]">
              Pick a template. Make it yours. Host it free.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-soft leading-relaxed max-w-lg">
              Every template is plain HTML, CSS and JavaScript, with no framework and no build step.
              Change the text right on the page, download the ZIP, and put it on GitHub Pages, Vercel or Netlify.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/generator"
                className="px-5 py-2.5 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Start with a template</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/explore"
                className="px-5 py-2.5 rounded-lg bg-white hover:bg-paper-2 text-ink text-sm font-semibold border border-line-2 inline-flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-pencil" />
                <span>Browse templates</span>
              </Link>
            </div>
          </div>

          <HeroStack />

        </div>

        {/* 2. INTERACTIVE PRODUCT PREVIEW STAGE */}
        <div className="mt-4 sm:mt-6 bg-white border border-line rounded-xl overflow-hidden">
          
          {/* Stage Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-line bg-paper">
            
            {/* Top row / Left: Window dots & Style buttons */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar">
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-line border border-line-2" />
                <span className="w-2.5 h-2.5 rounded-full bg-line border border-line-2" />
                <span className="w-2.5 h-2.5 rounded-full bg-line border border-line-2" />
              </div>

              {/* Style Switcher - Scrollable on mobile so mobile users can pick any preview style */}
              <div className="flex items-center gap-1 bg-paper-2 p-0.5 rounded-md border border-line overflow-x-auto shrink-0">
                {previewOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedPreview(opt)}
                    className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                      selectedPreview.key === opt.key
                        ? 'bg-white text-ink font-semibold shadow-2xs'
                        : 'text-pencil hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Fake URL bar */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-line text-[11px] font-mono text-pencil max-w-xs truncate shadow-2xs">
              <span className="text-ink font-semibold">{getSiteHost()}</span>
              <span>/live/{selectedPreview.key.toLowerCase()}</span>
            </div>

            {/* Right: Viewports & Use Action */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              {/* Viewport controls (Desktop, Tab, Mobile) */}
              <div className="flex items-center bg-paper-2 p-0.5 rounded-md border border-line">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 text-xs ${
                    previewViewport === 'desktop'
                      ? 'bg-white text-ink font-semibold shadow-2xs'
                      : 'text-pencil hover:text-ink'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 text-xs ${
                    previewViewport === 'tablet'
                      ? 'bg-white text-ink font-semibold shadow-2xs'
                      : 'text-pencil hover:text-ink'
                  }`}
                  title="Tablet View (720px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tab</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 text-xs ${
                    previewViewport === 'mobile'
                      ? 'bg-white text-ink font-semibold shadow-2xs'
                      : 'text-pencil hover:text-ink'
                  }`}
                  title="Mobile View (360px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              {/* Use button */}
              <Link
                to={`/generator?template=${selectedPreview.key}`}
                className="px-3 sm:px-3.5 py-1.5 rounded-md bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5 text-hl" />
                <span>Use style</span>
              </Link>
            </div>

          </div>

          {/* Canvas Container */}
          <div className="bg-paper-2 p-3 sm:p-6 overflow-x-auto min-h-[460px] max-h-[660px]">
            <div 
              className={`bg-white rounded-lg border border-line shadow-sm overflow-hidden transition-all duration-300 h-[480px] sm:h-[520px] mx-auto shrink-0 ${
                previewViewport === 'mobile' ? 'w-[360px] max-w-full' :
                previewViewport === 'tablet' ? 'w-[720px]' :
                'w-full min-w-[960px] lg:min-w-0'
              }`}
            >
              <iframe
                title="Live Product Preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-forms allow-modals"
              />
            </div>
          </div>

          {/* Bottom Bar: Stack, Author & Split Editor Link */}
          <div className="px-5 py-3 border-t border-line bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-pencil">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${selectedPreview.color}`}>
                {selectedPreview.tag}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-soft bg-paper border border-line">
                {previewViewport === 'mobile' ? '360px · Mobile' : previewViewport === 'tablet' ? '720px · Tablet' : 'Responsive · Desktop'}
              </span>
              <span className="text-ink font-semibold">{selectedPreview.label}</span>
              <span className="text-line hidden sm:inline">|</span>
              <span className="hidden sm:inline">Maintained by {selectedPreview.author}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-soft hidden md:inline">
                {selectedPreview.stack}
              </span>
              <span className="text-line hidden md:inline">|</span>
              <Link
                to={`/editor?template=${selectedPreview.key}`}
                className="text-ink hover:text-accent flex items-center gap-1.5 font-medium transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-hl" />
                <span>Open in split code editor</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. WORKFLOW BREAKDOWN - HUMAN, TECHNICAL, OPINIONATED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-line pt-14">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                How PortfolioHub works
              </h2>
              <p className="text-sm text-soft mt-1 max-w-xl">
                Built specifically for developers who want a beautiful, professional web presence without wrestling with bloated JavaScript runtimes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 bg-white border border-line rounded-xl shadow-2xs hover:border-line-2 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-7 h-7 rounded-md bg-paper-2 text-accent font-mono text-xs font-bold flex items-center justify-center border border-line">
                    01
                  </span>
                  <span className="text-[10px] font-mono text-pencil bg-paper px-2 py-0.5 rounded border border-line">
                    12 STYLES
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink tracking-tight">
                  Choose a design engine
                </h3>
                <p className="text-xs text-soft mt-2 leading-relaxed">
                  Select from 12 distinct aesthetic styles—from Swiss minimalist typography to interactive UNIX terminal interfaces—designed around actual developer roles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[11px] font-mono text-pencil">
                Developer · Minimal · Terminal · Creative · Student
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white border border-line rounded-xl shadow-2xs hover:border-line-2 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-7 h-7 rounded-md bg-paper-2 text-accent font-mono text-xs font-bold flex items-center justify-center border border-line">
                    02
                  </span>
                  <span className="text-[10px] font-mono text-pencil bg-paper px-2 py-0.5 rounded border border-line">
                    LIVE SYNC
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink tracking-tight">
                  Populate and customize
                </h3>
                <p className="text-xs text-soft mt-2 leading-relaxed">
                  Use our guided step-by-step generator for quick setup, or open the live split-screen editor to tweak raw HTML, CSS, fonts, and accent color swatches directly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[11px] font-mono text-pencil">
                Live preview · Color palette tokens · Custom typography
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white border border-line rounded-xl shadow-2xs hover:border-line-2 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-7 h-7 rounded-md bg-paper-2 text-accent font-mono text-xs font-bold flex items-center justify-center border border-line">
                    03
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    100% STATIC
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink tracking-tight">
                  Export production ZIP
                </h3>
                <p className="text-xs text-soft mt-2 leading-relaxed">
                  Download clean, self-contained files. Drag and drop onto GitHub Pages, Vercel, or Netlify with zero build dependencies, zero node_modules, and perfect Lighthouse metrics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[11px] font-mono text-pencil">
                index.html · style.css · script.js · README.md
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CURATED STYLES DIRECTORY - 12 ENGINES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-line pt-14">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                12 Curated Aesthetic Engines
              </h2>
              <p className="text-sm text-soft mt-1">
                Each engine is structured around a distinct engineering persona and content hierarchy.
              </p>
            </div>

            <Link
              to="/explore"
              className="text-xs font-semibold text-ink hover:text-accent flex items-center gap-1.5 transition-colors"
            >
              <span>Explore all templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const badgeStyle = CATEGORY_BADGE_STYLES[cat] || CATEGORY_BADGE_STYLES.Default;
              const descriptions = {
                Developer: 'Bento modular cards with tech stack badges',
                Minimal: 'High-contrast typography with generous negative space',
                Terminal: 'Interactive bash terminal emulator with CLI commands',
                Student: 'Academic honors, coursework cards, and internships',
                Corporate: 'Executive leadership case studies & engineering metrics',
                Designer: 'Magnetic layout grid with visual project showcases',
                Luxury: 'Warm editorial serif typography with gold accents',
                Cyberpunk: 'Neo-tokyo dark aesthetic with monospace headers',
                Creative: 'Expressive layout with dynamic project thumbnails',
                Photographer: 'Visual lightbox gallery with high-res showcases',
                Dark: 'Deep charcoal low-strain developer dark theme',
                '3D': 'Interactive canvas perspective with spatial depth'
              };

              return (
                <Link
                  key={cat}
                  to={`/explore?category=${cat}`}
                  className="p-4 bg-white border border-line rounded-xl hover:border-line-2 hover:shadow-sm transition-all group flex flex-col justify-between min-h-[110px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeStyle}`}>
                        {cat}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-ink group-hover:text-accent transition-colors mt-2">
                      {cat} Engine
                    </div>
                    <p className="text-[11px] text-soft mt-1 line-clamp-2 leading-relaxed">
                      {descriptions[cat] || 'Custom modular portfolio structure'}
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-pencil group-hover:text-ink flex items-center justify-between pt-3 border-t border-line/60 mt-3">
                    <span>View templates</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-accent" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PORTFOLIO TEMPLATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-line pt-14">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                Featured Developer Portfolios
              </h2>
              <p className="text-sm text-soft mt-1">
                Real templates downloaded, customized, and deployed by our community.
              </p>
            </div>

            <Link
              to="/explore"
              className="text-xs font-semibold text-ink hover:text-accent flex items-center gap-1.5 transition-colors"
            >
              <span>View catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-pencil">
              Loading featured templates...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((tmpl) => (
                <TemplateCard key={tmpl.id} template={tmpl} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. WHY DEVELOPERS USE PORTFOLIOHUB - ARCHITECTURE BREAKDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-line pt-14">
          <div className="bg-white border border-line rounded-xl p-8 sm:p-12 shadow-2xs">
            
            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                No dependencies. No page builders. No monthly subscriptions.
              </h2>
              <p className="text-sm text-soft mt-2">
                Most portfolio tools try to trap you in an expensive CMS ecosystem. PortfolioHub gives you clean, semantic source code that you fully own forever.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">Instant Load Times</h3>
                <p className="text-xs text-soft leading-relaxed">
                  Plain HTML and CSS, with no framework and no build step, keep every page light and quick to load.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">Clean Source Code</h3>
                <p className="text-xs text-soft leading-relaxed">
                  Easily edit the downloaded files in VS Code, Sublime, or Neovim. No minified garbage or obfuscated React chunks.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">Live Split-Editor</h3>
                <p className="text-xs text-soft leading-relaxed">
                  Test changes live with viewport resizing for desktop, tablet, and mobile before exporting.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">Free Hosting Anywhere</h3>
                <p className="text-xs text-soft leading-relaxed">
                  Host directly on GitHub Pages for $0/year. Deploy in seconds by pushing to a repo or dropping into Netlify.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION - RESTRAINED & FUNCTIONAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ink text-white rounded-xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-zinc-800 shadow-md">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-800 text-hl text-xs font-mono font-semibold mb-3">
              <span>READY TO LAUNCH</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create your developer portfolio today.
            </h3>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Choose your style engine, populate your bio and featured projects, and download production-ready code in less than 5 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/generator"
              className="px-5 py-2.5 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-sm font-semibold transition-all shadow-sm"
            >
              Start in generator
            </Link>
            <Link
              to="/editor"
              className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-sm font-medium transition-colors"
            >
              Open raw code editor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
