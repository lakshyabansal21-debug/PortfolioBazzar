/**
 * NavigationProgress.jsx: a thin loading bar at the top of the screen while a new page opens,
 * plus "prefetch on hover" so most pages are already downloaded when you click.
 *
 * Why it exists: React Router keeps the OLD page on screen until the next page's code has
 * downloaded, so the page spinner (PageLoader) never shows and the click seems to do nothing.
 * This bar starts on the click and stops when the address really changes.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// path prefix -> the same dynamic import App.jsx uses (the bundler shares the downloaded file)
const PRELOAD = [
  ['/explore', () => import('../../pages/ExplorePage.jsx')],
  ['/template/', () => import('../../pages/TemplateDetailsPage.jsx')],
  ['/generator', () => import('../../pages/GeneratorPage.jsx')],
  ['/editor', () => import('../../pages/LiveEditorPage.jsx')],
  ['/upload', () => import('../../pages/UploadPage.jsx')],
  ['/profile', () => import('../../pages/ProfilePage.jsx')],
  ['/admin', () => import('../../pages/AdminDashboardPage.jsx')]
];

function preload(pathname) {
  const hit = PRELOAD.find(([prefix]) => pathname.startsWith(prefix));
  if (hit) hit[1]().catch(() => { /* a failed prefetch is fine: the click will try again */ });
}

/** The internal <a> a pointer event happened on, or null (new tab, other site, #anchor, download ...). */
function internalLink(event) {
  const a = event.target?.closest?.('a[href]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
  const href = a.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  try {
    const url = new URL(a.href, window.location.href);
    return url.origin === window.location.origin ? url : null;
  } catch {
    return null;
  }
}

export default function NavigationProgress() {
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const safetyTimer = useRef(null);

  // the address changed: the new page is on screen
  useEffect(() => {
    setBusy(false);
    clearTimeout(safetyTimer.current);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onHover = (e) => {
      const url = internalLink(e);
      if (url) preload(url.pathname);
    };
    const onClick = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const url = internalLink(e);
      if (!url) return;
      const here = window.location.pathname + window.location.search;
      if (url.pathname + url.search === here) return;
      preload(url.pathname);
      setBusy(true);
      clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => setBusy(false), 15000); // never get stuck
    };
    document.addEventListener('pointerover', onHover, { passive: true });
    document.addEventListener('focusin', onHover);
    document.addEventListener('touchstart', onHover, { passive: true });
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('pointerover', onHover);
      document.removeEventListener('focusin', onHover);
      document.removeEventListener('touchstart', onHover);
      document.removeEventListener('click', onClick);
      clearTimeout(safetyTimer.current);
    };
  }, []);

  if (!busy) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none" role="progressbar" aria-label="Opening page">
      <div className="h-full bg-accent" style={{ animation: 'ph-nav-progress 12s cubic-bezier(0.1, 0.6, 0.2, 1) forwards' }} />
      <style>{'@keyframes ph-nav-progress { from { width: 4%; } to { width: 92%; } }'}</style>
    </div>
  );
}
