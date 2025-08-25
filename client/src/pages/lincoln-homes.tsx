import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MapPin, 
  Calculator, 
  Home,
  TrendingUp,
  GraduationCap,
  Building,
  Trees,
  Phone,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function LincolnHomes() {
  const [, setLocation] = useLocation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Very confident in dealing with the details and negotiations from beginning to end, starting with the selling price. I was very impressed with the entire team and would recommend them to anyone looking for a realtor.",
      author: "Stephanie Hitchens"
    }
  ];

  const agents = [
    {
      name: "Ben Bleicher",
      title: "Realtor® / Team Lead",
      phone: "(402) 419-6309",
      email: "ben.bleicher@prg-ne.com",
      website: "ben.prg-ne.com",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Nate Rangel", 
      title: "Real Estate Agent",
      phone: "(402) 440-9314",
      email: "nate.rangel@prg-ne.com",
      website: "nate.prg-ne.com",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Elizabeth Haney",
      title: "Real Estate Agent", 
      phone: "(402) 617-2279",
      email: "elizabeth.haney@prg-ne.com",
      website: "elizabeth.prg-ne.com",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b586?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Dillon Critel",
      title: "Real Estate Agent",
      phone: "(308) 214-1715", 
      email: "dillon.critel@prg-ne.com",
      website: "dillon.prg-ne.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const faqs = [
    {
      question: "How much does a house cost in Lincoln, NE?",
      answer: "As of 2025, the median home price in Lincoln is typically lower than the national average, making it one of the more affordable Midwest markets. Prices vary by neighborhood — South Lincoln often features newer homes at higher price points, while North Lincoln offers more budget-friendly options."
    },
    {
      question: "What are the best neighborhoods in Lincoln to buy a home?",
      answer: "South Lincoln is highly popular for new construction and strong schools. Downtown and the Haymarket District attract buyers who enjoy walkable city living. North Lincoln has affordable, established neighborhoods, while the edge of town offers acreages with more space."
    },
    {
      question: "Are Lincoln Public Schools highly rated?",
      answer: "Yes. Lincoln Public Schools (LPS) is recognized nationally for academic programs and diversity of offerings. Families also have access to private and faith-based schools such as Pius X and Lincoln Christian."
    },
    {
      question: "How do I find new construction homes in Lincoln, NE?",
      answer: "New builds are most commonly found in South Lincoln, but development is happening across the city. Professional Realty Group can connect you with the latest new construction listings through our IDX feed."
    },
    {
      question: "Why should I work with a local Realtor in Lincoln?",
      answer: "A local Realtor provides insight on schools, neighborhoods, and the local market that national search sites can't. Professional Realty Group has deep Lincoln expertise and can help buyers confidently navigate offers, negotiations, and closings."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-bjork-black via-bjork-black/95 to-bjork-black/90">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Lincoln Nebraska skyline" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/60" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light mb-6 leading-tight">
              Houses for Sale in <span className="text-bjork-beige">Lincoln, NE</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed">
              Search the MLS now to find houses for sale in Lincoln, NE.
            </p>
            <Button 
              size="lg" 
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium"
              onClick={() => setLocation('/search')}
            >
              Find a Place
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Looking for houses for sale in Lincoln, NE?
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Professional Realty Group is your trusted local partner for buying homes across the city. 
                From South Lincoln's new neighborhoods to established communities in North Lincoln, our team 
                of Realtors is here to guide you with expertise, local knowledge, and proven results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Tools Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Useful Real Estate Tools to Get You Started
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Quick Home Estimate</h3>
                <p className="text-gray-600 mb-6">
                  Get a quick and automated home value estimate. If you would like a more complete 
                  and comprehensive home valuation visit us or give us a call today!
                </p>
                <Button className="bg-bjork-black hover:bg-bjork-black/90 text-white">
                  Get Estimate
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Intuitive MLS Search</h3>
                <p className="text-gray-600 mb-6">
                  Quickly find your dream home in your favorite location with our easy-to-use IDX 
                  search tool. Conveniently compare the best listings side-by-side.
                </p>
                <Button 
                  className="bg-bjork-black hover:bg-bjork-black/90 text-white"
                  onClick={() => setLocation('/search')}
                >
                  Search Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calculator className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Mortgage Calculator</h3>
                <p className="text-gray-600 mb-6">
                  Find out your monthly or yearly mortgage payment for a prospective home based 
                  on your loan amount and the current interest rate.
                </p>
                <Button className="bg-bjork-black hover:bg-bjork-black/90 text-white">
                  Calculate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Browse Homes Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
                Browse Homes for Sale in Lincoln, NE
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Our real-time MLS feed gives you access to every home available on the Lincoln market, 
                updated daily. Whether you're searching for your first home, a new build, or a spacious 
                acreage, you'll find the latest listings here.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Search by price, neighborhood, or school district</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">See photos, details, and updates instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Schedule a showing with a PRG Realtor directly from the listing</span>
                </div>
              </div>

              <Button 
                className="bg-bjork-black hover:bg-bjork-black/90 text-white px-6 py-3"
                onClick={() => setLocation('/search')}
              >
                Start Browsing
              </Button>
            </div>
            
            <div>
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Modern Lincoln home" 
                  className="w-full h-80 object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy in Lincoln Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-purple-50 to-violet-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Lincoln park with trails" 
                  className="w-full h-80 object-cover"
                />
              </Card>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-6">
                Why Buy a House in Lincoln, Nebraska?
              </h2>
              <h3 className="text-2xl font-semibold text-bjork-beige mb-6">
                Buying a House in Lincoln is a Good Investment
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Lincoln is one of the fastest-growing cities in the Midwest, offering affordable living, 
                strong schools, and vibrant community life. From family-friendly parks to downtown nightlife, 
                the city has something for everyone.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Affordable housing compared to national average</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Growing job market (healthcare, University of Nebraska–Lincoln, state government)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Outdoor lifestyle: Holmes Lake Park, Pioneers Park, 134 miles of city trails</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Local culture and events in the Historic Haymarket District</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats Section */}
      <section className="h-screen flex items-center bg-bjork-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light mb-12">
              Lincoln Market Statistics
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-bjork-beige mb-4">24</div>
              <h3 className="text-xl font-semibold mb-2">Average Days on Market</h3>
              <p className="text-gray-300">(Last 60 Days)</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-bjork-beige mb-4">$395,514</div>
              <h3 className="text-xl font-semibold mb-2">Average Listing Price</h3>
              <p className="text-gray-300">(Last 60 Days)</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-bjork-beige mb-4">298</div>
              <h3 className="text-xl font-semibold mb-2">New Listings on Market</h3>
              <p className="text-gray-300">This Month</p>
            </div>
          </div>
        </div>
      </section>

      {/* School Districts Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-cyan-50 to-sky-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-bjork-black" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black">
                  Lincoln School Districts
                </h2>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Schools are a top factor when buying a home in Lincoln. The city is served by Lincoln Public Schools (LPS), 
                a nationally recognized district, along with private and faith-based options.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Lincoln Southeast & Southwest High Schools – South Lincoln</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Lincoln East & Northeast High Schools – Central/North</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Dozens of highly rated elementary and middle schools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full"></div>
                  <span className="text-gray-700">Private options: Pius X Catholic High School, Lincoln Christian School, and more</span>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Lincoln school building" 
                  className="w-full h-80 object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Explore Lincoln Neighborhoods and Communities
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Lincoln offers diverse neighborhoods, each with unique benefits. Whether you're seeking a quiet family 
              community, a downtown condo, or wide-open space, PRG helps buyers find the right fit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="w-6 h-6 text-bjork-beige" />
                  <h3 className="text-xl font-semibold">South Lincoln</h3>
                </div>
                <p className="text-gray-700">
                  Popular for new construction, excellent schools, and family-friendly amenities. Many buyers choose 
                  South Lincoln for its modern developments and convenient access to shopping and recreation.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <Building className="w-6 h-6 text-bjork-beige" />
                  <h3 className="text-xl font-semibold">Haymarket & Downtown</h3>
                </div>
                <p className="text-gray-700">
                  Perfect for young professionals, walkable lifestyle, and nightlife. Living downtown also puts you 
                  close to UNL, restaurants, and Lincoln's entertainment scene.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <Home className="w-6 h-6 text-bjork-beige" />
                  <h3 className="text-xl font-semibold">North Lincoln</h3>
                </div>
                <p className="text-gray-700">
                  Affordable homes in established neighborhoods with easy city access. North Lincoln offers a wide 
                  range of options for first-time buyers and those seeking value.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <Trees className="w-6 h-6 text-bjork-beige" />
                  <h3 className="text-xl font-semibold">Close To Lincoln</h3>
                </div>
                <p className="text-gray-700">
                  Privacy and space on the edge of town — ideal for buyers wanting land. These properties often 
                  include larger lots, making them attractive for hobby farming or outdoor living.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="h-screen flex items-center bg-bjork-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-light mb-16">
            Why Work With Professional Realty Group?
          </h2>
          
          <div className="relative">
            <div className="mb-8">
              <p className="text-lg md:text-xl italic mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-bjork-beige font-semibold">
                {testimonials[currentTestimonial].author}
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="border-white text-white hover:bg-white hover:text-bjork-black bg-transparent"
                onClick={() => setCurrentTestimonial(Math.max(0, currentTestimonial - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white text-white hover:bg-white hover:text-bjork-black bg-transparent"
                onClick={() => setCurrentTestimonial(Math.min(testimonials.length - 1, currentTestimonial + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-lg mt-12 text-gray-300">
            Backed by Berkshire Hathaway HomeServices, our Realtors provide trusted guidance for buyers across Lincoln.
          </p>
        </div>
      </section>

      {/* Meet Our Agents Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-zinc-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Meet Our Top Performing Realtors & Agents
            </h2>
            <p className="text-lg text-gray-700">
              Ready to find your next home? Professional Realty Group is here to help you search, tour, 
              and purchase with confidence. From South Lincoln to every corner of the city, we know the market — and we're ready to work for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src={agent.image}
                    alt={agent.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                  <p className="text-gray-600 mb-4">{agent.title}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4 text-bjork-beige" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 text-bjork-beige" />
                      <span className="text-xs">{agent.email}</span>
                    </div>
                  </div>
                  <Button 
                    className="mt-4 bg-bjork-black hover:bg-bjork-black/90 text-white text-sm"
                    onClick={() => setLocation('/contact')}
                  >
                    Contact Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Get In Touch Now!
            </h2>
          </div>
          
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone" type="tel" />
              </div>
              <Textarea 
                placeholder="Your Message" 
                className="mt-6 min-h-[120px]"
              />
              <Button className="w-full mt-6 bg-bjork-black hover:bg-bjork-black/90 text-white">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Frequently Asked Questions About Houses for Sale in Lincoln, NE
            </h2>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold mb-4 text-bjork-black">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
