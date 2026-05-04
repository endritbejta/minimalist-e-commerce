/**
 * Breadcrumbs Component
 * Displays a navigation trail based on the current URL path.
 * @param {string} className - Additional CSS classes for the nav element.
 * @param {Object} props - Additional props spread onto the nav element.
 */
function Breadcrumbs({ className = "", ...props }) {
  const location = useLocation();
  
  // Split path into segments and filter out empty strings
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className={`flex text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-2 lg:mb-4 ${className}`} aria-label="Breadcrumb" {...props}>
      <ol className="flex items-center space-x-1 lg:space-x-2">
        <li>
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        </li>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          // Format label: capitalize and replace dashes with spaces
          const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return (
            <li key={to} className="flex items-center space-x-2">
              <span>/</span>
              {last ? (
                <span className="text-gray-900 font-medium">{label}</span>
              ) : (
                <Link to={to} className="hover:text-gray-900 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
