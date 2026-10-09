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
