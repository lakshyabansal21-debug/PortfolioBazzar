import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Code2, 
  Download, 
  Eye, 
  Copy, 
  Check, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  Layers, 
  Palette, 
  MoveUp, 
  MoveDown,
  Maximize2, 
  Minimize2,
  Sliders,
  FileCode,
  ArrowLeft,
  Sparkles,
  Wand2,
  ExternalLink,
  Save,
  UserCheck,
  Edit3,
  Globe,
  Mail,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TEMPLATE_CATEGORIES, 
  DEFAULT_USER_DATA, 
  generatePortfolioCode 
} from '../services/templateEngines.js';
import { dbService } from '../services/dbService.js';
import { assemblePreviewHtml } from '../utils/previewHelper.js';
import { downloadPortfolioZip } from '../utils/zipExport.js';
import { extractProfileFromHtml, personalizeHtml, getInitials } from '../utils/templatePersonalizer.js';
import { useToast } from '../context/ToastContext.jsx';

export default function LiveEditorPage() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const initialTemplate = searchParams.get('template') || 'Minimal';
  const [template, setTemplate] = useState(initialTemplate);
  const [loadedCustomTemplate, setLoadedCustomTemplate] = useState(null);
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [activeSidebarTab, setActiveSidebarTab] = useState('personalize'); // personalize, visual, sections, metadata, code
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [copiedTab, setCopiedTab] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // User state
  const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA });

  // Personalization form state
  const [profileForm, setProfileForm] = useState({
    name: DEFAULT_USER_DATA.personal.name,
    title: DEFAULT_USER_DATA.personal.title,
    bio: DEFAULT_USER_DATA.personal.bio,
    email: DEFAULT_USER_DATA.personal.email,
    github: DEFAULT_USER_DATA.personal.github,
    linkedin: DEFAULT_USER_DATA.personal.linkedin,
    twitter: DEFAULT_USER_DATA.personal.twitter
  });
  const [extractedProfile, setExtractedProfile] = useState(null);

  // Template metadata state (for renaming & editing uploaded templates)
  const [templateMeta, setTemplateMeta] = useState({
    title: '',
    creator_name: '',
    category: 'Minimal',
    description: ''
  });

  // Visual Customizations
  const [accentColor, setAccentColor] = useState('#F59E0B');
  const [customFont, setCustomFont] = useState('Plus Jakarta Sans');

  // Section Ordering & Visibility
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero Profile & Bio', visible: true },
    { id: 'skills', name: 'Skills & Stack Matrix', visible: true },
    { id: 'projects', name: 'Featured Project Showcases', visible: true },
    { id: 'contact', name: 'Contact & Inquiries', visible: true }
  ]);

  const moveSection = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setSections(updated);
    addToast(`Reordered ${moved.name}`, 'info');
  };

  const toggleSection = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  // Base generated code
  const baseCode = useMemo(() => {
    return generatePortfolioCode(template, userData);
  }, [template, userData]);

  // Code editor manual overrides state
  const [customHtml, setCustomHtml] = useState(null);
  const [customCss, setCustomCss] = useState(null);
  const [customJs, setCustomJs] = useState(null);
  const [codeTab, setCodeTab] = useState('html');

  // Load custom template if templateId provided in query string
  useEffect(() => {
    const templateId = searchParams.get('templateId') || searchParams.get('id');
    if (templateId) {
      dbService.getTemplateById(templateId).then((t) => {
        if (t) {
          setLoadedCustomTemplate(t);
          setCustomHtml(t.html_code);
          setCustomCss(t.css_code || '');
          setCustomJs(t.js_code || '');
          if (t.category) setTemplate(t.category);

          // Extract current profile values from template HTML
          const extracted = extractProfileFromHtml(t.html_code, {
            name: t.creator_name,
            title: t.title,
            creator_name: t.creator_name
          });
          setExtractedProfile(extracted);
          setProfileForm({
            name: extracted.name || '',
            title: extracted.title || '',
            bio: extracted.bio || '',
            email: extracted.email || '',
            github: extracted.github || '',
            linkedin: extracted.linkedin || '',
            twitter: extracted.twitter || ''
          });

          setTemplateMeta({
            title: t.title || '',
            creator_name: t.creator_name || '',
            category: t.category || 'Minimal',
            description: t.description || ''
          });

          setActiveSidebarTab('personalize');
          addToast(`Loaded template: "${t.title}". Personalize your info below.`, 'success');
        }
      }).catch(err => {
        console.warn('Notice loading template into editor:', err);
      });
    }
  }, [searchParams, addToast]);

  const activeHtml = customHtml !== null ? customHtml : baseCode.html;
  const activeCss = customCss !== null ? customCss : baseCode.css;
  const activeJs = customJs !== null ? customJs : baseCode.js;

  // Apply personalization to the current active code
  const handleApplyPersonalization = (overrideForm) => {
    const currentForm = overrideForm || profileForm;
    if (loadedCustomTemplate) {
      const currentCode = activeHtml;
      const oldProf = extractedProfile || extractProfileFromHtml(currentCode, { creator_name: loadedCustomTemplate.creator_name });
      const newHtml = personalizeHtml(currentCode, {
        oldProfile: oldProf,
        newProfile: currentForm
      });
      setCustomHtml(newHtml);
      setExtractedProfile({ ...oldProf, ...currentForm });
      addToast('Updated portfolio with your personalized info!', 'success');
    } else {
      setUserData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: currentForm.name,
          title: currentForm.title,
          bio: currentForm.bio,
          email: currentForm.email,
          github: currentForm.github,
          linkedin: currentForm.linkedin,
          twitter: currentForm.twitter
        }
      }));
      addToast('Updated portfolio with your personal info!', 'success');
    }
  };

  // Save changes to database (updates Supabase & local storage)
  const handleSaveToDatabase = async () => {
    if (!loadedCustomTemplate) return;
    setIsSavingDb(true);
    try {
      const updates = {
        title: templateMeta.title.trim() || loadedCustomTemplate.title,
        creator_name: templateMeta.creator_name.trim() || profileForm.name.trim() || loadedCustomTemplate.creator_name,
        category: templateMeta.category || loadedCustomTemplate.category,
        description: templateMeta.description || loadedCustomTemplate.description,
        html_code: activeHtml,
        css_code: activeCss,
        js_code: activeJs
      };
      const updated = await dbService.updateTemplate(loadedCustomTemplate.id, updates);
      if (updated) {
        setLoadedCustomTemplate({ ...loadedCustomTemplate, ...updated, ...updates });
        confetti({ particleCount: 60, spread: 60 });
        addToast('Template saved and updated in database!', 'success');
      }
    } catch (err) {
      addToast('Failed to save template: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsSavingDb(false);
    }
  };

  // Save as new remix
  const handleSaveAsRemix = async () => {
    try {
      const orig = loadedCustomTemplate || { id: 'template', title: template, creator_name: 'Community' };
      const remixed = await dbService.remixTemplate(orig, { username: profileForm.name || 'Personalized Creator' });
      if (remixed) {
        await dbService.updateTemplate(remixed.id, {
          title: `${profileForm.name || 'Personalized'}'s Portfolio`,
          creator_name: profileForm.name || 'Community Member',
          html_code: activeHtml,
          css_code: activeCss,
          js_code: activeJs
        });
        confetti({ particleCount: 70, spread: 60 });
        addToast('Saved as new portfolio in your collection!', 'success');
      }
    } catch (err) {
      addToast('Failed to create remix: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  // Render document
  const iframeSrcDoc = useMemo(() => {
    return assemblePreviewHtml(activeHtml, activeCss, activeJs, {
      fallbackCategory: template,
      accentColor,
      customFont
    });
  }, [activeHtml, activeCss, activeJs, template, accentColor, customFont]);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const fileName = loadedCustomTemplate?.title || userData.personal.name || 'portfolio';
      const author = loadedCustomTemplate?.creator_name || userData.personal.name || 'Community Member';
      await downloadPortfolioZip({
        html: activeHtml,
        css: activeCss,
        js: activeJs,
        zipName: `${fileName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-live-editor.zip`,
        authorName: author
      });
      if (loadedCustomTemplate?.id) {
        try {
          await dbService.incrementDownloads(loadedCustomTemplate.id);
        } catch (e) {}
      }
      confetti({ particleCount: 70, spread: 50 });
      addToast('Portfolio ZIP downloaded successfully', 'success');
    } catch (err) {
      addToast('Export error: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(type);
    addToast(`${type.toUpperCase()} code copied to clipboard`, 'info');
    setTimeout(() => setCopiedTab(''), 2000);
  };

  const handleReset = () => {
    setCustomHtml(null);
    setCustomCss(null);
    setCustomJs(null);
    setUserData({ ...DEFAULT_USER_DATA });
    setAccentColor('#F59E0B');
    addToast('Reset to original template codebase', 'info');
  };

  return (
    <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#FAF8F5] p-4' : ''}`}>
      
      {/* 1. TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-[#E6E1D6] rounded-xl shadow-2xs">
        
        {/* Left: Navigation & Template Engine Selector */}
        <div className="flex items-center gap-3">
          <Link
            to="/explore"
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="text-xs font-bold text-[#18181B] flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[#D97706]">DEV STUDIO</span>
              <span className="text-[#E6E1D6]">/</span>
              {loadedCustomTemplate ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#18181B] underline decoration-[#F59E0B] decoration-2">
                    {loadedCustomTemplate.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] text-[#52525B] border border-[#E6E1D6]">
                    Community Template
                  </span>
                </div>
              ) : (
                <select
                  value={template}
                  onChange={(e) => {
                    setTemplate(e.target.value);
                    setCustomHtml(null);
                    setCustomCss(null);
                    setCustomJs(null);
                  }}
                  className="font-semibold text-xs text-[#18181B] bg-transparent border-0 focus:outline-none cursor-pointer underline decoration-[#F59E0B] decoration-2"
                >
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat} Engine</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Center & Right: Viewport Controls, Fullscreen, Reset, Download */}
        <div className="flex items-center gap-2">
          {loadedCustomTemplate && (
            <>
              <button
                onClick={handleSaveToDatabase}
                disabled={isSavingDb}
                className="px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                title="Save updates directly to template in database"
              >
                <Save className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">{isSavingDb ? 'Saving...' : 'Save Changes'}</span>
              </button>

              <a
                href={`/site/${loadedCustomTemplate.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg border border-[#E6E1D6] bg-white text-[#18181B] hover:bg-[#F3EFE6] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer mr-1"
                title="Open full portfolio website in standalone view"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D97706]" />
                <span className="hidden sm:inline">Open Live Site</span>
              </a>
            </>
          )}

          {/* Viewport Toggles */}
          <div className="flex items-center bg-[#F3EFE6] p-0.5 rounded-md border border-[#E6E1D6]">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'desktop' ? 'bg-white text-[#18181B] shadow-2xs font-semibold' : 'text-[#71717A] hover:text-[#18181B]'}`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'tablet' ? 'bg-white text-[#18181B] shadow-2xs font-semibold' : 'text-[#71717A] hover:text-[#18181B]'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'mobile' ? 'bg-white text-[#18181B] shadow-2xs font-semibold' : 'text-[#71717A] hover:text-[#18181B]'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md border border-[#E6E1D6] bg-white text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] transition-colors cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-md border border-[#E6E1D6] bg-white text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] transition-colors cursor-pointer shadow-2xs"
            title="Reset code overrides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging...' : 'Download ZIP'}</span>
          </button>
        </div>

      </div>

      {/* 2. MAIN SPLIT-SCREEN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-170px)] min-h-[640px]">
        
        {/* LEFT PANEL: CONFIG & CODE (5 columns) */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-[#E6E1D6] rounded-xl overflow-hidden shadow-2xs">
          
          {/* Panel Tab Controls */}
          <div className="p-2.5 border-b border-[#E6E1D6] bg-[#FAF8F5] flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveSidebarTab('personalize')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeSidebarTab === 'personalize' ? 'bg-[#18181B] text-white shadow-2xs' : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Personalize Info</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('visual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeSidebarTab === 'visual' ? 'bg-white text-[#18181B] shadow-2xs border border-[#E6E1D6]' : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Visual
              </button>

              {!loadedCustomTemplate && (
                <button
                  onClick={() => setActiveSidebarTab('sections')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeSidebarTab === 'sections' ? 'bg-white text-[#18181B] shadow-2xs border border-[#E6E1D6]' : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  Sections
                </button>
              )}

              {loadedCustomTemplate && (
                <button
                  onClick={() => setActiveSidebarTab('metadata')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeSidebarTab === 'metadata' ? 'bg-white text-[#18181B] shadow-2xs border border-[#E6E1D6]' : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  Template Info
                </button>
              )}

              <button
                onClick={() => setActiveSidebarTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeSidebarTab === 'code' ? 'bg-white text-[#18181B] shadow-2xs border border-[#E6E1D6]' : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Raw Code
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* PERSONALIZE TAB */}
            {activeSidebarTab === 'personalize' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#18181B] text-[#F59E0B] font-bold text-sm flex items-center justify-center border border-[#E6E1D6] shrink-0">
                      {getInitials(profileForm.name)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#18181B]">Personalize Portfolio</h3>
                      <p className="text-[11px] text-[#52525B]">
                        Change your name, headline, bio, and contact links in this template.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Your Full Name <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileForm(prev => ({ ...prev, name: val }));
                    }}
                    placeholder="e.g. Lakshya Bansal"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                  />
                  <p className="text-[10px] text-[#71717A] mt-0.5">
                    Updates headings, title tags, avatar initials, and copyright info.
                  </p>
                </div>

                {/* Headline / Title Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Professional Headline / Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileForm(prev => ({ ...prev, title: val }));
                    }}
                    placeholder="e.g. Aspiring Engineer & Developer"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                {/* Bio / About Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    About Me & Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileForm(prev => ({ ...prev, bio: val }));
                    }}
                    placeholder="Passionate engineer building elegant solutions..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706] resize-y"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#71717A]" />
                    <span>Contact Email</span>
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileForm(prev => ({ ...prev, email: val }));
                    }}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                {/* Social Profiles */}
                <div className="pt-2 border-t border-[#E6E1D6] space-y-2.5">
                  <span className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider block">
                    Social & Profile Links
                  </span>

                  <div>
                    <label className="block text-[11px] text-[#52525B] mb-0.5 flex items-center gap-1">
                      <Github className="w-3 h-3 text-[#71717A]" />
                      <span>GitHub URL</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#52525B] mb-0.5 flex items-center gap-1">
                      <Linkedin className="w-3 h-3 text-[#71717A]" />
                      <span>LinkedIn URL</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#52525B] mb-0.5 flex items-center gap-1">
                      <Twitter className="w-3 h-3 text-[#71717A]" />
                      <span>Twitter / X URL</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.twitter}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="https://x.com/username"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#E6E1D6] space-y-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPersonalization()}
                    className="w-full py-2 px-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Changes to Live Preview</span>
                  </button>

                  {loadedCustomTemplate ? (
                    <button
                      type="button"
                      onClick={handleSaveToDatabase}
                      disabled={isSavingDb}
                      className="w-full py-2 px-3 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{isSavingDb ? 'Saving to Database...' : 'Save to Template (Database)'}</span>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSaveAsRemix}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-[#F3EFE6] text-[#18181B] text-xs font-medium border border-[#E6E1D6] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Save as New Portfolio in Catalog</span>
                  </button>
                </div>
              </div>
            )}

            {/* TEMPLATE SETTINGS METADATA TAB */}
            {activeSidebarTab === 'metadata' && loadedCustomTemplate && (
              <div className="space-y-4">
                <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl">
                  <h3 className="text-xs font-bold text-[#18181B]">Template Settings</h3>
                  <p className="text-[11px] text-[#52525B]">
                    Rename this template, change author attribution, or update the catalog description.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Template Title <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateMeta.title}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, title: e.target.value })}
                    placeholder="e.g. Modern Developer Showcase"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Creator / Author Name
                  </label>
                  <input
                    type="text"
                    value={templateMeta.creator_name}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, creator_name: e.target.value })}
                    placeholder="e.g. Lakshya Bansal"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Template Category
                  </label>
                  <select
                    value={templateMeta.category}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white cursor-pointer focus:outline-none focus:border-[#D97706]"
                  >
                    {TEMPLATE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Catalog Description
                  </label>
                  <textarea
                    rows={3}
                    value={templateMeta.description}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, description: e.target.value })}
                    placeholder="Describe what makes this portfolio template standout..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706] resize-y"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveToDatabase}
                  disabled={isSavingDb}
                  className="w-full py-2 px-3 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{isSavingDb ? 'Saving Changes...' : 'Save Template Settings'}</span>
                </button>
              </div>
            )}

            {/* VISUAL CONFIG TAB */}
            {activeSidebarTab === 'visual' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Color Accent Token</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E6E1D6] cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] font-mono uppercase text-[#18181B] focus:outline-none focus:border-[#D97706]"
                    />
                  </div>
                  {/* Preset color chips */}
                  <div className="flex items-center gap-1.5 pt-2">
                    {['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#18181B'].map(col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setAccentColor(col)}
                        style={{ backgroundColor: col }}
                        className="w-5 h-5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform"
                        title={col}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Primary Typography</label>
                  <select
                    value={customFont}
                    onChange={(e) => setCustomFont(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white cursor-pointer focus:outline-none focus:border-[#D97706]"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Balanced Humanist)</option>
                    <option value="Inter">Inter (Technical Precision)</option>
                    <option value="Geist">Geist (Developer Sans)</option>
                    <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    <option value="JetBrains Mono">JetBrains Mono (CLI Code)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#E6E1D6] space-y-3">
                  <span className="text-xs font-bold text-[#18181B]">Quick Profile Overrides</span>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#52525B] mb-1">Your Name</label>
                    <input
                      type="text"
                      value={userData.personal.name}
                      onChange={(e) => setUserData({
                        ...userData,
                        personal: { ...userData.personal, name: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] focus:outline-none focus:border-[#D97706]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#52525B] mb-1">Professional Headline</label>
                    <input
                      type="text"
                      value={userData.personal.title}
                      onChange={(e) => setUserData({
                        ...userData,
                        personal: { ...userData.personal, title: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] focus:outline-none focus:border-[#D97706]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTIONS REORDERING TAB */}
            {activeSidebarTab === 'sections' && (
              <div className="space-y-3">
                <p className="text-xs text-[#52525B]">
                  Reorder and toggle visibility of structural components in your active template:
                </p>

                <div className="space-y-2">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1D6] bg-[#FAF8F5]"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleSection(sec.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                            sec.visible ? 'bg-[#18181B] border-[#18181B] text-white' : 'bg-white border-[#E6E1D6]'
                          }`}
                        >
                          {sec.visible && <Check className="w-3 h-3 font-bold" />}
                        </button>
                        <span className={`text-xs font-semibold ${sec.visible ? 'text-[#18181B]' : 'text-[#71717A] line-through'}`}>
                          {sec.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSection(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-[#71717A] hover:text-[#18181B] disabled:opacity-30 cursor-pointer hover:bg-[#F3EFE6] rounded"
                          title="Move section up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSection(idx, 1)}
                          disabled={idx === sections.length - 1}
                          className="p-1 text-[#71717A] hover:text-[#18181B] disabled:opacity-30 cursor-pointer hover:bg-[#F3EFE6] rounded"
                          title="Move section down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RAW CODE TAB */}
            {activeSidebarTab === 'code' && (
              <div className="h-full flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-[#F3EFE6] p-0.5 rounded-lg border border-[#E6E1D6]">
                    {['html', 'css', 'js'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                          codeTab === tab ? 'bg-white text-[#18181B] font-bold shadow-2xs' : 'text-[#71717A] hover:text-[#18181B]'
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(codeTab === 'html' ? activeHtml : codeTab === 'css' ? activeCss : activeJs, codeTab)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#52525B] hover:text-[#18181B] cursor-pointer"
                  >
                    {copiedTab === codeTab ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy {codeTab.toUpperCase()}</span>
                  </button>
                </div>

                <div className="flex-1 min-h-[400px] rounded-xl bg-[#18181B] p-3 overflow-hidden flex flex-col border border-zinc-800">
                  {codeTab === 'html' && (
                    <textarea
                      value={activeHtml}
                      onChange={(e) => setCustomHtml(e.target.value)}
                      className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none p-1 leading-relaxed"
                      spellCheck={false}
                    />
                  )}
                  {codeTab === 'css' && (
                    <textarea
                      value={activeCss}
                      onChange={(e) => setCustomCss(e.target.value)}
                      className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none p-1 leading-relaxed"
                      spellCheck={false}
                    />
                  )}
                  {codeTab === 'js' && (
                    <textarea
                      value={activeJs}
                      onChange={(e) => setCustomJs(e.target.value)}
                      className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none p-1 leading-relaxed"
                      spellCheck={false}
                    />
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT PANEL: LIVE PREVIEW IFRAME (7 columns) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E1D6] rounded-xl overflow-hidden shadow-2xs flex flex-col">
          
          {/* Preview address line */}
          <div className="px-4 py-2.5 border-b border-[#E6E1D6] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#71717A]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-[#18181B] font-semibold">Live Split Preview</span>
            </div>
            <span className="text-[11px] font-mono text-[#52525B]">
              VIEWPORT: {viewport.toUpperCase()}
            </span>
          </div>

          {/* Iframe Stage */}
          <div className="flex-1 bg-[#F3EFE6] p-4 flex justify-center items-center overflow-hidden">
            <div 
              className={`bg-white rounded-lg border border-[#E6E1D6] shadow-sm overflow-hidden transition-all duration-200 h-full w-full ${
                viewport === 'mobile' ? 'max-w-[375px]' :
                viewport === 'tablet' ? 'max-w-[768px]' :
                'w-full'
              }`}
            >
              <iframe
                title="Live Editor Preview"
                srcDoc={iframeSrcDoc}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
