import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";

export default function HomeBuilders() {
  const [, setLocation] = useLocation();

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  const builders = [
    {
      name: "Legacy Homes",
      specialty: "Luxury Custom Homes",
      description: "Award-winning custom home builder specializing in luxury estates and executive homes throughout Nebraska.",
      priceRange: "$500K - $2M+",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      communities: ["Elkhorn", "West Omaha", "Lincoln"],
      features: ["Custom Design", "Energy Efficient", "Smart Home Ready"]
    },
    {
      name: "Premier Construction Group",
      specialty: "Executive Homes",
      description: "Specializing in high-end executive homes with superior craftsmanship and attention to detail.",
      priceRange: "$400K - $1.5M",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      communities: ["Papillion", "Gretna", "Bennington"],
      features: ["Custom Floor Plans", "Quality Materials", "Professional Design"]
    },
    {
      name: "Nebraska Elite Builders",
      specialty: "Modern Luxury",
      description: "Contemporary luxury homes featuring modern design elements and premium finishes.",
      priceRange: "$600K - $3M+",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      communities: ["West Omaha", "Lincoln", "Fremont"],
      features: ["Modern Design", "Luxury Finishes", "Open Concepts"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Hero Section */}
      <section className="relative h-[50vh] overflow-hidden bg-gradient-to-br from-bjork-black/70 via-bjork-black/60 to-bjork-black/50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="New construction luxury home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/40" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-4 leading-tight">
              Premier <span className="font-bold">Home Builders</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 font-light max-w-2xl mx-auto leading-relaxed">
              Partner with Nebraska's finest custom home builders to create your dream home
            </p>
            <Button 
              size="lg" 
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-6 py-3 text-base font-medium"
              onClick={() => setLocation('/contact')}
            >
              Start Building Your Dream
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column - Why Build New */}
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-light text-bjork-black mb-6">
                Why Build <span className="font-bold">New?</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed font-light mb-8">
                Building a new home allows you to create exactly what you want, where you want it. From custom floor plans 
                to energy-efficient features, new construction gives you complete control over your investment.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-bjork-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🏗️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-bjork-black mb-2">Custom Design</h3>
                    <p className="text-gray-600 text-sm">Design your home exactly how you want it with custom floor plans and features.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-bjork-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-bjork-black mb-2">Energy Efficient</h3>
                    <p className="text-gray-600 text-sm">Modern construction techniques and materials for maximum energy efficiency.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-bjork-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-bjork-black mb-2">No Repairs</h3>
                    <p className="text-gray-600 text-sm">Everything is brand new with full warranties and no immediate maintenance needs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Builders */}
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-light text-bjork-black mb-6">
                Featured <span className="font-bold">Builders</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We work with Nebraska's most trusted and experienced home builders to ensure quality construction and exceptional service.
              </p>

              <div className="space-y-6">
                {builders.map((builder, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="flex">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img 
                          src={builder.image}
                          alt={`${builder.name} home`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-bjork-black">{builder.name}</h3>
                            <Badge variant="secondary" className="text-bjork-blue text-xs">{builder.specialty}</Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{builder.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-700">Price Range:</span>
                              <span className="text-xs font-bold text-bjork-blue">{builder.priceRange}</span>
                            </div>
                            
                            <div>
                              <span className="text-xs font-medium text-gray-700">Communities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {builder.communities.slice(0, 2).map((community, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs px-2 py-0">
                                    {community}
                                  </Badge>
                                ))}
                                {builder.communities.length > 2 && (
                                  <Badge variant="outline" className="text-xs px-2 py-0">
                                    +{builder.communities.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm"
                            className="w-full bg-bjork-black hover:bg-bjork-black/90 text-white text-xs"
                            onClick={() => setLocation('/contact')}
                          >
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Call to Action Section */}
      <section className="py-12 bg-bjork-black text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-4">
            Ready to Build Your <span className="font-bold text-bjork-beige">Dream Home?</span>
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Our team will connect you with the right builder for your vision and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-6 py-3 text-base font-medium"
              onClick={() => setLocation('/contact')}
            >
              Get Started Today
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black px-6 py-3 text-base font-medium bg-transparent"
              onClick={() => setLocation('/search')}
            >
              View Available Lots
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}