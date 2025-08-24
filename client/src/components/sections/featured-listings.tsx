import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PropertyCard from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
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
  yearBuilt: number;
  status: string;
  propertyType: string;
  style: string;
  subdivision?: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

interface ExternalApiResponse {
  data: ExternalProperty[];
  meta: any;
}

// Transform external API data to match our Property schema
function transformExternalProperty(external: ExternalProperty): Property {
  // Extract state and zip from address if possible
  const addressParts = external.address.split(',');
  const lastPart = addressParts[addressParts.length - 1]?.trim() || '';
  const stateZipMatch = lastPart.match(/([A-Z]{2})\s+(\d{5})/);
  const state = stateZipMatch?.[1] || 'NE';
  const zipCode = stateZipMatch?.[2] || '68104';
  
  // Clean address to remove state/zip
  const cleanAddress = addressParts.slice(0, -1).join(',').trim() || external.address;

  return {
    id: parseInt(external.id.slice(-8), 16), // Convert hex ID to number
    mlsId: external.id.slice(-8), // Use last 8 chars as MLS ID
    listingKey: external.id,
    title: `${external.beds} Bed, ${external.baths} Bath ${external.style} in ${external.city}`,
    description: `Beautiful ${external.style.toLowerCase()} home in ${external.subdivision || external.city}`,
    price: external.listPrice.toString(),
    address: cleanAddress,
    city: external.city,
    state: state,
    zipCode: zipCode,
    beds: external.beds,
    baths: external.baths.toString(),
    sqft: external.sqft,
    yearBuilt: external.yearBuilt,
    propertyType: external.propertyType,
    status: external.status.toLowerCase(),
    standardStatus: external.status,
    featured: true, // Mark all as featured since this is the featured section
    luxury: external.listPrice >= 300000, // Mark as luxury if over $300k
    images: external.imageUrl ? [external.imageUrl] : [],
    neighborhood: external.subdivision || null,
    schoolDistrict: null,
    style: external.style,
    coordinates: {
      lat: external.latitude,
      lng: external.longitude
    },
    features: [],
    architecturalStyle: external.style,
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

export default function FeaturedListings() {
  const { data: externalData, isLoading, error } = useQuery<ExternalApiResponse>({
    queryKey: ["external-featured-properties"],
    queryFn: async () => {
      const response = await fetch("http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?city=Omaha&min_price=200000&max_price=400000");
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Transform the data to match our Property schema and sort by price (highest first)
  const properties = externalData?.data
    ?.map(transformExternalProperty)
    .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    .slice(0, 6) || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load featured properties</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-6">
            Featured <span className="text-bjork-beige">Luxury Listings</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Current luxury properties in Omaha showcasing the finest homes available today
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <>
            <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/search?featured=true">
                <Button className="bg-bjork-beige text-white hover:bg-bjork-blue transition-colors duration-300 text-lg px-8 py-4">
                  View All Featured Listings
                </Button>
              </Link>
            </div>
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
  );
}
