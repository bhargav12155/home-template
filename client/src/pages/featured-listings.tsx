import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";
import PropertyCard from "@/components/property/property-card";

interface FeaturedFilters {
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  bathrooms: string;
  location: string;
  features: string[];
  sortBy: string;
}

export default function FeaturedListings() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FeaturedFilters>({
    propertyType: "any",
    priceRange: "any",
    bedrooms: "any",
    bathrooms: "any",
    location: "any",
    features: [],
    sortBy: "newest"
  });

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  // Fetch featured properties based on filters
  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ["/api/properties/featured", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      // Add filters to search params
      if (filters.propertyType !== "any") searchParams.append("propertyType", filters.propertyType);
      if (filters.priceRange !== "any") {
        const [min, max] = filters.priceRange.split("-");
        if (min) searchParams.append("minPrice", min);
        if (max && max !== "plus") searchParams.append("maxPrice", max);
      }
      if (filters.bedrooms !== "any") searchParams.append("beds", filters.bedrooms);
      if (filters.bathrooms !== "any") searchParams.append("baths", filters.bathrooms);
      if (filters.location !== "any") searchParams.append("location", filters.location);
      if (filters.features.length > 0) searchParams.append("features", filters.features.join(","));
      searchParams.append("sortBy", filters.sortBy);
      searchParams.append("featured", "true");
      searchParams.append("limit", "20");
      
      const response = await fetch(`/api/properties/search?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured properties");
      }
      return response.json();
    },
  });

  const handleFilterChange = (key: keyof FeaturedFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      propertyType: "any",
      priceRange: "any",
      bedrooms: "any",
      bathrooms: "any",
      location: "any",
      features: [],
      sortBy: "newest"
    });
  };

  const availableFeatures = [
    "Pool", "Fireplace", "Garage", "Updated Kitchen", "Hardwood Floors",
    "Basement", "Deck/Patio", "Walk-in Closet", "Master Suite", "New Construction"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden bg-gradient-to-br from-bjork-black/70 via-bjork-black/60 to-bjork-black/50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Featured luxury homes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/40" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-4 leading-tight">
              Featured <span className="font-bold">Listings</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 font-light max-w-2xl mx-auto leading-relaxed">
              Discover our handpicked selection of exceptional properties
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-light text-bjork-black mb-2">
              Filter Featured <span className="font-bold">Properties</span>
            </h2>
            <p className="text-gray-600">Customize your search to find the perfect featured listing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Property Type */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</Label>
              <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</Label>
              <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-300000">Under $300K</SelectItem>
                  <SelectItem value="300000-500000">$300K - $500K</SelectItem>
                  <SelectItem value="500000-750000">$500K - $750K</SelectItem>
                  <SelectItem value="750000-1000000">$750K - $1M</SelectItem>
                  <SelectItem value="1000000-plus">$1M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Beds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Beds</SelectItem>
                  <SelectItem value="1">1+ Bed</SelectItem>
                  <SelectItem value="2">2+ Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                  <SelectItem value="4">4+ Beds</SelectItem>
                  <SelectItem value="5">5+ Beds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Bathrooms</Label>
              <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange("bathrooms", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Baths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Baths</SelectItem>
                  <SelectItem value="1">1+ Bath</SelectItem>
                  <SelectItem value="2">2+ Baths</SelectItem>
                  <SelectItem value="3">3+ Baths</SelectItem>
                  <SelectItem value="4">4+ Baths</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Location</Label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Location</SelectItem>
                  <SelectItem value="omaha">Omaha</SelectItem>
                  <SelectItem value="lincoln">Lincoln</SelectItem>
                  <SelectItem value="papillion">Papillion</SelectItem>
                  <SelectItem value="bellevue">Bellevue</SelectItem>
                  <SelectItem value="gretna">Gretna</SelectItem>
                  <SelectItem value="elkhorn">Elkhorn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Listed</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="beds">Most Bedrooms</SelectItem>
                  <SelectItem value="size">Largest Square Feet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features Filter */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Features</Label>
            <div className="flex flex-wrap gap-2">
              {availableFeatures.map((feature) => (
                <Badge
                  key={feature}
                  variant={filters.features.includes(feature) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.features.includes(feature)
                      ? "bg-bjork-black text-white hover:bg-bjork-black/90"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleFeatureToggle(feature)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={() => refetch()}
              className="bg-bjork-black hover:bg-bjork-black/90 text-white"
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjork-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading featured properties...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-display font-light text-bjork-black">
                  <span className="font-bold">{properties?.data?.length || 0}</span> Featured Properties Found
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/search')}
                  className="text-bjork-black border-bjork-black hover:bg-bjork-black hover:text-white"
                >
                  View All Properties
                </Button>
              </div>

              {properties?.data?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.data.map((property: any) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured properties found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or browse all available properties.
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={clearFilters}
                        className="bg-bjork-black hover:bg-bjork-black/90 text-white w-full"
                      >
                        Clear Filters
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setLocation('/search')}
                        className="w-full"
                      >
                        Browse All Properties
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
