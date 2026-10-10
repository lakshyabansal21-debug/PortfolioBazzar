/**
 * ExplorePage.jsx: Browse all templates with search, category, difficulty, sort and pagination (state is kept in the URL).
 */
import React, { useState, useEffect } from 'react';
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

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [templates, setTemplates] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) setCategory(urlCat);
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) setSearch(urlSearch);
    const urlSort = searchParams.get('sort');
    if (urlSort) setSort(urlSort);
    const urlDiff = searchParams.get('difficulty');
    if (urlDiff) setDifficulty(urlDiff);
    const urlPage = searchParams.get('page');
    if (urlPage) setPage(parseInt(urlPage, 10));
  }, [searchParams]);

  // Load templates on filter change
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await dbService.getTemplates({
        category,
        difficulty,
        search,
        sort,
        page,
        limit: 9
      });
      setTemplates(res.templates || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setLoading(false);
    }
    load();
  }, [category, difficulty, search, sort, page]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (cat === 'All') p.delete('category');
    else p.set('category', cat);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    p.set('sort', newSort);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (diff === 'All') p.delete('difficulty');
    else p.set('difficulty', diff);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (val.trim()) p.set('search', val.trim());
    else p.delete('search');
    p.set('page', '1');
    setSearchParams(p);
  };

  const clearFilters = () => {
    setCategory('All');
    setDifficulty('All');
    setSearch('');
    setSort('popular');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'All' || difficulty !== 'All' || search.trim() !== '' || sort !== 'popular';

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
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-xs rounded-lg bg-white border border-line text-ink placeholder-pencil focus:outline-none focus:border-accent focus:ring-2 focus:ring-hl/20 transition-all shadow-2xs"
            />
            {search && (
              <button
                onClick={() => handleSearchChange('')}
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
            onClick={() => setPage(Math.max(1, page - 1))}
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
                onClick={() => setPage(pNum)}
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
            onClick={() => setPage(Math.min(totalPages, page + 1))}
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
