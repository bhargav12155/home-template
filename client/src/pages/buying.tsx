import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, MapPin, Key, Bell, Eye } from "lucide-react";
import { useLocation } from "wouter";

export default function Buying() {
  const [, setLocation] = useLocation();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-bjork-black via-bjork-black/95 to-bjork-black/90">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Happy family in new home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bjork-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light leading-tight mb-6 animate-fade-in-up">
              We'll Help You <span className="text-bjork-beige">Buy Your Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              Expert guidance through every step of your home buying journey
            </p>
            <Button 
              size="lg" 
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium animate-fade-in-up"
              onClick={() => setLocation('/search')}
            >
              Start Your Home Search
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

      {/* The Home Buying Process Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight text-bjork-black mb-8">
              The Home Buying Process
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Buying a home is a big step! Whether you're buying your first home, your dream home, or your tenth investment 
                property, yours will be a big investment. We know how important this is to you, and we have an army of experts 
                to make sure we find the perfect property for your unique circumstances. We know the market and love real estate, 
                and we'll educate you throughout the buying experience.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Finding the perfect property is just one way we can help you with your real estate purchase. As real estate 
                agents, we have ongoing access to experts in every related field from lending to relocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Start Your Home Search Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-light leading-tight text-bjork-black">
                  Start Your Home Search
                </h3>
              </div>
              <h4 className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
                Search for homes wherever you are
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                When buying a home, start by making a wish list and setting a budget. We can help you choose a lender to get 
                you pre-approved for a loan, and then you're ready to start house hunting. Search for your dream home from any 
                device on our website. You can even compare walk scores, school ratings, and neighborhood demographics for 
                different listings.
              </p>
              <Button 
                className="bg-bjork-black hover:bg-bjork-black/90 text-white px-6 py-3"
                onClick={() => setLocation('/search')}
              >
                Search Properties
              </Button>
            </div>
            <div className="lg:order-first">
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Home search on laptop" 
                  className="w-full h-80 object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Get Listing Alerts Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Mobile notifications" 
                  className="w-full h-80 object-cover"
                />
              </Card>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-medium text-bjork-black">
                  Get Listing Alerts
                </h3>
              </div>
              <h4 className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
                Be the first to know when a property hits the market
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                When you save a search on our site, any new homes matching your wish list criteria will be delivered straight 
                to your inbox the moment they go up for sale.
              </p>
              <Button 
                className="bg-bjork-black hover:bg-bjork-black/90 text-white px-6 py-3"
                onClick={() => setLocation('/contact')}
              >
                Set Up Alerts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Save and See Listings Section */}
      <section className="h-screen flex items-center bg-gradient-to-br from-purple-50 to-violet-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-bjork-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-medium text-bjork-black">
                  Save and See Listings
                </h3>
              </div>
              <h4 className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
                Favorite properties and tour homes
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Click the <Heart className="inline w-5 h-5 text-red-500" /> icon when you find a house you love to save it in your favorites 
                section and let us know you like it. Hit "See This Listing" or reach out to your agent directly to schedule an 
                in-person showing. We're happy to walk you through the home and answer any questions, so you can make an informed decision.
              </p>
              <Button 
                className="bg-bjork-black hover:bg-bjork-black/90 text-white px-6 py-3"
                onClick={() => setLocation('/contact')}
              >
                Schedule a Tour
              </Button>
            </div>
            <div className="lg:order-first">
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="House tour with agent" 
                  className="w-full h-80 object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Making An Offer And Closing Section */}
      <section className="h-screen flex items-center bg-bjork-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-bjork-beige rounded-full flex items-center justify-center">
                <Key className="w-10 h-10 text-bjork-black" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-light leading-tight mb-8">
              Making An Offer And Closing
            </h3>
            <h4 className="text-2xl md:text-3xl text-bjork-beige mb-8 font-medium">
              We're With You Till The End
            </h4>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-lg md:text-xl leading-relaxed">
                When you find a home you love, your agent will help you submit an offer. We are skilled negotiators that know 
                how to get you the best price and value possible. Once an offer has been accepted we'll help you navigate through 
                inspections, appraisals, and closing in a stress free way. You can rest assured that your agent is always acting 
                in your best interest with a dedicated buyers agreement in place.
              </p>
              <p className="text-lg md:text-xl leading-relaxed">
                Then it's time to get the keys, throw a housewarming party, and make lasting memories in your new home. We're so 
                happy that you trusted us to help you through this exciting process.
              </p>
            </div>
            <div className="mt-10">
              <Button 
                size="lg"
                className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg font-medium"
                onClick={() => setLocation('/contact')}
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
