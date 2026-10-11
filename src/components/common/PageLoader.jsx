/**
 * PageLoader.jsx: spinner shown for a moment while a page's code is being downloaded (see lazy() in App.jsx).
 */
import React from 'react';

export default function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="w-8 h-8 rounded-full border-2 border-line border-t-accent animate-spin" />
    </div>
  );
}
