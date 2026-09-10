import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Code2, 
  Eye, 
  Check, 
  Image as ImageIcon,
  ArrowRight,
  X,
  Plus,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEMPLATE_CATEGORIES } from '../services/templateEngines.js';
import { dbService } from '../services/dbService.js';
import { assemblePreviewHtml } from '../utils/previewHelper.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function UploadPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Developer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80');
  const [tags, setTags] = useState(['HTML5', 'CSS3', 'JavaScript']);
  const [tagInput, setTagInput] = useState('');
  
  // Code files
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="status-badge">Available for hire</div>
      <h1>Alex Rivera</h1>
      <p class="role">Distributed Systems & Web Platform Engineer</p>
    </header>
    <main class="content">
      <section class="section">
        <h2>Selected Work</h2>
        <div class="project-card">
          <h3>Distributed Cache Proxy</h3>
          <p>High-throughput memory buffer with zero GC pauses and sub-millisecond p99 latency.</p>
        </div>
      </section>
    </main>
  </div>
  <script src="script.js"></script>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #FAF8F5;
  color: #18181B;
  line-height: 1.6;
  padding: 48px 24px;
}
.container {
  max-width: 680px;
  margin: 0 auto;
}
.status-badge {
  display: inline-block;
  font-size: 11px;
  font-family: monospace;
  background: #FEF3C7;
  color: #D97706;
  border: 1px solid #F59E0B;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.header h1 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #18181B;
}
.role {
  color: #52525B;
  font-size: 15px;
  margin-top: 6px;
}
.content {
  margin-top: 40px;
}
.section h2 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #D97706;
  font-family: monospace;
  margin-bottom: 16px;
}
.project-card {
  background: #ffffff;
  border: 1px solid #E6E1D6;
  padding: 20px;
  border-radius: 10px;
}
.project-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #18181B;
}
.project-card p {
  font-size: 13px;
  color: #52525B;
  margin-top: 6px;
}`);

  const [jsCode, setJsCode] = useState(`console.log('Portfolio engine mounted successfully.');`);
  const [codeTab, setCodeTab] = useState('html');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assembled iframe document
  const previewDoc = useMemo(() => {
    return assemblePreviewHtml(htmlCode, cssCode, jsCode, {
      fallbackCategory: category
    });
  }, [htmlCode, cssCode, jsCode, category]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/,/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please provide a title for your template', 'error');
      return;
    }
    if (!htmlCode.trim()) {
      addToast('Please provide HTML code for the template', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTemplate = await dbService.createTemplate({
        title: title.trim(),
        category,
        difficulty,
        description: description.trim() || 'A bespoke community-crafted developer portfolio template.',
        thumbnail_url: thumbnailUrl.trim(),
        tags: tags,
        html_code: htmlCode,
        css_code: cssCode,
        js_code: jsCode,
        creator_id: user?.id || 'guest-creator',
        creator_name: profile?.username || user?.email?.split('@')[0] || 'Community Designer',
        creator_avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      });

      confetti({ particleCount: 100, spread: 60 });
      addToast('Template published successfully to catalog', 'success');
      navigate(`/template/${newTemplate.id}`);
    } catch (err) {
      addToast('Upload failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* 1. TOP HEADER */}
      <div className="border-b border-[#E6E1D6] pb-6">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D97706] mb-1">
          COMMUNITY / CONTRIBUTIONS
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
          Publish Portfolio Template
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] mt-1.5">
          Contribute lightweight, accessible, zero-build static portfolio architectures to the developer community.
        </p>
      </div>

      {/* 2. FORM BODY */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Fields Card */}
        <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#18181B] border-b border-[#E6E1D6] pb-2.5">
            Template Specifications
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
              Template Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Minimalist Mono Developer Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#F59E0B]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe the aesthetic direction, layout techniques, and recommended developer archetype..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#F59E0B]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Category Engine
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706] cursor-pointer"
              >
                {TEMPLATE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] bg-white focus:outline-none focus:border-[#D97706] cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Tags Chips Input */}
          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
              Tags & Tech Stack
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Type tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] focus:outline-none focus:border-[#D97706]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#18181B] border border-[#E6E1D6] text-xs font-semibold transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FAF8F5] border border-[#E6E1D6] text-[#18181B]"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-[#71717A] hover:text-[#18181B] cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
              Preview Screenshot URL
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6E1D6] text-[#18181B] focus:outline-none focus:border-[#D97706]"
            />
            {thumbnailUrl && (
              <div className="mt-3 aspect-[16/9] max-w-sm rounded-lg overflow-hidden border border-[#E6E1D6] bg-[#FAF8F5]">
                <img 
                  src={thumbnailUrl} 
                  alt="Template Thumbnail Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 3. CODE INPUT SECTION */}
        <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 sm:p-7 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-3">
            <h2 className="text-sm font-bold text-[#18181B]">
              Source Architecture
            </h2>
            <div className="flex items-center gap-1 bg-[#F3EFE6] p-0.5 rounded-lg border border-[#E6E1D6]">
              {['html', 'css', 'js'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer transition-colors ${
                    codeTab === tab ? 'bg-white text-[#18181B] font-bold shadow-2xs' : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  {tab === 'html' ? 'index.html' : tab === 'css' ? 'style.css' : 'script.js'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#18181B] p-4 text-zinc-200 border border-zinc-800">
            {codeTab === 'html' && (
              <textarea
                rows={12}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full bg-transparent font-mono text-xs text-zinc-200 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            )}
            {codeTab === 'css' && (
              <textarea
                rows={12}
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full bg-transparent font-mono text-xs text-zinc-200 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            )}
            {codeTab === 'js' && (
              <textarea
                rows={12}
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full bg-transparent font-mono text-xs text-zinc-200 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* 4. OPTIONAL LIVE TEST MODAL / EXPAND */}
        {showPreview && (
          <div className="bg-white border border-[#E6E1D6] rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#18181B]">Live Render Simulation</span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-[#71717A] hover:text-[#18181B] cursor-pointer font-medium"
              >
                Close Canvas
              </button>
            </div>
            <div className="border border-[#E6E1D6] rounded-lg h-[420px] overflow-hidden bg-white shadow-inner">
              <iframe
                title="Upload Preview"
                srcDoc={previewDoc}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-forms allow-modals"
              />
            </div>
          </div>
        )}

        {/* 5. ACTION BUTTONS */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2.5 rounded-lg bg-white border border-[#E6E1D6] text-[#18181B] text-xs font-semibold hover:bg-[#F3EFE6] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#71717A]" />
            <span>{showPreview ? 'Hide preview' : 'Preview code render'}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
          >
            <span>{isSubmitting ? 'Publishing...' : 'Publish to Catalog'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>

    </div>
  );
}
