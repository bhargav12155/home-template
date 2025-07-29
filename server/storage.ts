import { 
  users, 
  properties, 
  communities, 
  blogPosts, 
  leads, 
  trackingCodes, 
  marketStats,
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type Community,
  type InsertCommunity,
  type BlogPost,
  type InsertBlogPost,
  type Lead,
  type InsertLead,
  type TrackingCode,
  type InsertTrackingCode,
  type MarketStats,
  type InsertMarketStats,
  type PropertySearch
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property methods
  getProperties(search?: PropertySearch): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertyByMLS(mlsId: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  updatePropertyStyle(id: number, styleData: {
    architecturalStyle?: string;
    secondaryStyle?: string;
    styleConfidence?: number;
    styleFeatures?: string[];
    styleAnalyzed?: boolean;
  }): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  getLuxuryProperties(): Promise<Property[]>;

  // Community methods
  getCommunities(): Promise<Community[]>;
  getCommunity(slug: string): Promise<Community | undefined>;
  createCommunity(community: InsertCommunity): Promise<Community>;

  // Blog methods
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;

  // Tracking methods
  getTrackingCodes(active?: boolean): Promise<TrackingCode[]>;
  createTrackingCode(code: InsertTrackingCode): Promise<TrackingCode>;
  updateTrackingCode(id: number, code: Partial<InsertTrackingCode>): Promise<TrackingCode | undefined>;

  // Market stats
  getMarketStats(area?: string): Promise<MarketStats[]>;
  createMarketStats(stats: InsertMarketStats): Promise<MarketStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private communities: Map<number, Community>;
  private blogPosts: Map<number, BlogPost>;
  private leads: Map<number, Lead>;
  private trackingCodes: Map<number, TrackingCode>;
  private marketStats: Map<number, MarketStats>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.communities = new Map();
    this.blogPosts = new Map();
    this.leads = new Map();
    this.trackingCodes = new Map();
    this.marketStats = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Sample properties based on real data from bjorkhomes.com
    const sampleProperties: InsertProperty[] = [
      {
        mlsId: "22520502",
        title: "Luxury Estate in Elkhorn",
        description: "Stunning luxury home with modern amenities and beautiful landscaping",
        price: "1195000",
        address: "21727 Cimarron Road",
        city: "Elkhorn",
        state: "NE",
        zipCode: "68022",
        beds: 4,
        baths: "5.0",
        sqft: 3694,
        yearBuilt: 2020,
        propertyType: "Single Family",
        status: "active",
        featured: true,
        luxury: true,
        architecturalStyle: "Modern",
        secondaryStyle: "Contemporary",
        styleConfidence: "0.89",
        styleFeatures: ["Clean lines", "Large windows", "Open concept", "Minimalist design"],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
        ],
        neighborhood: "Cimarron Ridge",
        schoolDistrict: "Elkhorn Public Schools",
        coordinates: { lat: 41.2871, lng: -96.2394 },
        features: ["Gourmet Kitchen", "Master Suite", "3-Car Garage", "Covered Patio"]
      },
      {
        mlsId: "22520385",
        title: "New Construction in Lincoln",
        description: "Brand new home with contemporary design and energy-efficient features",
        price: "850000",
        address: "2904 Georgian Court",
        city: "Lincoln",
        state: "NE",
        zipCode: "68502",
        beds: 4,
        baths: "4.0",
        sqft: 3244,
        yearBuilt: 2024,
        propertyType: "Single Family",
        status: "active",
        featured: true,
        luxury: true,
        architecturalStyle: "Contemporary",
        secondaryStyle: "Transitional",
        styleConfidence: "0.85",
        styleFeatures: ["Smart home integration", "Energy-efficient design", "Open layouts", "Contemporary finishes"],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
        ],
        neighborhood: "Georgian Heights",
        schoolDistrict: "Lincoln Public Schools",
        coordinates: { lat: 40.8136, lng: -96.7025 },
        features: ["Smart Home Technology", "Open Floor Plan", "Luxury Finishes"]
      },
      {
        mlsId: "22520377",
        title: "Luxury Manor in West Omaha",
        description: "Exceptional luxury home with premium finishes and extensive amenities",
        price: "1995000",
        address: "13824 Cuming Street",
        city: "Omaha",
        state: "NE",
        zipCode: "68154",
        beds: 5,
        baths: "6.0",
        sqft: 7460,
        yearBuilt: 2018,
        propertyType: "Single Family",
        status: "active",
        featured: true,
        luxury: true,
        architecturalStyle: "Traditional",
        secondaryStyle: "Colonial",
        styleConfidence: "0.91",
        styleFeatures: ["Symmetrical facade", "Classical proportions", "Premium finishes", "Formal layouts"],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        ],
        neighborhood: "Regency",
        schoolDistrict: "Millard Public Schools",
        coordinates: { lat: 41.2565, lng: -96.1951 },
        features: ["Wine Cellar", "Home Theater", "Pool", "Guest Suite"]
      }
    ];

    sampleProperties.forEach(property => {
      const id = this.currentId++;
      this.properties.set(id, { ...property, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Sample communities
    const sampleCommunities: InsertCommunity[] = [
      {
        name: "Omaha",
        slug: "omaha",
        description: "Urban sophistication meets Midwest charm",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        propertyCount: 1250,
        averagePrice: "485000",
        highlights: ["Downtown Living", "Arts District", "Fine Dining"]
      },
      {
        name: "Lincoln",
        slug: "lincoln",
        description: "Capital city living at its finest",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        propertyCount: 890,
        averagePrice: "425000",
        highlights: ["University Area", "State Capital", "Growing Tech Scene"]
      },
      {
        name: "Elkhorn",
        slug: "elkhorn",
        description: "Family-friendly suburban excellence",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80",
        propertyCount: 520,
        averagePrice: "675000",
        highlights: ["Top Schools", "New Construction", "Family Community"]
      },
      {
        name: "Lake Properties",
        slug: "lake-properties",
        description: "Waterfront luxury and recreation",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
        propertyCount: 185,
        averagePrice: "925000",
        highlights: ["Waterfront Access", "Recreation", "Luxury Homes"]
      }
    ];

    sampleCommunities.forEach(community => {
      const id = this.currentId++;
      this.communities.set(id, { ...community, id });
    });

    // Sample blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "Is Getting a Home Mortgage Still Too Difficult?",
        slug: "home-mortgage-difficulty-2025",
        excerpt: "Understanding current lending standards and how they affect Nebraska homebuyers in today's market.",
        content: "Current mortgage lending standards have evolved significantly...",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&q=80",
        category: "Market Analysis",
        author: "Michael Bjork",
        published: true,
        createdAt: new Date("2025-01-23"),
        updatedAt: new Date("2025-01-23")
      },
      {
        title: "Why You Should Consider Selling in the Winter",
        slug: "winter-selling-advantages",
        excerpt: "Winter selling attracts serious buyers and can lead to faster closings in Nebraska's unique market.",
        content: "While many homeowners wait for spring to list their homes...",
        image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        category: "Selling Tips",
        author: "Michael Bjork",
        published: true,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-20")
      },
      {
        title: "Things to Look Out for Before Buying Your Dream Home",
        slug: "home-buying-checklist-2025",
        excerpt: "Essential checklist items every Nebraska homebuyer should consider before making an offer.",
        content: "Buying a home is one of the most significant investments...",
        image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&q=80",
        category: "Buying Guide",
        author: "Michael Bjork",
        published: true,
        createdAt: new Date("2025-01-18"),
        updatedAt: new Date("2025-01-18")
      }
    ];

    sampleBlogPosts.forEach(post => {
      const id = this.currentId++;
      this.blogPosts.set(id, { ...post, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(search?: PropertySearch): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (search) {
      if (search.query) {
        const query = search.query.toLowerCase();
        properties = properties.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.neighborhood?.toLowerCase().includes(query)
        );
      }
      if (search.minPrice) {
        properties = properties.filter(p => parseFloat(p.price) >= search.minPrice!);
      }
      if (search.maxPrice) {
        properties = properties.filter(p => parseFloat(p.price) <= search.maxPrice!);
      }
      if (search.beds) {
        properties = properties.filter(p => p.beds >= search.beds!);
      }
      if (search.baths) {
        properties = properties.filter(p => parseFloat(p.baths) >= search.baths!);
      }
      if (search.propertyType) {
        properties = properties.filter(p => p.propertyType === search.propertyType);
      }
      if (search.city) {
        properties = properties.filter(p => p.city.toLowerCase() === search.city!.toLowerCase());
      }
      if (search.luxury) {
        properties = properties.filter(p => p.luxury === search.luxury);
      }
      if (search.featured) {
        properties = properties.filter(p => p.featured === search.featured);
      }
      if (search.architecturalStyle) {
        properties = properties.filter(p => 
          p.architecturalStyle === search.architecturalStyle ||
          p.secondaryStyle === search.architecturalStyle
        );
      }
      if (search.neighborhood) {
        properties = properties.filter(p => p.neighborhood?.toLowerCase() === search.neighborhood!.toLowerCase());
      }
      if (search.schoolDistrict) {
        properties = properties.filter(p => p.schoolDistrict?.toLowerCase() === search.schoolDistrict!.toLowerCase());
      }
    }

    return properties.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertyByMLS(mlsId: string): Promise<Property | undefined> {
    return Array.from(this.properties.values()).find(p => p.mlsId === mlsId);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.currentId++;
    const newProperty: Property = { 
      ...property, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = { 
      ...existing, 
      ...property, 
      updatedAt: new Date() 
    };
    this.properties.set(id, updated);
    return updated;
  }

  async updatePropertyStyle(id: number, styleData: {
    architecturalStyle?: string;
    secondaryStyle?: string;
    styleConfidence?: number;
    styleFeatures?: string[];
    styleAnalyzed?: boolean;
  }): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = { 
      ...existing, 
      architecturalStyle: styleData.architecturalStyle || existing.architecturalStyle,
      secondaryStyle: styleData.secondaryStyle || existing.secondaryStyle,
      styleConfidence: styleData.styleConfidence?.toString() || existing.styleConfidence,
      styleFeatures: styleData.styleFeatures || existing.styleFeatures,
      styleAnalyzed: styleData.styleAnalyzed ?? existing.styleAnalyzed,
      updatedAt: new Date() 
    };
    this.properties.set(id, updated);
    return updated;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.featured);
  }

  async getLuxuryProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.luxury);
  }

  // Community methods
  async getCommunities(): Promise<Community[]> {
    return Array.from(this.communities.values());
  }

  async getCommunity(slug: string): Promise<Community | undefined> {
    return Array.from(this.communities.values()).find(c => c.slug === slug);
  }

  async createCommunity(community: InsertCommunity): Promise<Community> {
    const id = this.currentId++;
    const newCommunity: Community = { ...community, id };
    this.communities.set(id, newCommunity);
    return newCommunity;
  }

  // Blog methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    if (published !== undefined) {
      posts = posts.filter(p => p.published === published);
    }
    return posts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const newPost: BlogPost = { 
      ...post, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  // Lead methods
  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const newLead: Lead = { 
      ...lead, 
      id, 
      createdAt: new Date() 
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  // Tracking methods
  async getTrackingCodes(active?: boolean): Promise<TrackingCode[]> {
    let codes = Array.from(this.trackingCodes.values());
    if (active !== undefined) {
      codes = codes.filter(c => c.active === active);
    }
    return codes;
  }

  async createTrackingCode(code: InsertTrackingCode): Promise<TrackingCode> {
    const id = this.currentId++;
    const newCode: TrackingCode = { 
      ...code, 
      id, 
      createdAt: new Date() 
    };
    this.trackingCodes.set(id, newCode);
    return newCode;
  }

  async updateTrackingCode(id: number, code: Partial<InsertTrackingCode>): Promise<TrackingCode | undefined> {
    const existing = this.trackingCodes.get(id);
    if (!existing) return undefined;

    const updated: TrackingCode = { ...existing, ...code };
    this.trackingCodes.set(id, updated);
    return updated;
  }

  // Market stats
  async getMarketStats(area?: string): Promise<MarketStats[]> {
    let stats = Array.from(this.marketStats.values());
    if (area) {
      stats = stats.filter(s => s.area === area);
    }
    return stats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createMarketStats(stats: InsertMarketStats): Promise<MarketStats> {
    const id = this.currentId++;
    const newStats: MarketStats = { ...stats, id };
    this.marketStats.set(id, newStats);
    return newStats;
  }
}

export const storage = new MemStorage();
