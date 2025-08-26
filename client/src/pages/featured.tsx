import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import PropertyCard from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, MapPin, Bed, Bath, Square } from "lucide-react";
import type { Property } from "@shared/schema";

interface ExternalProperty {
  id: string;
  address: string;
  city: string;
  listPrice: number;
  soldPrice?: number;
  sqft: number;
  beds: number;
  baths: number;
  status: string;
  imageUrl?: string;
  description?: string;
}

interface ExternalApiResponse {
  data: ExternalProperty[];
  success: boolean;
}

function transformExternalProperty(external: ExternalProperty): Property {
  return {
    id: parseInt(external.id),
    mlsId: external.id,
    listingKey: null,
    title: external.address,
    description: external.description || `Beautiful ${external.beds} bedroom, ${external.baths} bathroom home in ${external.city}`,
    price: external.listPrice.toString(),
    address: external.address,
    city: external.city,
    state: 'NE',
    zipCode: '',
    beds: external.beds,
    baths: external.baths.toString(),
    sqft: external.sqft,
    yearBuilt: null,
    propertyType: 'Residential',
    status: external.status === 'sold' ? 'sold' : 'active',
    standardStatus: null,
    featured: true,
    luxury: external.listPrice > 500000,
    images: external.imageUrl ? [external.imageUrl] : [],
    neighborhood: null,
    schoolDistrict: null,
    style: null,
    coordinates: null,
    features: [],
    architecturalStyle: null,
    secondaryStyle: null,
    styleConfidence: null,
    styleFeatures: [],
    styleAnalyzed: false,
    listingAgentKey: null,
    listingOfficeName: null,
    listingContractDate: null,
    daysOnMarket: null,
    originalListPrice: null,
    mlsStatus: external.status,
    modificationTimestamp: null,
    photoCount: external.imageUrl ? 1 : 0,
    virtualTourUrl: null,
    isIdxListing: false,
    idxSyncedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export default function FeaturedListingsPage() {
  const { data: externalData, isLoading, error } = useQuery<ExternalApiResponse>({
    queryKey: ["/api/properties/external/featured"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Transform the data to match our Property schema and sort by price (highest first)
  const properties = externalData?.data
    ?.map(transformExternalProperty)
    .sort((a, b) => parseFloat(b.price) - parseFloat(a.price)) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-bjork-black via-bjork-black/95 to-bjork-black/90">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Luxury home showcase" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/60" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light mb-6 leading-tight">
              Featured <span className="text-bjork-beige">Listings</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed">
              Discover our carefully curated selection of exceptional properties
            </p>
            <Link href="/search">
              <Button 
                size="lg" 
                className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium"
              >
                Search All Properties
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Filters Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight text-bjork-black mb-4">
              Refine Your Search
            </h2>
            <p className="text-lg text-gray-700">
              Find exactly what you're looking for with our advanced filters
            </p>
          </div>
          
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="City or Neighborhood" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-300000">Under $300K</SelectItem>
                      <SelectItem value="300000-500000">$300K - $500K</SelectItem>
                      <SelectItem value="500000-750000">$500K - $750K</SelectItem>
                      <SelectItem value="750000-1000000">$750K - $1M</SelectItem>
                      <SelectItem value="1000000+">$1M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Select>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full bg-bjork-black hover:bg-bjork-black/90 text-white">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Exceptional Properties
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Each property in our featured collection has been carefully selected for its unique qualities, 
              exceptional value, and outstanding potential.
            </p>
          </div>

          {isLoading ? (
            <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load featured properties</p>
              <Link href="/search">
                <Button variant="outline">Browse All Properties</Button>
              </Link>
            </div>
          ) : properties && properties.length > 0 ? (
            <>
              <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {properties.length > 12 && (
                <div className="text-center mt-16">
                  <p className="text-gray-600 mb-4">
                    Showing {Math.min(12, properties.length)} of {properties.length} featured properties
                  </p>
                  <Link href="/search?featured=true">
                    <Button className="bg-bjork-beige text-white hover:bg-bjork-blue transition-colors duration-300 text-lg px-8 py-4">
                      View All Featured Properties
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No featured properties available at this time.</p>
              <Link href="/search">
                <Button variant="outline">Browse All Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why These Properties Are Featured */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-violet-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Why These Properties Stand Out
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-light leading-tight mb-4">Prime Locations</h3>
                <p className="text-gray-600">
                  Situated in Nebraska's most desirable neighborhoods with excellent schools, 
                  convenient amenities, and strong investment potential.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                  <Square className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-light leading-tight mb-4">Exceptional Quality</h3>
                <p className="text-gray-600">
                  Each property meets our strict criteria for construction quality, design, 
                  and overall condition to ensure lasting value.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bath className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-light leading-tight mb-4">Unique Features</h3>
                <p className="text-gray-600">
                  Properties with distinctive architectural details, premium finishes, 
                  or special amenities that set them apart from the market.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-bjork-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-light mb-8">
            Ready to Find Your <span className="text-bjork-beige">Dream Home?</span>
          </h2>
          <p className="text-xl mb-12 text-gray-300">
            Let our expert team help you discover the perfect property from our featured collection 
            or explore all available listings in Nebraska.
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
                Browse All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
