import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Award, Users, TrendingUp, Heart } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

import White_background from "@assets/White background.jpg";

export default function About() {
  const achievements = [
    { icon: TrendingUp, label: "Total Sales Volume", value: "$200M+" },
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Heart, label: "Client Satisfaction", value: "98%" }
  ];

  const testimonials = [
    {
      name: "Sarah & Mike Johnson",
      location: "Elkhorn, NE",
      text: "Michael and his team made our dream home a reality. Their attention to detail and personal approach made all the difference in our home buying experience.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b193?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "David Chen",
      location: "Omaha, NE", 
      text: "Selling our home with Bjork Group was seamless. They handled everything professionally and got us top dollar in a competitive market.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Jennifer Martinez",
      location: "Lincoln, NE",
      text: "The luxury service they provide isn't about the price point - it's truly about the experience. Every client is treated like their most important client.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const services = [
    {
      title: "Buyer Representation",
      description: "Comprehensive guidance through every step of the home buying process",
      icon: Users
    },
    {
      title: "Seller Services", 
      description: "Strategic marketing and pricing to maximize your property's value",
      icon: TrendingUp
    },
    {
      title: "Luxury Properties",
      description: "Specialized expertise in Nebraska's finest luxury real estate market",
      icon: Award
    },
    {
      title: "Investment Properties",
      description: "Strategic acquisition and portfolio management for investors",
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light leading-tight text-bjork-black mb-6">
                About <span className="text-bjork-beige">Bjork Group</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                At Bjork Group Real Estate, we believe that luxury is not a price point but an experience. Our commitment to delivering unparalleled service, attention to detail, and a personalized approach ensures that every client feels like a priority, no matter their budget.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With Bjork Group, luxury means going beyond expectations to create a friendly, personal experience that transforms the way you buy and sell real estate in Nebraska.
              </p>
              <div className="flex space-x-4">
                <Link href="/contact">
                  <Button className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                    Work With Us
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" className="border-bjork-black text-bjork-black hover:bg-bjork-black hover:text-white transition-colors duration-300">
                    View Listings
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img 
                src={White_background}
                alt="Michael Bjork, Principal Broker"
                className="w-full h-96 object-contain rounded-lg shadow-lg bg-white"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Achievements Section */}
      <section className="py-20 bg-bjork-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight mb-6">
              Our <span className="text-bjork-beige">Track Record</span>
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and client satisfaction
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-bjork-beige rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-display font-bold mb-2">{achievement.value}</div>
                <div className="text-sm opacity-80">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Meet Michael Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
                            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight text-bjork-black mb-6">
                Meet Michael Bjork
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Michael Bjork brings over 15 years of real estate expertise to Nebraska's luxury market. As the principal broker of Bjork Group Real Estate, Michael has built his reputation on a foundation of integrity, market knowledge, and unwavering dedication to his clients.
                </p>
                <p>
                  His philosophy is simple: luxury is an experience, not a price point. This approach has earned him recognition as one of Nebraska's top real estate professionals, with over $200 million in career sales and a client satisfaction rate that speaks to his commitment to excellence.
                </p>
                <p>
                  Michael specializes in luxury properties throughout Omaha, Lincoln, Elkhorn, and surrounding communities. His deep understanding of local markets, combined with cutting-edge marketing strategies and a personalized approach, ensures that every client receives the highest level of service.
                </p>
                <p>
                  When he's not helping clients achieve their real estate goals, Michael enjoys giving back to the Nebraska community through various charitable initiatives and mentoring upcoming real estate professionals.
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-3xl md:text-4xl font-display font-light leading-tight text-bjork-black mb-4">Credentials & Affiliations</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-bjork-beige text-white">Licensed Broker</Badge>
                  <Badge className="bg-bjork-blue text-white">Luxury Home Specialist</Badge>
                  <Badge className="bg-gray-600 text-white">Berkshire Hathaway HomeServices</Badge>
                  <Badge className="bg-gray-600 text-white">Nebraska REALTORS® Association</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-3xl md:text-4xl font-display font-light leading-tight text-bjork-black mb-4">Contact Michael</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-bjork-beige mr-3" />
                      <span>{CONTACT_INFO.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-bjork-beige mr-3" />
                      <span>michael@bjorkhomes.com</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-bjork-beige mr-3" />
                      <div>
                        <div>{CONTACT_INFO.address.street}</div>
                        <div>{CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}</div>
                      </div>
                    </div>
                  </div>
                  <Link href="/contact">
                    <Button className="w-full mt-4 bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                      Schedule Consultation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-light text-bjork-black mb-6">
              Our <span className="text-bjork-beige">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive real estate services tailored to your unique needs and goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="bg-bjork-beige rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-bjork-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-light text-bjork-black mb-6">
              Client <span className="text-bjork-beige">Testimonials</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from the clients who have experienced the Bjork Group difference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-medium text-bjork-black">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-20 bg-bjork-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-light mb-6">
            Ready to Experience <span className="text-bjork-beige">Luxury Service?</span>
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Whether you're buying, selling, or investing, we're here to make your real estate journey exceptional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-bjork-beige text-white hover:bg-white hover:text-bjork-blue transition-colors duration-300 px-8">
                Get Started Today
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-bjork-blue transition-colors duration-300 px-8 bg-transparent">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
