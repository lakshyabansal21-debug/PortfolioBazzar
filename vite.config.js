import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SEO tags that need the full site address (share image, structured data).
 * The address comes from VITE_SITE_URL, or from Vercel's production URL. If neither is known the
 * tags are left out (a relative share image would not work anyway).
 */
function seoHtml(mode) {
  return {
    name: 'portfoliohub-seo-html',
    transformIndexHtml(html) {
      const env = loadEnv(mode, process.cwd(), '');
      const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '';
      const base = String(env.VITE_SITE_URL || process.env.VITE_SITE_URL || vercel).trim().replace(/\/+$/, '');
      if (!base) return html.replace('<!--SEO_SITE_TAGS-->', '');
      const name = env.VITE_SITE_NAME || 'PortfolioHub';
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', name, url: `${base}/` },
          { '@type': 'Organization', name, url: `${base}/`, logo: `${base}/og-default.png` }
        ]
      });
      const tags = [
        `<meta property="og:image" content="${base}/og-default.png" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:image" content="${base}/og-default.png" />`,
        `<script type="application/ld+json">${jsonLd}</script>`
      ].join('\n    ');
      return html.replace('<!--SEO_SITE_TAGS-->', tags);
    }
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss(), seoHtml(mode)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Remove console.log / debugger from production builds
    esbuild: { drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [] },
    build: {
      rollupOptions: {
        output: {
          // Libraries change rarely, so keeping them in their own files lets browsers cache them.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
