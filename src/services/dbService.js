/**
 * dbService.js: the data layer of the app.
 *
 * Rule of this file: "local first, Supabase second".
 *   - Every write goes to localStorage first (instant), then to Supabase if it is configured.
 *   - Every read merges three sources: Supabase rows, local templates, and the built-in seeds.
 *   - If Supabase fails or a table is missing, we log a warning and keep working locally.
 *
 * Sections in this file:
 *   1. helpers
 *   2. reading templates      (getTemplates, getTemplateById)
 *   3. writing templates      (uploadTemplate, updateTemplate, remixTemplate, deleteTemplate)
 *   4. engagement             (likes, favorites, views, downloads)
 *   5. comments
 *   6. platform stats + admin tools
 */
import { supabase, isSupabaseConfigured } from '../supabase/client.js';
import { generatePortfolioCode, DEFAULT_USER_DATA } from './templateEngines.js';
import { SEED_TEMPLATES, SEED_IDS } from '../data/seedTemplates.js';
import { KEYS, readJson, writeJson } from './localStore.js';
import { SITE, DEFAULT_UPLOAD_THUMBNAIL } from '../config/siteConfig.js';

/* ------------------------------------------------------------------ */
/* 1. Helpers                                                          */
/* ------------------------------------------------------------------ */

/** Bump this when the seed data changes shape or values. Old seed copies in localStorage are then reset. */
const STORE_VERSION = 2;

/** Likes / favorites of people who are not signed in are kept under this name. */
const GUEST = 'guest';

/** Columns we are allowed to send to Supabase when a template is updated. */
const EDITABLE_CLOUD_FIELDS = [
  'title', 'description', 'category', 'difficulty', 'tags', 'creator_name', 'thumbnail_url',
  'html_code', 'css_code', 'js_code', 'is_featured', 'is_approved', 'is_public'
];

/** Views counted in this browser session (so a refresh does not add another view). */
const viewedThisSession = new Set();

/** True if `id` looks like a UUID (real Supabase row ids and user ids are UUIDs). */
function isUuid(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
}

/** Compare ids safely (one may be a number, the other a string). */
function sameId(a, b) {
  return String(a) === String(b);
}

/** Should we talk to Supabase for this template? (configured, and the id is a real row id) */
function isCloudTemplate(templateId) {
  return isSupabaseConfigured && isUuid(templateId);
}

/** Local list of templates. Creates it from the seeds the first time, and resets old seed copies after an update. */
function loadLocalTemplates() {
  let list = readJson(KEYS.templates, []);
  if (!Array.isArray(list)) list = [];

  let changed = false;
  if (readJson(KEYS.storeVersion, 0) !== STORE_VERSION) {
    // drop old copies of built-in templates (they may carry old fake counters); user-made ones stay
    list = list.filter((t) => !SEED_IDS.has(t.id));
    writeJson(KEYS.storeVersion, STORE_VERSION);
    changed = true;
  }

  const known = new Set(list.map((t) => t.id));
  const missingSeeds = SEED_TEMPLATES.filter((t) => !known.has(t.id)).map((t) => ({ ...t }));
  if (missingSeeds.length > 0) {
    list = [...list, ...missingSeeds];
    changed = true;
  }

  if (changed) writeJson(KEYS.templates, list);
  return list;
}

function saveLocalTemplates(list) {
  writeJson(KEYS.templates, list);
}

/** Change one local template (if it exists). `change` receives the template and returns the new one. */
function patchLocalTemplate(templateId, change) {
  const list = loadLocalTemplates();
  const index = list.findIndex((t) => sameId(t.id, templateId));
  if (index === -1) return null;
  list[index] = change(list[index]);
  saveLocalTemplates(list);
  return list[index];
}

/** Per-user lists (likes / favorites) are stored as { [userId]: [templateId, ...] }. */
function readUserList(key, userId) {
  const stored = readJson(key, {});
  // very old versions saved a plain array for everybody
  const map = Array.isArray(stored) ? { [GUEST]: stored } : stored || {};
  return { map, list: map[userId || GUEST] || [] };
}

function writeUserList(key, map, userId, list) {
  writeJson(key, { ...map, [userId || GUEST]: list });
}

