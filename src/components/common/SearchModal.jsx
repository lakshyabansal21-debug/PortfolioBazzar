import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Layers, Code, Sparkles, Clock } from 'lucide-react';
import { dbService } from '../../services/dbService.js';
import { TEMPLATE_CATEGORIES } from '../../services/templateEngines.js';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ph_recent_searches') || '["Developer", "Minimal", "Terminal"]');
    } catch {
      return ["Developer", "Minimal", "Terminal"];
    }
  });

  const popularStyles = ['Developer', 'Minimal', 'Editorial', '3D Interactive', 'Terminal', 'Creative Studio'];
  const popularTech = ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Vite'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await dbService.getTemplates({ search: query.trim(), limit: 5 });
        setResults(res.templates || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== term.trim().toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('ph_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectTemplate = (template) => {
    saveRecentSearch(template.title);
    onClose();
    navigate(`/template/${template.id}`);
  };

  const handleExecuteSearch = (term) => {
    const q = term || query;
    if (q.trim()) {
      saveRecentSearch(q);
      onClose();
      navigate(`/explore?search=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelectTemplate(results[selectedIndex]);
      } else {
        handleExecuteSearch();
      }
    }
  };

  // Close on Esc from anywhere (works even if the input loses focus)
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white border border-[#E6E1D6] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E6E1D6] bg-white">
          <Search className="w-4 h-4 text-[#71717A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates, styles, keywords (e.g. Developer, Minimal, Terminal)..."
            className="w-full ml-3 text-sm text-[#18181B] placeholder-[#71717A] bg-transparent focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            title="Close (Esc)"
            className="group relative shrink-0 ml-2 flex items-center justify-center w-10 h-6 rounded border border-[#E6E1D6] bg-[#FAF8F5] text-[#71717A] cursor-pointer transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-500 hover:scale-110 active:scale-95"
          >
            <span className="absolute text-[10px] font-mono transition-all duration-200 group-hover:opacity-0 group-hover:scale-50">
              ESC
            </span>
            <X className="absolute w-3.5 h-3.5 opacity-0 scale-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100" />
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="max-h-[420px] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs font-mono text-[#71717A]">
              Searching catalog...
            </div>
          )}

          {/* Results List */}
          {!loading && results.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#D97706] px-2 mb-1.5">
                MATCHES FOR "{query}"
              </div>
              {results.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTemplate(item)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    selectedIndex === idx ? 'bg-[#F3EFE6] text-[#18181B]' : 'hover:bg-[#FAF8F5] text-[#18181B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-10 h-8 object-cover rounded border border-[#E6E1D6]"
                    />
                    <div>
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-[11px] text-[#52525B]">{item.category} · by {item.creator_name || 'Community'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#71717A]">
                    <span className="font-mono text-[11px]">{item.difficulty}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}

              <button
                onClick={() => handleExecuteSearch()}
                className="w-full text-center py-2.5 mt-2 text-xs font-semibold text-[#18181B] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer border-t border-[#E6E1D6]"
              >
                View all results for "{query}" in Catalog →
              </button>
            </div>
          )}

          {/* Empty Results */}
          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs text-[#18181B] font-semibold">No templates found for "{query}"</p>
              <p className="text-[11px] text-[#52525B] mt-1">Try keywords like "Developer", "Minimal", or "Terminal".</p>
            </div>
          )}

          {/* Default Discovery State */}
          {!query && (
            <div className="space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#71717A] mb-2 px-1">
                    <Clock className="w-3 h-3" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleExecuteSearch(term)}
                        className="px-2.5 py-1 text-xs text-[#18181B] bg-[#FAF8F5] border border-[#E6E1D6] hover:bg-[#F3EFE6] rounded-md transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Styles */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#71717A] mb-2 px-1">
                  <Layers className="w-3 h-3" />
                  <span>Popular Architectures</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => handleExecuteSearch(style)}
                      className="px-2.5 py-1 text-xs text-[#18181B] bg-white border border-[#E6E1D6] hover:bg-[#FAF8F5] rounded-md transition-colors cursor-pointer"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#71717A] mb-2 px-1">
                  <Code className="w-3 h-3" />
                  <span>Technologies</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularTech.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => handleExecuteSearch(tech)}
                      className="px-2.5 py-1 text-xs text-[#52525B] bg-white border border-[#E6E1D6] hover:text-[#18181B] hover:border-[#18181B] rounded-md transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#E6E1D6] flex items-center justify-between text-[11px] text-[#71717A]">
          <span>Navigate with <kbd className="font-mono bg-white px-1 py-0.5 border border-[#E6E1D6] rounded">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 border border-[#E6E1D6] rounded">↓</kbd></span>
          <span>Select with <kbd className="font-mono bg-white px-1 py-0.5 border border-[#E6E1D6] rounded">Enter</kbd></span>
        </div>
      </div>
    </div>
  );
}
