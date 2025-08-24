interface CMAPipelineProperty {
  id?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  year_built?: number;
  property_type?: string;
  status?: string;
  listing_date?: string;
  days_on_market?: number;
  lat?: number;
  lng?: number;
  description?: string;
  photos?: string[];
  mls_id?: string;
  listing_agent?: string;
  listing_office?: string;
}

export class ExternalPropertyAPI {
  private baseUrl = 'http://gbcma.us-east-2.elasticbeanstalk.com/api';

  async getPropertiesForCity(city: string, options: {
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  } = {}): Promise<CMAPipelineProperty[]> {
    try {
      const params = new URLSearchParams({
        city,
        ...(options.minPrice && { min_price: options.minPrice.toString() }),
        ...(options.maxPrice && { max_price: options.maxPrice.toString() }),
      });

      const response = await fetch(`${this.baseUrl}/cma-comparables?${params}`, {
        headers: {
          'Accept': '*/*',
          'User-Agent': 'BjorkHomes/1.0',
        },
      });

      if (!response.ok) {
        console.error(`CMA API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      
      // Handle both array and single object responses
      const properties = Array.isArray(data) ? data : (data.properties || []);
      
      // Sort by price descending and limit results
      const sortedProperties = properties
        .filter((p: any) => p.price && p.price > 0)
        .sort((a: any, b: any) => (b.price || 0) - (a.price || 0));

      return options.limit ? sortedProperties.slice(0, options.limit) : sortedProperties;
    } catch (error) {
      console.error('Error fetching properties from CMA API:', error);
      return [];
    }
  }

  async getLuxuryProperties(): Promise<CMAPipelineProperty[]> {
    try {
      // Get high-end properties from Omaha and Lincoln
      const [omahaProperties, lincolnProperties] = await Promise.all([
        this.getPropertiesForCity('Omaha', { minPrice: 500000, maxPrice: 2000000, limit: 10 }),
        this.getPropertiesForCity('Lincoln', { minPrice: 400000, maxPrice: 1500000, limit: 10 })
      ]);

      // Combine and sort by price descending
      const allProperties = [...omahaProperties, ...lincolnProperties]
        .sort((a, b) => (b.price || 0) - (a.price || 0));

      return allProperties.slice(0, 6); // Return top 6 luxury properties
    } catch (error) {
      console.error('Error fetching luxury properties:', error);
      return [];
    }
  }

  // Transform CMA API data to our property schema
  transformToProperty(cmaProperty: CMAPipelineProperty): any {
    return {
      mlsId: cmaProperty.mls_id || cmaProperty.id || `CMA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: this.generatePropertyTitle(cmaProperty),
      description: cmaProperty.description || this.generateDescription(cmaProperty),
      price: cmaProperty.price?.toString() || "0",
      address: cmaProperty.address || "",
      city: cmaProperty.city || "",
      state: cmaProperty.state || "NE",
      zipCode: cmaProperty.zip_code || "",
      beds: cmaProperty.beds || 3,
      baths: cmaProperty.baths?.toString() || "2.0",
      sqft: cmaProperty.sqft || 2000,
      yearBuilt: cmaProperty.year_built || 2020,
      propertyType: cmaProperty.property_type || "Single Family",
      status: "active",
      featured: true,
      luxury: (cmaProperty.price || 0) > 400000,
      images: this.generatePropertyImages(cmaProperty),
      neighborhood: this.extractNeighborhood(cmaProperty),
      schoolDistrict: this.getSchoolDistrict(cmaProperty.city),
      style: this.getPropertyStyle(cmaProperty),
      coordinates: cmaProperty.lat && cmaProperty.lng ? {
        lat: cmaProperty.lat,
        lng: cmaProperty.lng
      } : this.getDefaultCoordinates(cmaProperty.city),
      features: this.generateFeatures(cmaProperty),
      architecturalStyle: this.determineArchitecturalStyle(cmaProperty),
      secondaryStyle: null,
      styleConfidence: "0.75",
      styleFeatures: this.getStyleFeatures(cmaProperty),
      styleAnalyzed: true,
      isIdxListing: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generatePropertyTitle(property: CMAPipelineProperty): string {
    const price = property.price ? `$${(property.price / 1000).toFixed(0)}K` : "";
    const city = property.city || "Nebraska";
    const beds = property.beds || 3;
    const baths = property.baths || 2;
    
    return `${beds}BR/${baths}BA Luxury Home in ${city} ${price}`.trim();
  }

  private generateDescription(property: CMAPipelineProperty): string {
    const city = property.city || "Nebraska";
    const sqft = property.sqft ? `${property.sqft.toLocaleString()} sq ft` : "spacious";
    const year = property.year_built ? `built in ${property.year_built}` : "modern construction";
    
    return `Beautiful luxury home in ${city} featuring ${sqft} of ${year} living space with premium finishes and modern amenities.`;
  }

  private generatePropertyImages(property: CMAPipelineProperty): string[] {
    // Use property photos if available, otherwise use high-quality stock images
    if (property.photos && property.photos.length > 0) {
      return property.photos;
    }

    // Return luxury home stock images
    return [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ];
  }

  private extractNeighborhood(property: CMAPipelineProperty): string {
    // Extract neighborhood from address or use city
    if (property.address) {
      const parts = property.address.split(',');
      if (parts.length > 1) {
        return parts[parts.length - 2].trim();
      }
    }
    return property.city ? `${property.city} Area` : "Downtown";
  }

  private getSchoolDistrict(city?: string): string {
    const districts: Record<string, string> = {
      'Omaha': 'Omaha Public Schools',
      'Lincoln': 'Lincoln Public Schools',
      'Elkhorn': 'Elkhorn Public Schools',
      'Bellevue': 'Bellevue Public Schools',
      'Papillion': 'Papillion La Vista Schools'
    };
    return districts[city || ''] || 'Local School District';
  }

  private getPropertyStyle(property: CMAPipelineProperty): string {
    if (property.year_built && property.year_built > 2010) return "2 Story";
    if (property.sqft && property.sqft > 3000) return "2 Story";
    return "Ranch";
  }

  private getDefaultCoordinates(city?: string): { lat: number; lng: number } {
    const coordinates: Record<string, { lat: number; lng: number }> = {
      'Omaha': { lat: 41.2565, lng: -95.9345 },
      'Lincoln': { lat: 40.8136, lng: -96.7026 },
      'Elkhorn': { lat: 41.2871, lng: -96.2394 },
      'Bellevue': { lat: 41.1370, lng: -95.9145 },
      'Papillion': { lat: 41.1544, lng: -96.0422 }
    };
    return coordinates[city || ''] || coordinates['Omaha'];
  }

  private generateFeatures(property: CMAPipelineProperty): string[] {
    const features = ["Luxury Finishes"];
    
    if (property.sqft && property.sqft > 2500) {
      features.push("Spacious Layout");
    }
    if (property.year_built && property.year_built > 2015) {
      features.push("Modern Amenities");
    }
    if ((property.price || 0) > 600000) {
      features.push("Premium Location", "High-End Features");
    }
    
    return features;
  }

  private determineArchitecturalStyle(property: CMAPipelineProperty): string {
    if (property.year_built && property.year_built > 2015) return "Modern";
    if (property.year_built && property.year_built > 2000) return "Contemporary";
    return "Traditional";
  }

  private getStyleFeatures(property: CMAPipelineProperty): string[] {
    const year = property.year_built || 2020;
    if (year > 2015) {
      return ["Open concept", "Large windows", "Clean lines", "Modern finishes"];
    }
    return ["Classic design", "Quality craftsmanship", "Timeless appeal"];
  }
}

export const externalPropertyAPI = new ExternalPropertyAPI();