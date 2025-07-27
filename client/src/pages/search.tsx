import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import PropertySearchComponent from "@/components/property/property-search";
import PropertyCard from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid, List, Map } from "lucide-react";
import type { Property, PropertySearch } from "@shared/schema";

export default function Search() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchParams, setSearchParams] = useState<PropertySearch>({});

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: PropertySearch = {};
    
    if (urlParams.get("query")) params.query = urlParams.get("query")!;
    if (urlParams.get("minPrice")) params.minPrice = parseInt(urlParams.get("minPrice")!);
    if (urlParams.get("maxPrice")) params.maxPrice = parseInt(urlParams.get("maxPrice")!);
    if (urlParams.get("beds")) params.beds = parseInt(urlParams.get("beds")!);
    if (urlParams.get("baths")) params.baths = parseFloat(urlParams.get("baths")!);
    if (urlParams.get("propertyType")) params.propertyType = urlParams.get("propertyType")!;
    if (urlParams.get("city")) params.city = urlParams.get("city")!;
    if (urlParams.get("luxury")) params.luxury = urlParams.get("luxury") === "true";
    if (urlParams.get("featured")) params.featured = urlParams.get("featured") === "true";

    setSearchParams(params);
  }, [location]);

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", searchParams],
    enabled: true,
  });

  const handleSearch = (params: PropertySearch) => {
    setSearchParams(params);
    
    // Update URL
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.set(key, value.toString());
      }
    });
    
    const newUrl = `/search${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-light text-bjork-black mb-4">
            Property <span className="text-bjork-beige">Search</span>
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect home in Nebraska's premier communities
          </p>
        </div>

        <PropertySearchComponent onSearch={handleSearch} initialParams={searchParams} />

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            {properties && (
              <Badge variant="outline" className="bg-white">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
              </Badge>
            )}
            {searchParams.query && (
              <Badge className="bg-bjork-beige text-white">
                Search: "{searchParams.query}"
              </Badge>
            )}
            {searchParams.luxury && (
              <Badge className="bg-bjork-blue text-white">Luxury</Badge>
            )}
            {searchParams.featured && (
              <Badge className="bg-green-500 text-white">Featured</Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-bjork-black text-white" : ""}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-bjork-black text-white" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-bjork-black text-white" : ""}
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load properties</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          viewMode === "map" ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-display mb-4">Interactive Map View</h3>
              <p className="text-gray-600 mb-4">
                Map integration will be implemented with Leaflet to show property locations
              </p>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map component placeholder</p>
              </div>
            </div>
          ) : (
            <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-display text-gray-600 mb-4">No Properties Found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your search criteria to see more results.</p>
            <Button 
              onClick={() => handleSearch({})}
              className="bg-bjork-black text-white hover:bg-bjork-blue"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
