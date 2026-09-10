import { SITE } from '../../lib/site';

/**
 * PageLoader Component
 * Loading indicator for code-split routes.
 * @param {Object} props - Component props.
 * @param {boolean} [props.fullScreen=false] - Cover the viewport instead of sitting in the content area.
 */
function PageLoader({ fullScreen = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        fullScreen
          ? 'fixed inset-0 flex flex-col items-center justify-center bg-white z-loader'
          : 'min-h-[60vh] flex flex-col items-center justify-center'
      }
    >
      <div className="w-64 max-w-[60vw] h-[1px] bg-gray-100 relative overflow-hidden mb-4">
        <div className="absolute inset-0 bg-black animate-loading-bar origin-left" />
      </div>

      <div className="flex flex-col items-center space-y-1">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-900">
          {SITE.shortName}
        </span>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}

export default PageLoader;
