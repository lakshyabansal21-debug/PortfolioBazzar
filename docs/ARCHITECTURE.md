# Architecture

## The big idea: "local first, Supabase second"
`src/services/dbService.js` is the only file that reads or writes template data.
* **Write:** save in `localStorage` first (instant), then in Supabase if it is configured.
* **Read:** merge Supabase rows + local templates + the 24 built-in seeds (`src/data/seedTemplates.js`).
* If Supabase fails or a table is missing, a warning is logged and the app keeps working locally.

Likes, favorites, comments, views and downloads follow the same rule. Per-user data (likes, favorites) is stored per user id.
`templates.id` is TEXT in the database, so a built-in template that was synced to Supabase keeps an id like `tmpl-minimal-01`;
`dbService` remembers which ids came from the cloud (`cloudIds`).

## Request flow of a normal page
```
URL -> App.jsx (lazy route) -> page component -> dbService / useAuth -> state -> UI
```
Pages are loaded with `lazy()`, so the browser downloads a page only when it is opened.

## Login and admin
`context/AuthContext.jsx` keeps `user`, `profile`, `isAdmin`. With Supabase, `isAdmin` is `profile.role === 'admin'`.
The profile row is created by the database when someone signs up. The app only ever sends the fields in `EDITABLE_PROFILE_FIELDS`
(never `role`). `sql/` contains the policies and triggers that make this safe even if someone calls the API directly.
The OAuth popup (`pages/AuthCallbackPage.jsx`) tells the opener only `{ type }`, addressed to this site's origin; the session itself is read with `getSession()`.
User-typed links go through `utils/url.js` (`safeUrl`) so `javascript:` addresses are never rendered.

## Templates and previews
* `services/templateEngines.js` + `services/templates/*.js`: 24 functions that return `{ html, css, js }` from user data.
* `utils/previewHelper.js`: builds one full HTML document for the preview iframe (storage shim, link handling, scroll sync).
* Previews are sandboxed iframes (`allow-scripts allow-forms` only, no `allow-same-origin`, no popups/modals, `referrerPolicy="no-referrer"`). The editor talks to them only with `postMessage`, and the messages are addressed to this site's own origin (`utils/inlineEditor.js`).

## The editor engine (how an uploaded template becomes editable)
An uploaded template is just three strings. `utils/portfolioReader.js` parses the HTML with `DOMParser`, finds text nodes,
sections and repeated cards/chips, and edits them by index. `utils/jsData.js` edits plain arrays inside the JS without running it.
`utils/editableFields.js` lets the uploader mark details (name, email, links) that the next person can change.
`utils/inlineEditor.js` is the script that runs inside the preview for click-to-edit.

## Settings and constants
* `config/siteConfig.js`: site name, footer links, default images (values come from `.env`).
* `services/localStore.js`: every localStorage key and safe read/write helpers (storage can be blocked).
* `index.css`: design tokens (`@theme`), the dark palette (`html[data-theme='dark']`) and the 3D effects. `context/ThemeContext.jsx` remembers light/dark; a tiny script in `index.html` sets it before first paint.
* `data/categories.js`: the category list, kept apart from the template generators so the footer does not download them.

## Crashes and unknown URLs
`components/common/ErrorBoundary.jsx` wraps the routes (a crashing page shows Reload / Go home instead of a white screen) and `pages/NotFoundPage.jsx` handles unknown URLs.

## Build and caching
`vite.config.js` splits react and supabase into their own cached chunks and drops `console.*` / `debugger` from production builds. `jszip` is loaded only when someone downloads a ZIP.

## Quality gate
`npm run check` (`scripts/check.mjs`) fails on dead files, unused imports/variables, undefined names, missing relative imports
and packages that are imported but not in `package.json`.
