/**
 * NotFoundPage.jsx: shown when the URL does not match any page (before, wrong URLs silently redirected home).
 */
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-5xl font-extrabold text-ink">404</p>
      <h1 className="text-xl font-bold text-ink">This page does not exist</h1>
      <p className="text-sm text-soft">The link may be old or mistyped.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="px-4 py-2 rounded-lg bg-hl text-ink text-sm font-bold">Go home</Link>
        <Link to="/explore" className="px-4 py-2 rounded-lg bg-white border border-line text-ink text-sm font-semibold">Browse templates</Link>
      </div>
    </div>
  );
}