/** Fill in html/css/js for a template that only has a placeholder (the built-in seeds). */
function withGeneratedCode(template) {
  const html = template.html_code ? String(template.html_code).trim() : '';
  const isPlaceholder =
    !html ||
    html.length < 35 ||
    (html.startsWith('<!--') && html.endsWith('-->') && !html.includes('<div') && !html.includes('<section'));
  if (!isPlaceholder) return template;

  const generated = generatePortfolioCode(template.category || template.title, DEFAULT_USER_DATA);
  const hasCss = template.css_code && String(template.css_code).trim().length > 20;
  const hasJs = template.js_code && String(template.js_code).trim().length > 10;
  return {
    ...template,
    html_code: generated.html,
    css_code: hasCss ? template.css_code : generated.css,
    js_code: hasJs ? template.js_code : generated.js
  };
}

/** Keep only the fields Supabase accepts, and only the ones that were actually provided. */
function pickCloudFields(updates) {
  const payload = {};
  EDITABLE_CLOUD_FIELDS.forEach((field) => {
    if (updates[field] !== undefined) payload[field] = updates[field];
  });
  return payload;
}

/** Search + category + difficulty filters used by getTemplates. */
function filterTemplates(items, { category, difficulty, search }) {
  let result = items;
  if (category && category !== 'All') {
    result = result.filter((t) => t.category && t.category.toLowerCase() === category.toLowerCase());
  }
  if (difficulty && difficulty !== 'All') {
    result = result.filter((t) => t.difficulty && t.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.creator_name && t.creator_name.toLowerCase().includes(q)) ||
        (Array.isArray(t.tags) && t.tags.some((tag) => String(tag).toLowerCase().includes(q))) ||
        (typeof t.tags === 'string' && t.tags.toLowerCase().includes(q))
    );
  }
  return result;
}

