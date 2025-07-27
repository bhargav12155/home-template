import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PropertyCard from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@shared/schema";

export default function FeaturedListings() {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

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
            Discover exceptional properties curated by Nebraska's luxury real estate specialists
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
