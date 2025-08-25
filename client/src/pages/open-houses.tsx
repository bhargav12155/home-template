import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  DollarSign, 
  Car, 
  Bed, 
  Bath, 
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  Phone,
  Mail,
  Navigation,
  Users,
  Camera,
  Star
} from "lucide-react";

export default function OpenHouses() {
  const [, setLocation] = useLocation();

  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    date: "",
    timeRange: "",
    priceRange: "",
    city: "",
    propertyType: ""
  });

  // Mock open house data - in a real app, this would come from your API
  const openHouses = [
    {
      id: 1,
      address: "3245 South 27th Street",
      city: "Lincoln",
      state: "NE",
      zipCode: "68502",
      price: 485000,
      beds: 4,
      baths: 3,
      sqft: 2850,
      garage: 2,
      propertyType: "Single Family",
      date: "Sunday, August 25, 2025",
      time: "1:00 PM - 3:00 PM",
      agent: "Michael Bjork",
      agentPhone: "(402) 419-6309",
      description: "Beautiful updated home in desirable Sheridan neighborhood. Completely renovated kitchen with quartz countertops, hardwood floors throughout main level.",
      features: ["Updated Kitchen", "Hardwood Floors", "Finished Basement", "Large Yard"],
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isFeatured: true
    },
    {
      id: 2,
      address: "8901 Pioneers Boulevard",
      city: "Lincoln",
      state: "NE", 
      zipCode: "68506",
      price: 325000,
      beds: 3,
      baths: 2,
      sqft: 1950,
      garage: 2,
      propertyType: "Single Family",
      date: "Saturday, August 24, 2025",
      time: "11:00 AM - 1:00 PM",
      agent: "Sarah Johnson",
      agentPhone: "(402) 419-6309",
      description: "Charming ranch style home with open concept living. Perfect for first-time buyers or downsizing.",
      features: ["Open Concept", "New Roof", "Fenced Yard", "Move-in Ready"],
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isFeatured: false
    },
    {
      id: 3,
      address: "1234 Pine Lake Road",
      city: "Lincoln",
      state: "NE",
      zipCode: "68516",
      price: 675000,
      beds: 5,
      baths: 4,
      sqft: 3400,
      garage: 3,
      propertyType: "Single Family",
      date: "Sunday, August 25, 2025",
      time: "2:00 PM - 4:00 PM",
      agent: "Michael Bjork",
      agentPhone: "(402) 419-6309",
      description: "Luxury home with lake views. Custom built with premium finishes throughout. Gourmet kitchen and master suite.",
      features: ["Lake Views", "Custom Built", "Gourmet Kitchen", "Master Suite"],
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isFeatured: true
    },
    {
      id: 4,
      address: "5678 Oak Creek Drive",
      city: "Lincoln",
      state: "NE",
      zipCode: "68512",
      price: 425000,
      beds: 4,
      baths: 3,
      sqft: 2650,
      garage: 2,
      propertyType: "Single Family",
      date: "Saturday, August 24, 2025",
      time: "2:00 PM - 4:00 PM",
      agent: "David Chen",
      agentPhone: "(402) 419-6309",
      description: "Modern two-story home in excellent condition. Great neighborhood with walking trails and parks nearby.",
      features: ["Modern Design", "Walking Trails", "Updated Bathrooms", "Energy Efficient"],
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isFeatured: false
    },
    {
      id: 5,
      address: "9876 Heritage Lane",
      city: "Lincoln",
      state: "NE",
      zipCode: "68526",
      price: 550000,
      beds: 4,
      baths: 3.5,
      sqft: 3100,
      garage: 3,
      propertyType: "Single Family",
      date: "Sunday, August 25, 2025",
      time: "12:00 PM - 2:00 PM",
      agent: "Lisa Martinez",
      agentPhone: "(402) 419-6309",
      description: "Executive home in prestigious neighborhood. Formal dining, home office, and spacious family room.",
      features: ["Executive Home", "Home Office", "Formal Dining", "Premium Location"],
      image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isFeatured: false
    },
    {
      id: 6,
      address: "2468 Vintage Hill Circle",
      city: "Lincoln",
      state: "NE",
      zipCode: "68508",
      price: 375000,
      beds: 3,
      baths: 2.5,
      sqft: 2200,
      garage: 2,
      propertyType: "Townhouse",
      date: "Saturday, August 24, 2025",
      time: "10:00 AM - 12:00 PM",
      agent: "Jennifer Wilson",
      agentPhone: "(402) 419-6309",
      description: "Low-maintenance townhouse with modern amenities. End unit with extra privacy and natural light.",
      features: ["End Unit", "Low Maintenance", "Modern Amenities", "Extra Privacy"],
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isFeatured: false
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const PropertyCard = ({ property, isGrid = true }: { property: typeof openHouses[0], isGrid?: boolean }) => (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isGrid ? '' : 'flex flex-row'}`}>
      <div className={`relative ${isGrid ? 'h-48' : 'w-80 h-64'}`}>
        <img 
          src={property.image} 
          alt={property.address}
          className="w-full h-full object-cover"
        />
        {property.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white">
            Featured
          </Badge>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-bjork-beige text-bjork-black font-medium">
            <Clock className="h-3 w-3 mr-1" />
            {property.time}
          </Badge>
        </div>
      </div>
      
      <CardContent className={`p-6 ${isGrid ? '' : 'flex-1'}`}>
        <div className="mb-3">
          <h3 className="text-xl font-display font-bold text-bjork-black mb-1">
            {formatPrice(property.price)}
          </h3>
          <p className="text-gray-600 text-sm">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.beds} beds
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.baths} baths
          </div>
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {property.sqft.toLocaleString()} sqft
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            {property.garage} garage
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-bjork-beige" />
            <span className="text-sm font-medium text-bjork-black">{property.date}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{property.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm">
            <p className="font-medium text-bjork-black">{property.agent}</p>
            <p className="text-gray-600">{property.agentPhone}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button size="sm" className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black">
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative bg-bjork-black text-white py-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Open house background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-bjork-black/60" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6 leading-tight">
            Open Houses in <span className="font-bold text-bjork-beige">Lincoln, NE</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Tour your future home this weekend. View available open houses and schedule private showings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black px-8 py-4 text-lg"
              onClick={() => document.getElementById('open-houses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="h-5 w-5 mr-2" />
              View Open Houses
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black px-8 py-4 text-lg bg-transparent"
              onClick={() => setLocation('/search')}
            >
              <Search className="h-5 w-5 mr-2" />
              Search All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-gray-50 py-8 border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by address or neighborhood"
                  className="pl-10"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <Select value={filters.date} onValueChange={(value) => setFilters(prev => ({ ...prev, date: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-weekend">This Weekend</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-300k">Under $300K</SelectItem>
                  <SelectItem value="300-500k">$300K - $500K</SelectItem>
                  <SelectItem value="500-700k">$500K - $700K</SelectItem>
                  <SelectItem value="over-700k">Over $700K</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-bjork-black" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-bjork-black" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Houses Listings */}
      <section id="open-houses" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-bjork-black mb-2">
                Available Open Houses
              </h2>
              <p className="text-gray-600">
                {openHouses.length} open houses found in Lincoln, NE
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Featured Open Houses */}
          <div className="mb-12">
            <h3 className="text-2xl font-display font-bold text-bjork-black mb-6 flex items-center">
              <Star className="h-6 w-6 text-bjork-beige mr-2" />
              Featured Open Houses
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {openHouses.filter(house => house.isFeatured).map((house) => (
                <PropertyCard key={house.id} property={house} isGrid={true} />
              ))}
            </div>
          </div>

          {/* All Open Houses */}
          <div>
            <h3 className="text-2xl font-display font-bold text-bjork-black mb-6">
              All Open Houses
            </h3>
            <div className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {openHouses.map((house) => (
                <PropertyCard key={house.id} property={house} isGrid={viewMode === "grid"} />
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bjork-black text-bjork-black hover:bg-bjork-black hover:text-white"
            >
              Load More Open Houses
            </Button>
          </div>
        </div>
      </section>

      {/* Tips for Open House Visits */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-bjork-black mb-4">
              Open House <span className="text-bjork-beige">Visit Tips</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of your open house visits with these helpful tips from our experienced agents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Come Prepared</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bring a list of questions, take notes, and have your financing pre-approved to show you're a serious buyer.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Document Your Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Take photos and videos (with permission) to help remember details when comparing multiple properties.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-bjork-beige rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-bjork-black" />
                </div>
                <CardTitle className="text-xl font-display">Connect with Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build relationships with listing agents and ask about similar properties that might not be on the market yet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bjork-black text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-4">
            Didn't Find What You're <span className="font-bold text-bjork-beige">Looking For</span>?
          </h2>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            Let us help you find the perfect home. Schedule a private showing or get notified about new open houses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bjork-beige hover:bg-bjork-beige/90 text-bjork-black"
              onClick={() => setLocation('/contact')}
            >
              <Phone className="h-5 w-5 mr-2" />
              Schedule Private Showing
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bjork-black bg-transparent"
              onClick={() => setLocation('/search')}
            >
              <Search className="h-5 w-5 mr-2" />
              Browse All Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
