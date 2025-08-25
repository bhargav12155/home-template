import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";
import { Calculator, TrendingUp, Home, DollarSign, MapPin, Calendar, Ruler, Bed, Bath, Car, Phone, Mail, Award } from "lucide-react";

export default function HomeValuation() {
  const [, setLocation] = useLocation();

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  const [valuationForm, setValuationForm] = useState({
    address: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    lotSize: "",
    yearBuilt: "",
    garageSpaces: "",
    currentCondition: "",
    recentUpdates: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setValuationForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Home valuation form submitted:", valuationForm);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-bjork-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Beautiful home exterior for valuation" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-bjork-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-5xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-light mb-8 leading-tight">
              Free Home <span className="font-bold text-bjork-beige">Valuation</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover your home's true market value with our comprehensive property analysis
            </p>
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg"
              onClick={() => document.getElementById('valuation-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calculator className="h-5 w-5 mr-2" />
              Get My Home Value
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

      {/* Why Get a Home Valuation Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Why Get a <span className="font-bold text-bjork-beige">Home Valuation</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're thinking of selling, refinancing, or just curious about your home's worth, our accurate valuation helps you make informed decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Accurate Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get a precise estimate based on current market conditions, recent sales, and property features.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Understand local market trends and how they affect your property's value over time.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Expert Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our professional realtors provide detailed analysis and personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">98%</div>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">24hr</div>
              <p className="text-gray-600">Turnaround Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">5,000+</div>
              <p className="text-gray-600">Homes Valued</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bjork-black mb-2">100%</div>
              <p className="text-gray-600">Free Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Home Valuation Form */}
      <section id="valuation-form" className="min-h-screen flex flex-col justify-center items-center py-20 bg-bjork-black text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Real estate data background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="w-full max-w-4xl px-6 flex flex-col justify-center items-center relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-8">
              Get Your Free <span className="font-bold text-bjork-beige">Home Valuation</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Fill out the form below to receive a comprehensive market analysis of your property within 24 hours.
            </p>
          </div>

          <Card className="w-full bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Information */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Property Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Property Address *</label>
                      <Input
                        placeholder="123 Main Street, Lincoln, NE"
                        value={valuationForm.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Property Type *</label>
                      <Select value={valuationForm.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-family">Single Family Home</SelectItem>
                          <SelectItem value="condo">Condominium</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="multi-family">Multi-Family</SelectItem>
                          <SelectItem value="land">Land/Lot</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Bedrooms</label>
                      <Select value={valuationForm.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Beds" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Bathrooms</label>
                      <Select value={valuationForm.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Baths" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="2.5">2.5</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="3.5">3.5</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Year Built</label>
                      <Input
                        placeholder="2010"
                        type="number"
                        value={valuationForm.yearBuilt}
                        onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Garage</label>
                      <Select value={valuationForm.garageSpaces} onValueChange={(value) => handleInputChange("garageSpaces", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Garage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No Garage</SelectItem>
                          <SelectItem value="1">1 Car</SelectItem>
                          <SelectItem value="2">2 Car</SelectItem>
                          <SelectItem value="3">3+ Car</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Square Footage</label>
                      <Input
                        placeholder="2,500"
                        value={valuationForm.squareFootage}
                        onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Lot Size</label>
                      <Input
                        placeholder="0.25 acres"
                        value={valuationForm.lotSize}
                        onChange={(e) => handleInputChange("lotSize", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Current Condition</label>
                      <Select value={valuationForm.currentCondition} onValueChange={(value) => handleInputChange("currentCondition", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="needs-work">Needs Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Timeline for Information</label>
                      <Select value={valuationForm.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="1-week">Within 1 Week</SelectItem>
                          <SelectItem value="1-month">Within 1 Month</SelectItem>
                          <SelectItem value="3-months">Within 3 Months</SelectItem>
                          <SelectItem value="just-curious">Just Curious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Recent Updates or Improvements</label>
                    <Input
                      placeholder="New roof, updated kitchen, etc."
                      value={valuationForm.recentUpdates}
                      onChange={(e) => handleInputChange("recentUpdates", e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-6 border-t border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Contact Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                      <Input
                        placeholder="John Doe"
                        value={valuationForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={valuationForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                    <Input
                      placeholder="(402) 555-0123"
                      value={valuationForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Additional Information</label>
                    <Textarea
                      placeholder="Tell us more about your property, any special features, or questions you have..."
                      value={valuationForm.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      rows={4}
                      className="bg-white/10 border-white/30 text-white placeholder-white/60 resize-none"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black py-4 text-lg font-medium"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Get My Free Home Valuation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-4">
              Questions About Your <span className="font-bold text-bjork-beige">Home Value</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our experienced team is here to help you understand your property's value and explore your options.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-bjork-black mb-6">Professional Realty Group</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-bjork-beige" />
                    <div>
                      <p className="font-medium text-bjork-black">3201 Pioneers Blvd Suite 32</p>
                      <p className="text-gray-600">Lincoln, NE 68502</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-bjork-beige" />
                    <p className="text-bjork-black font-medium">(402) 419-6309</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-bjork-beige" />
                    <p className="text-bjork-black font-medium">info@prglincoln.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-display font-bold text-bjork-black mb-4">What Happens Next?</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bjork-beige rounded-full flex items-center justify-center text-xs font-bold text-bjork-black">1</div>
                    <p>We analyze your property details and local market data</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bjork-beige rounded-full flex items-center justify-center text-xs font-bold text-bjork-black">2</div>
                    <p>Our experts prepare a comprehensive valuation report</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-bjork-beige rounded-full flex items-center justify-center text-xs font-bold text-bjork-black">3</div>
                    <p>You receive detailed results within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional real estate team"
                className="w-full max-w-lg h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bjork-black text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-4">
            Ready to Discover Your <span className="font-bold text-bjork-beige">Home's Value</span>?
          </h2>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            Get your free, accurate home valuation today and take the first step toward your real estate goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
              onClick={() => document.getElementById('valuation-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calculator className="h-5 w-5 mr-2" />
              Get Free Valuation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black bg-transparent"
              onClick={() => setLocation('/contact')}
            >
              <Phone className="h-5 w-5 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
