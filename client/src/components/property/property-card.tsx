import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bed, Bath, Square, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyStyleBadge from "./property-style-badge";
import type { Property } from "@shared/schema";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
  variant?: "vertical" | "horizontal";
  className?: string;
}

export default function PropertyCard({ property, variant = "vertical", className = "" }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[currentImageIndex];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (variant === "horizontal") {
    return (
      <Card className={`property-card group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}>
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-80 h-48 overflow-hidden flex-shrink-0">
            <img 
              src={currentImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Image Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {property.featured && (
                <Badge className="bg-bjork-beige text-white">Featured</Badge>
              )}
              {property.luxury && (
                <Badge className="bg-bjork-blue text-white">Luxury</Badge>
              )}
              {property.yearBuilt && property.yearBuilt >= new Date().getFullYear() - 1 && (
                <Badge className="bg-green-500 text-white">New Construction</Badge>
              )}
            </div>

            {/* Heart Icon */}
            <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-300">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Content Section */}
          <CardContent className="p-6 flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-display font-medium text-bjork-black">
                {formatPrice(property.price)}
              </h3>
              {property.mlsId && (
                <span className="text-sm text-gray-500 opacity-50"># {property.mlsId}</span>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
            
            {property.neighborhood && (
              <p className="text-sm text-bjork-beige mb-4 font-medium">
                {property.neighborhood}
              </p>
            )}
            
            <div className="mb-4">
              <PropertyStyleBadge 
                architecturalStyle={property.architecturalStyle}
                secondaryStyle={property.secondaryStyle}
                styleConfidence={property.styleConfidence}
                styleFeatures={property.styleFeatures}
              />
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span className="font-medium text-bjork-black">{property.beds}</span>
                <span>Beds</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span className="font-medium text-bjork-black">{formatBaths(property.baths)}</span>
                <span>Baths</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="w-4 h-4" />
                <span className="font-medium text-bjork-black">{property.sqft.toLocaleString()}</span>
                <span>Sq.Ft.</span>
              </div>
            </div>
            
            <Link href={`/property/${property.mlsId || property.listingKey || property.id}`}>
              <Button className="w-full bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                View Details
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`property-card group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}>
      <div className="relative h-64 overflow-hidden">
        <img 
          src={currentImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <Badge className="bg-bjork-beige text-white">Featured</Badge>
          )}
          {property.luxury && (
            <Badge className="bg-bjork-blue text-white">Luxury</Badge>
          )}
          {property.yearBuilt && property.yearBuilt >= new Date().getFullYear() - 1 && (
            <Badge className="bg-green-500 text-white">New Construction</Badge>
          )}
        </div>
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-300">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-display font-medium text-bjork-black">
            {formatPrice(property.price)}
          </h3>
          {property.mlsId && (
            <span className="text-sm text-gray-500 opacity-50"># {property.mlsId}</span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">
          {property.address}, {property.city}, {property.state} {property.zipCode}
        </p>
        
        {property.neighborhood && (
          <p className="text-sm text-bjork-beige mb-4 font-medium">
            {property.neighborhood}
          </p>
        )}
        
        <div className="mb-4">
          <PropertyStyleBadge 
            architecturalStyle={property.architecturalStyle}
            secondaryStyle={property.secondaryStyle}
            styleConfidence={property.styleConfidence}
            styleFeatures={property.styleFeatures}
          />
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4" />
            <span className="font-medium text-bjork-black">{property.beds}</span>
            <span>Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4" />
            <span className="font-medium text-bjork-black">{formatBaths(property.baths)}</span>
            <span>Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="w-4 h-4" />
            <span className="font-medium text-bjork-black">{property.sqft.toLocaleString()}</span>
            <span>Sq.Ft.</span>
          </div>
        </div>
        
        <Link href={`/property/${property.mlsId || property.listingKey || property.id}`}>
          <Button className="w-full bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
