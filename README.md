# PortfolioHub

Pick a portfolio template, make it yours, and host it free. Every template is plain HTML, CSS and
JavaScript (no framework, no build step), exported as a ZIP or a single HTML file.

**What you can do:** browse 24 built-in templates and community uploads, build one from a form (Generator),
customise any template with a live preview (Editor: form, click-to-edit text, sections, fonts and colours, raw code),
publish your own template (Upload), like / favorite / review templates, and manage the site from an Admin dashboard.
Light and dark mode are built in.

**Stack:** React 19, React Router 7, Tailwind CSS 4, Vite 6, Supabase (login + database). Without Supabase the app
still runs in a local demo mode (data stays in the browser).

## Quick start

```bash
npm install               # also creates package-lock.json: commit it
cp .env.example .env      # then fill in your Supabase URL and anon key (optional)
npm run dev               # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the production build locally |
| `npm run check` | find dead files, unused code, missing imports and undeclared packages (same as `npm run lint`) |

Run `npm run check` before every commit. It fails when something is wrong.

## Settings (`.env`)

See `.env.example`. Nothing is required. Footer links and the site name come from these variables; an empty link is not shown.
On Vercel add the same variables under **Project Settings > Environment Variables**.

## Supabase setup

1. Create a Supabase project and copy the **Project URL** and **anon key** into `.env`.
2. **New project:** run `sql/schema.sql` once in the SQL editor. It already contains all security hardening, limits, the
   privacy fix and `set_site_admin`. Then, optionally, run `supabase/setup.sql` (it only adds what is missing: like counter, view/download counters).
3. **Existing project** (made from an older schema): run these in order, each one is safe to run twice:
   `supabase/check.sql` (read-only look first) -> `supabase/setup.sql` -> `sql/security_fixes.sql` -> `sql/security_limits.sql` -> `sql/002_privacy_and_comments.sql`.
   Deploy this version of the website **before** `002` (it reads profiles with explicit columns, which the privacy step needs).
   Dry run any file by putting `BEGIN;` on its first line and `ROLLBACK;` on its last.
4. Under **Authentication > URL Configuration** add your site URL and `https://your-site/auth/callback` (needed for Google / GitHub login).

### Choosing the admin

The admin is the one account whose profile has `role = 'admin'`. Sign in on the website once with that account, then run this in the SQL editor:

```sql
SELECT public.set_site_admin('you@example.com');
```

That account now sees an **Admin** button in the top bar (icon-only on smaller laptops) and can open `/admin`. Running it again with another email moves
the role (there is only ever one admin). If you prefer plain SQL, `sql/make_single_admin.sql` does the same.
Nobody can give themselves admin from the website: the database blocks it.

In demo mode (no Supabase) the admin is the email in `VITE_DEMO_ADMIN_EMAIL`, and only while running `npm run dev`.

## Deploy to Vercel

Import the repository. The build command (`npm run build`) and output folder (`dist`) are detected automatically. `vercel.json` adds the
single-page-app rewrite, security headers and long-lived caching for built assets. Add the `.env` variables in the Vercel dashboard.

## Project layout

See `docs/ARCHITECTURE.md` for how the pieces fit together.

```
src/
  pages/        one file per screen
  components/   Navbar, Footer, TemplateCard, ErrorBoundary, editor tabs, ...
  services/     dbService (all data), templateEngines (the 24 generators), localStore
  utils/        preview + export + the HTML editing engine, safe URLs
  context/      login state, theme, popup messages
  config/       siteConfig: site name and links
sql/            schema.sql (new project) + patches for existing projects
supabase/       setup.sql and check.sql (counters, comments, read-only inspection)
scripts/        check.mjs
```

## Security notes

* Uploaded templates run JavaScript, so every preview is a sandboxed iframe **without** `allow-same-origin` (and without popups/modals):
  a template cannot read the visitor's login session or open windows that escape the sandbox.
* The login popup never sends tokens to other windows; the site only listens to messages from its own origin.
* The admin check in the browser only decides which buttons to show. The real protection is the database (row level security + triggers in `sql/`).
* Users cannot read other users' email addresses, change their own role / ban flag / counters, or publish more than 20 templates per hour.
* Links typed by users (profile, thumbnail) must be http(s); `javascript:` links are rejected.
* **Known limit:** `vercel.json` does not restrict `script-src`, because previews use `srcdoc` iframes that inherit the page's policy and a strict one
  would break every template preview. The complete fix is to serve previews from a separate domain.
