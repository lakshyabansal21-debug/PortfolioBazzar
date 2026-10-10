/**
 * TemplateCard.jsx: One template card used in grids: thumbnail, badges, buttons, tags, creator and counters.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  ExternalLink,
  Star,
  Wand2
} from 'lucide-react';
import { dbService } from '../../services/dbService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useTilt from '../../hooks/useTilt.js';
import { getAvatarUrl } from '../../utils/avatar.js';
import { DEFAULT_THUMBNAIL } from '../../config/siteConfig.js';

// One calm badge style for every category (the thumbnail already carries the colour)
const CATEGORY_NAMES = [
  'Developer', 'Minimal', 'Bento', 'Terminal', 'Neumorphic', 'Retro Arcade', 'Editorial', 'Aurora',
  'Blueprint', 'Kinetic', 'Card Deck', 'Holographic', 'Deep Space', 'Origami', 'Creative', 'Student',
  'Corporate', 'Designer', 'Luxury', 'Cyberpunk', 'Photographer', 'Dark', '3D'
];
export const CATEGORY_BADGE_STYLES = Object.fromEntries([
  ...CATEGORY_NAMES.map((name) => [name, 'bg-white text-ink border-line-2']),
  ['Default', 'bg-white text-ink border-line-2']
]);

/** One template in a grid: thumbnail, badges, "Use template" and "Live Site" buttons, tags, creator, counters. */
export default function TemplateCard({ template, index = 0, scrollReveal = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const likesCount = template.likes_count || 0;
  const [isFav, setIsFav] = useState(dbService.isFavorite(template.id, user?.id));
  const tiltRef = useTilt(5);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFav = await dbService.toggleFavorite(template.id, user?.id);
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
    <div
      className={`sheet-stack h-full ${scrollReveal ? '' : 'card-in'}`}
      style={{ '--i': Math.min(index, 8), '--d': `${(index % 3) * 90}ms` }}
      {...(scrollReveal ? { 'data-reveal': '' } : {})}
    >
    <div ref={tiltRef} className="tilt group h-full bg-white border border-line rounded-xl overflow-hidden flex flex-col hover:border-line-2">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-2 border-b border-line">
        {/* Link wrapping only the thumbnail image */}
        <Link 
          to={`/template/${template.id}`} 
          className="block w-full h-full"
          aria-label={`View ${template.title}`}
        >
          <img
            src={template.thumbnail_url || DEFAULT_THUMBNAIL}
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
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-hl text-ink shadow-2xs">
                FEATURED
              </span>
            )}
          </div>

          <button
            onClick={handleFavorite}
            className={`p-1.5 rounded-md bg-white/90 backdrop-blur-sm border border-line transition-all duration-200 pointer-events-auto cursor-pointer shadow-2xs hover:scale-110 active:scale-95 ${
              isFav ? 'text-accent' : 'text-pencil hover:text-ink'
            }`}
            title={isFav ? 'Saved' : 'Save to favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-hl text-accent' : ''}`} />
          </button>
        </div>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 pointer-events-auto z-10">
          <button
            onClick={handleUseTemplate}
            className="flex-1 py-1.5 px-3 rounded-md bg-ink hover:bg-ink-2 text-white text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wand2 className="w-3.5 h-3.5 text-hl" />
            <span>{template.id && !template.id.startsWith('tmpl-') ? 'Open in Editor' : 'Use template'}</span>
          </button>
          
          <a 
            href={`/site/${template.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-1.5 px-2.5 rounded-md bg-white hover:bg-paper-2 text-ink text-xs font-semibold border border-line transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Open live site in new tab"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-accent" />
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
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-paper-2 text-soft border border-line"
              >
                {tag}
              </span>
            ))}
            <span className="text-[10px] font-mono text-pencil ml-auto">
              {template.difficulty || 'All Levels'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/template/${template.id}`} className="block text-ink hover:text-accent transition-colors">
            <h3 className="text-sm font-semibold tracking-tight line-clamp-1">
              {template.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-soft mt-1.5 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Footer info: Creator & stats */}
        <div className="mt-4 pt-2.5 border-t border-line flex items-center justify-between text-xs text-pencil">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={getAvatarUrl(template.creator_avatar, template.creator_name)}
              alt={template.creator_name}
              className="w-4 h-4 rounded-full object-cover border border-line"
            />
            <span className="text-[11px] text-soft truncate max-w-[110px]">
              {template.creator_name || 'Community'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1" title="Downloads">
              <Download className="w-3 h-3 text-pencil" />
              <span>{template.downloads_count || 0}</span>
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <Star className="w-3 h-3 text-hl fill-hl" />
              <span>{likesCount}</span>
            </span>
          </div>
        </div>

      </div>

    </div>
    </div>
  );
}
