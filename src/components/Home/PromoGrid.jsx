import Button from '../UI/Button';

const PROMOS = [
  {
    title: 'Summer Essentials',
    cta: 'Explore Collection',
    to: '/collections/accessories',
    fallback: 'bg-[#e5e7eb]',
    image:
      "https://images.unsplash.com/photo-1743062356649-eb59ce7b8140?q=80&w=1432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: 'Tech Setup',
    cta: 'View Gadgets',
    to: '/collections/electronics',
    fallback: 'bg-[#d1d5db]',
    image:
      "https://images.unsplash.com/photo-1765551097131-03fb35a0d6c3?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

/**
 * PromoGrid Component
 * Promotional banners linking to collections.
 */
function PromoGrid() {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <h2 className="sr-only">Featured collections</h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROMOS.map(({ title, cta, to, image, fallback }) => (
          <div
            key={to}
            // Set through style rather than a Tailwind arbitrary value: the
            // Unsplash URLs contain characters that make class names brittle.
            style={{ backgroundImage: `url("${image}")` }}
            className={`h-[400px] ${fallback} bg-cover bg-center rounded-2xl flex items-center justify-center relative overflow-hidden group`}
          >
            {/* Scrim keeps the heading readable whatever the photo does. */}
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-500" />
            <div className="z-10 text-center">
              <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-sm">{title}</h3>
              <Button to={to} variant="secondary">{cta}</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PromoGrid;
