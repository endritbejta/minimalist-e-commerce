
import './App.css'

import HeroBanner from "./components/Home/HeroBanner";
import FeaturedTabs from "./components/Home/FeaturedTabs";
import PromoGrid from "./components/Home/PromoGrid";

import SEO from "./components/UI/SEO";

function App() {
  return (
    <div className="home-page">
      <SEO 
        title="Premium Minimalist Essentials"
        description="Curating the finest minimalist tech, accessories, and apparel for your modern lifestyle. Quality over quantity, always."
        keywords="minimalist, tech accessories, apparel, premium quality, modern lifestyle"
      />
      <HeroBanner />
      <FeaturedTabs />
      <PromoGrid />
    </div>
  );
}


export default App;
