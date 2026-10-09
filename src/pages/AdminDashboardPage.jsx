/**
 * AdminDashboardPage.jsx: Admin-only page: real platform numbers, feature / delete templates, sync built-in templates to Supabase.
 */
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { 
  ShieldCheck, 
  Layers, 
  Download, 
  Star, 
  Trash2, 
  Eye, 
=======
import {
  Trash2,
  Eye,
>>>>>>> a6a0a74 (Update website content and layout)
  Database,
  Plus,
  RefreshCw,
  Copy,
  Check,
  FileCode,
  X
} from 'lucide-react';
import { dbService } from '../services/dbService.js';
import { SEED_TEMPLATES } from '../data/seedTemplates.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function AdminDashboardContent() {
  const { isSupabaseConfigured } = useAuth();
  const { addToast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null); // real numbers from dbService.getPlatformStats()
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [res, platformStats] = await Promise.all([
      dbService.getTemplates({ limit: 1000, sort: 'newest' }),
      dbService.getPlatformStats()
    ]);
    setTemplates(res.templates || []);
    setStats(platformStats);
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
        addToast(result.message, 'success');
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
    setStats(await dbService.getPlatformStats());
    addToast(`Deleted "${title}"`, 'success');
  };

  const builtInCount = SEED_TEMPLATES.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-soft mt-1">
            Manage public portfolio templates, feature curation, and monitor database telemetry.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload template</span>
        </Link>
      </div>

