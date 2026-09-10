# Minimalist Essentials — Premium E-Commerce

A minimalist e-commerce storefront built with **React 19**, **Vite** and **Tailwind CSS**.
Client-side only: the catalog is static data and the cart lives in `localStorage`.

🔗 **[Live Demo](https://endrits-e-commerce.netlify.app/)**

---

## Getting Started

```bash
npm install
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (regenerates `public/sitemap.xml` first) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint, including the React Compiler rules |
| `npm test` | Vitest unit tests |

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) with the React Compiler
- **Build**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Tests**: [Vitest](https://vitest.dev/)

Document metadata uses React 19's built-in `<title>`/`<meta>` hoisting, so there is no
helmet library. `index.html` deliberately declares neither, to avoid duplicate tags.

---

## Architecture

```
src/
├─ lib/          Framework-free logic — catalog lookups, cart line identity,
│                price formatting, emblem geometry, site constants
├─ context/      Each context is split in two: `XContext.js` holds the context
│                object and its hook, `XProvider.jsx` holds the component.
│                Keeps React Fast Refresh working.
├─ hooks/        useScrollLock, useDialog, usePersistedReducer, and friends
├─ components/   UI, grouped by feature (Cart, Collection, Home, Product, UI)
├─ Layout/       Header, Footer, MainLayout, CartDrawer, MobileMenu
├─ pages/        Route components (all code-split)
└─ data/         Static product catalog
```

A few conventions worth knowing:

- **Nothing imports `data/products` to look something up.** `lib/catalog.js` owns
  lookups, the collection registry and the nav list, so a new collection in the
  data is automatically reachable and an unknown URL 404s properly.
- **Prices only ever render through `formatPrice`.**
- **A cart line is identified by variant *and* customization**, not by product id
  — see `lib/cart.js`. Two colours of the same shirt are two lines.
- **Adding to the cart is animated by the compositor.** `FlyToCartProvider`
  sends a disc of the product arcing from the button to the cart icon using the
  Web Animations API, and the item is added when it lands. The geometry is a
  pure function in `lib/flyToCart.js`.
- **Overlays share `useScrollLock` and `useDialog`.** The scroll lock is
  reference-counted so overlapping overlays cannot unlock the page early, and
  closed overlays are marked `inert` so they leave the tab order.
- **Design tokens live in `tailwind.config.js`** — including a named z-index
  scale (`z-header`, `z-modal`, `z-cart`…) rather than ad-hoc values.

## Accessibility

- Every dialog traps focus, closes on Escape, and returns focus to its trigger.
- Animated headings expose their text via `aria-label`; the per-character spans
  are hidden from assistive technology.
- `prefers-reduced-motion` is honoured globally in `index.css`.
- The design is light-only and declares `color-scheme: light`.

## Testing

Unit tests cover the parts where a mistake is expensive — cart line identity,
reducer transitions, persistence and rehydration of untrusted `localStorage`
data, catalog lookups and price formatting.

```bash
npm test
```

## Known Limitations

This is a portfolio demo, not a shop:

- No backend — checkout is disabled, and the contact/newsletter forms only
  confirm locally.
- Product photography is placeholder imagery from Unsplash. The t-shirt colour
  variants all share one photo, so the swatches change the selection but not the
  picture.
- Customization is captured and priced at the base rate; there is no upcharge.

---

Curated with care by **Endrit Bejta**.
