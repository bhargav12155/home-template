import Hero from "@/components/sections/hero";
import FeaturedListings from "@/components/sections/featured-listings";
import CommunitiesGrid from "@/components/sections/communities-grid";
import AboutMichael from "@/components/sections/about-michael";
import VideoShowcase from "@/components/sections/video-showcase";
import MarketInsights from "@/components/sections/market-insights";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedListings />
      <CommunitiesGrid />
      <AboutMichael />
      <VideoShowcase />
      <MarketInsights />
      <ContactSection />
    </div>
  );
}
