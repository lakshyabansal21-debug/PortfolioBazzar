# What changed in this clean-up

## 1. Removed unused code
- 10 unused files in `components/portfolio/` (AboutSection, AchievementsSection, ContactSection, ExperienceSection, HeroSection, PortfolioFooter, PortfolioNavbar, ProjectsSection, ResumeModal, SkillsSection) + `TerminalCard.jsx` + `data/portfolioData.js`.
- About 80 unused imports and variables, found with the TypeScript compiler (`noUnusedLocals`).
- Unused service functions: `getAdminStats` (fake numbers), `toggleFeature`, `recordView`, `recordDownload`.
- Template-generator functions are no longer exported (only the dispatcher uses them).
- "Quick Profile Overrides" box in the Visual tab (the Personalize tab already edits name and headline).

## 2. Hard-coded values -> real values
| Before | Now |
|---|---|
| Fake counters on 24 templates (likes 2150, downloads 5640 ...) | Start at 0. Only real activity changes them (old copies in localStorage are reset once) |
| Fake creators (Elena Rostova ...) on built-in templates | Creator = site name |
| Admin: `totalUsers: 14820`, `activeSessions: 412` | `dbService.getPlatformStats()`: templates, downloads, views, likes, remixes, contributors, and registered users (counted from Supabase `profiles`) |
| Admin text "24 styles" | Uses the real count |
| Footer: social links to github.com / twitter.com home pages, Privacy / Terms / Docs all pointing to /explore | `config/siteConfig.js` + `.env` (`VITE_GITHUB_URL` ...). An empty value hides the link |
| Footer category list | First categories of the real category list |
| Profile: fake GitHub / LinkedIn links, fake email, fake bio, "Supabase Synced" always on | Removed fake links; real email; honest badge (Cloud account / Saved on this device) |
| `portfoliohub.dev` in preview bars | The real host of the site |
| Same stock avatar for everyone | Initials avatar (`utils/avatar.js`) |
| Generator email / GitHub inputs pre-filled with example values | Empty with placeholders |
| "Perfect Lighthouse scores" claim | Plain, honest sentence |