<<<<<<< HEAD
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-line space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-pencil uppercase tracking-wider">Active Templates</div>
          <p className="text-2xl font-bold text-ink">{templates.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-line space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-pencil uppercase tracking-wider">Total Downloads</div>
          <p className="text-2xl font-bold text-ink">{totalDownloads.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-line space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-pencil uppercase tracking-wider">Community Stars</div>
          <p className="text-2xl font-bold text-ink">{totalLikes.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-line space-y-1 shadow-2xs">
          <div className="text-[10px] font-mono text-pencil uppercase tracking-wider">Storage Engine</div>
          <p className="text-xs font-bold text-ink pt-2">
            {isSupabaseConfigured ? 'Supabase Postgres (Cloud)' : 'Local Engine (IndexedDB)'}
          </p>
=======
      {/* Metrics Row (real numbers, calculated from the data) */}
      {loading && !stats && <p className="text-xs text-pencil">Loading statistics...</p>}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-white border border-line space-y-1">
            <div className="text-[10px] text-pencil">Templates</div>
            <p className="text-2xl font-bold text-ink">{stats.totalTemplates}</p>
            <p className="text-[10px] text-pencil">{stats.builtInTemplates} built-in, {stats.communityTemplates} community</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-line space-y-1">
            <div className="text-[10px] text-pencil">Downloads</div>
            <p className="text-2xl font-bold text-ink">{stats.totalDownloads.toLocaleString()}</p>
            <p className="text-[10px] text-pencil">{stats.totalViews.toLocaleString()} views</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-line space-y-1">
            <div className="text-[10px] text-pencil">Likes</div>
            <p className="text-2xl font-bold text-ink">{stats.totalLikes.toLocaleString()}</p>
            <p className="text-[10px] text-pencil">{stats.totalRemixes.toLocaleString()} remixes</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-line space-y-1">
            <div className="text-[10px] text-pencil">
              {stats.registeredUsers !== null ? 'Registered users' : 'Contributors'}
            </div>
            <p className="text-2xl font-bold text-ink">
              {(stats.registeredUsers !== null ? stats.registeredUsers : stats.contributors).toLocaleString()}
            </p>
            <p className="text-[10px] text-pencil">
              {stats.registeredUsers !== null ? `${stats.contributors} published a template` : 'Connect Supabase to count users'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-line space-y-1">
            <div className="text-[10px] text-pencil">Storage</div>
            <p className="text-xs font-bold text-ink pt-2">
              {stats.storage === 'cloud' ? 'Supabase (cloud)' : 'This browser (localStorage)'}
            </p>
          </div>
>>>>>>> a6a0a74 (Update website content and layout)
        </div>
      )}

      {/* Supabase Styles Cloud Sync Panel */}
      <div className="p-5 rounded-xl bg-white border border-line shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-ink">Supabase Styles Synchronization</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                  isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSupabaseConfigured ? 'Connected' : 'Standalone / Local'}
                </span>
              </div>
              <p className="text-xs text-soft mt-0.5">
<<<<<<< HEAD
                Populate all 24 production portfolio styles, responsive layouts, and CSS engines into your Supabase database.
=======
                Populate all {builtInCount} built-in portfolio styles into your Supabase database.
>>>>>>> a6a0a74 (Update website content and layout)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSqlModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-paper hover:bg-paper-2 text-ink text-xs font-medium cursor-pointer transition-colors shadow-2xs"
            >
              <FileCode className="w-3.5 h-3.5 text-pencil" />
              <span>View / Copy SQL</span>
            </button>

            <button
              onClick={handleSyncToSupabase}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing to Supabase...' : `Sync ${builtInCount} Styles to Supabase`}</span>
            </button>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3 rounded-lg bg-paper border border-line text-xs text-pencil flex flex-wrap items-center justify-between gap-2">
            <span>Notice: Connect your Supabase project keys in <code>.env</code> (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) to sync directly, or run the pre-built SQL migration.</span>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-accent hover:underline font-mono text-[11px] whitespace-nowrap font-semibold"
            >
              Open SQL script →
            </button>
          </div>
        )}
      </div>

      {/* SQL Script Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-line max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-accent" />
<<<<<<< HEAD
                <h3 className="font-bold text-sm text-ink">Supabase SQL Seed Script (24 Styles)</h3>
=======
                <h3 className="font-bold text-sm text-ink">Supabase SQL Seed Script ({builtInCount} Styles)</h3>
>>>>>>> a6a0a74 (Update website content and layout)
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-md text-pencil hover:text-ink hover:bg-line/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-ink bg-paper max-h-[60vh] border-b border-line">
              <pre className="whitespace-pre-wrap leading-relaxed">{dbService.generateSupabaseSqlSeedScript()}</pre>
            </div>

            <div className="p-4 flex items-center justify-between bg-white">
              <p className="text-[11px] text-pencil">
                Copy & paste directly into your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-accent underline">Supabase SQL Editor</a>.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-3 py-2 rounded-lg border border-line text-xs font-medium text-pencil hover:text-ink cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white border border-line rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-line flex items-center justify-between bg-paper">
          <h2 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
            Template Catalog ({templates.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-soft">
            <thead className="bg-paper uppercase text-[10px] font-mono text-pencil border-b border-line">
              <tr>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Promotion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-paper transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={t.thumbnail_url}
                      alt=""
                      className="w-10 h-8 rounded object-cover border border-line"
                    />
                    <div>
                      <p className="font-bold text-ink">{t.title}</p>
                      <p className="text-[10px] text-pencil">by {t.creator_name}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-ink">{t.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-2 text-ink border border-line">
                      {t.difficulty || 'Intermediate'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-ink">{(t.downloads_count || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFeatured(t.id, t.is_featured)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        t.is_featured
                          ? 'bg-hl text-ink shadow-2xs border border-accent'
                          : 'bg-paper border border-line text-pencil hover:text-ink hover:bg-paper-2'
                      }`}
                    >
                      {t.is_featured ? '★ FEATURED' : 'STANDARD'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <Link
                      to={`/template/${t.id}`}
                      className="inline-block p-1.5 rounded-md text-pencil hover:text-ink hover:bg-paper-2 border border-line shadow-2xs"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    {dbService.isBuiltIn(t.id) ? (
                      <span className="inline-block px-2 py-1 text-[10px] text-pencil" title="Built-in templates come from the code and cannot be deleted">
                        Built-in
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer shadow-2xs"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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

/**
 * Gate for the admin page: only a signed-in admin can see the dashboard
 * (and therefore the delete / feature buttons). Everyone else goes back home.
 */
export default function AdminDashboardPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-pencil">Checking access…</div>;
  }
  if (!isAdmin) return <Navigate to="/" replace />;

  return <AdminDashboardContent />;
}
