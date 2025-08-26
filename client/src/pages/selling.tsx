import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";

export default function Selling() {
  const [, setLocation] = useLocation();

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-bjork-black/70 via-bjork-black/60 to-bjork-black/50">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Happy family selling their home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/40" />
        </div>
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-5xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-light mb-8 leading-tight">
              We Can Help You <span className="font-bold">Sell Your Home</span>
            </h1>
          </div>
        </div>
        {/* Scroll indicator (kept as requested) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Why Sell With Us & Pricing Strategy (combined) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Why Sell With <span className="font-bold">Bjork Group</span>
            </h2>
            <div className="max-w-5xl mx-auto space-y-6 text-left">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                We know what makes your home sell: how it's priced, how it shows, and how it's marketed. Our experts use up-to-date MLS data and local market knowledge to price your home right and sell it fast. You'll get transparency and instant communication throughout the process, plus custom marketing strategies and high-impact photography to make your listing shine.
              </p>
            </div>
            <div className="mt-8">
              <Button 
                size="lg" 
                className="bg-bjork-blue hover:bg-bjork-blue/90 text-white px-8 py-4 text-lg font-medium"
                onClick={() => setLocation('/contact')}
              >
                Get Your Home Value
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing & Photography (combined) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-bjork-black text-white relative overflow-hidden">
        {/* Background image inspired by attachment */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Modern kitchen background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="w-full max-w-7xl px-6 flex flex-col justify-center items-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-light text-white">
                We Make Your Listing <span className="font-bold">Shine</span>
              </h2>
              <p className="text-xl font-medium uppercase tracking-wide text-white/80">
                PHOTOGRAPHS, VIRTUAL TOURS, 3D WALKTHROUGHS, VIDEOS & THE EXCLUSIVE NEW <span className="text-red-500 font-bold">SHOWCASE® LISTINGS</span> FOR ZILLOW
              </p>
              <div className="space-y-4">
                <p className="text-lg text-white/90 leading-relaxed">
                  Today's home buyers are armed with more information than ever. They tell their agents which homes they want to see—and they've already rejected listings with too few, or poor quality photos. It is absolutely vital that your online listing has high-impact photos to make a lasting first impression and create a desire to see more.
                </p>
                <p className="text-lg text-white/90 leading-relaxed">
                  <span className="font-bold">Bjork Group</span> takes this even further with <span className="text-red-500 font-bold">Showcase® Listings</span> on Zillow. Only available to select realtors, these listings increase online exposure even more with advanced user features like scrolling images and interactive floor plans that connect photography to the rooms.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional real estate photography"
                className="w-full max-w-lg h-auto rounded-lg shadow-lg border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Technology (condensed Brivity section) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-7xl px-6 flex flex-col justify-center items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:order-first">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Real estate dashboard analytics"
                className="w-full max-w-lg h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black">
                Real-Time Updates & <span className="font-bold">Transparency</span>
              </h2>
              <p className="text-xl text-bjork-blue font-medium uppercase tracking-wide">
                Powered by Brivity
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                You'll always know what's happening with your sale. Our online marketing tool gives you real-time updates and constant communication, so nothing slips through the cracks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (clarified form fields) */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-bjork-black text-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-4">
              Ready to List? <span className="font-bold">Let's Talk!</span>
            </h2>
            <p className="text-xl text-bjork-blue font-medium uppercase tracking-wide mb-8">
              Meet With An Agent To Talk Through The Selling Process
            </p>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                We'll get to know your selling goals, explain the process, and show you how we market and manage your listing. You'll always be in the loop.
              </p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      placeholder="Your Name" 
                      className="text-lg py-6 border-gray-300"
                    />
                    <Input 
                      placeholder="Email Address" 
                      className="text-lg py-6 border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      placeholder="Phone Number" 
                      className="text-lg py-6 border-gray-300"
                    />
                    <Input 
                      placeholder="Property Address" 
                      className="text-lg py-6 border-gray-300"
                    />
                  </div>
                  <Textarea 
                    placeholder="Your Message"
                    rows={6}
                    className="text-lg border-gray-300 resize-none"
                  />
                  <Button 
                    size="lg" 
                    className="w-full bg-bjork-blue hover:bg-bjork-blue/90 text-white py-4 text-lg font-medium uppercase tracking-wide"
                  >
                    Send Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
