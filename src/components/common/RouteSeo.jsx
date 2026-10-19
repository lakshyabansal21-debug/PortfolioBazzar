/**
 * RouteSeo.jsx: gives EVERY page sensible SEO tags, based on the address.
 * A page that knows more (for example the template page) renders its own <Seo> after this one,
 * and that one wins.
 *
 * Public pages are indexed. Private / tool / duplicate pages (profile, editor, admin, login
 * callbacks, full-screen previews, unknown addresses) are marked "noindex".
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import Seo from './Seo.jsx';
import { SITE, getSiteUrl } from '../../config/siteConfig.js';
import { TEMPLATE_CATEGORIES } from '../../data/categories.js';

// path prefix -> the tab title. These pages are never indexed by search engines.
const PRIVATE_PAGES = [
  ['/profile', 'My Profile'],
  ['/editor', 'Live Editor'],
  ['/admin', 'Admin Dashboard'],
  ['/auth', 'Signing in'],
  ['/reset-password', 'Reset Password'],
  ['/site/', 'Template Preview'],
  ['/preview/', 'Template Preview']
];

const PUBLIC_PAGES = {
  '/generator': {
    title: 'Portfolio Generator: Build Your Developer Portfolio in Minutes',
    description:
      'Fill in your details, pick one of 24 designs and download a ready-to-host portfolio website as a ZIP. No build step, no framework, no sign-up needed.'
  },
  '/upload': {
    title: 'Upload and Share a Portfolio Template',
    description:
      'Share your own portfolio design with the community. Upload HTML, CSS and JavaScript, mark the editable text, and let others personalize and download it.'
  }
};

export default function RouteSeo() {
  const { pathname, search } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  // ---- private / utility pages: own tab title, never indexed ----
  const privatePage = PRIVATE_PAGES.find(([p]) => {
    const base = p.replace(/\/$/, '');
    return path === base || path.startsWith(`${base}/`);
  });
  if (privatePage) {
    return <Seo title={privatePage[1]} noindex />;
  }

  // ---- home ----
  if (path === '/') {
    const base = getSiteUrl();
    return (
      <Seo
        title="PortfolioHub: Developer Portfolio Templates, Live Editor & ZIP Export"
        suffix={false}
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', name: SITE.name, url: base ? `${base}/` : undefined },
            { '@type': 'Organization', name: SITE.name, url: base ? `${base}/` : undefined }
          ]
        }}
      />
    );
  }

  // ---- explore (filters are part of the address) ----
  if (path === '/explore') {
    const q = new URLSearchParams(search);
    const rawCategory = q.get('category') || '';
    const category = TEMPLATE_CATEGORIES.includes(rawCategory) ? rawCategory : '';
    const page = Math.max(1, parseInt(q.get('page') || '1', 10) || 1);
    // search / level / sort only re-arrange the same templates: keep them out of search results
    const isThinVariant = Boolean((q.get('search') || '').trim() || q.get('difficulty') || q.get('sort'));

    const canonicalQuery = new URLSearchParams();
    if (category) canonicalQuery.set('category', category);
    if (page > 1) canonicalQuery.set('page', String(page));
    const canonicalPath = `/explore${canonicalQuery.toString() ? `?${canonicalQuery.toString()}` : ''}`;

    const heading = category ? `${category} Portfolio Templates` : 'Explore Developer Portfolio Templates';
    return (
      <Seo
        title={page > 1 ? `${heading} (Page ${page})` : heading}
        description={
          category
            ? `Browse ${category} developer portfolio templates. Preview them live, personalize them in the editor and download the finished site as a ZIP.`
            : 'Browse free developer portfolio templates in 24 styles. Preview them live, personalize them in the editor and download the finished site as a ZIP.'
        }
        path={canonicalPath}
        noindex={isThinVariant}
      />
    );
  }

  // ---- other public pages ----
  if (PUBLIC_PAGES[path]) {
    return <Seo title={PUBLIC_PAGES[path].title} description={PUBLIC_PAGES[path].description} path={path} />;
  }

  // ---- a template: the template page sets the real title once it has loaded ----
  if (path.startsWith('/template/')) {
    return <Seo title="Portfolio Template" path={path} />;
  }

  // ---- anything else is a wrong address ----
  return <Seo title="Page not found" noindex />;
}