## 3. Likes, comments, favorites, views, downloads now work
- **Comments:** the page sent an object but the service expected 3 arguments, so author and text were saved wrong. Fixed (`addComment(templateId, comment)`). The 2 fake demo comments are gone. A review without a rating no longer shows 5 stars.
- **Likes:** per user (a second user no longer sees the first user's like). For Supabase templates the count comes from the `likes` table (the old code returned 0 for cloud templates). Guests are asked to sign in to like cloud templates.
- **Favorites:** per user.
- **Views:** counted once per browser session. **Downloads:** counted on download. Both use the SQL function `increment_template_stat` when available.
- **Admin "Feature" toggle** now saves to Supabase too (`is_featured` / `is_approved` were missing from the allowed fields).
- **Admin delete:** built-in templates cannot be deleted (they used to come back after refresh).
- **Profile:** "My uploads" now also finds Supabase templates (they store `user_id`).

## 4. Easier to understand
- `services/dbService.js` rewritten in sections with a comment on every function; seed data moved to `data/seedTemplates.js`; storage keys + helpers in `services/localStore.js`; site values in `config/siteConfig.js`.
- `LiveEditorPage.jsx` 1183 -> 957 lines: four tabs moved to `components/editor/` (TemplateInfoTab, VisualTab, SectionsTab, CodeTab).
- Every file now starts with a comment saying what it is for.

## 5. New files
- `.env.example`: all settings in one place.
- `supabase/check.sql` (read-only inspection, run first) and `supabase/setup.sql` (optional comments table, like counter trigger and counter function; it skips anything that already exists).


---

# Second clean-up: security, speed, admin

## Security (see `sql/security_fixes.sql`)
- Nobody can make themselves admin: `profiles.role` is locked by a trigger (only the SQL editor can change it).
- At most one admin, enforced by a unique index. `sql/make_single_admin.sql` sets the one admin by email.
- Templates: only signed-in users can publish, only as themselves; owners can no longer feature/approve their own
  templates or change the owner; like/view/download/remix counters can only change through the official functions.
- Downloads and storage uploads are limited to the signed-in user (storage: own folder only).
- `is_admin()` has a fixed `search_path`.
- App: `isAdmin` trusts only the database role (demo-mode admin works only in `npm run dev`);
  `updateProfile` never sends `role`.

## Safer previews
- All 6 preview iframes now use `sandbox="allow-scripts allow-forms allow-modals"` (no `allow-same-origin`).
  Before, 3 of them (editor, details page, standalone preview) ran community-uploaded code with the website's
  own origin, which could read the visitor's login session from localStorage. The editor now keeps/restores the
  preview scroll position through `postMessage` (`injectScrollBridge` in `utils/inlineEditor.js`).

## Admin
- New **Admin** button in the top bar (desktop) and **Admin dashboard** button in the mobile menu, visible only to the admin.
  The `/admin` page (feature toggle, delete, sync built-ins, stats) is still guarded by `isAdmin`.

## Speed
- Every page is loaded on demand (`React.lazy`), react/supabase are separate cached chunks.
- `TEMPLATE_CATEGORIES` moved to `data/categories.js`, so the footer no longer pulls in all template generators.
- Fonts are loaded with `<link>` in `index.html` (parallel) instead of a CSS `@import` (chained); unused font families removed.
- Template lists no longer download the large html/css/js columns (details/editor pages still load the full code).

## Removed
- 11 unused components in `components/portfolio/` and `data/portfolioData.js`.
- Unused packages: `@google/genai`, `motion`, `framer-motion`, `dotenv`, `express`, `tsx`, `esbuild`, `typescript`,
  `autoprefixer`, `@types/*`; duplicate `vite` entry; `bun.lock`; Tailwind v3 `tailwind.config.js` / `postcss.config.js`;
  `eslint.config.js` and the fake `lint` script; `metadata.json`; empty `public/assets/aistudio/`.


---

# Third clean-up: hardening and tidy-up

## Security
- **OAuth popup** no longer posts the Supabase session (tokens) to `'*'`. It now posts only `{type}` to the site's own origin,
  and `AuthContext` ignores messages from any other origin (the session is read with `getSession()`).
- **Preview iframes**: removed `allow-modals`, added `referrerPolicy="no-referrer"`. The scroll bridge inside the iframe only accepts messages from its parent.
- **`vercel.json`**: security headers (nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, HSTS) and a CSP with
  `object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`.
  `script-src` is intentionally NOT restricted: preview iframes use `srcdoc`, which inherits the page CSP, so a strict script policy would break every template preview.
  The proper fix is to serve previews from a separate domain (see README of the review).
- `sql/schema.sql` now includes all security hardening (policies, role lock, guard triggers, storage rules), so a fresh install is secure by default.
  The insecure "Anyone can insert templates" / "Anyone can log downloads" / open storage-upload policies are gone from the base schema.
- New DB limits: 1 MB per code column, title/description length, max 20 template publishes per user per hour (`sql/security_limits.sql` for existing projects).
- Upload page skips files larger than 1 MB.
- All `target="_blank"` links now have `rel="noopener noreferrer"`.
- Seed data in `schema.sql` starts with 0 likes/downloads/views and creator `PortfolioHub` (matches the app).

## Tidy-up
- Actually removed the 11 unused `components/portfolio/*` files, `TerminalCard.jsx` and `data/portfolioData.js` (the previous CHANGES.md said this but they were still in the zip).
- Removed leftovers: `bun.lock`, `eslint.config.js`, `metadata.json`, `postcss.config.js`, `tailwind.config.js` (Tailwind v4 needs none of them), `public/assets/aistudio/`.
- `.gitignore` ignores `*.zip`. `.env` is NOT included in this package: copy `.env.example` to `.env`.
- Production build drops `console.*` and `debugger` (`vite.config.js`). Added `public/robots.txt`, `theme-color` and referrer meta tags.


---

# Fourth clean-up: CSS polish + dark mode

- **Dark / light toggle**: sun/moon button in the top bar (desktop and mobile). Remembers the choice (`portfoliohub_theme`), follows the
  operating-system setting until you choose, and a tiny script in `index.html` sets the theme before first paint (no flash).
  Files: `context/ThemeContext.jsx`, `components/common/ThemeToggle.jsx`, `App.jsx`, `Navbar.jsx`.
- **`index.css` reworked around theme variables**: `--surface`, `--text-main`, `--on-hl`, `--accent-solid`, `--key-edge`, `--shadow-card`.
  The dark palette is one block (`html[data-theme='dark']`); a short `@layer utilities` section re-maps the Tailwind classes that had fixed colours
  (white cards, ink text, status banners). Template previews are never themed: they always show the template as designed.
- **Polish**: balanced headings, nicer paragraph wrapping, consistent keyboard focus ring, slimmer floating scrollbar, pages fade up on navigation,
  smooth colour glide while switching theme, `prefers-reduced-motion` respected.
- **Bug fix**: `<body>` had hard-coded `bg-[#FAF8F5] text-[#18181B]` classes that overrode the design tokens; it now uses `bg-paper text-ink`.

- **New palette (warm instead of blue)**: cream paper, warm black ink, marker-yellow highlighter, forest-green accent; dark mode is warm charcoal.
  All colours are still in one place at the top of `src/index.css` (the `@theme`, `:root` and `html[data-theme='dark']` blocks).

- **Dark palette changed to "forest"** (deep green-black). Two more are built in: add `data-palette="graphite"` or `data-palette="plum"` to `<html>` in `index.html`.
- **More CSS polish**: faint paper-grain texture, `.marker` highlighter underline and `.skeleton` loading class (ready to use), one shared hover/focus style for every form field,
  tidy plain-text links, real entrance animation for popups (the old `animate-in` class names did nothing), print stylesheet.
- Dark mode: grey category chips on the landing page now follow the theme.


---

# Final merge ("best of all")

Built from `portfoliohub-snow-graphite` (the cleanest, most secure of the three zips) with these changes:

- **Preview iframe messages are locked to this site.** `inlineEditor.js` no longer posts to `'*'`; the site's own origin is
  baked into the editor and scroll-bridge scripts when they are injected (falls back to `'*'` only for non-http origins such as file://).
  The parent page already checks `e.source` before trusting any message.
- **Left out on purpose** (all present in the older zips): `.env` (real keys), `bun.lock`, `eslint.config.js` (disabled most rules),
  `metadata.json`, `public/assets/aistudio/`, the 11 unused portfolio components and the nested backup zips.
- **Checks done:** all 53 source files parse, and every relative import resolves.
  A full `vite build` could NOT be run where this was assembled (no internet), so run `npm install && npm run build` once yourself.

## Setup
1. `cp .env.example .env` and paste your Supabase URL + anon key (copy both from the SAME project: Supabase > Settings > API).
2. New database: run `sql/schema.sql`, then `supabase/setup.sql`, then `sql/make_single_admin.sql` (set your admin email).
   Existing database: run `sql/security_fixes.sql`, then `sql/security_limits.sql`.
3. `npm install && npm run dev`

- **Navbar:** removed the duplicate "Templates" link. It opened `/explore?sort=popular`, which is the same page as "Explore" (popular is already the default sort).
