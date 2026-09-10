import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Download, 
  Share2, 
  Code2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Check, 
  Copy, 
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Send,
  Star,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Info,
  Wand2,
  CheckCircle2,
  Edit3,
  X,
  UserCheck,
  Save,
  Mail,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbService } from '../services/dbService.js';
import { generatePortfolioCode, DEFAULT_USER_DATA, TEMPLATE_CATEGORIES } from '../services/templateEngines.js';
import { downloadPortfolioZip } from '../utils/zipExport.js';
import { assemblePreviewHtml } from '../utils/previewHelper.js';
import { extractProfileFromHtml, personalizeHtml, getInitials } from '../utils/templatePersonalizer.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import TemplateCard, { CATEGORY_BADGE_STYLES } from '../components/common/TemplateCard.jsx';

export default function TemplateDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'html' | 'css' | 'js' | 'reviews'
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [relatedTemplates, setRelatedTemplates] = useState([]);

  // Reviews state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Quick Personalize & Edit Template Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState('personal'); // 'personal' | 'template'
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: ''
  });
  const [templateForm, setTemplateForm] = useState({
    title: '',
    creator_name: '',
    category: 'Minimal',
    description: ''
  });

  const handleOpenEditModal = () => {
    if (!template) return;
    const extracted = extractProfileFromHtml(template.html_code, {
      name: template.creator_name,
      title: template.title,
      creator_name: template.creator_name
    });
    setPersonalForm({
      name: extracted.name || template.creator_name || '',
      title: extracted.title || '',
      bio: extracted.bio || '',
      email: extracted.email || '',
      github: extracted.github || '',
      linkedin: extracted.linkedin || '',
      twitter: extracted.twitter || ''
    });
    setTemplateForm({
      title: template.title || '',
      creator_name: template.creator_name || '',
      category: template.category || 'Minimal',
      description: template.description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!template) return;
    setIsSavingEdit(true);
    try {
      const oldExtracted = extractProfileFromHtml(template.html_code, {
        name: template.creator_name,
        title: template.title,
        creator_name: template.creator_name
      });
      const newHtml = personalizeHtml(template.html_code, {
        oldProfile: oldExtracted,
        newProfile: personalForm
      });

      const updates = {
        title: templateForm.title.trim() || template.title,
        creator_name: templateForm.creator_name.trim() || personalForm.name.trim() || template.creator_name,
        category: templateForm.category || template.category,
        description: templateForm.description || template.description,
        html_code: newHtml
      };

      const updated = await dbService.updateTemplate(template.id, updates);
      if (updated) {
        setTemplate(prev => ({ ...prev, ...updated, ...updates }));
        setIsEditModalOpen(false);
        confetti({ particleCount: 70, spread: 60 });
        addToast('Template details & personalized info updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to save changes: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadTemplate() {
      setLoading(true);
      try {
        const data = await dbService.getTemplateById(id);
        if (isMounted) {
          if (data) {
            setTemplate(data);
            setLikesCount(data.likes_count || 0);
            try {
              setIsLiked(dbService.isLiked(data.id));
              setIsFav(dbService.isFavorite(data.id));
            } catch (e) {}

            try {
              const comms = await dbService.getComments(data.id);
              setComments(comms || []);
            } catch (e) {
              console.warn('Comments fetch notice:', e);
            }

            try {
              dbService.incrementViews(data.id);
            } catch (e) {
              console.warn('Views increment notice:', e);
            }

            try {
              const relatedRes = await dbService.getTemplates({ category: data.category, limit: 3 });
              setRelatedTemplates((relatedRes.templates || []).filter((t) => t.id !== data.id));
            } catch (e) {
              console.warn('Related templates notice:', e);
            }
          } else {
            addToast('Template not found', 'error');
            navigate('/explore');
          }
        }
      } catch (err) {
        console.error('Error loading template:', err);
        if (isMounted) {
          addToast('Could not load template details: ' + (err.message || 'Unknown error'), 'error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTemplate();
    window.scrollTo(0, 0);
    return () => { isMounted = false; };
  }, [id, navigate]);

  const generatedCode = useMemo(() => {
    if (!template) return { html: '', css: '', js: '' };
    const rawHtml = template.html_code ? String(template.html_code).trim() : '';
    const isStub = !rawHtml || 
      rawHtml.length < 35 || 
      (rawHtml.startsWith('<!--') && rawHtml.endsWith('-->') && !rawHtml.includes('<div') && !rawHtml.includes('<section'));

    if (!isStub) {
      return {
        html: template.html_code,
        css: template.css_code || '',
        js: template.js_code || ''
      };
    }
    return generatePortfolioCode(template.category || template.title, DEFAULT_USER_DATA);
  }, [template]);

  const iframeSrcDoc = useMemo(() => {
    return assemblePreviewHtml(generatedCode.html, generatedCode.css, generatedCode.js, {
      fallbackCategory: template?.category || template?.title || 'Minimal'
    });
  }, [generatedCode, template]);

  const handleLike = async () => {
    if (!template) return;
    const res = await dbService.toggleLike(template.id, user?.id || 'guest');
    setIsLiked(res.hasLiked);
    setLikesCount(res.count);
    if (res.hasLiked) {
      addToast(`Liked "${template.title}"`, 'success');
    }
  };

  const handleFavorite = async () => {
    if (!template) return;
    const fav = await dbService.toggleFavorite(template.id);
    setIsFav(fav);
    addToast(fav ? 'Saved to your favorites' : 'Removed from favorites', 'info');
  };

  const handleDownloadZip = async () => {
    if (!template) return;
    setIsExporting(true);
    try {
      await downloadPortfolioZip({
        html: generatedCode.html,
        css: generatedCode.css,
        js: generatedCode.js,
        zipName: `${template.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-portfolio.zip`,
        authorName: template.creator_name || 'Community Member'
      });
      await dbService.incrementDownloads(template.id);
      confetti({ particleCount: 60, spread: 55 });
      addToast('Portfolio ZIP downloaded successfully', 'success');
    } catch (err) {
      addToast('Download failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    addToast('Code copied to clipboard', 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Direct link copied to clipboard', 'success');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    const added = await dbService.addComment(template.id, {
      user_id: user?.id || 'guest',
      user_name: profile?.username || user?.email?.split('@')[0] || 'Developer Guest',
      user_avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      content: newComment.trim(),
      rating: newRating
    });

    if (added) {
      setComments([added, ...comments]);
      setNewComment('');
      addToast('Community review posted', 'success');
    }
    setSubmittingComment(false);
  };

  if (loading || !template) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#18181B] border-t-[#F59E0B] rounded-full animate-spin" />
          <p className="text-xs font-mono text-[#71717A]">Loading template architecture...</p>
        </div>
      </div>
    );
  }

  const techStack = template.tags 
    ? (Array.isArray(template.tags) ? template.tags.join(' · ') : template.tags)
    : 'HTML5 · CSS3 · Vanilla JS';

  const badgeClass = CATEGORY_BADGE_STYLES[template.category] || CATEGORY_BADGE_STYLES.Default;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* 1. TOP BREADCRUMB & UTILITY ACTIONS */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Back to Catalog</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-md bg-white border border-[#E6E1D6] text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] transition-colors cursor-pointer shadow-2xs"
            title="Share Template"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-md border transition-colors cursor-pointer shadow-2xs ${
              isFav ? 'bg-[#FEF3C7] text-[#D97706] border-[#F59E0B]' : 'bg-white text-[#71717A] hover:text-[#18181B] border-[#E6E1D6] hover:bg-[#F3EFE6]'
            }`}
            title="Favorite"
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#F59E0B]' : ''}`} />
          </button>
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer shadow-2xs ${
              isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-[#E6E1D6] text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{likesCount}</span>
          </button>
        </div>
      </div>

      {/* 2. TEMPLATE HEADER INFORMATION & PRIMARY CTAs */}
      <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeClass}`}>
              {template.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#52525B] bg-[#F3EFE6] border border-[#E6E1D6]">
              {template.difficulty || 'Intermediate'}
            </span>
            {template.is_featured && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F59E0B] text-[#18181B] shadow-2xs">
                FEATURED ENGINE
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
            {template.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            {template.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A] pt-2 border-t border-[#E6E1D6]">
            <div className="flex items-center gap-2">
              <img
                src={template.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-5 h-5 rounded-full object-cover border border-[#E6E1D6]"
              />
              <span className="text-[#18181B] font-semibold">{template.creator_name || 'Community Member'}</span>
            </div>
            <span className="text-[#E6E1D6]">·</span>
            <span className="font-mono text-[11px] text-[#52525B]">{techStack}</span>
            <span className="text-[#E6E1D6]">·</span>
            <span className="font-mono text-[11px] text-[#52525B]">{(template.downloads_count || 0).toLocaleString()} downloads</span>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 lg:w-60">
          <a
            href={`/site/${template.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-4 py-2.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Open Live Portfolio Site</span>
          </a>

          <button
            onClick={handleOpenEditModal}
            className="w-full text-center px-4 py-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#18181B] text-xs font-bold transition-all shadow-2xs border border-[#E6E1D6] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Edit Details & Name</span>
          </button>

          <Link
            to={`/editor?templateId=${template.id}`}
            className="w-full text-center px-4 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Open in Dev Studio</span>
          </Link>

          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="w-full text-center px-4 py-2 rounded-lg bg-white hover:bg-[#F3EFE6] text-[#18181B] text-xs font-semibold border border-[#E6E1D6] hover:border-[#D1CBC0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{isExporting ? 'Packaging ZIP...' : 'Download ZIP export'}</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE BROWSER PREVIEW STAGE */}
      <div className={`bg-white border border-[#E6E1D6] rounded-xl overflow-hidden shadow-2xs ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : ''}`}>
        
        {/* Browser Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E6E1D6] bg-[#FAF8F5]">
          {/* Window dots & Fullsite link */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E1D6] border border-[#D1CBC0]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E1D6] border border-[#D1CBC0]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E1D6] border border-[#D1CBC0]" />
            </div>
            <a 
              href={`/site/${template.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-[#71717A] hover:text-[#D97706] flex items-center gap-1 transition-colors"
              title="Open standalone live website"
            >
              <span>portfoliohub.dev/site/{template.id?.substring(0, 8) || 'preview'}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Viewport & Fullscreen Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F3EFE6] p-0.5 rounded-md border border-[#E6E1D6]">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'desktop' ? 'bg-white text-[#18181B] shadow-2xs font-semibold' : 'text-[#71717A] hover:text-[#18181B]'}`}
                title="Desktop Canvas"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'tablet' ? 'bg-white text-[#18181B] shadow-2xs font-semibold' : 'text-[#71717A] hover:text-[#18181B]'}`}
                title="Tablet Canvas (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${viewport === 'mobile' ? 'bg-white text-[#18181B] shadow-2xs font-semibold' : 'text-[#71717A] hover:text-[#18181B]'}`}
                title="Mobile Canvas (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href={`/site/${template.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] border border-[#E6E1D6] transition-colors cursor-pointer"
              title="Open full-screen portfolio site in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] border border-[#E6E1D6] transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live Preview Canvas Stage */}
        <div className={`bg-[#F3EFE6] p-4 flex justify-center items-center overflow-hidden ${isFullscreen ? 'h-[calc(100vh-42px)]' : 'min-h-[520px]'}`}>
          <div
            className={`bg-white rounded-lg border border-[#E6E1D6] shadow-sm overflow-hidden transition-all duration-200 ${
              isFullscreen ? 'h-full' : 'h-[620px]'
            } ${
              viewport === 'mobile' ? 'w-[375px]' :
              viewport === 'tablet' ? 'w-[768px]' :
              'w-full'
            }`}
          >
            <iframe
              title={template.title}
              srcDoc={iframeSrcDoc}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            />
          </div>
        </div>

      </div>

      {/* 4. DETAILS & CODE TABS SECTION */}
      <div className="bg-white border border-[#E6E1D6] rounded-xl overflow-hidden shadow-2xs">
        
        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#E6E1D6] bg-[#FAF8F5]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#D97706] text-[#18181B]'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'html'
                ? 'border-[#D97706] text-[#18181B]'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            index.html
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'css'
                ? 'border-[#D97706] text-[#18181B]'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            style.css
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'js'
                ? 'border-[#D97706] text-[#18181B]'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            script.js
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#D97706] text-[#18181B]'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Community Reviews ({comments.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-[#18181B] mb-3">Engine Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                    <div className="text-[10px] font-mono text-[#71717A]">STYLE CATEGORY</div>
                    <div className="text-xs font-bold text-[#18181B] mt-0.5">{template.category}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                    <div className="text-[10px] font-mono text-[#71717A]">DIFFICULTY</div>
                    <div className="text-xs font-bold text-[#18181B] mt-0.5">{template.difficulty || 'Intermediate'}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                    <div className="text-[10px] font-mono text-[#71717A]">RUNTIME OVERHEAD</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">0 KB (Static)</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                    <div className="text-[10px] font-mono text-[#71717A]">DEPLOYMENT</div>
                    <div className="text-xs font-bold text-[#18181B] mt-0.5">GitHub / Vercel / Pages</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#18181B] mb-2">Architectural Highlights</h3>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  {template.description} This template is designed with semantic HTML elements, high-performance CSS Grid layouts, and vanilla JS interactions. It requires zero compilation steps and can be hosted completely free on GitHub Pages, Cloudflare Pages, Vercel, or Netlify.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`/generator?template=${template.category || 'Minimal'}`}
                  className="px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all"
                >
                  Generate with this style
                </Link>
                <Link
                  to={`/editor?template=${template.category || 'Minimal'}`}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E6E1D6] hover:bg-[#F3EFE6] text-[#18181B] text-xs font-semibold transition-colors"
                >
                  Open in raw split editor
                </Link>
              </div>
            </div>
          )}

          {/* Raw Code Tabs (HTML, CSS, JS) */}
          {(activeTab === 'html' || activeTab === 'css' || activeTab === 'js') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[#52525B]">
                  {activeTab === 'html' ? 'index.html (Semantic Structure)' : activeTab === 'css' ? 'style.css (Styling & Layout)' : 'script.js (Interactive Logic)'}
                </span>
                <button
                  onClick={() => handleCopyCode(generatedCode[activeTab])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-[#F3EFE6] text-[#18181B] border border-[#E6E1D6] transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#71717A]" />}
                  <span>{copiedCode ? 'Copied' : 'Copy code'}</span>
                </button>
              </div>

              <div className="rounded-lg bg-[#18181B] text-zinc-200 p-4 font-mono text-xs overflow-auto max-h-[500px] border border-zinc-800">
                <pre className="whitespace-pre-wrap leading-relaxed">{generatedCode[activeTab]}</pre>
              </div>
            </div>
          )}

          {/* Community Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              {/* Submission Form */}
              <form onSubmit={handleAddComment} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#18181B]">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewRating(s)}
                        className="p-1 cursor-pointer text-[#71717A] hover:text-[#D97706] transition-colors"
                      >
                        <Star className={`w-4 h-4 ${s <= newRating ? 'fill-[#F59E0B] text-[#D97706]' : 'text-[#D1CBC0]'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="Leave developer feedback or tips for this template..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white border border-[#E6E1D6] text-xs text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#F59E0B]/20"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {submittingComment ? 'Posting...' : 'Post review'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-[#71717A] py-6 text-center">
                    No community reviews yet. Be the first developer to review!
                  </p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={comm.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-[#E6E1D6]"
                          />
                          <span className="text-xs font-bold text-[#18181B]">{comm.user_name}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(comm.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#D97706]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#52525B] leading-relaxed pl-8">
                        {comm.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 5. RELATED TEMPLATES */}
      {relatedTemplates.length > 0 && (
        <div className="border-t border-[#E6E1D6] pt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D97706] mb-1">
                MORE IN THIS CATEGORY
              </div>
              <h3 className="text-base font-bold text-[#18181B]">
                Other {template.category} Portfolios
              </h3>
            </div>
            <Link to={`/explore?category=${template.category}`} className="text-xs font-semibold text-[#18181B] hover:text-[#D97706] transition-colors">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      )}

      {/* 6. EDIT DETAILS & NAME MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E6E1D6] shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E6E1D6] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Customize Template & Personal Info</span>
                </h3>
                <p className="text-[11px] text-[#52525B]">
                  Update your name, headline, bio, or rename this template in the catalog.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#E6E1D6] bg-white px-5 pt-2 gap-2">
              <button
                type="button"
                onClick={() => setEditModalTab('personal')}
                className={`pb-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  editModalTab === 'personal'
                    ? 'border-[#18181B] text-[#18181B]'
                    : 'border-transparent text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Your Personal Details
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab('template')}
                className={`pb-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  editModalTab === 'template'
                    ? 'border-[#18181B] text-[#18181B]'
                    : 'border-transparent text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                Template Name & Metadata
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {editModalTab === 'personal' ? (
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6]">
                    <div className="w-10 h-10 rounded-full bg-[#18181B] text-[#F59E0B] font-bold text-sm flex items-center justify-center shrink-0">
                      {getInitials(personalForm.name)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#18181B]">
                        {personalForm.name || 'Your Name'}
                      </div>
                      <div className="text-[11px] text-[#71717A]">
                        {personalForm.title || 'Professional Title'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Full Name <span className="text-[#D97706]">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalForm.name}
                      onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                      placeholder="e.g. Lakshya Bansal"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Professional Headline / Role
                    </label>
                    <input
                      type="text"
                      value={personalForm.title}
                      onChange={(e) => setPersonalForm({ ...personalForm, title: e.target.value })}
                      placeholder="e.g. Aspiring Engineer & Developer"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      About Me / Bio
                    </label>
                    <textarea
                      rows={3}
                      value={personalForm.bio}
                      onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                      placeholder="Brief background summary..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#71717A]" />
                      <span>Contact Email</span>
                    </label>
                    <input
                      type="email"
                      value={personalForm.email}
                      onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-[#52525B] mb-1 flex items-center gap-1">
                        <Github className="w-3 h-3 text-[#71717A]" />
                        <span>GitHub Profile</span>
                      </label>
                      <input
                        type="url"
                        value={personalForm.github}
                        onChange={(e) => setPersonalForm({ ...personalForm, github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#52525B] mb-1 flex items-center gap-1">
                        <Linkedin className="w-3 h-3 text-[#71717A]" />
                        <span>LinkedIn Profile</span>
                      </label>
                      <input
                        type="url"
                        value={personalForm.linkedin}
                        onChange={(e) => setPersonalForm({ ...personalForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Template Title (Name in Catalog) <span className="text-[#D97706]">*</span>
                    </label>
                    <input
                      type="text"
                      value={templateForm.title}
                      onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                      placeholder="e.g. Lakshya Bansal - Developer Portfolio"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                    <p className="text-[10px] text-[#71717A] mt-0.5">
                      Change this to update how this template appears across the website catalog.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Author / Creator Name
                    </label>
                    <input
                      type="text"
                      value={templateForm.creator_name}
                      onChange={(e) => setTemplateForm({ ...templateForm, creator_name: e.target.value })}
                      placeholder="e.g. Lakshya Bansal"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Category
                    </label>
                    <select
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
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
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                      placeholder="Describe the portfolio..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706] resize-y"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E6E1D6] bg-[#FAF8F5] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="px-5 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{isSavingEdit ? 'Saving Updates...' : 'Save & Apply Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
