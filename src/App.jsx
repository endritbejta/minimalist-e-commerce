import HeroBanner from "./components/Home/HeroBanner";
import FeaturedTabs from "./components/Home/FeaturedTabs";
import PromoGrid from "./components/Home/PromoGrid";
import SEO from "./components/UI/SEO";
import { SITE } from "./lib/site";

/**
 * Home Page
 * Composes the marketing sections shown at the root route.
 */
function Home() {
  return (
    <div className="home-page">
      <SEO
        title="Premium Minimalist Essentials"
        description={SITE.description}
        keywords="minimalist, tech accessories, apparel, premium quality, modern lifestyle"
      />
      {/* The carousel headings are h2s, so the page needs its own single h1. */}
      <h1 className="sr-only">{SITE.name} — {SITE.tagline}</h1>
      <HeroBanner />
      <FeaturedTabs />
      <PromoGrid />
    </div>
  );
}

export default Home;
