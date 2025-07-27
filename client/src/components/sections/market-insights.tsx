import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import type { BlogPost } from "@shared/schema";

export default function MarketInsights() {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog", { published: true }],
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load blog posts</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-6">
            Market <span className="text-bjork-beige">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest Nebraska real estate trends and market analysis
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <img 
                      src={post.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <Badge className="bg-bjork-beige text-white mb-2">{post.category}</Badge>
                      <h3 className="text-xl font-display font-medium text-bjork-black mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>{formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300 text-lg px-8 py-4">
                  View All Articles
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
}
