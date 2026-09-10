import { Link } from 'react-router-dom';

const BASE_STYLES =
  "inline-block font-bold transition-all duration-300 transform active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

const VARIANTS = {
  primary: "bg-black text-white px-10 py-4 rounded-full hover:bg-gray-800 hover:scale-105 shadow-lg",
  secondary:
    "bg-white text-black px-10 py-4 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50 hover:scale-105",
  link: "text-black underline underline-offset-4 hover:text-gray-600 px-0 py-0",
};

/**
 * Button Component
 * Renders an internal link or a button, depending on whether `to` is given.
 *
 * `onClick` is forwarded in both cases — the link branch used to swallow it.
 *
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - The button text or content.
 * @param {string} [props.to] - Internal link path; renders a Link when present.
 * @param {'primary'|'secondary'|'link'} [props.variant='primary'] - Visual style.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {Function} [props.onClick] - Click handler.
 */
const Button = ({ children, to, variant = 'primary', className = '', onClick, ...props }) => {
  const combinedClasses = `${BASE_STYLES} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
