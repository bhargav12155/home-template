import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Community } from "@shared/schema";

export default function CommunitiesGrid() {
  const { data: communities, isLoading, error } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load communities</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-6">
            Explore <span className="text-bjork-beige">Communities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From urban sophistication to suburban tranquility, discover the perfect Nebraska community for your lifestyle
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : communities && communities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communities.map((community) => (
              <Link key={community.id} href={`/communities/${community.slug}`}>
                <Card className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={community.image || `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                    alt={`${community.name} community`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bjork-black/70 to-transparent">
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-display font-medium mb-2">{community.name}</h3>
                      <p className="text-sm opacity-90">{community.description}</p>
                      {community.propertyCount && (
                        <p className="text-xs opacity-75 mt-2">{community.propertyCount} properties</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No communities available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
}
