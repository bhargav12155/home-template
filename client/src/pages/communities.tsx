import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Home, TrendingUp, Star } from "lucide-react";
import type { Community } from "@shared/schema";

export default function Communities() {
  const { data: communities, isLoading, error } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load communities</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-light text-bjork-black mb-6">
            Nebraska <span className="text-bjork-beige">Communities</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From urban sophistication to suburban tranquility, discover the perfect Nebraska community for your lifestyle. Each area offers unique character, amenities, and opportunities for luxury living.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <Skeleton className="h-80 w-full" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : communities && communities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {communities.map((community) => (
              <Card key={community.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 property-card">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  <div className="relative h-80 md:h-auto">
                    <img 
                      src={community.image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={`${community.name} community`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bjork-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-bjork-beige text-white">
                        <MapPin className="w-3 h-3 mr-1" />
                        {community.name}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-display font-medium text-bjork-black mb-3">
                        {community.name}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {community.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {community.propertyCount && (
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Home className="w-5 h-5 text-bjork-beige" />
                            </div>
                            <div className="text-lg font-semibold text-bjork-black">
                              {community.propertyCount}
                            </div>
                            <div className="text-xs text-gray-500">Properties</div>
                          </div>
                        )}
                        {community.averagePrice && (
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <TrendingUp className="w-5 h-5 text-bjork-beige" />
                            </div>
                            <div className="text-lg font-semibold text-bjork-black">
                              ${Math.round(parseFloat(community.averagePrice) / 1000)}K
                            </div>
                            <div className="text-xs text-gray-500">Avg Price</div>
                          </div>
                        )}
                      </div>

                      {community.highlights && community.highlights.length > 0 && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {community.highlights.slice(0, 3).map((highlight, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Link href={`/search?city=${encodeURIComponent(community.name)}`}>
                        <Button className="w-full bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                          View Properties
                        </Button>
                      </Link>
                      <Link href={`/search?city=${encodeURIComponent(community.name)}&luxury=true`}>
                        <Button variant="outline" className="w-full border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white transition-colors duration-300">
                          Luxury Listings
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-display text-gray-600 mb-4">No Communities Available</h3>
            <p className="text-gray-500 mb-8">We're currently updating our community information.</p>
            <Link href="/search">
              <Button className="bg-bjork-black text-white hover:bg-bjork-blue">
                Browse All Properties
              </Button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-display font-light text-bjork-black mb-6">
            Ready to Explore <span className="text-bjork-beige">Your Community?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let our local experts guide you through Nebraska's finest communities and help you find the perfect neighborhood for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300 px-8">
                Schedule Tour
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white transition-colors duration-300 px-8">
                Search Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
