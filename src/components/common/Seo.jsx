/**
 * Seo.jsx: sets the title, description, canonical link, share (Open Graph / Twitter) tags,
 * robots rule and structured data (JSON-LD) of the page that is open.
 *
 * Why it is needed: the site is a single-page app, so there is only one index.html. Without this,
 * every page would have the same title and description in Google and in share previews.
 * (Google runs JavaScript, so it sees these tags. Chat apps and some social sites do not, so for
 * those the defaults in index.html are used.)
 *
 * Usage:  <Seo title="Explore templates" description="..." path="/explore" />
 */
import { useEffect } from 'react';
import { SITE, getSiteUrl, DEFAULT_OG_IMAGE_PATH } from '../../config/siteConfig.js';

export const DEFAULT_DESCRIPTION =
  'A curated directory and live creation platform for modern developer portfolios with zero build setup, clean typography, and instant static ZIP export.';

/** Search engines show about 155 characters of a description. */
export function clip(text, max = 155) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(json) {
  let el = document.getElementById('ph-jsonld');
  if (!json) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = 'ph-jsonld';
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = json; // textContent (not innerHTML): the data can never become markup
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd = null,
  suffix = true
}) {
  const jsonText = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const base = getSiteUrl();
    const fullTitle = title ? (suffix ? `${title} | ${SITE.name}` : title) : SITE.name;
    const desc = clip(description);
    const url = base && path ? `${base}${path}` : '';
    const isAbsolute = (u) => /^https?:\/\//i.test(u || '');
    const img = isAbsolute(image) ? image : base ? `${base}${DEFAULT_OG_IMAGE_PATH}` : '';

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setCanonical(noindex ? '' : url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', noindex ? '' : url);
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);

    setJsonLd(noindex ? '' : jsonText);
  }, [title, description, path, image, type, noindex, jsonText, suffix]);

  return null;
}
