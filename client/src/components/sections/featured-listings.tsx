import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { Heart, Share2, Bed, Bath, Home, Car, MapPin } from "lucide-react";
import type { Property } from "@shared/schema";

export default function FeaturedListings() {
  const [, setLocation] = useLocation();

  // Fetch template configuration for agent info
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  // Fetch featured properties - get 8 properties for 2 rows x 4 columns
  const { data: properties, isLoading, error } = usePropertySearch({
    featured: true,
    limit: 8
  });

  // Debug logging
  console.log('Featured Properties Debug:', {
    properties,
    isLoading,
    error,
    propertiesLength: properties?.length,
    firstProperty: properties?.[0]
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Property badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge className="bg-red-600 text-white">Featured</Badge>
          )}
          {property.luxury && (
            <Badge className="bg-yellow-500 text-black">Luxury</Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Property status */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-green-600 text-white capitalize">
            {property.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-xl font-display font-bold text-bjork-black mb-1 group-hover:text-bjork-beige transition-colors">
            {formatPrice(property.price)}
          </h3>
          <p className="text-gray-600 text-sm flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.beds}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.baths}
          </div>
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {property.sqft?.toLocaleString()} sqft
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {property.propertyType} • {property.yearBuilt}
          </div>
          <Button 
            size="sm" 
            className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/property/${property.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PropertySkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex gap-4 mb-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
                <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-light text-bjork-black mb-6 leading-tight">
            Featured Property Listings
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exceptional properties in Nebraska's most desirable neighborhoods
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Unable to load featured properties</p>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        )}

        {/* Properties Grid */}
        {properties && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {properties.slice(0, 8).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* No Properties State */}
        {properties && properties.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-display font-bold text-bjork-black mb-4">
              No Featured Properties Available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for our latest featured listings.
            </p>
            <Button 
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
              onClick={() => setLocation('/search')}
            >
              Browse All Properties
            </Button>
          </div>
        )}

        {/* View All Properties Button */}
        {properties && properties.length > 0 && (
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-bjork-black hover:bg-bjork-beige hover:text-bjork-black text-white px-8 py-4 text-lg transition-all duration-300"
              onClick={() => setLocation('/search')}
            >
              View All Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}