/**
 * siteConfig.js: all site-wide values in one place.
 *
 * These used to be hard-coded in many files (footer links, default avatar, demo domain...).
 * Change them here, or set VITE_* variables in your .env file (see .env.example).
 * A link whose value is empty ("") is simply not shown, so the site never has dead links.
 *
 *   VITE_SITE_NAME        site name
 *   VITE_SITE_URL         public address of the site, e.g. https://portfoliohub.example.com (used by SEO: canonical links, sitemap, share images)
 *   VITE_GITHUB_URL       GitHub repo / organisation
 *   VITE_TWITTER_URL      X / Twitter profile
 *   VITE_LINKEDIN_URL     LinkedIn page
 *   VITE_DOCS_URL         documentation / export guide
 *   VITE_PRIVACY_URL      privacy policy
 *   VITE_TERMS_URL        terms of use
 *   VITE_CHANGELOG_URL    changelog / releases
 *   VITE_DEMO_ADMIN_EMAIL email that becomes admin in DEMO mode only (when Supabase is not configured)
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const SITE = {
  name: env.VITE_SITE_NAME || 'PortfolioHub',
  demoAdminEmail: env.VITE_DEMO_ADMIN_EMAIL || 'admin@demo.local',
  links: {
    github: env.VITE_GITHUB_URL || '',
    twitter: env.VITE_TWITTER_URL || '',
    linkedin: env.VITE_LINKEDIN_URL || '',
    docs: env.VITE_DOCS_URL || '',
    privacy: env.VITE_PRIVACY_URL || '',
    terms: env.VITE_TERMS_URL || '',
    changelog: env.VITE_CHANGELOG_URL || ''
  }
};

/**
 * Public address of the site without a trailing slash (https://example.com).
 * Uses VITE_SITE_URL when set, otherwise the address the page is currently opened on.
 */
export function getSiteUrl() {
  const fromEnv = String(env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  return typeof window !== 'undefined' ? window.location.origin : '';
}

/** Share image used when a page has none (a file in /public). */
export const DEFAULT_OG_IMAGE_PATH = '/og-default.png';

/** Host of the running site (for example "localhost:5173"). Shown in preview address bars. */
export function getSiteHost() {
  return typeof window !== 'undefined' ? window.location.host : '';
}

/** Used when a template has no thumbnail. */
export const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

/** Starting thumbnail on the Upload page (the user can change it). */
export const DEFAULT_UPLOAD_THUMBNAIL =
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';
