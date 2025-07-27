import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, User, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog", { published: true }],
  });

  // Filter posts based on search and category
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Get unique categories
  const categories = Array.from(new Set(posts?.map(post => post.category) || []));

  // Featured post (most recent)
  const featuredPost = posts?.[0];
  const recentPosts = filteredPosts.slice(1);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load blog posts</p>
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
            Market <span className="text-bjork-beige">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest Nebraska real estate trends, market analysis, and expert insights from the Bjork Group team.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:ring-bjork-blue"
            />
          </div>
          <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full md:w-48 border-gray-200 focus:ring-bjork-blue">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
              className="border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-8">
            <p className="text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-12">
            {/* Featured Post Skeleton */}
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <Skeleton className="h-80 w-full" />
                <div className="p-8 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </Card>

            {/* Recent Posts Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Post */}
            {!searchQuery && !selectedCategory && featuredPost && (
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 property-card">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-80 lg:h-auto">
                    <img 
                      src={featuredPost.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-bjork-blue text-white flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <Badge className="bg-bjork-beige text-white mb-4">
                        {featuredPost.category}
                      </Badge>
                      <h2 className="text-3xl font-display font-medium text-bjork-black mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatDistanceToNow(new Date(featuredPost.createdAt!), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                          Read Full Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Posts Grid */}
            <div>
              {recentPosts.length > 0 && (
                <h2 className="text-2xl font-display font-medium text-bjork-black mb-8">
                  {searchQuery || selectedCategory ? 'Search Results' : 'Recent Articles'}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery || selectedCategory ? filteredPosts : recentPosts).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer property-card">
                      <div className="relative h-48">
                        <img 
                          src={post.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-bjork-beige text-white">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-display font-medium text-bjork-black mb-3 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-display text-gray-600 mb-4">No Articles Found</h3>
              <p className="text-gray-500 mb-8">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search criteria to see more results."
                  : "We're currently working on new content. Check back soon!"
                }
              </p>
            </div>
            {(searchQuery || selectedCategory) && (
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
                className="bg-bjork-black text-white hover:bg-bjork-blue"
              >
                View All Articles
              </Button>
            )}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20 bg-bjork-blue rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-display font-light mb-6">
            Stay Informed with <span className="text-bjork-beige">Market Updates</span>
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get the latest Nebraska real estate insights, market trends, and exclusive property updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-bjork-beige"
            />
            <Button className="bg-bjork-beige text-white hover:bg-white hover:text-bjork-blue transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
