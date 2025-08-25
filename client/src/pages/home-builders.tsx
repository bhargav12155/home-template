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
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-bjork-black/70 via-bjork-black/60 to-bjork-black/50">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="New construction luxury home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-5xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-light mb-8 leading-tight">
              Premier <span className="font-bold">Home Builders</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Partner with Nebraska's finest custom home builders to create your dream home
            </p>
            <Button 
              size="lg" 
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium"
              onClick={() => setLocation('/contact')}
            >
              Start Building Your Dream
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Why Build New Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-bjork-black mb-8">
              Why Build <span className="font-bold">New?</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Building a new home allows you to create exactly what you want, where you want it. From custom floor plans 
                to energy-efficient features, new construction gives you complete control over your investment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="text-xl font-bold text-bjork-black">Custom Design</h3>
                <p className="text-gray-600">Design your home exactly how you want it with custom floor plans and features.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-bjork-black">Energy Efficient</h3>
                <p className="text-gray-600">Modern construction techniques and materials for maximum energy efficiency.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-bold text-bjork-black">No Repairs</h3>
                <p className="text-gray-600">Everything is brand new with full warranties and no immediate maintenance needs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Builders Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-4">
              Featured <span className="font-bold">Builders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with Nebraska's most trusted and experienced home builders to ensure quality construction and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {builders.map((builder, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-64">
                  <img 
                    src={builder.image}
                    alt={`${builder.name} home`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-bjork-black mb-1">{builder.name}</h3>
                    <Badge variant="secondary" className="text-bjork-blue">{builder.specialty}</Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">{builder.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Price Range:</span>
                      <span className="text-sm font-bold text-bjork-blue">{builder.priceRange}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Communities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {builder.communities.map((community, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {community}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {builder.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-bjork-black hover:bg-bjork-black/90 text-white mt-4"
                    onClick={() => setLocation('/contact')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-bjork-black text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-light mb-8">
            Ready to Build Your <span className="font-bold text-bjork-beige">Dream Home?</span>
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Our team will connect you with the right builder for your vision and budget. From initial consultation 
            to move-in day, we're here to guide you through every step of the building process.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium"
              onClick={() => setLocation('/contact')}
            >
              Get Started Today
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black px-8 py-4 text-lg font-medium bg-transparent"
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