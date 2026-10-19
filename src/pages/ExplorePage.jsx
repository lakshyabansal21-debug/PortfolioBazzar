/**
 * ExplorePage.jsx: Browse all templates with search, category, difficulty, sort and pagination (state is kept in the URL).
 */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw
} from 'lucide-react';
import { dbService } from '../services/dbService.js';
import { TEMPLATE_CATEGORIES } from '../data/categories.js';
import TemplateCard from '../components/common/TemplateCard.jsx';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const SORTS = ['popular', 'newest', 'downloads', 'likes'];
const PAGE_SIZE = 9;

/**
 * The address bar is the single source of truth for this page.
 * category / difficulty / sort / search / page are READ from the URL on every render and
 * changed ONLY by writing the URL (useSearchParams). There is no copy of them in useState, so the
 * browser Back / Forward buttons, shared links and reloads always show exactly what the URL says.
 * (Only the text typed in the search box is kept locally for a moment, so typing stays smooth.)
 */
export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- read the URL (with safe defaults: a bad value in the URL falls back instead of breaking) ----
  const rawCategory = searchParams.get('category') || 'All';
  const category = rawCategory === 'All' || TEMPLATE_CATEGORIES.includes(rawCategory) ? rawCategory : 'All';
  const rawDifficulty = searchParams.get('difficulty') || 'All';
  const difficulty = DIFFICULTIES.includes(rawDifficulty) ? rawDifficulty : 'All';
  const rawSort = searchParams.get('sort') || 'popular';
  const sort = SORTS.includes(rawSort) ? rawSort : 'popular';
  const search = searchParams.get('search') || '';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const [templates, setTemplates] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ---- write the URL ----
  // `replace` = true  -> edit the current history entry (used while typing, so Back is not flooded)
  // `replace` = false -> a new history entry (filters and pages: Back goes to the previous view)
  const updateUrl = useCallback(
    (changes, { replace = false } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        const isDefault =
          value === undefined || value === null || value === '' ||
          (key === 'category' && value === 'All') ||
          (key === 'difficulty' && value === 'All') ||
          (key === 'sort' && value === 'popular') ||
          (key === 'page' && Number(value) <= 1);
        if (isDefault) next.delete(key);
        else next.set(key, String(value));
      });
      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams]
  );

  // ---- search box: local text, copied to the URL 350 ms after the person stops typing ----
  const [searchText, setSearchText] = useState(search);
  const typingTimer = useRef(null);

  // Back / Forward / Reset / a link: the URL changed, so the box shows what the URL says
  useEffect(() => {
    setSearchText(search);
  }, [search]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const handleSearchInput = (value) => {
    setSearchText(value);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      updateUrl({ search: value.trim(), page: 1 }, { replace: true });
    }, 350);
  };

  const flushSearch = (value) => {
    clearTimeout(typingTimer.current);
    setSearchText(value);
    updateUrl({ search: value.trim(), page: 1 }, { replace: true });
  };

  // ---- load whatever the URL asks for ----
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await dbService.getTemplates({ category, difficulty, search, sort, page, limit: PAGE_SIZE });
      if (cancelled) return;
      // asked for a page that does not exist (old link, filters changed): go to the last real page
      if (page > (res.totalPages || 1)) {
        updateUrl({ page: res.totalPages || 1 }, { replace: true });
        return;
      }
      setTemplates(res.templates || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
    // updateUrl changes with the URL on purpose-free reads; the five values below are the real inputs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty, search, sort, page]);

  // new page / filter: start at the top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page, category, difficulty, search, sort]);

  const handleCategoryChange = (cat) => updateUrl({ category: cat, page: 1 });
  const handleSortChange = (newSort) => updateUrl({ sort: newSort, page: 1 });
  const handleDifficultyChange = (diff) => updateUrl({ difficulty: diff, page: 1 });
  const goToPage = (n) => updateUrl({ page: Math.min(Math.max(1, n), totalPages) });

  const clearFilters = () => {
    clearTimeout(typingTimer.current);
    setSearchText('');
    setSearchParams({});
  };

  const hasActiveFilters = useMemo(
    () => category !== 'All' || difficulty !== 'All' || search.trim() !== '' || sort !== 'popular',
    [category, difficulty, search, sort]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Explore Developer Portfolios
          </h1>
          <p className="text-sm text-soft mt-1">
            Browse hand-crafted styles, live test templates, and customize for your career.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-md bg-white border border-line text-xs font-mono text-soft shadow-2xs">
            <span className="font-bold text-ink">{total}</span> {total === 1 ? 'template' : 'templates'} found
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-pencil hover:text-ink transition-colors cursor-pointer"
              title="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-pencil" />
            <input
              type="text"
              placeholder="Search by keywords, tech stack, or persona..."
              value={searchText}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') flushSearch(e.currentTarget.value); }}
              className="w-full pl-9 pr-9 py-2.5 text-xs rounded-lg bg-white border border-line text-ink placeholder-pencil focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20 transition-all shadow-2xs"
            />
            {searchText && (
              <button
                onClick={() => flushSearch('')}
                className="absolute right-3 top-3 text-pencil hover:text-ink cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="py-2.5 px-3 rounded-lg bg-white border border-line text-xs text-ink focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="py-2.5 px-3 rounded-lg bg-white border border-line text-xs text-ink focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Added</option>
              <option value="downloads">Most Downloaded</option>
              <option value="likes">Most Starred</option>
            </select>
          </div>

        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-line pt-1">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              category === 'All'
                ? 'bg-ink text-white shadow-2xs'
                : 'bg-white text-soft hover:text-ink hover:bg-paper-2 border border-line'
            }`}
          >
            All Categories ({total})
          </button>
          
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-hl text-ink font-bold border border-accent shadow-2xs'
                    : 'bg-white text-soft hover:text-ink hover:bg-paper-2 border border-line'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TEMPLATES GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-line rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-paper-2" />
              <div className="p-4 space-y-2.5">
                <div className="h-4 bg-paper-2 rounded w-2/3" />
                <div className="h-3 bg-paper-2 rounded w-full" />
                <div className="h-3 bg-paper-2 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tmpl, i) => (
            <TemplateCard key={tmpl.id} template={tmpl} index={i} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-xl bg-white border border-line p-8 shadow-2xs">
          <Layers className="w-12 h-12 text-pencil mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-ink">No matching templates</h3>
          <p className="text-xs text-soft mt-1.5 max-w-sm mx-auto leading-relaxed">
            No portfolio templates match your active search keyword or category filter. Try clearing filters to see all available templates.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 px-4 py-2 rounded-lg bg-ink hover:bg-ink-2 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 4. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-line">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-md border border-line bg-white text-pencil hover:text-ink disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => goToPage(pNum)}
                className={`w-8 h-8 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  page === pNum
                    ? 'bg-hl text-ink border border-accent shadow-2xs'
                    : 'bg-white text-soft hover:bg-paper-2 hover:text-ink border border-line'
                }`}
              >
                {pNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-md border border-line bg-white text-pencil hover:text-ink disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
