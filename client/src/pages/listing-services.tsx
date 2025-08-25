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
import { 
  Camera, 
  MapPin, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  DollarSign, 
  Home, 
  Phone, 
  Mail, 
  Calendar,
  Globe,
  Target,
  Award,
  Zap,
  Shield,
  Clock,
  Eye,
  Megaphone,
  FileText,
  BarChart3
} from "lucide-react";

export default function ListingServices() {
  const [, setLocation] = useLocation();

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    propertyType: "",
    timeline: "",
    currentSituation: "",
    marketingGoals: "",
    additionalServices: [] as string[],
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setContactForm(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter(s => s !== service)
        : [...prev.additionalServices, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Listing services form submitted:", contactForm);
    // Here you would typically send the data to your backend
  };

  const services = [
    {
      icon: Camera,
      title: "Professional Photography",
      description: "High-quality photos that showcase your property's best features",
      features: ["HDR Photography", "Drone Aerial Shots", "Twilight Photography", "Virtual Staging"]
    },
    {
      icon: Globe,
      title: "3D Virtual Tours",
      description: "Immersive 3D walkthroughs that let buyers explore remotely",
      features: ["Matterport Technology", "24/7 Availability", "Interactive Floor Plans", "VR Compatible"]
    },
    {
      icon: Megaphone,
      title: "Strategic Marketing",
      description: "Multi-channel marketing campaigns to reach qualified buyers",
      features: ["MLS Listing", "Social Media Campaigns", "Print Advertising", "Email Marketing"]
    },
    {
      icon: BarChart3,
      title: "Market Analysis",
      description: "Comprehensive pricing strategy based on current market data",
      features: ["Comparative Market Analysis", "Pricing Strategy", "Market Trends", "Competitor Analysis"]
    },
    {
      icon: Target,
      title: "Buyer Targeting",
      description: "Identify and attract the right buyers for your property",
      features: ["Buyer Profiling", "Targeted Advertising", "Open House Strategy", "Private Showings"]
    },
    {
      icon: Shield,
      title: "Transaction Management",
      description: "Full-service support from listing to closing",
      features: ["Contract Negotiation", "Inspection Coordination", "Closing Support", "Legal Compliance"]
    }
  ];

  const marketingChannels = [
    { name: "MLS (Multiple Listing Service)", reach: "100% of local agents" },
    { name: "Zillow Premium Placement", reach: "36M monthly visitors" },
    { name: "Realtor.com Featured Listing", reach: "73M monthly visitors" },
    { name: "Social Media Advertising", reach: "Targeted demographics" },
    { name: "Professional Network", reach: "Qualified buyer pool" },
    { name: "Print & Digital Media", reach: "Local market coverage" }
  ];

  const statistics = [
    { value: "95%", label: "Homes Sold Within 30 Days" },
    { value: "102%", label: "Average List-to-Sale Price Ratio" },
    { value: "18", label: "Average Days on Market" },
    { value: "500+", label: "Homes Successfully Sold" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-bjork-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Professional real estate marketing" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-bjork-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-6xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-light mb-8 leading-tight">
              Premium <span className="font-bold text-bjork-beige">Listing Services</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Comprehensive marketing solutions to sell your property faster and for top dollar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Home className="h-5 w-5 mr-2" />
                List My Property
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-bjork-black px-8 py-4 text-lg bg-transparent"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Eye className="h-5 w-5 mr-2" />
                View Services
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Proven <span className="font-bold text-bjork-beige">Results</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive listing services deliver exceptional results that exceed industry standards.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {statistics.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-bjork-black mb-2">{stat.value}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-bjork-black rounded-lg p-8 w-full">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold text-white mb-4">Why Choose Our Listing Services?</h3>
              <p className="text-white/80 text-lg">We combine cutting-edge technology with proven marketing strategies</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-bjork-black" />
                </div>
                <h4 className="text-xl font-display font-bold text-white mb-2">Faster Sales</h4>
                <p className="text-white/80">Our properties sell 40% faster than the market average</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-bjork-black" />
                </div>
                <h4 className="text-xl font-display font-bold text-white mb-2">Higher Prices</h4>
                <p className="text-white/80">Achieve 2% higher sale prices with professional marketing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-bjork-black" />
                </div>
                <h4 className="text-xl font-display font-bold text-white mb-2">Expert Support</h4>
                <p className="text-white/80">Full-service team handling every detail of your sale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="min-h-screen flex flex-col justify-center items-center py-20 bg-gray-50">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Comprehensive <span className="font-bold text-bjork-beige">Marketing Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every aspect of your property marketing handled by our professional team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-bjork-black" />
                  </div>
                  <CardTitle className="text-xl font-display">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-bjork-beige" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="w-full bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-display font-bold text-bjork-black mb-6 text-center">Marketing Reach & Exposure</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketingChannels.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-bjork-black">{channel.name}</h4>
                    <p className="text-sm text-gray-600">{channel.reach}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-bjork-beige" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Our Proven <span className="font-bold text-bjork-beige">Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial consultation to closing day, we guide you through every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-bjork-black">1</span>
              </div>
              <h3 className="text-xl font-display font-bold text-bjork-black mb-4">Initial Consultation</h3>
              <p className="text-gray-600">Property assessment, market analysis, and strategy development</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-bjork-black">2</span>
              </div>
              <h3 className="text-xl font-display font-bold text-bjork-black mb-4">Preparation & Staging</h3>
              <p className="text-gray-600">Professional photography, staging recommendations, and listing preparation</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-bjork-black">3</span>
              </div>
              <h3 className="text-xl font-display font-bold text-bjork-black mb-4">Marketing Launch</h3>
              <p className="text-gray-600">Multi-channel marketing campaign, showings, and buyer outreach</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-bjork-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-bjork-black">4</span>
              </div>
              <h3 className="text-xl font-display font-bold text-bjork-black mb-4">Negotiation & Closing</h3>
              <p className="text-gray-600">Offer negotiation, contract management, and closing coordination</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="min-h-screen flex flex-col justify-center items-center py-20 bg-bjork-black text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Modern office background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="w-full max-w-4xl px-6 flex flex-col justify-center items-center relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-8">
              Ready to <span className="font-bold text-bjork-beige">List Your Property</span>?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get started with a free consultation and customized marketing strategy for your property.
            </p>
          </div>

          <Card className="w-full bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Contact Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                      <Input
                        placeholder="John Doe"
                        value={contactForm.name}
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
                        value={contactForm.email}
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
                      value={contactForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    />
                  </div>
                </div>

                {/* Property Information */}
                <div className="space-y-4 pt-6 border-t border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Property Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Property Address *</label>
                      <Input
                        placeholder="123 Main Street, Lincoln, NE"
                        value={contactForm.propertyAddress}
                        onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-white/60"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Property Type</label>
                      <Select value={contactForm.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Timeline to Sell</label>
                      <Select value={contactForm.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="1-month">Within 1 Month</SelectItem>
                          <SelectItem value="3-months">Within 3 Months</SelectItem>
                          <SelectItem value="6-months">Within 6 Months</SelectItem>
                          <SelectItem value="exploring">Just Exploring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Current Situation</label>
                      <Select value={contactForm.currentSituation} onValueChange={(value) => handleInputChange("currentSituation", value)}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder="Select situation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relocating">Relocating</SelectItem>
                          <SelectItem value="upgrading">Upgrading</SelectItem>
                          <SelectItem value="downsizing">Downsizing</SelectItem>
                          <SelectItem value="investment">Investment Property</SelectItem>
                          <SelectItem value="financial">Financial Reasons</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Services & Goals */}
                <div className="space-y-4 pt-6 border-t border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Services & Goals</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Primary Marketing Goal</label>
                    <Select value={contactForm.marketingGoals} onValueChange={(value) => handleInputChange("marketingGoals", value)}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Select primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fastest-sale">Sell as Quickly as Possible</SelectItem>
                        <SelectItem value="highest-price">Achieve Highest Possible Price</SelectItem>
                        <SelectItem value="balanced">Balance Speed and Price</SelectItem>
                        <SelectItem value="convenience">Maximum Convenience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-4">Additional Services Needed</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Professional Photography",
                        "3D Virtual Tours",
                        "Drone Photography",
                        "Home Staging Consultation",
                        "Minor Repairs Coordination",
                        "Deep Cleaning Services"
                      ].map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={service}
                            checked={contactForm.additionalServices.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="rounded border-white/30 bg-white/10 text-bjork-beige focus:ring-bjork-beige"
                          />
                          <label htmlFor={service} className="text-sm text-white">{service}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Additional Information</label>
                    <Textarea
                      placeholder="Tell us more about your property, timeline, or any specific requirements..."
                      value={contactForm.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
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
                  <Home className="h-5 w-5 mr-2" />
                  Schedule Free Consultation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 bg-white">
        <div className="w-full max-w-6xl px-6 flex flex-col justify-center items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-8">
              Meet Your <span className="font-bold text-bjork-beige">Listing Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A dedicated team of professionals working together to achieve your real estate goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Team Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-bjork-black mb-6">Professional Realty Group</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-bjork-beige rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-bjork-black" />
                    </div>
                    <div>
                      <h4 className="font-bold text-bjork-black mb-2">Listing Specialists</h4>
                      <p className="text-gray-600">Expert agents who specialize in property marketing and sales strategy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-bjork-beige rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-bjork-black" />
                    </div>
                    <div>
                      <h4 className="font-bold text-bjork-black mb-2">Marketing Team</h4>
                      <p className="text-gray-600">Professional photographers, staging consultants, and marketing specialists</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-bjork-beige rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-bjork-black" />
                    </div>
                    <div>
                      <h4 className="font-bold text-bjork-black mb-2">Transaction Coordinators</h4>
                      <p className="text-gray-600">Dedicated support for contracts, inspections, and closing coordination</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-display font-bold text-bjork-black mb-4">Contact Information</h4>
                <div className="space-y-3">
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
                    <p className="text-bjork-black font-medium">listings@prglincoln.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
            Ready to <span className="font-bold text-bjork-beige">Maximize Your Sale</span>?
          </h2>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            Let our proven listing services help you achieve the best possible outcome for your property sale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Home className="h-5 w-5 mr-2" />
              Get Started Today
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black bg-transparent"
              onClick={() => setLocation('/home-valuation')}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Free Home Valuation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