/** Sort used by getTemplates. "popular" = likes x3 + downloads x2 + views x0.1. */
function sortTemplates(items, sort) {
  const n = (value) => value || 0;
  const popularity = (t) => n(t.likes_count) * 3 + n(t.downloads_count) * 2 + n(t.views_count) * 0.1;
  const sorters = {
    newest: (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
    downloads: (a, b) => n(b.downloads_count) - n(a.downloads_count),
    likes: (a, b) => n(b.likes_count) - n(a.likes_count),
    popular: (a, b) => popularity(b) - popularity(a)
  };
  return [...items].sort(sorters[sort] || sorters.popular);
}

/** Add +1 to a counter (views_count / downloads_count / remixes_count), locally and in Supabase. */
async function bumpCounter(templateId, field) {
  if (!templateId) return;
  patchLocalTemplate(templateId, (t) => ({ ...t, [field]: (t[field] || 0) + 1 }));

  if (!isCloudTemplate(templateId)) return;
  try {
    // Preferred: the SQL function from supabase/setup.sql (works even when RLS blocks plain updates)
    const { error } = await supabase.rpc('increment_template_stat', { p_template_id: templateId, p_field: field });
    if (!error) return;

    // Fallback: read the number, then write number + 1
    const { data } = await supabase.from('templates').select(field).eq('id', templateId).maybeSingle();
    if (data) await supabase.from('templates').update({ [field]: (data[field] || 0) + 1 }).eq('id', templateId);
  } catch (e) {
    console.warn(`Supabase ${field} update notice:`, e);
  }
}

/** Number of likes of a cloud template, counted from the `likes` table. Returns null if it cannot be read. */
async function countCloudLikes(templateId) {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', templateId);
    return error ? null : count ?? 0;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* The service                                                         */
/* ------------------------------------------------------------------ */

export const dbService = {
  /* ============ 2. Reading templates ============ */

  /**
   * List templates (Explore, Landing, Profile, Admin all use this).
   * Merges Supabase + local + seeds (first one wins on duplicate ids), then filters, sorts and paginates.
   * @returns {{ templates: object[], total: number, totalPages: number }}
   */
  async getTemplates({ category = 'All', difficulty = 'All', search = '', sort = 'popular', page = 1, limit = 9 } = {}) {
    const merged = [];
    const seen = new Set();
    const add = (item) => {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('templates').select('*').eq('is_approved', true);
        if (!error && Array.isArray(data)) data.forEach(add);
      } catch (e) {
        console.warn('Supabase templates fetch notice:', e);
      }
    }
    loadLocalTemplates().forEach(add);
    SEED_TEMPLATES.forEach(add);

    const items = sortTemplates(filterTemplates(merged, { category, difficulty, search }), sort);
    const start = (page - 1) * limit;
    return {
      templates: items.slice(start, start + limit),
      total: items.length,
      totalPages: Math.ceil(items.length / limit) || 1
    };
  },

  /**
   * Get one template by id (or by title). Looks in Supabase, then local, then seeds.
   * Built-in seeds have no code stored, so the code is generated here.
   */
  async getTemplateById(id) {
    if (!id) return null;
    let found = null;

    if (isSupabaseConfigured) {
      try {
        const query = supabase.from('templates').select('*');
        const { data, error } = isUuid(id) ? await query.eq('id', id).maybeSingle() : await query.ilike('title', id).maybeSingle();
        if (!error && data) found = data;
      } catch (e) {
        console.warn('Supabase getTemplateById notice:', e);
      }
    }

    const matches = (t) => sameId(t.id, id) || (t.title && t.title.toLowerCase() === String(id).toLowerCase());
    if (!found) found = loadLocalTemplates().find(matches) || null;
    if (!found) found = SEED_TEMPLATES.find(matches) || null;

    return found ? withGeneratedCode(found) : null;
  },

  /** True for the 24 built-in templates (they cannot be deleted, they come from code). */
  isBuiltIn(templateId) {
    return SEED_IDS.has(templateId);
  },

  /* ============ 3. Writing templates ============ */

  /**
   * Publish a new template. Saved locally first, then to Supabase (the cloud id replaces the local id).
   * @param templateData title, description, category, html_code, css_code, js_code ...
   * @param user         the signed-in user (id, username, avatar_url) or {}
   */
  async uploadTemplate(templateData, user = {}) {
    const thumbnail = templateData.thumbnail_url || DEFAULT_UPLOAD_THUMBNAIL;
    const template = {
      id: `user-tmpl-${Date.now()}`,
      title: templateData.title,
      description: templateData.description || 'Custom developer portfolio template.',
      category: templateData.category || 'Minimal',
      difficulty: templateData.difficulty || 'Intermediate',
      tags: templateData.tags || ['Custom', 'Community'],
      thumbnail_url: thumbnail,
      preview_images: templateData.preview_images || [thumbnail],
      html_code: templateData.html_code || '',
      css_code: templateData.css_code || '',
      js_code: templateData.js_code || '',
      creator_name: user.username || templateData.creator_name || 'Community Creator',
      creator_id: user.id || templateData.creator_id || GUEST,
      creator_avatar: user.avatar_url || templateData.creator_avatar || null,
      likes_count: 0,
      downloads_count: 0,
      views_count: 0,
      remixes_count: 0,
      is_featured: false,
      is_approved: true,
      is_public: true,
      created_at: new Date().toISOString()
    };

    saveLocalTemplates([template, ...loadLocalTemplates()]);

    if (isSupabaseConfigured) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const payload = {
          ...pickCloudFields(template),
          preview_images: template.preview_images,
          is_approved: true,
          is_public: true
        };
        const activeUserId = sessionData?.session?.user?.id;
        if (activeUserId) payload.user_id = activeUserId;

        const { data, error } = await supabase.from('templates').insert(payload).select().maybeSingle();
        if (!error && data) {
          // keep the local copy in sync with the real row (new id etc.)
          const synced = { ...template, ...data };
          saveLocalTemplates(loadLocalTemplates().map((t) => (t.id === template.id ? synced : t)));
          return synced;
        }
        if (error) console.warn('Supabase template insert notice:', error.message);
      } catch (e) {
        console.warn('Supabase upload error:', e);
      }
    }
    return template;
  },

  /** Same as uploadTemplate (kept because the Upload page calls this name). */
  async createTemplate(templateData, user = {}) {
    return this.uploadTemplate(templateData, user);
  },

  /**
   * Update a template (editor "Save", details "Edit", admin "Feature").
   * If it only exists as a built-in, a local copy is created first.
   */
  async updateTemplate(templateId, updates = {}) {
    if (!templateId) return null;
    const stamp = { updated_at: new Date().toISOString() };

    let updated = patchLocalTemplate(templateId, (t) => ({ ...t, ...updates, ...stamp }));
    if (!updated) {
      const original = await this.getTemplateById(templateId);
      if (original) {
        updated = { ...original, ...updates, ...stamp };
        saveLocalTemplates([updated, ...loadLocalTemplates()]);
      }
    }

    if (isCloudTemplate(templateId)) {
      const payload = pickCloudFields(updates);
      if (Object.keys(payload).length > 0) {
        try {
          const { data, error } = await supabase.from('templates').update(payload).eq('id', templateId).select().maybeSingle();
          if (!error && data) updated = { ...updated, ...data };
          else if (error) console.warn('Supabase updateTemplate notice:', error.message);
        } catch (e) {
          console.warn('Supabase updateTemplate error:', e);
        }
      }
    }
    return updated;
  },

  /**
   * Make your own copy of a template ("remix") and credit the original.
   * The original's remixes_count goes up by one.
   */
  async remixTemplate(originalTemplate, user = {}) {
    const remix = {
      ...originalTemplate,
      id: `remix-${Date.now()}`,
      title: `${originalTemplate.title} (Remix by ${user.username || 'Creator'})`,
      creator_name: user.username || 'Remixer',
      creator_id: user.id || GUEST,
      creator_avatar: user.avatar_url || null,
      remixed_from_id: originalTemplate.id,
      remixed_from_title: originalTemplate.title,
      original_creator: originalTemplate.creator_name,
      likes_count: 0,
      downloads_count: 0,
      views_count: 0,
      remixes_count: 0,
      is_featured: false,
      created_at: new Date().toISOString()
    };

    saveLocalTemplates([remix, ...loadLocalTemplates()]);
    bumpCounter(originalTemplate.id, 'remixes_count');

    if (isSupabaseConfigured && isUuid(user.id)) {
      try {
        const { data, error } = await supabase
          .from('templates')
          .insert({
            title: remix.title,
            description: remix.description,
            category: remix.category,
            difficulty: remix.difficulty,
            tags: remix.tags,
            thumbnail_url: remix.thumbnail_url,
            creator_name: remix.creator_name,
            html_code: remix.html_code || '',
            css_code: remix.css_code || '',
            js_code: remix.js_code || '',
            remixed_from_id: isUuid(originalTemplate.id) ? originalTemplate.id : null,
            user_id: user.id,
            is_approved: true,
            is_public: true
          })
          .select()
          .maybeSingle();
        if (!error && data) {
          const synced = { ...remix, ...data };
          saveLocalTemplates(loadLocalTemplates().map((t) => (t.id === remix.id ? synced : t)));
          return synced;
        }
        if (error) console.warn('Supabase remix notice:', error.message);
      } catch (e) {
        console.warn('Supabase remix save error', e);
      }
    }
    return remix;
  },

  /** Delete a template (local + Supabase). Built-in templates cannot be deleted. */
  async deleteTemplate(templateId) {
    if (SEED_IDS.has(templateId)) return false;
    saveLocalTemplates(loadLocalTemplates().filter((t) => !sameId(t.id, templateId)));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('templates').delete().eq('id', templateId);
        if (error) console.warn('Supabase delete notice:', error.message);
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    return true;
  },

  /* ============ 4. Engagement: likes, favorites, views, downloads ============ */

  /**
   * Like / unlike a template as `userId`.
   *  - Built-in and local templates: stored in this browser, counted locally.
   *  - Supabase templates: needs a signed-in user; stored in the `likes` table and the
   *    number comes from counting that table, so it is always correct.
   * @returns {{ hasLiked: boolean, count: number, requiresLogin?: boolean, error?: string }}
   */
  async toggleLike(templateId, userId = GUEST) {
    const { map, list } = readUserList(KEYS.likes, userId);

    if (isCloudTemplate(templateId)) {
      if (!isUuid(userId)) {
        const count = (await countCloudLikes(templateId)) ?? 0;
        return { hasLiked: false, count, requiresLogin: true };
      }
      try {
        const alreadyLiked = await this.isLiked(templateId, userId);
        const { error } = alreadyLiked
          ? await supabase.from('likes').delete().eq('template_id', templateId).eq('user_id', userId)
          : await supabase.from('likes').insert({ template_id: templateId, user_id: userId });
        if (error) throw error;

        const count = (await countCloudLikes(templateId)) ?? 0;
        // keep the number on the template row fresh too (needs permission; ignored if blocked)
        supabase.from('templates').update({ likes_count: count }).eq('id', templateId).then(() => {}, () => {});
        writeUserList(KEYS.likes, map, userId, alreadyLiked ? list.filter((id) => id !== templateId) : [...list, templateId]);
        return { hasLiked: !alreadyLiked, count };
      } catch (e) {
        console.warn('Supabase like error', e);
        const count = (await countCloudLikes(templateId)) ?? 0;
        return { hasLiked: list.includes(templateId), count, error: e.message || 'Could not update like' };
      }
    }

    // local template (built-in / uploaded in this browser)
    const hasLiked = list.includes(templateId);
    writeUserList(KEYS.likes, map, userId, hasLiked ? list.filter((id) => id !== templateId) : [...list, templateId]);
    const updated = patchLocalTemplate(templateId, (t) => ({
      ...t,
      likes_count: Math.max(0, (t.likes_count || 0) + (hasLiked ? -1 : 1))
    }));
    return { hasLiked: !hasLiked, count: updated?.likes_count || 0 };
  },

  /** Did this user like this template? (checks Supabase for cloud templates) */
  async isLiked(templateId, userId = GUEST) {
    if (readUserList(KEYS.likes, userId).list.includes(templateId)) return true;
    if (isCloudTemplate(templateId) && isUuid(userId)) {
      try {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('template_id', templateId)
          .eq('user_id', userId);
        return (count || 0) > 0;
      } catch {
        return false;
      }
    }
    return false;
  },

  /** Save / un-save a template to this user's favorites (stored in this browser). Returns the new state. */
  async toggleFavorite(templateId, userId = GUEST) {
    const { map, list } = readUserList(KEYS.favorites, userId);
    const isFav = list.includes(templateId);
    writeUserList(KEYS.favorites, map, userId, isFav ? list.filter((id) => id !== templateId) : [...list, templateId]);
    return !isFav;
  },

  isFavorite(templateId, userId = GUEST) {
    return readUserList(KEYS.favorites, userId).list.includes(templateId);
  },

  /** Count a view (once per browser session per template). */
  async incrementViews(templateId) {
    if (!templateId || viewedThisSession.has(templateId)) return;
    viewedThisSession.add(templateId);
    await bumpCounter(templateId, 'views_count');
  },

  /** Count a download. */
  async incrementDownloads(templateId) {
    await bumpCounter(templateId, 'downloads_count');
  },

  /* ============ 5. Comments / reviews ============ */

  /**
   * Comments of a template, newest first.
   * Reads the Supabase `comments` table (if it exists) and the comments saved in this browser.
   */
  async getComments(templateId) {
    const local = readJson(KEYS.comments, {})[templateId] || [];
    let cloud = [];
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('template_id', String(templateId))
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) cloud = data;
      } catch (e) {
        console.warn('Supabase comments fetch notice:', e);
      }
    }
    return [...cloud, ...local].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  /**
   * Add a comment. `comment` = { user_id, user_name, user_avatar, content, rating }.
   * Goes to Supabase when possible, otherwise it is saved in this browser.
   * @returns the saved comment
   */
  async addComment(templateId, comment) {
    const record = {
      template_id: String(templateId),
      user_id: comment.user_id || GUEST,
      user_name: comment.user_name || 'Anonymous',
      user_avatar: comment.user_avatar || null,
      content: String(comment.content || '').trim(),
      rating: comment.rating || null
    };
    if (!record.content) return null;

    if (isSupabaseConfigured && isUuid(record.user_id)) {
      try {
        const { data, error } = await supabase.from('comments').insert(record).select().maybeSingle();
        if (!error && data) return data;
        if (error) console.warn('Supabase comment notice (is the comments table created?):', error.message);
      } catch (e) {
        console.warn('Supabase comment error:', e);
      }
    }

    const saved = { ...record, id: `c-${Date.now()}`, created_at: new Date().toISOString() };
    const all = readJson(KEYS.comments, {});
    writeJson(KEYS.comments, { ...all, [templateId]: [saved, ...(all[templateId] || [])] });
    return saved;
  },

  /* ============ 6. Platform stats + admin tools ============ */

  /**
   * Real numbers for the admin dashboard, calculated from the templates themselves.
   * `registeredUsers` is only known when Supabase is connected (counted from `profiles`), otherwise null.
   */
  async getPlatformStats() {
    const { templates } = await this.getTemplates({ limit: 100000 });
    const sum = (field) => templates.reduce((total, t) => total + (t[field] || 0), 0);
    const community = templates.filter((t) => !SEED_IDS.has(t.id));

    let registeredUsers = null;
    if (isSupabaseConfigured) {
      try {
        const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (!error) registeredUsers = count ?? 0;
      } catch (e) {
        console.warn('Supabase profiles count notice:', e);
      }
    }

    return {
      totalTemplates: templates.length,
      builtInTemplates: templates.length - community.length,
      communityTemplates: community.length,
      featuredTemplates: templates.filter((t) => t.is_featured).length,
      totalDownloads: sum('downloads_count'),
      totalLikes: sum('likes_count'),
      totalViews: sum('views_count'),
      totalRemixes: sum('remixes_count'),
      contributors: new Set(community.map((t) => t.creator_id || t.creator_name)).size,
      registeredUsers,
      storage: isSupabaseConfigured ? 'cloud' : 'local'
    };
  },

  /** Admin: push all built-in templates (with generated code) to the Supabase `templates` table. */
  async syncAllStylesToSupabase() {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
      };
    }
    try {
      const records = SEED_TEMPLATES.map((t) => {
        const generated = generatePortfolioCode(t.category, DEFAULT_USER_DATA);
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          difficulty: t.difficulty,
          tags: t.tags || [],
          thumbnail_url: t.thumbnail_url,
          preview_images: t.preview_images || [t.thumbnail_url],
          html_code: generated.html || '',
          css_code: generated.css || '',
          js_code: generated.js || '',
          is_featured: Boolean(t.is_featured),
          is_approved: true,
          is_public: true,
          creator_name: t.creator_name || SITE.name,
          created_at: t.created_at || new Date().toISOString()
        };
      });

      const { error } = await supabase.from('templates').upsert(records, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase template upsert error:', error);
        return { success: false, error: error.message, message: error.message };
      }
      return { success: true, count: records.length, message: `Synchronized ${records.length} built-in templates to Supabase.` };
    } catch (err) {
      console.warn('Failed to sync styles to Supabase:', err);
      return { success: false, error: err.message, message: err.message };
    }
  },

  /** Admin: the same sync as SQL text that can be pasted into the Supabase SQL editor. */
  generateSupabaseSqlSeedScript() {
    const q = (text) => String(text || '').replace(/'/g, "''");
    const textArray = (items) => `ARRAY[${items.map((item) => `'${q(item)}'`).join(', ')}]::TEXT[]`;

    const rows = SEED_TEMPLATES.map((t) => {
      const title = q(t.title);
      return `(
  '${q(t.id)}', '${title}', '${q(t.description)}', '${q(t.category)}', '${q(t.difficulty)}',
  ${textArray(t.tags || [])}, '${q(t.thumbnail_url)}', ${textArray(t.preview_images || [t.thumbnail_url])},
  '<!-- ${title} -->', '/* ${title} CSS */', '// ${title} JS',
  ${Boolean(t.is_featured)}, true, true, '${q(t.creator_name || SITE.name)}'
)`;
    }).join(',\n');

    return `-- Run this in your Supabase SQL Editor:
INSERT INTO public.templates (
  id, title, description, category, difficulty, tags, thumbnail_url, preview_images,
  html_code, css_code, js_code, is_featured, is_approved, is_public, creator_name
) VALUES
${rows}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  tags = EXCLUDED.tags,
  thumbnail_url = EXCLUDED.thumbnail_url,
  preview_images = EXCLUDED.preview_images,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();`;
  }
};
