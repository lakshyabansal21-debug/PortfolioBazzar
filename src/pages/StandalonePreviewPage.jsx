/**
 * StandalonePreviewPage.jsx: Full-screen preview of one portfolio (/site/:id and /preview/:id) with device size buttons and download.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  Download,
  Monitor,
  Tablet,
  Smartphone,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { dbService } from '../services/dbService.js';
import { assemblePreviewHtml } from '../utils/previewHelper.js';
import { downloadPortfolioZip } from '../utils/zipExport.js';
import { useToast } from '../context/ToastContext.jsx';
import confetti from 'canvas-confetti';

export default function StandalonePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [isBarCollapsed, setIsBarCollapsed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchTemplate() {
      setLoading(true);
      try {
        const data = await dbService.getTemplateById(id);
        if (isMounted) {
          if (data) {
            setTemplate(data);
            try {
              dbService.incrementViews(data.id);
            } catch (e) {}
          } else {
            addToast('Template not found', 'error');
            navigate('/explore');
          }
        }
      } catch (err) {
        console.error('Failed to load standalone preview template:', err);
        if (isMounted) {
          addToast('Could not load portfolio preview: ' + (err.message || 'Unknown error'), 'error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTemplate();
    return () => { isMounted = false; };
  }, [id, navigate]);

  const iframeSrcDoc = useMemo(() => {
    if (!template) return '';
    return assemblePreviewHtml(template.html_code, template.css_code, template.js_code, {
      fallbackCategory: template.category || template.title || 'Minimal'
    });
  }, [template]);

  const handleDownload = async () => {
    if (!template) return;
    setIsExporting(true);
    try {
      await downloadPortfolioZip({
        html: template.html_code,
        css: template.css_code,
        js: template.js_code,
        zipName: `${(template.title || 'portfolio').toLowerCase().replace(/[^a-z0-9]/g, '-')}-site.zip`,
        authorName: template.creator_name || 'Community Member'
      });
      try {
        await dbService.incrementDownloads(template.id);
      } catch (e) {}
      confetti({ particleCount: 50, spread: 60 });
      addToast('Portfolio website ZIP downloaded successfully', 'success');
    } catch (err) {
      addToast('Download failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-paper flex flex-col items-center justify-center z-50">
        <div className="w-10 h-10 border-3 border-ink border-t-hl rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-soft">Booting live portfolio preview stage...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="fixed inset-0 bg-paper flex flex-col items-center justify-center p-6 text-center z-50">
        <h2 className="text-xl font-bold text-ink mb-2">Portfolio Template Not Found</h2>
        <p className="text-sm text-pencil mb-6 max-w-md">The requested portfolio site could not be found or has been moved.</p>
        <Link 
          to="/explore"
          className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-ink-2 transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-ink overflow-hidden select-none">
      
      {/* 1. TOP FLOATING CONTROL BAR */}
      <div className={`transition-all duration-300 ease-in-out border-b border-ink-2 bg-ink/95 backdrop-blur-md text-white px-4 py-2.5 z-50 flex items-center justify-between shrink-0 shadow-md ${
        isBarCollapsed ? '-mt-14 opacity-0 pointer-events-none' : 'mt-0 opacity-100'
      }`}>
        
        {/* Left: Back Link & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/template/${template.id}`}
            className="p-1.5 rounded-lg bg-ink-2 hover:bg-ink-2 text-mist hover:text-white transition-colors"
            title="Back to Template Details"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {template.title}
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-ink-2 text-hl border border-ink-2 shrink-0">
                {template.category}
              </span>
            </div>
            <p className="text-[10px] text-mist truncate">
              By {template.creator_name || 'Community Member'} · Live Preview
            </p>
          </div>
        </div>

        {/* Center: Viewport Controls (Desktop, Tablet, Mobile) */}
        <div className="hidden md:flex items-center bg-ink-2 p-0.5 rounded-lg border border-ink-2">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-ink-2 text-white font-semibold' : 'text-mist hover:text-white'
            }`}
            title="Desktop Canvas"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-ink-2 text-white font-semibold' : 'text-mist hover:text-white'
            }`}
            title="Tablet Canvas (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-ink-2 text-white font-semibold' : 'text-mist hover:text-white'
            }`}
            title="Mobile Canvas (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/editor?templateId=${template.id}`}
            className="px-3 py-1.5 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in Dev Studio</span>
            <span className="sm:hidden">Edit</span>
          </Link>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-lg bg-ink-2 hover:bg-ink-2 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-ink-2"
            title="Download ZIP"
          >
            <Download className="w-3.5 h-3.5 text-hl" />
            <span className="hidden sm:inline">{isExporting ? 'Packaging...' : 'Download ZIP'}</span>
          </button>

          <button
            onClick={() => setIsBarCollapsed(true)}
            className="p-1.5 rounded-lg text-mist hover:text-white hover:bg-ink-2 transition-colors cursor-pointer"
            title="Collapse toolbar"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Re-Open Button when toolbar collapsed */}
      {isBarCollapsed && (
        <button
          onClick={() => setIsBarCollapsed(false)}
          className="fixed top-3 right-3 z-50 p-2 rounded-full bg-ink/80 hover:bg-ink text-white border border-ink-2 shadow-lg backdrop-blur-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-1 text-xs font-mono"
          title="Show preview controls"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Controls</span>
        </button>
      )}

      {/* 2. FULL CANVAS IFRAME STAGE */}
      <div className="flex-1 w-full h-full flex justify-center items-center overflow-hidden bg-ink">
        <div
          className={`h-full bg-white transition-all duration-300 shadow-2xl overflow-hidden ${
            viewport === 'mobile' ? 'w-[375px] my-auto rounded-md' :
            viewport === 'tablet' ? 'w-[768px] my-auto rounded-md' :
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
  );
}
