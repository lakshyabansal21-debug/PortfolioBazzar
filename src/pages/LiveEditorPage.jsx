<<<<<<< HEAD
=======
/**
 * LiveEditorPage.jsx: The editor: customise a built-in or uploaded template with live preview (form, content tab, click-to-edit, sections, visual, raw code), then save, remix or download.
 */
>>>>>>> a6a0a74 (Update website content and layout)
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Download,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Sparkles,
  Wand2,
  ExternalLink,
  Save,
  UserCheck,
  Mail,
  Github,
  Linkedin,
  Twitter,
  FileText,
  Pencil
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TEMPLATE_CATEGORIES, 
  DEFAULT_USER_DATA, 
  generatePortfolioCode 
} from '../services/templateEngines.js';
import { dbService } from '../services/dbService.js';
import { assemblePreviewHtml, buildVisualOverrides } from '../utils/previewHelper.js';
import { downloadPortfolioZip, downloadSingleHtml } from '../utils/zipExport.js';
import ContentEditor from '../components/portfolio/ContentEditor.jsx';
<<<<<<< HEAD
=======
import TemplateInfoTab from '../components/editor/TemplateInfoTab.jsx';
import VisualTab from '../components/editor/VisualTab.jsx';
import SectionsTab from '../components/editor/SectionsTab.jsx';
import CodeTab from '../components/editor/CodeTab.jsx';
>>>>>>> a6a0a74 (Update website content and layout)
import FillDetailsForm from '../components/portfolio/FillDetailsForm.jsx';
import { readFieldDefs } from '../utils/editableFields.js';
import {
  readPortfolio,
  tagForEditing,
  updateText,
  duplicateItem,
  removeItem,
  moveItem,
  listPageBlocks,
  moveBlock,
  toggleBlock
} from '../utils/portfolioReader.js';
import { injectInlineEditor } from '../utils/inlineEditor.js';
import { extractProfileFromHtml, personalizeHtml, getInitials } from '../utils/templatePersonalizer.js';
import { useToast } from '../context/ToastContext.jsx';

