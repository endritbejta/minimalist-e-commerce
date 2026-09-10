import { Component } from 'react';

/**
 * ErrorBoundary Component
 * Catches render-time errors so a failure in one part of the tree does not
 * leave the visitor staring at a blank page.
 *
 * The common case in a code-split app is a chunk that 404s after a redeploy,
 * which a reload fixes — so that is the action offered first.
 */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // No error-reporting backend in this demo; the console is the sink.
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) return children;

    return (
      <div
        role="alert"
        className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Something went wrong
        </h1>
        <p className="text-gray-500 max-w-md mb-8">
          The page failed to load. Reloading usually clears it up.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          Reload the page
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
