/**
 * ErrorBoundary.jsx: catches a crash inside any page and shows a friendly message instead of a blank white screen.
 *
 * React only supports this feature in class components. It wraps the routes in App.jsx.
 */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4" role="alert">
        <h1 className="text-2xl font-bold text-ink">Something went wrong on this page</h1>
        <p className="text-sm text-soft">
          The page hit an unexpected error. Your saved work is safe. Reload the page, or go back to the home page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-hl text-ink text-sm font-bold cursor-pointer"
          >
            Reload page
          </button>
          <a href="/" className="px-4 py-2 rounded-lg bg-white border border-line text-ink text-sm font-semibold">
            Go home
          </a>
        </div>
      </div>
    );
  }
}