export default function LiveEditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [accentColor, setAccentColor] = useState(null); // null = keep the template's own colour
  const [customFont, setCustomFont] = useState(null); // null = keep the template's own font

  // Sections tab: the real top-level parts of the current page (read from the HTML)
  // Code is declared further down, so the list is computed after activeHtml exists (see pageBlocks below).

  // Base generated code
  const baseCode = useMemo(() => {
    return generatePortfolioCode(template, userData);
  }, [template, userData]);

  // Code editor manual overrides state
  const [customHtml, setCustomHtml] = useState(null);
  const [customCss, setCustomCss] = useState(null);
  const [customJs, setCustomJs] = useState(null);
  const [codeTab, setCodeTab] = useState('html');

  // Put an uploaded / community template into the editor
  const applyLoadedTemplate = useCallback((t) => {
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

    setAccentColor(null);
    setCustomFont(null);
    setActiveSidebarTab('personalize');
    addToast(`Loaded template: "${t.title}". Personalize your info below.`, 'success');
  }, [addToast]);

  // Load custom template if templateId provided in query string
  useEffect(() => {
    const templateId = searchParams.get('templateId') || searchParams.get('id');
    if (templateId) {
      dbService.getTemplateById(templateId).then((t) => {
        if (t) applyLoadedTemplate(t);
      }).catch(err => {
        console.warn('Notice loading template into editor:', err);
      });
    }
  }, [searchParams, applyLoadedTemplate]);

  // List of uploaded / community templates for the header dropdown
  const [catalog, setCatalog] = useState([]);
  const refreshCatalog = useCallback(async () => {
    try {
      const res = await dbService.getTemplates({ limit: 500, sort: 'newest' });
      // built-in demo styles (id "tmpl-...") are already listed as engines
      setCatalog((res.templates || []).filter((t) => t && t.id && !String(t.id).startsWith('tmpl-')));
    } catch (e) {
      console.warn('Notice loading template list:', e);
    }
  }, []);
  useEffect(() => { refreshCatalog(); }, [refreshCatalog]);

  const activeHtml = customHtml !== null ? customHtml : baseCode.html;
  const activeCss = customCss !== null ? customCss : baseCode.css;
  const activeJs = customJs !== null ? customJs : baseCode.js;

  // Sections tab data + actions (work on the real HTML, so they also work for uploaded templates)
  const pageBlocks = useMemo(() => listPageBlocks(activeHtml), [activeHtml]);
  const handleMoveBlock = (index, dir) => {
    setCustomHtml(moveBlock(activeHtml, index, dir));
    addToast('Section moved', 'info');
  };
  const handleToggleBlock = (index) => setCustomHtml(toggleBlock(activeHtml, index));

  // CSS / JS used for downloads = template code + the Visual tab choices (so the file matches the preview)
  const visualOverrides = useMemo(() => buildVisualOverrides({ accentColor, customFont }), [accentColor, customFont]);
  const exportCss = activeCss + visualOverrides.css;
  const exportJs = visualOverrides.js ? `${activeJs}\n${visualOverrides.js}` : activeJs;

  // Header dropdown: switch between built-in engines and uploaded templates
  const selectValue = loadedCustomTemplate ? `custom:${loadedCustomTemplate.id}` : `engine:${template}`;
  const hasUnsavedChanges = loadedCustomTemplate
    ? customHtml !== loadedCustomTemplate.html_code ||
      customCss !== (loadedCustomTemplate.css_code || '') ||
      customJs !== (loadedCustomTemplate.js_code || '')
    : customHtml !== null || customCss !== null || customJs !== null;

  const handleTemplateSwitch = (value) => {
    if (value === selectValue) return;
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Switch template and lose them?')) return;

    if (value.startsWith('custom:')) {
      // the effect above loads it when the URL changes
      setSearchParams({ templateId: value.slice('custom:'.length) });
      return;
    }
    const cat = value.slice('engine:'.length);
    setLoadedCustomTemplate(null);
    setExtractedProfile(null);
    setCustomHtml(null);
    setCustomCss(null);
    setCustomJs(null);
    setAccentColor(null);
    setCustomFont(null);
    setTemplate(cat);
    if (['metadata'].includes(activeSidebarTab)) setActiveSidebarTab('personalize');
    setSearchParams({ template: cat });
  };

  // Fields the template's creator marked as editable (stored inside the template html)
  const hasCreatorFields = useMemo(
    () => !!loadedCustomTemplate && readFieldDefs(activeHtml).length > 0,
    [loadedCustomTemplate, activeHtml]
  );

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
        refreshCatalog();
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
        refreshCatalog();
      }
    } catch (err) {
      addToast('Failed to create remix: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  // ---- Live preview document -------------------------------------------------
  // "Edit on page": click text directly inside the preview (see utils/inlineEditor.js)
  const [editOnPage, setEditOnPage] = useState(false);
  const iframeRef = useRef(null);
  const scrollRef = useRef(0);
  const skipUntilRef = useRef(0);
  const activeHtmlRef = useRef(activeHtml);
  activeHtmlRef.current = activeHtml;

  const computedSrcDoc = useMemo(() => {
    const isStub = !activeHtml || activeHtml.trim().length < 35;
    const source = editOnPage && !isStub ? tagForEditing(activeHtml) : activeHtml;
    const doc = assemblePreviewHtml(source, activeCss, activeJs, {
      fallbackCategory: template,
      accentColor,
      customFont
    });
    return editOnPage ? injectInlineEditor(doc) : doc;
  }, [activeHtml, activeCss, activeJs, template, accentColor, customFont, editOnPage]);

  // The iframe reloads whenever the document changes, EXCEPT right after an on-page text edit
  // (the text is already updated inside the iframe, so a reload would only cause a flicker).
  // The scroll position is kept across reloads.
  const [iframeSrcDoc, setIframeSrcDoc] = useState(computedSrcDoc);
  useEffect(() => {
    if (Date.now() < skipUntilRef.current) return;
    try {
      scrollRef.current = iframeRef.current?.contentWindow?.scrollY || 0;
    } catch {
      scrollRef.current = 0;
    }
    setIframeSrcDoc(computedSrcDoc);
  }, [computedSrcDoc]);

  const handleIframeLoad = () => {
    try {
      if (scrollRef.current) iframeRef.current.contentWindow.scrollTo(0, scrollRef.current);
    } catch {
      /* cross-origin or detached: ignore */
    }
  };

  // Messages from the on-page editor running inside the iframe
  useEffect(() => {
    if (!editOnPage) return undefined;
    const onMessage = (e) => {
      const d = e.data;
      if (!d || d.source !== 'ph-editor') return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      const current = (prev) => (prev !== null ? prev : activeHtmlRef.current);

      if (d.type === 'text') {
        skipUntilRef.current = Date.now() + 500; // no reload: the iframe already shows the new text
        setCustomHtml((prev) => updateText(current(prev), d.index, d.value));
      } else if (d.type === 'item') {
        const ops = {
          dup: (h, i) => duplicateItem(h, i),
          del: (h, i) => removeItem(h, i),
          up: (h, i) => moveItem(h, i, -1),
          down: (h, i) => moveItem(h, i, 1)
        };
        const op = ops[d.action];
        if (!op) return;
        skipUntilRef.current = 0; // structure changed: reload the preview
        setCustomHtml((prev) => op(current(prev), d.index));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [editOnPage]);

  // How much text can be clicked on the page (0 = content is built by JavaScript)
  const clickableTextCount = useMemo(
    () => (editOnPage ? readPortfolio(activeHtml).fields.length : -1),
    [editOnPage, activeHtml]
  );

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const fileName = loadedCustomTemplate?.title || userData.personal.name || 'portfolio';
      const author = loadedCustomTemplate?.creator_name || userData.personal.name || 'Community Member';
      await downloadPortfolioZip({
        html: activeHtml,
        css: exportCss,
        js: exportJs,
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

  const handleDownloadHtml = () => {
    try {
      const fileName = loadedCustomTemplate?.title || profileForm.name || userData.personal.name || 'portfolio';
      downloadSingleHtml({ html: activeHtml, css: exportCss, js: exportJs, fileName });
      confetti({ particleCount: 50, spread: 50 });
      addToast('Single index.html downloaded (CSS & JS inlined)', 'success');
    } catch (err) {
      addToast('Export error: ' + err.message, 'error');
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
    setAccentColor(null);
    setCustomFont(null);
    addToast('Reset to original template codebase', 'info');
  };

  return (
    <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-paper p-4' : ''}`}>
      
      {/* 1. TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-line rounded-xl shadow-2xs">
        
        {/* Left: Navigation & Template Engine Selector */}
        <div className="flex items-center gap-3">
          <Link
            to="/explore"
            className="p-1.5 rounded-lg text-pencil hover:text-ink hover:bg-paper-2 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="text-xs font-bold text-ink flex items-center gap-2 flex-wrap">
              <span className="font-mono text-accent">DEV STUDIO</span>
              <span className="text-line">/</span>
              <select
                value={selectValue}
                onChange={(e) => handleTemplateSwitch(e.target.value)}
                className="font-semibold text-xs text-ink bg-transparent border-0 focus:outline-none cursor-pointer underline decoration-hl decoration-2 max-w-[220px]"
              >
                <optgroup label="Built-in engines">
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <option key={cat} value={`engine:${cat}`}>{cat} Engine</option>
                  ))}
                </optgroup>
                {(catalog.length > 0 || loadedCustomTemplate) && (
                  <optgroup label="Uploaded & community templates">
                    {loadedCustomTemplate && !catalog.some((t) => String(t.id) === String(loadedCustomTemplate.id)) && (
                      <option value={`custom:${loadedCustomTemplate.id}`}>{loadedCustomTemplate.title}</option>
                    )}
                    {catalog.map((t) => (
                      <option key={t.id} value={`custom:${t.id}`}>{t.title}</option>
                    ))}
                  </optgroup>
                )}
              </select>
              {loadedCustomTemplate && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-paper text-soft border border-line">
                  Community Template
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center & Right: Viewport Controls, Fullscreen, Reset, Download */}
        <div className="flex flex-wrap items-center gap-2">
          {loadedCustomTemplate && (
            <>
              <button
                onClick={handleSaveToDatabase}
                disabled={isSavingDb}
                className="px-2.5 py-1.5 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                title="Save updates directly to template in database"
              >
                <Save className="w-3.5 h-3.5 text-hl" />
                <span className="hidden sm:inline">{isSavingDb ? 'Saving...' : 'Save Changes'}</span>
              </button>

              <a
                href={`/site/${loadedCustomTemplate.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg border border-line bg-white text-ink hover:bg-paper-2 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer mr-1"
                title="Open full portfolio website in standalone view"
              >
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Open Live Site</span>
              </a>
            </>
          )}

          {/* Viewport Toggles */}
          <div className="flex items-center bg-paper-2 p-0.5 rounded-md border border-line">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'desktop' ? 'bg-white text-ink shadow-2xs font-semibold' : 'text-pencil hover:text-ink'}`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'tablet' ? 'bg-white text-ink shadow-2xs font-semibold' : 'text-pencil hover:text-ink'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'mobile' ? 'bg-white text-ink shadow-2xs font-semibold' : 'text-pencil hover:text-ink'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md border border-line bg-white text-pencil hover:text-ink hover:bg-paper-2 transition-colors cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-md border border-line bg-white text-pencil hover:text-ink hover:bg-paper-2 transition-colors cursor-pointer shadow-2xs"
            title="Reset code overrides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-paper-2 text-ink border border-line font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Download one self-contained index.html"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download HTML</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging...' : 'Download ZIP'}</span>
          </button>
        </div>

      </div>

      {/* 2. MAIN SPLIT-SCREEN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[calc(100vh-170px)] lg:min-h-[640px]">
        
        {/* LEFT PANEL: CONFIG & CODE (5 columns) */}
        <div className="h-[560px] lg:h-auto lg:col-span-5 flex flex-col bg-white border border-line rounded-xl overflow-hidden shadow-2xs">
          
          {/* Panel Tab Controls */}
          <div className="p-2.5 border-b border-line bg-paper flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveSidebarTab('personalize')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeSidebarTab === 'personalize' ? 'bg-ink text-white shadow-2xs' : 'text-pencil hover:text-ink'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-hl" />
                <span>Personalize Info</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('content')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeSidebarTab === 'content' ? 'bg-ink text-white shadow-2xs' : 'text-pencil hover:text-ink'
                }`}
              >
                Content & Skills
              </button>

              <button
                onClick={() => setActiveSidebarTab('visual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeSidebarTab === 'visual' ? 'bg-white text-ink shadow-2xs border border-line' : 'text-pencil hover:text-ink'
                }`}
              >
                Visual
              </button>

              {(
                <button
                  onClick={() => setActiveSidebarTab('sections')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeSidebarTab === 'sections' ? 'bg-white text-ink shadow-2xs border border-line' : 'text-pencil hover:text-ink'
                  }`}
                >
                  Sections
                </button>
              )}

              {loadedCustomTemplate && (
                <button
                  onClick={() => setActiveSidebarTab('metadata')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeSidebarTab === 'metadata' ? 'bg-white text-ink shadow-2xs border border-line' : 'text-pencil hover:text-ink'
                  }`}
                >
                  Template Info
                </button>
              )}

              <button
                onClick={() => setActiveSidebarTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeSidebarTab === 'code' ? 'bg-white text-ink shadow-2xs border border-line' : 'text-pencil hover:text-ink'
                }`}
              >
                Raw Code
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* PERSONALIZE TAB */}
            {activeSidebarTab === 'personalize' && hasCreatorFields && (
              <FillDetailsForm html={activeHtml} onChange={setCustomHtml} />
            )}

            {activeSidebarTab === 'personalize' && !hasCreatorFields && (
              <div className="space-y-4">
                <div className="p-3 bg-paper border border-line rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ink text-hl font-bold text-sm flex items-center justify-center border border-line shrink-0">
                      {getInitials(profileForm.name)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-ink">Personalize Portfolio</h3>
                      <p className="text-[11px] text-soft">
                        Change your name, headline, bio, and contact links in this template.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Your Full Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileForm(prev => ({ ...prev, name: val }));
                    }}
                    placeholder="e.g. Lakshya Bansal"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                  />
                  <p className="text-[10px] text-pencil mt-0.5">
                    Updates headings, title tags, avatar initials, and copyright info.
                  </p>
                </div>

                {/* Headline / Title Input */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
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
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Bio / About Input */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
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
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent resize-y"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-pencil" />
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
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Social Profiles */}
                <div className="pt-2 border-t border-line space-y-2.5">
                  <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
                    Social & Profile Links
                  </span>

                  <div>
                    <label className="block text-[11px] text-soft mb-0.5 flex items-center gap-1">
                      <Github className="w-3 h-3 text-pencil" />
                      <span>GitHub URL</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-soft mb-0.5 flex items-center gap-1">
                      <Linkedin className="w-3 h-3 text-pencil" />
                      <span>LinkedIn URL</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-soft mb-0.5 flex items-center gap-1">
                      <Twitter className="w-3 h-3 text-pencil" />
                      <span>Twitter / X URL</span>
                    </label>
                    <input
                      type="url"
                      value={profileForm.twitter}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="https://x.com/username"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-line space-y-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPersonalization()}
                    className="w-full py-2 px-3 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Changes to Live Preview</span>
                  </button>

                  {loadedCustomTemplate ? (
                    <button
                      type="button"
                      onClick={handleSaveToDatabase}
                      disabled={isSavingDb}
                      className="w-full py-2 px-3 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5 text-hl" />
                      <span>{isSavingDb ? 'Saving to Database...' : 'Save to Template (Database)'}</span>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSaveAsRemix}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-paper-2 text-ink text-xs font-medium border border-line transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Save as New Portfolio in Catalog</span>
                  </button>
                </div>
              </div>
            )}

            {/* TEMPLATE SETTINGS METADATA TAB */}
            {activeSidebarTab === 'metadata' && loadedCustomTemplate && (
<<<<<<< HEAD
              <div className="space-y-4">
                <div className="p-3 bg-paper border border-line rounded-xl">
                  <h3 className="text-xs font-bold text-ink">Template Settings</h3>
                  <p className="text-[11px] text-soft">
                    Rename this template, change author attribution, or update the catalog description.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Template Title <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateMeta.title}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, title: e.target.value })}
                    placeholder="e.g. Modern Developer Showcase"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Creator / Author Name
                  </label>
                  <input
                    type="text"
                    value={templateMeta.creator_name}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, creator_name: e.target.value })}
                    placeholder="e.g. Lakshya Bansal"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Template Category
                  </label>
                  <select
                    value={templateMeta.category}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white cursor-pointer focus:outline-none focus:border-accent"
                  >
                    {TEMPLATE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Catalog Description
                  </label>
                  <textarea
                    rows={3}
                    value={templateMeta.description}
                    onChange={(e) => setTemplateMeta({ ...templateMeta, description: e.target.value })}
                    placeholder="Describe what makes this portfolio template standout..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white focus:outline-none focus:border-accent resize-y"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveToDatabase}
                  disabled={isSavingDb}
                  className="w-full py-2 px-3 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-hl" />
                  <span>{isSavingDb ? 'Saving Changes...' : 'Save Template Settings'}</span>
                </button>
              </div>
=======
              <TemplateInfoTab
                templateMeta={templateMeta}
                setTemplateMeta={setTemplateMeta}
                onSave={handleSaveToDatabase}
                saving={isSavingDb}
              />
>>>>>>> a6a0a74 (Update website content and layout)
            )}

            {/* VISUAL CONFIG TAB */}
            {activeSidebarTab === 'visual' && (
<<<<<<< HEAD
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Color Accent Token</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor || '#F59E0B'}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-line cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={accentColor || ''}
                      placeholder="Template default"
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-line font-mono uppercase text-ink focus:outline-none focus:border-accent"
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
                  <label className="block text-xs font-semibold text-ink mb-1.5">Primary Typography</label>
                  <select
                    value={customFont || ''}
                    onChange={(e) => setCustomFont(e.target.value || null)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink bg-white cursor-pointer focus:outline-none focus:border-accent"
                  >
                    <option value="">Template default font</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Balanced Humanist)</option>
                    <option value="Inter">Inter (Technical Precision)</option>
                    <option value="Geist">Geist (Developer Sans)</option>
                    <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    <option value="JetBrains Mono">JetBrains Mono (CLI Code)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-line space-y-3">
                  <span className="text-xs font-bold text-ink">Quick Profile Overrides</span>
                  <div>
                    <label className="block text-[11px] font-semibold text-soft mb-1">Your Name</label>
                    <input
                      type="text"
                      value={userData.personal.name}
                      onChange={(e) => setUserData({
                        ...userData,
                        personal: { ...userData.personal, name: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-soft mb-1">Professional Headline</label>
                    <input
                      type="text"
                      value={userData.personal.title}
                      onChange={(e) => setUserData({
                        ...userData,
                        personal: { ...userData.personal, title: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
=======
              <VisualTab
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                customFont={customFont}
                setCustomFont={setCustomFont}
              />
>>>>>>> a6a0a74 (Update website content and layout)
            )}

            {/* CONTENT & SKILLS TAB (reads any uploaded portfolio) */}
            {activeSidebarTab === 'content' && (
              <ContentEditor
                html={activeHtml}
                js={activeJs}
                onChangeHtml={setCustomHtml}
                onChangeJs={setCustomJs}
              />
            )}

            {/* SECTIONS REORDERING TAB (reads the real page structure) */}
            {activeSidebarTab === 'sections' && (
<<<<<<< HEAD
              <div className="space-y-3">
                <p className="text-xs text-soft">
                  Reorder or hide the main parts of this page. Changes apply to the preview and to your download.
                </p>

                {pageBlocks.length < 2 && (
                  <div className="p-3 rounded-xl border border-line bg-paper text-xs text-soft">
                    No separate sections were found in this HTML (the page may be built by JavaScript). Use the Raw Code tab to edit it.
                  </div>
                )}

                <div className="space-y-2">
                  {pageBlocks.map((blk, idx) => (
                    <div
                      key={`${blk.index}-${blk.label}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleToggleBlock(blk.index)}
                          title={blk.hidden ? 'Show section' : 'Hide section'}
                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                            !blk.hidden ? 'bg-ink border-ink text-white' : 'bg-white border-line'
                          }`}
                        >
                          {!blk.hidden && <Check className="w-3 h-3 font-bold" />}
                        </button>
                        <span className={`text-xs font-semibold ${!blk.hidden ? 'text-ink' : 'text-pencil line-through'}`}>
                          {blk.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveBlock(blk.index, -1)}
                          disabled={idx === 0}
                          className="p-1 text-pencil hover:text-ink disabled:opacity-30 cursor-pointer hover:bg-paper-2 rounded"
                          title="Move section up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveBlock(blk.index, 1)}
                          disabled={idx === pageBlocks.length - 1}
                          className="p-1 text-pencil hover:text-ink disabled:opacity-30 cursor-pointer hover:bg-paper-2 rounded"
                          title="Move section down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
=======
              <SectionsTab pageBlocks={pageBlocks} onMove={handleMoveBlock} onToggle={handleToggleBlock} />
>>>>>>> a6a0a74 (Update website content and layout)
            )}

            {/* RAW CODE TAB */}
            {activeSidebarTab === 'code' && (
<<<<<<< HEAD
              <div className="h-full flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-paper-2 p-0.5 rounded-lg border border-line">
                    {['html', 'css', 'js'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                          codeTab === tab ? 'bg-white text-ink font-bold shadow-2xs' : 'text-pencil hover:text-ink'
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(codeTab === 'html' ? activeHtml : codeTab === 'css' ? activeCss : activeJs, codeTab)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-soft hover:text-ink cursor-pointer"
                  >
                    {copiedTab === codeTab ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy {codeTab.toUpperCase()}</span>
                  </button>
                </div>

                <div className="flex-1 min-h-[400px] rounded-xl bg-ink p-3 overflow-hidden flex flex-col border border-zinc-800">
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
=======
              <CodeTab
                codeTab={codeTab}
                setCodeTab={setCodeTab}
                html={activeHtml}
                css={activeCss}
                js={activeJs}
                onChangeHtml={setCustomHtml}
                onChangeCss={setCustomCss}
                onChangeJs={setCustomJs}
                copiedTab={copiedTab}
                onCopy={handleCopy}
              />
>>>>>>> a6a0a74 (Update website content and layout)
            )}

          </div>

        </div>

        {/* RIGHT PANEL: LIVE PREVIEW IFRAME (7 columns) */}
        <div className="h-[520px] lg:h-auto lg:col-span-7 bg-white border border-line rounded-xl overflow-hidden shadow-2xs flex flex-col">
          
          {/* Preview address line */}
          <div className="px-4 py-2.5 border-b border-line bg-paper flex items-center justify-between text-xs text-pencil">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-ink font-semibold">Live Split Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditOnPage((v) => !v)}
                title="Click any text in the preview to edit it right there"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  editOnPage
                    ? 'bg-hl border-accent text-ink shadow-2xs'
                    : 'bg-white border-line text-ink hover:bg-paper-2'
                }`}
              >
                <Pencil className="w-3 h-3" />
                {editOnPage ? 'Editing on page — Done' : 'Edit on page'}
              </button>
              <span className="text-[11px] font-mono text-soft hidden sm:inline">
                VIEWPORT: {viewport.toUpperCase()}
              </span>
            </div>
          </div>

          {editOnPage && (
            <div className="px-4 py-2 border-b border-hl/40 bg-hl-soft text-[11px] text-accent-deep leading-relaxed">
              {clickableTextCount === 0 ? (
                <>
                  No clickable text found in the HTML: this page builds its content with JavaScript. Use{' '}
                  <b>Content &amp; Skills → Data in your JavaScript</b> to edit it.
                </>
              ) : (
                <>
                  <b>Click any text</b> to edit it · <b>Enter</b> saves · <b>Esc</b> cancels · hover a skill, project or
                  entry to <b>move, duplicate or delete</b> it.
                </>
              )}
            </div>
          )}

          {/* Iframe Stage */}
          <div className="flex-1 bg-paper-2 p-4 flex justify-center items-center overflow-hidden">
            <div 
              className={`bg-white rounded-lg border border-line shadow-sm overflow-hidden transition-all duration-200 h-full w-full ${
                viewport === 'mobile' ? 'max-w-[375px]' :
                viewport === 'tablet' ? 'max-w-[768px]' :
                'w-full'
              }`}
            >
              <iframe
                ref={iframeRef}
                onLoad={handleIframeLoad}
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
