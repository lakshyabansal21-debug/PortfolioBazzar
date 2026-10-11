# What this version is

A merge of two earlier clean-ups of PortfolioHub. The base is the "best" one (stronger security, speed, dark mode);
the robustness, privacy and tooling work from the "final" one was added on top.

## Security
| Area | Result |
|---|---|
| Preview iframes | `allow-scripts allow-forms` only, `referrerPolicy="no-referrer"`. No same-origin access, no popups, no modals. |
| OAuth popup | Sends only `{type}` to this site's origin; `AuthContext` ignores messages from other origins. (The other version posted the whole session to `'*'`: removed.) Return URL must be a path on this site. |
| Email privacy | `sql/schema.sql` / `sql/002_privacy_and_comments.sql` revoke table-wide read on `profiles` and grant safe columns only. The app reads explicit columns. |
| Ban flag / counters | Normal users can no longer change them on their own profile (admins can). Role stays locked to the SQL editor. |
| Links | `utils/url.js` `safeUrl`: profile links and upload thumbnails must be http(s) (blocks `javascript:`). |
| Database limits | 1 MB per code column, title/description length, 20 publishes per hour (from the "best" version), plus an upload-page check (1 MB total, 10 tags). |
| Headers | `vercel.json`: nosniff, X-Frame-Options, HSTS, referrer, permissions, and a CSP (object-src, base-uri, frame-ancestors, form-action). |
| Admin | `isAdmin` trusts only the database role. Demo mode admin: one email from `VITE_DEMO_ADMIN_EMAIL`, only in `npm run dev`. `updateProfile` sends whitelisted fields only and a failed profile read never rewrites a profile. |
| New: `set_site_admin(email)` | One command to choose the single admin. |

## Robustness
* `ErrorBoundary` (no more white screen) and a real 404 page.
* All storage goes through guarded helpers in `services/localStore.js` (private mode / blocked storage cannot crash the app).
* Comments: stars saved (`rating` column), author name/photo read from `profiles`, per-user likes, built-in templates synced to the cloud keep working (`cloudIds`).
* Profile page: website / GitHub / LinkedIn fields, validation, "name already taken" message, form refreshes from saved data.
* Developer "Supabase Connection" panel hidden on live sites.
* Navbar: admin button, search and user name collapse to icons on laptop widths so nothing wraps.
* New accounts no longer get a stock photo; initials avatar instead.

## Speed (unchanged from "best")
Lazy pages, separate cached react/supabase chunks, `console.*` dropped in production, template lists skip the heavy code columns, `jszip` loaded on demand, fonts loaded in parallel.

## Look and feel (unchanged from "best")
Light/dark theme with no flash on load, polished stylesheet, reveal animations.

## Tooling and docs
* `npm run check` (`npm run lint`) fails on dead files, unused names, undefined names, missing imports, undeclared packages.
* README and `docs/ARCHITECTURE.md` rewritten to match the code. The 1,100-line stale `CODEBASE_DOCUMENTATION.md` is gone.
* `.env.example` includes `VITE_DEMO_ADMIN_EMAIL`.

## Things to know
* `package-lock.json` is not included: `package.json` gained `typescript` (needed by `npm run check`), and an out-of-date lock breaks `npm ci`.
  Run `npm install` once and commit the new lock file.
* The SQL (`sql/schema.sql`, `sql/002_privacy_and_comments.sql`) has not been executed against a real database. Do the dry run described in the README.
* Not built or run here (no network): run `npm install && npm run build` before deploying.
