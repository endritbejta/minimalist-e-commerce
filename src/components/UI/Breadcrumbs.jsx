import { Link, useLocation } from "react-router-dom";
import { humanizeSlug } from "../../lib/format";

/**
 * Breadcrumbs Component
 * Navigation trail derived from the current URL.
 * @param {Object} props - Component props.
 * @param {string} [props.currentLabel] - Overrides the last crumb, so a product
 *   page can show its real title instead of its URL handle.
 * @param {string} [props.className] - Additional CSS classes for the nav element.
 */
function Breadcrumbs({ currentLabel, className = "", ...props }) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-2 lg:mb-4 ${className}`}
      {...props}
    >
      <ol className="flex items-center space-x-1 lg:space-x-2">
        <li>
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const to = `/${segments.slice(0, index + 1).join('/')}`;
          const label = isLast && currentLabel ? currentLabel : humanizeSlug(segment);

          return (
            <li key={to} className="flex items-center space-x-2">
              <span aria-hidden="true">/</span>
              {isLast ? (
                <span className="text-gray-900 font-medium" aria-current="page">{label}</span>
              ) : (
                <Link to={to} className="hover:text-gray-900 transition-colors">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
