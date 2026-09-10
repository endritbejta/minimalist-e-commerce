/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /**
       * A named stacking order. Previously every overlay picked its own
       * arbitrary value (50, 60, 70, 9999, 10000, 10010), which is why the
       * cart drawer needed a magic number to out-stack the modal.
       */
      zIndex: {
        header: '50',
        'menu-backdrop': '60',
        menu: '70',
        modal: '100',
        'search-backdrop': '110',
        search: '120',
        'cart-backdrop': '130',
        cart: '140',
        loader: '200',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(15px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        revealUp: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        revealDown: {
          from: { opacity: '0', transform: 'translateY(-100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceUp: {
          '0%': { opacity: '0', transform: 'translateY(120%)' },
          '50%': { opacity: '1', transform: 'translateY(-20%)' },
          '70%': { transform: 'translateY(10%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        sweepLeft: {
          from: { transform: 'translateX(50%)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        // `both` holds the from-state during the stagger delay, so elements
        // start hidden without needing a separate opacity-0 class.
        fadeIn: 'fadeIn 0.5s ease-out both',
        slideIn: 'slideIn 0.3s ease-out both',
        revealUp: 'revealUp 0.8s cubic-bezier(0.2, 0.6, 0.2, 1) both',
        revealDown: 'revealDown 0.8s cubic-bezier(0.2, 0.6, 0.2, 1) both',
        bounceUp: 'bounceUp 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'loading-bar': 'loadingBar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'sweep-left': 'sweepLeft 0.6s linear infinite',
      },
      boxShadow: {
        swatch:
          'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
      },
    },
  },
  plugins: [],
};
