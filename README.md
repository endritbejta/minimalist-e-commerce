# Minimalist Essentials — Premium E-Commerce

A minimalist e-commerce storefront built with **React 19**, **Vite** and **Tailwind CSS**.
Client-side only: the catalog is static data, and the cart and placed orders live
in `localStorage`.

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
│                checkout totals and validation, order records, price
│                formatting, emblem geometry, site constants
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
- **The checkout's arithmetic is one pure function.** `getOrderTotals` in
  `lib/checkout.js` turns the cart's subtotal and discount into every line of
  the order, and both the cart drawer and the checkout render those figures
  through the same `TotalsRow`. The free-delivery threshold is exported from
  there too, and the product page and shipping policy quote it from that
  constant — a checkout that charged for delivery the product page called free
  would be the worst kind of copy drift.
- **A checkout field says nothing until it has been left once.**
  `lib/checkoutReducer.js` owns that rule — complaining about an incomplete
  email halfway through typing it is noise, but going quiet the moment it
  becomes valid is not. Submitting asks for everything at once and sends focus
  to the first field that failed.

## Checkout

Cart → `/checkout` → `/orders/:orderNumber`.

**One page, not a stepper.** It was three steps to begin with, which is the
shape a checkout takes when it has to carve out payment. This one takes no
payment, which left a step for three radio buttons and a step for reviewing ten
fields that were still on screen — so the stepper cost more attention than the
form did. Everything is asked for once, with the totals alongside throughout.

**It has its own shell.** `CheckoutLayout` replaces the site header with the
wordmark alone and the footer with policy links: collection nav, search and a
cart icon are all invitations to leave a purchase half-finished, and the cart
icon in particular opened the drawer over the checkout, where its own
"Checkout" button pointed at the page the shopper was already on. The drawer is
still mounted without the icon that opened it, so the summary's "Edit" can bring
it up deliberately — and from there the action reads "Back to checkout". The
confirmation goes back to the full shell: the order is placed, so there is
nothing left to protect and the nav is the useful thing to offer next.

**No card details are collected, and no payment form is rendered.** The store
takes no money, so it asks for no card: a realistic-looking payment form on a
demo is a phishing layout with a friendly name, and nothing worth demonstrating
is lost by leaving it out. A notice above the Place order button says plainly
that nothing is charged.

Placing an order writes it to `localStorage` and clears the cart. The
confirmation lives at a real URL that survives a reload, which is the only
reason the order is stored at all — it never leaves the device, only the last
few are kept, and a stored order is validated on the way back out the way
rehydrated cart lines are. An order placed on one browser is genuinely not
found on another, and the page says so rather than pretending otherwise.

Both routes carry `noindex`, are kept out of the generated sitemap, and are
disallowed in `robots.txt` for crawlers that never run the JavaScript.

## Accessibility

- Every dialog traps focus, closes on Escape, and returns focus to its trigger.
- Animated headings expose their text via `aria-label`; the per-character spans
  are hidden from assistive technology.
- `prefers-reduced-motion` is honoured globally in `index.css`.
- The design is light-only and declares `color-scheme: light`.

## Testing

Unit tests cover the parts where a mistake is expensive — cart line identity,
reducer transitions, persistence and rehydration of untrusted `localStorage`
data, catalog lookups, price formatting, and the checkout: what each line of the
order totals comes to, what counts as a valid address, and when a field is
allowed to complain.

```bash
npm test
```

## Known Limitations

This is a portfolio demo, not a shop:

- No backend. Checkout completes and produces a real order record, but nothing
  is charged, no email is sent and nothing ships; the contact/newsletter forms
  only confirm locally.
- Orders exist only in the browser that placed them. There are no accounts and
  no order history beyond the last few kept in `localStorage`.
- Tax is a flat estimated rate, not one derived from the delivery address.
- Discount codes are checked in the browser against `lib/coupons.js`, so they
  are visible to and editable by anyone using the site. Real discounts have to
  be validated server-side. `MINIMAL10`, `ESSENTIALS20` and `FREESHIP` work in
  the demo.
- Product photography is placeholder imagery from Unsplash. The t-shirt colour
  variants all share one photo, so the swatches change the selection but not the
  picture.
- Customization is captured and priced at the base rate; there is no upcharge.

---

Curated with care by **Endrit Bejta**.
