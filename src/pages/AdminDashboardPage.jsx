import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Layers, 
  Download, 
  Star, 
  Trash2, 
  Eye, 
  Database,
  Plus,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  FileCode,
  X
} from 'lucide-react';
import { dbService } from '../services/dbService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORY_BADGE_STYLES } from '../components/common/TemplateCard.jsx';

export default function AdminDashboardPage() {
  const { isSupabaseConfigured } = useAuth();
  const { addToast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadAll() {
    setLoading(true);
    const res = await dbService.getTemplates({ limit: 100 });
    setTemplates(res.templates || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    try {
      const result = await dbService.syncAllStylesToSupabase();
      if (result.success) {
        addToast(result.message || 'All 24 styles synchronized to Supabase!', 'success');
        await loadAll();
      } else {
        addToast(result.error || result.message || 'Could not sync to Supabase', 'error');
      }
    } catch (e) {
      addToast('Sync failed: ' + e.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleCopySql = () => {
    const sql = dbService.generateSupabaseSqlSeedScript();
    navigator.clipboard.writeText(sql);
    setCopied(true);
    addToast('Supabase SQL seed script copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    await dbService.updateTemplate(id, { is_featured: !currentFeatured });
    setTemplates(templates.map(t => t.id === id ? { ...t, is_featured: !currentFeatured } : t));
    addToast(`Template ${!currentFeatured ? 'promoted to Featured' : 'reverted to Standard'}`, 'info');
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently remove "${title}" from the platform catalog?`)) return;
    await dbService.deleteTemplate(id);
    setTemplates(templates.filter(t => t.id !== id));
    addToast(`Deleted "${title}"`, 'success');
  };

  const totalDownloads = templates.reduce((acc, t) => acc + (t.downloads_count || 0), 0);
  const totalLikes = templates.reduce((acc, t) => acc + (t.likes_count || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1D6] pb-6">
        <div>
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D97706] mb-1">
            CONTROL PLANE / GOVERNANCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Manage public portfolio templates, feature curation, and monitor database telemetry.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload template</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">Active Templates</div>
          <p className="text-2xl font-bold text-[#18181B]">{templates.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">Total Downloads</div>
          <p className="text-2xl font-bold text-[#18181B]">{totalDownloads.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">Community Stars</div>
          <p className="text-2xl font-bold text-[#18181B]">{totalLikes.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">Storage Engine</div>
          <p className="text-xs font-bold text-[#18181B] pt-2">
            {isSupabaseConfigured ? 'Supabase Postgres (Cloud)' : 'Local Engine (IndexedDB)'}
          </p>
        </div>
      </div>

      {/* Supabase Styles Cloud Sync Panel */}
      <div className="p-5 rounded-xl bg-white border border-[#E6E1D6] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#18181B]">Supabase Styles Synchronization</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                  isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSupabaseConfigured ? 'Connected' : 'Standalone / Local'}
                </span>
              </div>
              <p className="text-xs text-[#52525B] mt-0.5">
                Populate all 24 production portfolio styles, responsive layouts, and CSS engines into your Supabase database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSqlModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E1D6] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#18181B] text-xs font-medium cursor-pointer transition-colors shadow-2xs"
            >
              <FileCode className="w-3.5 h-3.5 text-[#71717A]" />
              <span>View / Copy SQL</span>
            </button>

            <button
              onClick={handleSyncToSupabase}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing to Supabase...' : 'Sync 24 Styles to Supabase'}</span>
            </button>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6] text-xs text-[#71717A] flex items-center justify-between">
            <span>Notice: Connect your Supabase project keys in <code>.env</code> (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) to sync directly, or run the pre-built SQL migration.</span>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-[#D97706] hover:underline font-mono text-[11px] whitespace-nowrap ml-2 font-semibold"
            >
              Open SQL script →
            </button>
          </div>
        )}
      </div>

      {/* SQL Script Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#E6E1D6] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#E6E1D6] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#D97706]" />
                <h3 className="font-bold text-sm text-[#18181B]">Supabase SQL Seed Script (24 Styles)</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#E6E1D6]/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-[#18181B] bg-[#FAF8F5] max-h-[60vh] border-b border-[#E6E1D6]">
              <pre className="whitespace-pre-wrap leading-relaxed">{dbService.generateSupabaseSqlSeedScript()}</pre>
            </div>

            <div className="p-4 flex items-center justify-between bg-white">
              <p className="text-[11px] text-[#71717A]">
                Copy & paste directly into your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#D97706] underline">Supabase SQL Editor</a>.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-3 py-2 rounded-lg border border-[#E6E1D6] text-xs font-medium text-[#71717A] hover:text-[#18181B] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white border border-[#E6E1D6] rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-[#E6E1D6] flex items-center justify-between bg-[#FAF8F5]">
          <h2 className="text-xs font-mono font-bold text-[#18181B] uppercase tracking-wider">
            Template Catalog ({templates.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#52525B]">
            <thead className="bg-[#FAF8F5] uppercase text-[10px] font-mono text-[#71717A] border-b border-[#E6E1D6]">
              <tr>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Promotion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1D6]">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={t.thumbnail_url}
                      alt=""
                      className="w-10 h-8 rounded object-cover border border-[#E6E1D6]"
                    />
                    <div>
                      <p className="font-bold text-[#18181B]">{t.title}</p>
                      <p className="text-[10px] text-[#71717A]">by {t.creator_name}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#18181B]">{t.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F3EFE6] text-[#18181B] border border-[#E6E1D6]">
                      {t.difficulty || 'Intermediate'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#18181B]">{(t.downloads_count || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFeatured(t.id, t.is_featured)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        t.is_featured
                          ? 'bg-[#F59E0B] text-[#18181B] shadow-2xs border border-[#D97706]'
                          : 'bg-[#FAF8F5] border border-[#E6E1D6] text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      {t.is_featured ? '★ FEATURED' : 'STANDARD'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <Link
                      to={`/template/${t.id}`}
                      className="inline-block p-1.5 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#F3EFE6] border border-[#E6E1D6] shadow-2xs"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id, t.title)}
                      className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer shadow-2xs"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
