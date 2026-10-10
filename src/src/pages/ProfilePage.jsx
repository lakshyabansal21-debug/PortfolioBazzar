/**
 * ProfilePage.jsx: The signed-in user's profile: their uploads, favorites and basic stats; edit username and bio.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Star,
  Download,
  Edit3,
  Plus,
  Clock
} from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar.js';
import { isSupabaseConfigured } from '../supabase/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { dbService } from '../services/dbService.js';
import { useToast } from '../context/ToastContext.jsx';
import TemplateCard from '../components/common/TemplateCard.jsx';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' | 'favorites' | 'activity'
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [uploadedTemplates, setUploadedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(profile?.username || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [editAvatar, setEditAvatar] = useState(profile?.avatar_url || '');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const allRes = await dbService.getTemplates({ limit: 1000 });
      const all = allRes.templates || [];

      // Filter favorites
      const favs = all.filter(t => dbService.isFavorite(t.id, user?.id));
      setFavoriteTemplates(favs);

      // Filter uploads
      // Supabase rows store the owner in `user_id`, local uploads in `creator_id`
      const uploads = user ? all.filter(t => t.creator_id === user.id || t.user_id === user.id) : [];
      setUploadedTemplates(uploads);

      setLoading(false);
    }
    loadData();
  }, [user, profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      username: editUsername.trim(),
      bio: editBio.trim(),
      avatar_url: editAvatar.trim()
    });
    setIsEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || 'Developer';
  const displayUsername = user?.email?.split('@')[0] || 'dev';
  const displayAvatar = getAvatarUrl(profile?.avatar_url, displayName);

  const totalDownloads = uploadedTemplates.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);
  // "stars" = likes received on the templates I published
  const totalStars = uploadedTemplates.reduce((acc, curr) => acc + (curr.likes_count || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-white border border-line rounded-xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-line shadow-2xs"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  {displayName}
                </h1>
                <span className="font-mono text-xs text-pencil">@{displayUsername}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {isSupabaseConfigured ? 'Cloud account' : 'Saved on this device'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-soft max-w-xl leading-relaxed">
                {profile?.bio || 'No bio yet. Use "Edit profile" to add one.'}
              </p>

              {/* Social & Contact Links */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-soft">
                <span className="flex items-center gap-1.5 text-pencil">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email || 'No email'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-lg border border-line bg-white text-ink hover:bg-paper-2 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-pencil" />
            <span>{isEditing ? 'Cancel' : 'Edit profile'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-5 border-t border-line space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Display Name</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Bio / Headline</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-line text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Save profile
              </button>
            </div>
          </form>
        )}

        {/* 2. STATS ROW */}
        <div className="pt-5 border-t border-line flex flex-wrap items-center gap-8 text-xs">
          <div>
            <span className="font-bold text-sm text-ink mr-1.5">
              {uploadedTemplates.length}
            </span>
            <span className="text-soft">Published templates</span>
          </div>
          <div>
            <span className="font-bold text-sm text-ink mr-1.5">
              {totalDownloads}
            </span>
            <span className="text-soft">Community downloads</span>
          </div>
          <div>
            <span className="font-bold text-sm text-ink mr-1.5">
              {totalStars}
            </span>
            <span className="text-soft">Total stars</span>
          </div>
        </div>

      </div>

      {/* 3. TABS */}
      <div className="flex items-center gap-1 border-b border-line pb-1">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'uploads'
              ? 'border-accent text-ink'
              : 'border-transparent text-pencil hover:text-ink'
          }`}
        >
          Uploaded Templates ({uploadedTemplates.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'favorites'
              ? 'border-accent text-ink'
              : 'border-transparent text-pencil hover:text-ink'
          }`}
        >
          Saved Favorites ({favoriteTemplates.length})
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'activity'
              ? 'border-accent text-ink'
              : 'border-transparent text-pencil hover:text-ink'
          }`}
        >
          Activity Log
        </button>
      </div>

      {/* 4. TAB PANELS */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-pencil">Loading profile catalog...</div>
      ) : activeTab === 'uploads' ? (
        uploadedTemplates.length === 0 ? (
          <div className="py-16 text-center bg-white border border-line rounded-xl p-8 space-y-3 shadow-2xs">
            <h3 className="text-sm font-bold text-ink">No templates published yet</h3>
            <p className="text-xs text-soft max-w-sm mx-auto leading-relaxed">
              Contribute custom portfolio layouts and architectures to the open developer ecosystem.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hl hover:bg-accent text-ink hover:text-white text-xs font-bold transition-all shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish first template</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )
      ) : activeTab === 'favorites' ? (
        favoriteTemplates.length === 0 ? (
          <div className="py-16 text-center bg-white border border-line rounded-xl p-8 space-y-3 shadow-2xs">
            <h3 className="text-sm font-bold text-ink">No saved templates</h3>
            <p className="text-xs text-soft max-w-sm mx-auto leading-relaxed">
              Star templates in the Catalog to save and quickly access them here.
            </p>
            <Link
              to="/explore"
              className="inline-block px-4 py-2 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )
      ) : (
        /* Activity Tab */
        <div className="bg-white border border-line rounded-xl p-6 sm:p-7 space-y-4 shadow-2xs">
          <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
            Recent Account Milestones
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 py-2.5 border-b border-line">
              <Clock className="w-4 h-4 text-pencil" />
              <div className="flex-1">
                <span className="font-semibold text-ink">Signed into PortfolioHub</span>
                <span className="text-pencil ml-2 font-mono text-[11px]">Today</span>
              </div>
            </div>

            {favoriteTemplates.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-line">
                <Star className="w-4 h-4 fill-hl text-accent" />
                <div className="flex-1">
                  <span className="text-soft">Starred template </span>
                  <Link to={`/template/${t.id}`} className="font-bold text-ink hover:underline">
                    {t.title}
                  </Link>
                  <span className="text-pencil ml-2 font-mono text-[11px]">({t.category})</span>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 py-2.5">
              <Download className="w-4 h-4 text-pencil" />
              <div className="flex-1">
                <span className="font-semibold text-ink">Downloaded standalone portfolio ZIP bundle</span>
                <span className="text-pencil ml-2 font-mono text-[11px]">Recent</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
