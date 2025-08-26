import { useParams, useLocation } from "wouter";
import { ArrowLeft, Heart, Share2, Bed, Bath, Square, MapPin, Calendar, Eye, Phone, Mail, Calculator, Home, School, Car, Wifi, Flame, Droplets, Trees, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GoogleMap from "@/components/google-map";
import PropertyStyleBadge from "@/components/property/property-style-badge";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";
import { useState, useEffect } from "react";
import React from "react";

interface TemplateConfig {
  companyName: string;
  agentName: string;
  agentTitle: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [agentConfig, setAgentConfig] = useState<TemplateConfig | null>(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [downPayment, setDownPayment] = useState("20");
  const [interestRate, setInterestRate] = useState("7.5");
  const [loanTerm, setLoanTerm] = useState("30");
  
  const { data: response, isLoading, error } = usePropertyDetail(id!);
  const property = response?.property;

  // Define images based on property data
  const images = React.useMemo(() => {
    return property?.images && property.images.length > 0 
      ? property.images 
      : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
  }, [property?.images]);

  // Fetch agent configuration
  useEffect(() => {
    fetch("/api/template")
      .then(res => res.json())
      .then(data => setAgentConfig(data))
      .catch(err => console.error("Failed to fetch agent config:", err));
  }, []);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    if (!loanAmount || !downPayment || !interestRate || !loanTerm) return 0;
    
    const loan = parseFloat(loanAmount) - (parseFloat(loanAmount) * parseFloat(downPayment) / 100);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseFloat(loanTerm) * 12;
    
    if (monthlyRate === 0) return loan / numPayments;
    
    const monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return monthlyPayment;
  };

  // Set initial loan amount when property loads
  useEffect(() => {
    if (property && !loanAmount) {
      setLoanAmount(property.price);
    }
  }, [property, loanAmount]);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/search")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-display text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/search")}>
              Return to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatBaths = (baths: string) => {
    const bathNum = parseFloat(baths);
    return bathNum % 1 === 0 ? bathNum.toString() : baths;
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/search")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Images Section - Spans 3 columns */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-lg group">
                <img 
                  src={images[selectedImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {property.featured && (
                  <Badge className="absolute top-4 left-4 bg-bjork-beige text-white">
                    Featured
                  </Badge>
                )}
                {property.luxury && (
                  <Badge className="absolute top-4 right-4 bg-bjork-blue text-white">
                    Luxury
                  </Badge>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-bjork-black' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {images.length > 6 && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-sm text-gray-600">+{images.length - 6}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Property Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-display text-bjork-black">Property Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Bed className="w-8 h-8 mx-auto mb-2 text-bjork-black" />
                      <div className="text-2xl font-bold text-bjork-black">{property.beds}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <Bath className="w-8 h-8 mx-auto mb-2 text-bjork-black" />
                      <div className="text-2xl font-bold text-bjork-black">{formatBaths(property.baths)}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="text-center">
                      <Square className="w-8 h-8 mx-auto mb-2 text-bjork-black" />
                      <div className="text-2xl font-bold text-bjork-black">{property.sqft?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Sq. Ft.</div>
                    </div>
                    <div className="text-center">
                      <Home className="w-8 h-8 mx-auto mb-2 text-bjork-black" />
                      <div className="text-2xl font-bold text-bjork-black">{property.yearBuilt}</div>
                      <div className="text-sm text-gray-600">Year Built</div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-bjork-black mb-3">Property Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Type:</span>
                          <span className="font-medium">{property.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Style:</span>
                          <span className="font-medium">{property.style || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant="outline" className="capitalize">
                            {property.status}
                          </Badge>
                        </div>
                        {property.daysOnMarket && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Days on Market:</span>
                            <span className="font-medium">{property.daysOnMarket} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-bjork-black mb-3">Listing Information</h4>
                      <div className="space-y-2 text-sm">
                        {property.mlsId && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">MLS ID:</span>
                            <span className="font-medium">#{property.mlsId}</span>
                          </div>
                        )}
                        {property.originalListPrice && property.originalListPrice !== property.price && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="font-medium line-through text-gray-500">
                              {formatPrice(property.originalListPrice)}
                            </span>
                          </div>
                        )}
                        {property.photoCount && property.photoCount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Photos:</span>
                            <span className="font-medium">{property.photoCount} photos</span>
                          </div>
                        )}
                        {property.listingOfficeName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Listing Office:</span>
                            <span className="font-medium">{property.listingOfficeName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features & Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-display text-bjork-black">Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Common features based on property type */}
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-bjork-black" />
                      <span>Garage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-bjork-black" />
                      <span>High-Speed Internet Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-bjork-black" />
                      <span>Central Heating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-bjork-black" />
                      <span>Central Air</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trees className="w-5 h-5 text-bjork-black" />
                      <span>Landscaping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-bjork-black" />
                      <span>Move-In Ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Agent Contact & Calculator */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price & Basic Info */}
            <div>
              <h1 className="text-4xl font-display font-light text-bjork-black mb-2">
                {formatPrice(property.price)}
              </h1>
              {property.originalListPrice && property.originalListPrice !== property.price && (
                <p className="text-lg text-gray-500 line-through mb-2">
                  Originally {formatPrice(property.originalListPrice)}
                </p>
              )}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
              {property.neighborhood && (
                <p className="text-bjork-beige font-medium mb-4">
                  {property.neighborhood}
                </p>
              )}
            </div>

          {/* Sidebar - Agent Contact & Calculator */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price & Basic Info */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-display font-light text-bjork-black mb-2">
                  {formatPrice(property.price)}
                </h1>
                {property.originalListPrice && property.originalListPrice !== property.price && (
                  <p className="text-lg text-gray-500 line-through mb-2">
                    Originally {formatPrice(property.originalListPrice)}
                  </p>
                )}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.address}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {property.city}, {property.state} {property.zipCode}
                </div>
                {property.neighborhood && (
                  <p className="text-bjork-beige font-medium mb-4">
                    {property.neighborhood}
                  </p>
                )}
                
                {/* Style Badge */}
                {property.architecturalStyle && (
                  <div className="mb-4">
                    <PropertyStyleBadge 
                      architecturalStyle={property.architecturalStyle}
                      secondaryStyle={property.secondaryStyle}
                      styleConfidence={property.styleConfidence}
                      styleFeatures={property.styleFeatures}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agent Contact Card */}
            {agentConfig && (
              <Card className="bg-bjork-black text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                      <img 
                        src="/attached_assets/Mandy Visty headshot (1)_1753818758165.jpg"
                        alt={agentConfig.agentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{agentConfig.agentName}</h3>
                      <p className="text-bjork-beige text-sm">{agentConfig.agentTitle}</p>
                      <p className="text-gray-300 text-xs">{agentConfig.companyName}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6">
                    Get expert guidance and personalized service for your real estate needs.
                  </p>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black">
                      <Phone className="w-4 h-4 mr-2" />
                      {agentConfig.phone}
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-bjork-black">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                  
                  {agentConfig.licenseNumber && (
                    <p className="text-xs text-gray-400 mt-4 text-center">
                      License: {agentConfig.licenseNumber}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Mortgage Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bjork-black">
                  <Calculator className="w-5 h-5" />
                  Mortgage Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loanAmount">Home Price</Label>
                  <Input
                    id="loanAmount"
                    type="text"
                    value={loanAmount ? `$${parseFloat(loanAmount).toLocaleString()}` : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[$,]/g, '');
                      if (!isNaN(Number(value))) setLoanAmount(value);
                    }}
                    placeholder="$0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="downPayment">Down Payment (%)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="7.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="loanTerm">Loan Term (years)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="30"
                  />
                </div>
                
                <Separator />
                
                <div className="bg-bjork-beige/10 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Estimated Monthly Payment</div>
                    <div className="text-2xl font-bold text-bjork-black">
                      ${calculateMonthlyPayment().toLocaleString(undefined, { 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0 
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      *Principal & Interest only
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* School Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bjork-black">
                  <School className="w-5 h-5" />
                  Schools & Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.schoolDistrict && (
                    <div>
                      <div className="font-semibold text-bjork-black">{property.schoolDistrict}</div>
                      <div className="text-sm text-gray-600">School District</div>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Elementary:</span>
                      <span className="font-medium">Lincoln Elementary</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Middle School:</span>
                      <span className="font-medium">Lincoln Middle</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">High School:</span>
                      <span className="font-medium">Lincoln High</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-3">
                    *School assignments subject to change. Please verify with school district.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-light text-bjork-black mb-6">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>
          </div>
        )}

        {/* Map */}
        {property.coordinates && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-light text-bjork-black mb-6">Location</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <GoogleMap
                properties={[property]}
                center={property.coordinates}
                zoom={15}
              />
            </div>
          </div>
        )}

        {/* Virtual Tour */}
        {property.virtualTourUrl && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-light text-bjork-black mb-6">Virtual Tour</h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={property.virtualTourUrl}
                className="w-full h-full"
                title="Virtual Tour"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
