import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { PRICE_RANGES, PROPERTY_TYPES, COMMUNITIES, ARCHITECTURAL_STYLES } from "@/lib/constants";
import type { PropertySearch } from "@shared/schema";

interface PropertySearchProps {
  onSearch: (params: PropertySearch) => void;
  initialParams?: PropertySearch;
}

export default function PropertySearchComponent({ onSearch, initialParams }: PropertySearchProps) {
  const [searchParams, setSearchParams] = useState<PropertySearch>(initialParams || {});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const updateParam = (key: keyof PropertySearch, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value === "any" || !value ? undefined : value
    }));
  };

  const clearFilters = () => {
    setSearchParams({});
    onSearch({});
  };

  const activeFiltersCount = Object.values(searchParams).filter(Boolean).length;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter Location, Zip, Address or MLS #"
                value={searchParams.query || ""}
                onChange={(e) => updateParam("query", e.target.value)}
                className="border-gray-200 focus:ring-bjork-blue"
              />
            </div>
            <Select value={searchParams.minPrice?.toString() || "any"} onValueChange={(value) => updateParam("minPrice", value === "any" ? null : parseInt(value))}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Min Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Min</SelectItem>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.min} value={range.min.toString()}>
                    ${range.min.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={searchParams.maxPrice?.toString() || "any"} onValueChange={(value) => updateParam("maxPrice", value === "any" ? null : parseInt(value))}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Max Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Max</SelectItem>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.max || 999999999} value={(range.max || 999999999).toString()}>
                    {range.max ? `$${range.max.toLocaleString()}` : '$2M+'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-bjork-black text-white hover:bg-bjork-blue">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-bjork-blue text-white">{activeFiltersCount}</Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button type="button" variant="ghost" onClick={clearFilters} className="text-gray-500">
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select value={searchParams.beds?.toString() || "any"} onValueChange={(value) => updateParam("beds", value === "any" ? null : parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Beds</SelectItem>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}+ Beds</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={searchParams.baths?.toString() || "any"} onValueChange={(value) => updateParam("baths", value === "any" ? null : parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Baths</SelectItem>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}+ Baths</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={searchParams.propertyType || "any"} onValueChange={(value) => updateParam("propertyType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Type</SelectItem>
                    {PROPERTY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={searchParams.city || "any"} onValueChange={(value) => updateParam("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any City</SelectItem>
                    {COMMUNITIES.map(community => (
                      <SelectItem key={community.slug} value={community.name}>{community.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={searchParams.neighborhood || "any"} onValueChange={(value) => updateParam("neighborhood", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Neighborhood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Neighborhood</SelectItem>
                    <SelectItem value="Cimarron Ridge">Cimarron Ridge</SelectItem>
                    <SelectItem value="Georgian Heights">Georgian Heights</SelectItem>
                    <SelectItem value="Regency">Regency</SelectItem>
                    <SelectItem value="Benson">Benson</SelectItem>
                    <SelectItem value="Millard">Millard</SelectItem>
                    <SelectItem value="Dundee">Dundee</SelectItem>
                    <SelectItem value="Aksarben">Aksarben</SelectItem>
                    <SelectItem value="West Omaha">West Omaha</SelectItem>
                    <SelectItem value="Country Club">Country Club</SelectItem>
                    <SelectItem value="Shadow Lake">Shadow Lake</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchParams.schoolDistrict || "any"} onValueChange={(value) => updateParam("schoolDistrict", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="School District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any School District</SelectItem>
                    <SelectItem value="Omaha Public Schools">Omaha Public Schools</SelectItem>
                    <SelectItem value="Elkhorn Public Schools">Elkhorn Public Schools</SelectItem>
                    <SelectItem value="Millard Public Schools">Millard Public Schools</SelectItem>
                    <SelectItem value="Westside Community Schools">Westside Community Schools</SelectItem>
                    <SelectItem value="Bennington Public Schools">Bennington Public Schools</SelectItem>
                    <SelectItem value="Ralston Public Schools">Ralston Public Schools</SelectItem>
                    <SelectItem value="Lincoln Public Schools">Lincoln Public Schools</SelectItem>
                    <SelectItem value="Waverly School District">Waverly School District</SelectItem>
                    <SelectItem value="Norris School District">Norris School District</SelectItem>
                    <SelectItem value="Papillion-La Vista Schools">Papillion-La Vista Schools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI-Powered Architectural Style Filter */}
              <div className="bg-gradient-to-r from-bjork-beige/10 to-bjork-blue/10 p-4 rounded-lg border border-bjork-beige/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-bjork-beige rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-bjork-black">AI-Powered Style Search</span>
                  <Badge variant="secondary" className="text-xs bg-bjork-blue/10 text-bjork-blue">NEW</Badge>
                </div>
                <Select value={searchParams.architecturalStyle || "any"} onValueChange={(value) => updateParam("architecturalStyle", value)}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="🏛️ Search by Architectural Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Style</SelectItem>
                    {ARCHITECTURAL_STYLES.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600 mt-2">
                  Our AI analyzes property images to identify architectural styles like Modern, Farmhouse, Colonial, and more.
                </p>
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={searchParams.luxury ? "default" : "outline"}
              size="sm"
              onClick={() => updateParam("luxury", !searchParams.luxury || undefined)}
              className={searchParams.luxury ? "bg-bjork-blue text-white" : "border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white"}
            >
              Luxury Homes
            </Button>
            <Button
              type="button"
              variant={searchParams.featured ? "default" : "outline"}
              size="sm"
              onClick={() => updateParam("featured", !searchParams.featured || undefined)}
              className={searchParams.featured ? "bg-bjork-blue text-white" : "border-bjork-beige text-bjork-black hover:bg-bjork-beige hover:text-white"}
            >
              Featured
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
