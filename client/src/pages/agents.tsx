import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Star, Award, Home, Users } from "lucide-react";
import mikeBjorkPhoto from "@assets/White background_1753818665671.jpg";

export default function Agents() {
  const agents = [
    {
      id: 1,
      name: "Michael Bjork",
      title: "Principal Broker & Team Leader",
      email: "mike.bjork@bhhsamb.com",
      phone: "(402) 522-6131",
      image: mikeBjorkPhoto,
      bio: "With over 15 years of experience in luxury real estate, Michael leads the Bjork Group with unmatched expertise in the Omaha and Lincoln markets. Specializing in high-end properties and exceptional client service.",
      specialties: ["Luxury Homes", "Investment Properties", "New Construction", "Relocation"],
      stats: {
        yearsSelling: 15,
        homesSold: 850,
        avgSalePrice: "$425,000",
        clientSatisfaction: 98
      },
      certifications: ["CRS", "GRI", "ABR"],
      languages: ["English"]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "Senior Real Estate Advisor",
      email: "sarah.johnson@bhhsamb.com",
      phone: "(402) 555-0123",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Sarah brings a fresh perspective to real estate with her background in marketing and design. She excels at helping first-time buyers navigate the market and find their perfect home.",
      specialties: ["First-Time Buyers", "Condos & Townhomes", "Marketing", "Staging"],
      stats: {
        yearsSelling: 8,
        homesSold: 420,
        avgSalePrice: "$275,000",
        clientSatisfaction: 96
      },
      certifications: ["ABR", "PSA"],
      languages: ["English", "Spanish"]
    },
    {
      id: 3,
      name: "David Thompson",
      title: "Commercial & Investment Specialist",
      email: "david.thompson@bhhsamb.com",
      phone: "(402) 555-0124",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "David specializes in commercial real estate and investment properties. His analytical approach and market knowledge help investors maximize their returns in the Nebraska market.",
      specialties: ["Commercial Real Estate", "Investment Analysis", "1031 Exchanges", "Multi-Family"],
      stats: {
        yearsSelling: 12,
        homesSold: 320,
        avgSalePrice: "$650,000",
        clientSatisfaction: 97
      },
      certifications: ["CCIM", "SIOR"],
      languages: ["English"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bjork-black via-bjork-blue to-bjork-beige text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-light mb-6">
              Meet Our Expert Agents
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Experienced professionals dedicated to delivering exceptional results in luxury real estate
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>1,500+ Homes Sold</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>97% Client Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                <div className="relative">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-bjork-blue text-white">
                      {agent.stats.yearsSelling} Years Experience
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-display font-medium text-bjork-black mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-bjork-beige font-medium">{agent.title}</p>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {agent.bio}
                  </p>

                  {/* Certifications */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="font-medium text-bjork-black mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs bg-bjork-beige/10 text-bjork-black">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bjork-blue">{agent.stats.homesSold}</div>
                      <div className="text-xs text-gray-500">Homes Sold</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bjork-blue">{agent.stats.avgSalePrice}</div>
                      <div className="text-xs text-gray-500">Avg Sale Price</div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-bjork-beige" />
                      <a href={`tel:${agent.phone}`} className="text-bjork-black hover:text-bjork-blue transition-colors">
                        {agent.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-bjork-beige" />
                      <a href={`mailto:${agent.email}`} className="text-bjork-black hover:text-bjork-blue transition-colors">
                        {agent.email}
                      </a>
                    </div>
                    <Button className="w-full bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300 mt-4">
                      Contact {agent.name.split(' ')[0]}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Approach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-light text-bjork-black mb-6">
              The Bjork Group Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our collaborative approach ensures you receive comprehensive support throughout your real estate journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bjork-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-bjork-black mb-4">Expert Knowledge</h3>
              <p className="text-gray-600">
                Deep understanding of local markets, pricing trends, and neighborhood dynamics
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-bjork-black mb-4">Team Support</h3>
              <p className="text-gray-600">
                Collaborative approach with multiple agents working together for your success
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bjork-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-bjork-black mb-4">Proven Results</h3>
              <p className="text-gray-600">
                Track record of successful transactions and satisfied clients across all price ranges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bjork-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-light mb-6">
            Ready to Work with Our Team?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contact us today to discuss your real estate goals and get matched with the right agent for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-bjork-blue text-white hover:bg-bjork-beige hover:text-bjork-black transition-colors duration-300">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-bjork-black transition-colors duration-300">
              Call (402) 522-6131
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}