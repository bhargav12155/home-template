import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PRICE_RANGES } from "@/lib/constants";
import { Template } from "@/types/template";
import { getImageUrlWithFallback } from "@/lib/media-utils";
import { useAuth } from "@/context/auth";
import { TEMPLATE_PLACEHOLDERS, getTemplateValue } from "@/lib/template-placeholders";
// Fallback video for when template doesn't have heroVideoUrl
import fallbackHeroVideo from "@assets/Web page video_1753809980517.mp4";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log("🔍 Hero Component Debug:");
  console.log("  - user:", user);
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - isLoading:", isLoading);

  // Fetch template configuration - use user's template if authenticated, otherwise public
  const { data: template } = useQuery<Template>({
    queryKey: isAuthenticated && user ? [`template-public-user-${user.id}`] : ["template-public-default"],
    queryFn: async ({ queryKey }) => {
      const isUserSpecific = (queryKey[0] as string).includes('user-');
      const url = isUserSpecific && user ? `/api/template/public?user=${user.id}` : '/api/template/public';
      console.log("🌐 Fetching template from URL:", url);
      console.log("  - Query key:", queryKey[0]);
      console.log("  - Is user specific:", isUserSpecific);
      console.log("  - User ID:", user?.id);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch template');
      return response.json();
    },
    enabled: !isLoading, // Wait until auth check is complete
    refetchOnMount: true,
    staleTime: 0,
  });

  console.log("Hero component current user:", user);
  console.log("Hero component template data:", template);
  console.log("Hero video URL:", template?.heroVideoUrl);
  console.log("Hero image URL:", template?.heroImageUrl);
  console.log("Fallback video URL:", fallbackHeroVideo);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    setLocation(`/search?${params.toString()}`);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        {template?.heroVideoUrl ? (
          // Video takes priority if available
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'none' }}
            onError={(e) => {
              console.error("Hero video loading error:", e);
              console.log("Failed video URL:", template.heroVideoUrl);
              // Fallback to image if video fails and image available
              const video = e.currentTarget;
              const parentDiv = video.parentElement;
              if (parentDiv) {
                video.style.display = 'none';
                const img = document.createElement('img');
                img.src = getTemplateValue(template?.heroImageUrl, TEMPLATE_PLACEHOLDERS.heroImageUrl);
                img.alt = 'Hero background';
                img.className = 'w-full h-full object-cover';
                parentDiv.appendChild(img);
              }
            }}
            onLoadStart={() => console.log("Hero video loading started")}
            onCanPlay={() => console.log("Hero video can play")}
            ref={(video) => {
              if (video) {
                video.playbackRate = 0.5; // Slow down to 50% speed
              }
            }}
          >
            <source 
              src={template.heroVideoUrl} 
              type="video/mp4"
              onError={(e) => {
                console.error("Hero video source error:", e);
                console.log("Failed source URL:", template.heroVideoUrl);
              }}
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Image background (uses template image or placeholder)
          <img 
            src={getTemplateValue(template?.heroImageUrl, TEMPLATE_PLACEHOLDERS.heroImageUrl)}
            alt="Hero background"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Hero image loading error:", e);
              console.log("Failed image URL:", template?.heroImageUrl);
              // Fallback to default video if both fail
              const img = e.currentTarget;
              const parentDiv = img.parentElement;
              if (parentDiv) {
                img.style.display = 'none';
                const video = document.createElement('video');
                video.src = fallbackHeroVideo;
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.className = 'w-full h-full object-cover';
                parentDiv.appendChild(video);
              }
            }}
          />
        )}
        <div className="absolute inset-0 bg-bjork-black/40 video-overlay" />
      </div>

      {/* Main Title - Centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pt-16">
        <h1
          className="hero-title text-4xl md:text-6xl lg:text-7xl font-display font-light text-white text-center leading-tight animate-fade-in-up"
          style={{ marginTop: -400 }}
        >
          {getTemplateValue(template?.heroTitle, TEMPLATE_PLACEHOLDERS.heroTitle)}
        </h1>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 text-center text-white max-w-4xl mx-auto px-4 pb-16 lg:pb-20 animate-fade-in-up">
        <p className="text-lg md:text-xl lg:text-2xl mb-6 lg:mb-8 font-light max-w-2xl mx-auto leading-relaxed">
          {getTemplateValue(template?.heroSubtitle, TEMPLATE_PLACEHOLDERS.heroSubtitle)}
        </p>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter Location, Zip, Address or MLS #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-[2] md:min-w-[300px] text-soft-black border-gray-200 focus:ring-bjork-blue"
            />
            <Select
              value={minPrice || "any"}
              onValueChange={(value) =>
                setMinPrice(value === "any" ? "" : value)
              }
            >
              <SelectTrigger className="w-full md:w-32 text-soft-black border-gray-200 focus:ring-bjork-blue">
                <SelectValue placeholder="Min Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Min</SelectItem>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.min} value={range.min.toString()}>
                    ${range.min.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={maxPrice || "any"}
              onValueChange={(value) =>
                setMaxPrice(value === "any" ? "" : value)
              }
            >
              <SelectTrigger className="w-full md:w-32 text-soft-black border-gray-200 focus:ring-bjork-blue">
                <SelectValue placeholder="Max Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Max</SelectItem>
                {PRICE_RANGES.map((range) => (
                  <SelectItem
                    key={range.max || 999999999}
                    value={(range.max || 999999999).toString()}
                  >
                    {range.max ? `$${range.max.toLocaleString()}` : "$2M+"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300 whitespace-nowrap px-8"
            >
              Search Homes
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
