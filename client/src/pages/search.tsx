import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PropertySearchComponent from "@/components/property/property-search";
import PropertyCard from "@/components/property/property-card";
import GoogleMap from "@/components/google-map";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Map, Heart, Search as SearchIcon, Filter, ChevronDown } from "lucide-react";
import type { PropertySearch } from "@shared/schema";
import { usePropertySearch } from "@/hooks/usePropertySearch";

export default function Search() {
  const [location] = useLocation();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<PropertySearch>({});
  const [showFilters, setShowFilters] = useState(false);

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

  const { data: properties, isLoading, error, isExternal } = usePropertySearch(searchParams);

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
    <div className="min-h-screen bg-white pt-20">
      {/* Header with Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Row - Main Search */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light leading-tight text-bjork-black">
              Lincoln, NE Homes for Sale
            </h1>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Address, City, or Zip Code"
                  className="pl-10 pr-4 py-2 border-gray-300"
                  value={searchParams.query || ""}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                />
              </div>
            </div>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white px-6"
              onClick={() => handleSearch(searchParams)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Save Search
            </Button>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={searchParams.minPrice?.toString() || ""} onValueChange={(value) => setSearchParams(prev => ({ ...prev, minPrice: value ? parseInt(value) : undefined }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="PRICE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100000">$100K+</SelectItem>
                <SelectItem value="200000">$200K+</SelectItem>
                <SelectItem value="300000">$300K+</SelectItem>
                <SelectItem value="400000">$400K+</SelectItem>
                <SelectItem value="500000">$500K+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={searchParams.beds?.toString() || ""} onValueChange={(value) => setSearchParams(prev => ({ ...prev, beds: value ? parseInt(value) : undefined }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="BED & BATH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+ Bed</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </SelectContent>
            </Select>

            <Select value={searchParams.propertyType || ""} onValueChange={(value) => setSearchParams(prev => ({ ...prev, propertyType: value || undefined }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="TYPE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Family">House</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Multi-Family">Multi-Family</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="STATUS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">For Sale</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              ALL FILTERS
            </Button>

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-bjork-black text-white" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-bjork-black text-white" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-bjork-black">{properties?.length || 0}</span> of{" "}
              <span className="font-bold text-bjork-black">1084</span> listings
              <span className="ml-4">Sort: <Button variant="link" className="p-0 h-auto text-blue-600">Newest <ChevronDown className="h-3 w-3 ml-1" /></Button></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Map Section */}
        <div className="w-1/2 relative">
          <GoogleMap
            properties={properties || []}
            center={{ lat: 40.8136, lng: -96.7026 }} // Lincoln, NE
            zoom={12}
            onPropertySelect={(property) => {
              setSelectedProperty(property.id);
              // Scroll to property in the list
              const element = document.getElementById(`property-${property.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          />
        </div>

        {/* Properties List Section */}
        <div className="w-1/2 overflow-y-auto bg-white">
          {isLoading ? (
            <div className="p-6 space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-600">Error loading properties: {error.message}</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="p-6 grid grid-cols-1 gap-6">
              {properties?.map((property) => (
                <div
                  key={property.id}
                  id={`property-${property.id}`}
                  className={`transition-all duration-300 ${
                    selectedProperty === property.id 
                      ? 'ring-2 ring-bjork-black ring-offset-2' 
                      : ''
                  }`}
                >
                  <PropertyCard
                    property={property}
                    className="hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {properties?.map((property) => (
                <div
                  key={property.id}
                  id={`property-${property.id}`}
                  className={`transition-all duration-300 ${
                    selectedProperty === property.id 
                      ? 'bg-bjork-beige/10 border-l-4 border-bjork-black' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <PropertyCard
                    property={property}
                    variant="horizontal"
                    className="p-6 transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {properties && properties.length === 0 && !isLoading && (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
              <Button 
                variant="outline"
                onClick={() => setSearchParams({})}
                className="border-bjork-black text-bjork-black hover:bg-bjork-black hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section className="bg-bjork-black text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-light leading-tight mb-4">
            Search & Save Your Favorite <span className="font-bold text-bjork-beige">Homes For Sale</span> In Lincoln, NE & Surrounding Areas
          </h2>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            Search hundreds of homes for sale in Lincoln, NE & surrounding areas. Save your searches and get notified of new listings "before" they hit the 
            MLS! When you save a search, any new homes matching your wish list criteria will be delivered straight to your inbox the moment they go up for sale.
          </p>
          
          <div className="bg-white/10 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-display font-light leading-tight mb-6 text-bjork-beige">Get in Touch</h3>
            <p className="mb-6">If you are ready to narrow your search and learn more about homes for sale in Lincoln, NE — Get in touch now!</p>
            <div className="space-y-4">
              <Button 
                size="lg"
                className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black w-full"
              >
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
