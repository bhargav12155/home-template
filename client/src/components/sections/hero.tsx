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
import heroVideo from "@assets/Web page video_1753809980517.mp4";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    setLocation(`/search?${params.toString()}`);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'none' }}
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.5; // Slow down to 50% speed
            }
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-bjork-black/40 video-overlay" />
      </div>

      {/* Main Title - Centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pt-16">
        <h1
          className="hero-title text-4xl md:text-6xl lg:text-7xl font-display font-light text-white text-center leading-tight animate-fade-in-up"
          style={{ marginTop: -400 }}
        >
          Luxury is an <br />
          <span className="text-bjork-beige">Experience</span>
        </h1>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 text-center text-white max-w-4xl mx-auto px-4 pb-16 lg:pb-20 animate-fade-in-up">
        <p className="text-lg md:text-xl lg:text-2xl mb-6 lg:mb-8 font-light max-w-2xl mx-auto leading-relaxed">
          {template?.companyDescription ||
            "Discover exceptional homes with Nebraska's premier luxury real estate team"}
        </p>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter Location, Zip, Address or MLS #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-soft-black border-gray-200 focus:ring-bjork-blue"
            />
            <Select
              value={minPrice || "any"}
              onValueChange={(value) =>
                setMinPrice(value === "any" ? "" : value)
              }
            >
              <SelectTrigger className="text-soft-black border-gray-200 focus:ring-bjork-blue">
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
              <SelectTrigger className="text-soft-black border-gray-200 focus:ring-bjork-blue">
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
