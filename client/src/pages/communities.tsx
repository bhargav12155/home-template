import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { MapPin, Home, Users, DollarSign, TrendingUp } from "lucide-react";

interface Community {
  id: number;
  name: string;
  description: string;
  city: string;
  state: string;
  avgPrice: number;
  priceRange: string;
  homeCount: number;
  amenities: string[];
  featured: boolean;
  imageUrl: string;
}

export default function Communities() {
  // Fetch communities data
  const { data: communities, isLoading, error } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    initialData: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden bg-gradient-to-br from-bjork-black via-bjork-black/95 to-bjork-black/90">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Nebraska communities" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/60" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light mb-6 leading-tight">
              Nebraska <span className="text-bjork-beige">Communities</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed">
              Discover exceptional neighborhoods and communities across Omaha and Lincoln
            </p>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-bjork-black mb-6 leading-tight">
              Featured Communities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the finest neighborhoods in Nebraska, each offering unique character and exceptional living experiences
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load communities</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Communities Grid */}
          {communities && communities.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communities.map((community) => (
                <Card key={community.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={community.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={community.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {community.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-bjork-beige text-bjork-black">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-display font-bold text-bjork-black mb-2 group-hover:text-bjork-beige transition-colors">
                        {community.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {community.city}, {community.state}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {community.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-bjork-beige" />
                        <span>{community.homeCount} homes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-bjork-beige" />
                        <span>{community.priceRange}</span>
                      </div>
                    </div>

                    {community.amenities && community.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {community.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {community.amenities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{community.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Avg: ${community.avgPrice?.toLocaleString() || 'N/A'}
                      </div>
                      <Link href={`/search?community=${encodeURIComponent(community.name)}`}>
                        <Button 
                          size="sm"
                          className="bg-bjork-black hover:bg-bjork-beige hover:text-bjork-black text-white transition-all duration-300"
                        >
                          View Homes
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {communities && communities.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-display font-bold text-bjork-black mb-4">
                No Communities Available
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for featured communities in your area.
              </p>
              <Link href="/search">
                <Button 
                  className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
                >
                  Browse All Properties
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-bjork-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-display font-light mb-6 leading-tight">
            Find Your Perfect <span className="text-bjork-beige">Community</span>
          </h2>
          <p className="text-xl mb-8 font-light leading-relaxed">
            Let our expert team help you discover the ideal neighborhood that matches your lifestyle and preferences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium"
              >
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/search">
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-bjork-black px-8 py-4 text-lg font-medium bg-transparent"
              >
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
