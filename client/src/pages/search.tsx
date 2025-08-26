import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
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
import { useInfinitePropertySearch } from "@/hooks/useInfinitePropertySearch";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Search() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState<PropertySearch>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update search params when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery !== (searchParams.query || "")) {
      const newParams = { ...searchParams, query: debouncedSearchQuery || undefined };
      setSearchParams(newParams);
      handleSearch(newParams);
    }
  }, [debouncedSearchQuery]);

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: PropertySearch = {};
    
    if (urlParams.get("query")) {
      params.query = urlParams.get("query")!;
      setSearchQuery(urlParams.get("query")!);
    }
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

  const { 
    data: properties, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfinitePropertySearch(searchParams);
  
  // Ref for intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Row - Main Search */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light leading-tight text-bjork-black">
              Lincoln, NE Homes for Sale
            </h1>
            <div className="flex-1 max-w-2xl">
              <div className="relative flex">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Address, City, or Zip Code"
                    className="pl-10 pr-4 py-2 border-gray-300 rounded-r-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch({ ...searchParams, query: searchQuery || undefined });
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={() => handleSearch({ ...searchParams, query: searchQuery || undefined })}
                  className="bg-bjork-black hover:bg-bjork-blue text-white px-6 rounded-l-none"
                >
                  Search
                </Button>
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
            <Select value={searchParams.minPrice?.toString() || ""} onValueChange={(value) => {
              const newParams = { ...searchParams, minPrice: value ? parseInt(value) : undefined };
              setSearchParams(newParams);
              handleSearch(newParams);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="PRICE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Price</SelectItem>
                <SelectItem value="100000">$100K+</SelectItem>
                <SelectItem value="200000">$200K+</SelectItem>
                <SelectItem value="300000">$300K+</SelectItem>
                <SelectItem value="400000">$400K+</SelectItem>
                <SelectItem value="500000">$500K+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={searchParams.beds?.toString() || ""} onValueChange={(value) => {
              const newParams = { ...searchParams, beds: value ? parseInt(value) : undefined };
              setSearchParams(newParams);
              handleSearch(newParams);
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="BED & BATH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Beds</SelectItem>
                <SelectItem value="1">1+ Bed</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </SelectContent>
            </Select>

            <Select value={searchParams.propertyType || ""} onValueChange={(value) => {
              const newParams = { ...searchParams, propertyType: value || undefined };
              setSearchParams(newParams);
              handleSearch(newParams);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="TYPE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Type</SelectItem>
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

            <Button variant="outline" className="border-gray-300" onClick={() => {
              const newParams = {};
              setSearchParams(newParams);
              setSearchQuery("");
              handleSearch(newParams);
            }}>
              <Filter className="h-4 w-4 mr-2" />
              CLEAR FILTERS
            </Button>

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-bjork-black text-white shadow-md" 
                    : "text-gray-600 hover:text-bjork-black hover:bg-white"
                }`}
              >
                <Grid className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-bjork-black text-white shadow-md" 
                    : "text-gray-600 hover:text-bjork-black hover:bg-white"
                }`}
              >
                <List className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">List</span>
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
      <div className="flex min-h-screen">
        {/* Map Section */}
        <div className="w-1/2 sticky top-0 h-screen">
          <GoogleMap
            properties={properties || []}
            center={{ lat: 40.8136, lng: -96.7026 }} // Lincoln, NE
            zoom={12}
            selectedPropertyId={selectedProperty}
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
        <div className="w-1/2 bg-white">{/* This will naturally scroll with the page */}
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
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {properties?.map((property) => (
                <div
                  key={property.id}
                  id={`property-${property.id}`}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedProperty === property.id 
                      ? 'ring-2 ring-bjork-black ring-offset-4 scale-[1.02]' 
                      : ''
                  }`}
                  onClick={() => setSelectedProperty(property.id)}
                >
                  <PropertyCard
                    property={property}
                    className="hover:shadow-2xl transition-shadow duration-500 h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Completely redesigned list view - compact table style
            <div className="p-6">
              {/* List Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg mb-4 text-sm font-medium text-gray-600 uppercase tracking-wide">
                <div className="col-span-4">Property</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Beds/Baths</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Actions</div>
              </div>
              
              {/* List Items */}
              <div className="space-y-2">
                {properties?.map((property) => {
                  const formatPrice = (price: string) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(parseFloat(price));
                  };

                  const formatBaths = (baths: string) => {
                    const bathNum = parseFloat(baths);
                    return bathNum % 1 === 0 ? bathNum.toString() : baths;
                  };

                  const currentImage = property.images && property.images.length > 0 
                    ? property.images[0] 
                    : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

                  return (
                    <div
                      key={property.id}
                      id={`property-${property.id}`}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer items-center hover:bg-gray-50 hover:border-bjork-black ${
                        selectedProperty === property.id 
                          ? 'bg-bjork-beige/10 border-bjork-black shadow-md' 
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={() => setSelectedProperty(property.id)}
                    >
                      {/* Property Info with Image - Mobile: full width, Desktop: 4 cols */}
                      <div className="col-span-1 md:col-span-4 flex items-center space-x-3">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={currentImage}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          {(property.featured || property.luxury) && (
                            <div className="absolute top-1 left-1">
                              {property.featured && (
                                <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                              )}
                              {property.luxury && (
                                <div className="w-2 h-2 bg-bjork-blue rounded-full mt-0.5"></div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-bjork-black truncate">
                            {property.address}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {property.city}, {property.state} {property.zipCode}
                          </p>
                          {property.neighborhood && (
                            <p className="text-xs text-bjork-beige font-medium truncate">
                              {property.neighborhood}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price - Mobile: inline, Desktop: 2 cols */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="md:hidden text-sm text-gray-500">Price:</div>
                        <div className="text-lg md:text-xl font-semibold text-bjork-black">
                          {formatPrice(property.price)}
                        </div>
                        {property.mlsId && (
                          <div className="text-xs text-gray-400">#{property.mlsId}</div>
                        )}
                      </div>

                      {/* Beds/Baths - Mobile: inline, Desktop: 2 cols */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="md:hidden text-sm text-gray-500">Beds/Baths:</div>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-bjork-black">{property.beds}</span>
                            <span className="text-gray-500">bd</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-bjork-black">{formatBaths(property.baths)}</span>
                            <span className="text-gray-500">ba</span>
                          </div>
                        </div>
                      </div>

                      {/* Size - Mobile: inline, Desktop: 2 cols */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="md:hidden text-sm text-gray-500">Square Feet:</div>
                        <div className="text-sm">
                          <span className="font-medium text-bjork-black">{property.sqft.toLocaleString()}</span>
                          <span className="text-gray-500 ml-1">sq ft</span>
                        </div>
                        {property.sqft > 0 && (
                          <div className="text-xs text-gray-400">
                            ${Math.round(parseFloat(property.price) / property.sqft)}/sq ft
                          </div>
                        )}
                      </div>

                      {/* Actions - Mobile: full width, Desktop: 2 cols */}
                      <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
                        <Link 
                          href={`/property/${property.mlsId || property.listingKey || property.id}`}
                          className="flex-1"
                        >
                          <Button 
                            size="sm"
                            className="w-full bg-bjork-black text-white hover:bg-bjork-blue text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="p-2 border-gray-300 hover:border-bjork-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle save functionality
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="p-6 text-center">
              {isFetchingNextPage ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjork-black"></div>
                  </div>
                  <p className="text-gray-600">Loading more properties...</p>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  className="border-bjork-black text-bjork-black hover:bg-bjork-black hover:text-white"
                >
                  Load More Properties
                </Button>
              )}
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
