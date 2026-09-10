import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, ExternalLink, Star, ArrowUpRight, Wand2 } from 'lucide-react';
import { dbService } from '../../services/dbService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

// Color map for categories to give strategic color identity without AI slop
export const CATEGORY_BADGE_STYLES = {
  Developer: 'bg-blue-50 text-blue-700 border-blue-200',
  Minimal: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  Bento: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Terminal: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Neumorphic: 'bg-slate-100 text-slate-800 border-slate-300',
  'Retro Arcade': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  Editorial: 'bg-stone-100 text-stone-800 border-stone-300',
  Aurora: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  Blueprint: 'bg-sky-50 text-sky-800 border-sky-300',
  Kinetic: 'bg-amber-50 text-amber-900 border-amber-300',
  'Card Deck': 'bg-violet-50 text-violet-700 border-violet-200',
  Holographic: 'bg-pink-50 text-pink-700 border-pink-200',
  'Deep Space': 'bg-purple-50 text-purple-800 border-purple-200',
  Origami: 'bg-orange-50 text-orange-800 border-orange-200',
  Creative: 'bg-purple-50 text-purple-700 border-purple-200',
  Student: 'bg-amber-50 text-amber-800 border-amber-200',
  Corporate: 'bg-slate-100 text-slate-700 border-slate-200',
  Designer: 'bg-rose-50 text-rose-700 border-rose-200',
  Luxury: 'bg-amber-100 text-amber-900 border-amber-300',
  Cyberpunk: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  Photographer: 'bg-teal-50 text-teal-800 border-teal-200',
  Dark: 'bg-zinc-800 text-zinc-100 border-zinc-700',
  '3D': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Default: 'bg-zinc-100 text-zinc-700 border-zinc-200'
};

export default function TemplateCard({ template, onLikeChange }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [likesCount, setLikesCount] = useState(template.likes_count || 0);
  const [isLiked, setIsLiked] = useState(dbService.isLiked(template.id));
  const [isFav, setIsFav] = useState(dbService.isFavorite(template.id));

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFav = await dbService.toggleFavorite(template.id);
    setIsFav(newFav);
    addToast(newFav ? `Added "${template.title}" to saved` : `Removed from saved`, 'info');
  };

  const handleUseTemplate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (template.id && !template.id.startsWith('tmpl-')) {
      navigate(`/editor?templateId=${template.id}`);
    } else {
      navigate(`/generator?template=${template.category || 'Minimal'}`);
    }
  };

  // Tech stack string
  const tagsList = Array.isArray(template.tags) 
    ? template.tags.slice(0, 3) 
    : (template.tags ? template.tags.split(',').map(t => t.trim()).slice(0, 3) : ['HTML5', 'CSS3']);

  const badgeClass = CATEGORY_BADGE_STYLES[template.category] || CATEGORY_BADGE_STYLES.Default;

  return (
    <div className="group bg-white border border-[#E6E1D6] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D1CBC0] hover:-translate-y-1.5 hover:shadow-xl">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3EFE6] border-b border-[#E6E1D6]">
        {/* Link wrapping only the thumbnail image */}
        <Link 
          to={`/template/${template.id}`} 
          className="block w-full h-full"
          aria-label={`View ${template.title}`}
        >
          <img
            src={template.thumbnail_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
            alt={template.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-transform duration-200 group-hover:scale-105 ${badgeClass}`}>
              {template.category}
            </span>
            {template.is_featured && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F59E0B] text-[#18181B] shadow-2xs">
                FEATURED
              </span>
            )}
          </div>

          <button
            onClick={handleFavorite}
            className={`p-1.5 rounded-md bg-white/90 backdrop-blur-sm border border-[#E6E1D6] transition-all duration-200 pointer-events-auto cursor-pointer shadow-2xs hover:scale-110 active:scale-95 ${
              isFav ? 'text-[#D97706]' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
            title={isFav ? 'Saved' : 'Save to favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#F59E0B] text-[#D97706]' : ''}`} />
          </button>
        </div>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 pointer-events-auto z-10">
          <button
            onClick={handleUseTemplate}
            className="flex-1 py-1.5 px-3 rounded-md bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{template.id && !template.id.startsWith('tmpl-') ? 'Open in Editor' : 'Use template'}</span>
          </button>
          
          <a 
            href={`/site/${template.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-1.5 px-2.5 rounded-md bg-white hover:bg-[#F3EFE6] text-[#18181B] text-xs font-semibold border border-[#E6E1D6] transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Open live site in new tab"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-[#D97706]" />
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tech stack chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {tagsList.map((tag) => (
              <span 
                key={tag} 
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F3EFE6] text-[#52525B] border border-[#E6E1D6]"
              >
                {tag}
              </span>
            ))}
            <span className="text-[10px] font-mono text-[#71717A] ml-auto">
              {template.difficulty || 'All Levels'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/template/${template.id}`} className="block text-[#18181B] hover:text-[#D97706] transition-colors">
            <h3 className="text-sm font-semibold tracking-tight line-clamp-1">
              {template.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-[#52525B] mt-1.5 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Footer info: Creator & stats */}
        <div className="mt-4 pt-2.5 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#71717A]">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={template.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={template.creator_name}
              className="w-4 h-4 rounded-full object-cover border border-[#E6E1D6]"
            />
            <span className="text-[11px] text-[#52525B] truncate max-w-[110px]">
              {template.creator_name || 'Community'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1" title="Downloads">
              <Download className="w-3 h-3 text-[#71717A]" />
              <span>{template.downloads_count || 0}</span>
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              <span>{likesCount}</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
