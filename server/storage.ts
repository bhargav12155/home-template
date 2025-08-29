import {
  users,
  properties,
  communities,
  blogPosts,
  leads,
  trackingCodes,
  marketStats,
  idxAgents,
  idxMedia,
  idxSyncLog,
  templates,
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
  type IdxAgent,
  type InsertIdxAgent,
  type IdxMedia,
  type InsertIdxMedia,
  type IdxSyncLog,
  type InsertIdxSyncLog,
  type PropertySearch,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { externalPropertyAPI } from "./external-api";

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
  updateProperty(
    id: number,
    property: Partial<InsertProperty>
  ): Promise<Property | undefined>;
  updatePropertyStyle(
    id: number,
    styleData: {
      architecturalStyle?: string;
      secondaryStyle?: string;
      styleConfidence?: number;
      styleFeatures?: string[];
      styleAnalyzed?: boolean;
    }
  ): Promise<Property | undefined>;
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
  updateTrackingCode(
    id: number,
    code: Partial<InsertTrackingCode>
  ): Promise<TrackingCode | undefined>;

  // Market stats
  getMarketStats(area?: string): Promise<MarketStats[]>;
  createMarketStats(stats: InsertMarketStats): Promise<MarketStats>;

  // IDX Agent methods
  getIdxAgents(): Promise<IdxAgent[]>;
  getIdxAgent(id: number): Promise<IdxAgent | undefined>;
  getIdxAgentByMemberKey(memberKey: string): Promise<IdxAgent | undefined>;
  createIdxAgent(agent: InsertIdxAgent): Promise<IdxAgent>;
  updateIdxAgent(
    id: number,
    agent: Partial<InsertIdxAgent>
  ): Promise<IdxAgent | undefined>;

  // IDX Media methods
  getIdxMediaForProperty(listingKey: string): Promise<IdxMedia[]>;
  getIdxMedia(id: number): Promise<IdxMedia | undefined>;
  getIdxMediaByKey(mediaKey: string): Promise<IdxMedia | undefined>;
  createIdxMedia(media: InsertIdxMedia): Promise<IdxMedia>;
  updateIdxMedia(
    id: number,
    media: Partial<InsertIdxMedia>
  ): Promise<IdxMedia | undefined>;

  // IDX Sync Log methods
  getIdxSyncLogs(limit?: number): Promise<IdxSyncLog[]>;
  getIdxSyncLog(id: number): Promise<IdxSyncLog | undefined>;
  createIdxSyncLog(log: InsertIdxSyncLog): Promise<IdxSyncLog>;
  updateIdxSyncLog(
    id: number,
    log: Partial<InsertIdxSyncLog>
  ): Promise<IdxSyncLog | undefined>;

  // Template methods
  getTemplate(): Promise<any>;
  updateTemplate(template: any): Promise<any>;

  // User-specific template methods
  getTemplateByUser(userId: number): Promise<any>;
  updateTemplateByUser(userId: number, template: any): Promise<any>;
  createTemplateForUser(userId: number, template: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private communities: Map<number, Community>;
  private blogPosts: Map<number, BlogPost>;
  private leads: Map<number, Lead>;
  private trackingCodes: Map<number, TrackingCode>;
  private marketStats: Map<number, MarketStats>;
  private idxAgents: Map<number, IdxAgent>;
  private idxMedia: Map<number, IdxMedia>;
  private idxSyncLogs: Map<number, IdxSyncLog>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.communities = new Map();
    this.blogPosts = new Map();
    this.leads = new Map();
    this.trackingCodes = new Map();
    this.marketStats = new Map();
    this.idxAgents = new Map();
    this.idxMedia = new Map();
    this.idxSyncLogs = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Sample properties based on real data from bjorkhomes.com
    const sampleProperties: InsertProperty[] = [
      {
        mlsId: "22520502",
        title: "Luxury Estate in Elkhorn",
        description:
          "Stunning luxury home with modern amenities and beautiful landscaping",
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
        styleFeatures: [
          "Clean lines",
          "Large windows",
          "Open concept",
          "Minimalist design",
        ],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
        ],
        neighborhood: "Cimarron Ridge",
        schoolDistrict: "Elkhorn Public Schools",
        style: "2 Story",
        coordinates: { lat: 41.2871, lng: -96.2394 },
        features: [
          "Gourmet Kitchen",
          "Master Suite",
          "3-Car Garage",
          "Covered Patio",
        ],
      },
      {
        mlsId: "22520385",
        title: "New Construction in Lincoln",
        description:
          "Brand new home with contemporary design and energy-efficient features",
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
        styleFeatures: [
          "Smart home integration",
          "Energy-efficient design",
          "Open layouts",
          "Contemporary finishes",
        ],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
        ],
        neighborhood: "Georgian Heights",
        schoolDistrict: "Lincoln Public Schools",
        style: "1.5 Story",
        coordinates: { lat: 40.8136, lng: -96.7025 },
        features: [
          "Smart Home Technology",
          "Open Floor Plan",
          "Luxury Finishes",
        ],
      },
      {
        mlsId: "22520377",
        title: "Luxury Manor in West Omaha",
        description:
          "Exceptional luxury home with premium finishes and extensive amenities",
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
        styleFeatures: [
          "Symmetrical facade",
          "Classical proportions",
          "Premium finishes",
          "Formal layouts",
        ],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        ],
        neighborhood: "Regency",
        schoolDistrict: "Millard Public Schools",
        style: "Ranch",
        coordinates: { lat: 41.2565, lng: -96.1951 },
        features: ["Wine Cellar", "Home Theater", "Pool", "Guest Suite"],
      },
    ];

    sampleProperties.forEach((property) => {
      const id = this.currentId++;
      this.properties.set(id, {
        ...property,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Sample communities
    const sampleCommunities: InsertCommunity[] = [
      {
        name: "Omaha",
        slug: "omaha",
        description: "Urban sophistication meets Midwest charm",
        image:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        propertyCount: 1250,
        averagePrice: "485000",
        highlights: ["Downtown Living", "Arts District", "Fine Dining"],
      },
      {
        name: "Lincoln",
        slug: "lincoln",
        description: "Capital city living at its finest",
        image:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        propertyCount: 890,
        averagePrice: "425000",
        highlights: ["University Area", "State Capital", "Growing Tech Scene"],
      },
      {
        name: "Elkhorn",
        slug: "elkhorn",
        description: "Family-friendly suburban excellence",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80",
        propertyCount: 520,
        averagePrice: "675000",
        highlights: ["Top Schools", "New Construction", "Family Community"],
      },
      {
        name: "Lake Properties",
        slug: "lake-properties",
        description: "Waterfront luxury and recreation",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
        propertyCount: 185,
        averagePrice: "925000",
        highlights: ["Waterfront Access", "Recreation", "Luxury Homes"],
      },
    ];

    sampleCommunities.forEach((community) => {
      const id = this.currentId++;
      this.communities.set(id, { ...community, id });
    });

    // Sample blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "Is Getting a Home Mortgage Still Too Difficult?",
        slug: "home-mortgage-difficulty-2025",
        excerpt:
          "Understanding current lending standards and how they affect Nebraska homebuyers in today's market.",
        content:
          "Current mortgage lending standards have evolved significantly...",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&q=80",
        category: "Market Analysis",
        author: "Michael Bjork",
        published: true,
        createdAt: new Date("2025-01-23"),
        updatedAt: new Date("2025-01-23"),
      },
      {
        title: "Why You Should Consider Selling in the Winter",
        slug: "winter-selling-advantages",
        excerpt:
          "Winter selling attracts serious buyers and can lead to faster closings in Nebraska's unique market.",
        content: "While many homeowners wait for spring to list their homes...",
        image:
          "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        category: "Selling Tips",
        author: "Michael Bjork",
        published: true,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-01-20"),
      },
      {
        title: "Things to Look Out for Before Buying Your Dream Home",
        slug: "home-buying-checklist-2025",
        excerpt:
          "Essential checklist items every Nebraska homebuyer should consider before making an offer.",
        content: "Buying a home is one of the most significant investments...",
        image:
          "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&q=80",
        category: "Buying Guide",
        author: "Michael Bjork",
        published: true,
        createdAt: new Date("2025-01-18"),
        updatedAt: new Date("2025-01-18"),
      },
    ];

    sampleBlogPosts.forEach((post) => {
      const id = this.currentId++;
      this.blogPosts.set(id, { ...post, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
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
        properties = properties.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.address.toLowerCase().includes(query) ||
            p.city.toLowerCase().includes(query) ||
            p.neighborhood?.toLowerCase().includes(query)
        );
      }
      if (search.minPrice) {
        properties = properties.filter(
          (p) => parseFloat(p.price) >= search.minPrice!
        );
      }
      if (search.maxPrice) {
        properties = properties.filter(
          (p) => parseFloat(p.price) <= search.maxPrice!
        );
      }
      if (search.beds) {
        properties = properties.filter((p) => p.beds >= search.beds!);
      }
      if (search.baths) {
        properties = properties.filter(
          (p) => parseFloat(p.baths) >= search.baths!
        );
      }
      if (search.propertyType) {
        properties = properties.filter(
          (p) => p.propertyType === search.propertyType
        );
      }
      if (search.city) {
        properties = properties.filter(
          (p) => p.city.toLowerCase() === search.city!.toLowerCase()
        );
      }
      if (search.luxury) {
        properties = properties.filter((p) => p.luxury === search.luxury);
      }
      if (search.featured) {
        properties = properties.filter((p) => p.featured === search.featured);
      }
      if (search.architecturalStyle) {
        properties = properties.filter(
          (p) =>
            p.architecturalStyle === search.architecturalStyle ||
            p.secondaryStyle === search.architecturalStyle
        );
      }
      if (search.neighborhood) {
        properties = properties.filter(
          (p) =>
            p.neighborhood?.toLowerCase() === search.neighborhood!.toLowerCase()
        );
      }
      if (search.schoolDistrict) {
        properties = properties.filter(
          (p) =>
            p.schoolDistrict?.toLowerCase() ===
            search.schoolDistrict!.toLowerCase()
        );
      }
      if (search.style) {
        properties = properties.filter(
          (p) => p.style?.toLowerCase() === search.style!.toLowerCase()
        );
      }
    }

    return properties.sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertyByMLS(mlsId: string): Promise<Property | undefined> {
    return Array.from(this.properties.values()).find((p) => p.mlsId === mlsId);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.currentId++;
    const newProperty: Property = {
      ...property,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(
    id: number,
    property: Partial<InsertProperty>
  ): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = {
      ...existing,
      ...property,
      updatedAt: new Date(),
    };
    this.properties.set(id, updated);
    return updated;
  }

  async updatePropertyStyle(
    id: number,
    styleData: {
      architecturalStyle?: string;
      secondaryStyle?: string;
      styleConfidence?: number;
      styleFeatures?: string[];
      styleAnalyzed?: boolean;
    }
  ): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;

    const updated: Property = {
      ...existing,
      architecturalStyle:
        styleData.architecturalStyle || existing.architecturalStyle,
      secondaryStyle: styleData.secondaryStyle || existing.secondaryStyle,
      styleConfidence:
        styleData.styleConfidence?.toString() || existing.styleConfidence,
      styleFeatures: styleData.styleFeatures || existing.styleFeatures,
      styleAnalyzed: styleData.styleAnalyzed ?? existing.styleAnalyzed,
      updatedAt: new Date(),
    };
    this.properties.set(id, updated);
    return updated;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    try {
      // Get luxury properties from external API
      const externalProperties =
        await externalPropertyAPI.getLuxuryProperties();

      if (externalProperties.length > 0) {
        // Transform external properties to our schema format
        return externalProperties.map((prop) =>
          externalPropertyAPI.transformToProperty(prop)
        );
      }

      // Fallback to local properties if API fails
      return Array.from(this.properties.values()).filter((p) => p.featured);
    } catch (error) {
      console.error(
        "Error fetching featured properties from external API:",
        error
      );
      // Return local featured properties as fallback
      return Array.from(this.properties.values()).filter((p) => p.featured);
    }
  }

  async getLuxuryProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((p) => p.luxury);
  }

  // Community methods
  async getCommunities(): Promise<Community[]> {
    return Array.from(this.communities.values());
  }

  async getCommunity(slug: string): Promise<Community | undefined> {
    return Array.from(this.communities.values()).find((c) => c.slug === slug);
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
      posts = posts.filter((p) => p.published === published);
    }
    return posts.sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find((p) => p.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const newPost: BlogPost = {
      ...post,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      createdAt: new Date(),
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  // Tracking methods
  async getTrackingCodes(active?: boolean): Promise<TrackingCode[]> {
    let codes = Array.from(this.trackingCodes.values());
    if (active !== undefined) {
      codes = codes.filter((c) => c.active === active);
    }
    return codes;
  }

  async createTrackingCode(code: InsertTrackingCode): Promise<TrackingCode> {
    const id = this.currentId++;
    const newCode: TrackingCode = {
      ...code,
      id,
      createdAt: new Date(),
    };
    this.trackingCodes.set(id, newCode);
    return newCode;
  }

  async updateTrackingCode(
    id: number,
    code: Partial<InsertTrackingCode>
  ): Promise<TrackingCode | undefined> {
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
      stats = stats.filter((s) => s.area === area);
    }
    return stats.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createMarketStats(stats: InsertMarketStats): Promise<MarketStats> {
    const id = this.currentId++;
    const newStats: MarketStats = { ...stats, id };
    this.marketStats.set(id, newStats);
    return newStats;
  }

  // IDX Agent methods
  async getIdxAgents(): Promise<IdxAgent[]> {
    return Array.from(this.idxAgents.values());
  }

  async getIdxAgent(id: number): Promise<IdxAgent | undefined> {
    return this.idxAgents.get(id);
  }

  async getIdxAgentByMemberKey(
    memberKey: string
  ): Promise<IdxAgent | undefined> {
    return Array.from(this.idxAgents.values()).find(
      (a) => a.memberKey === memberKey
    );
  }

  async createIdxAgent(agent: InsertIdxAgent): Promise<IdxAgent> {
    const id = this.currentId++;
    const newAgent: IdxAgent = {
      ...agent,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.idxAgents.set(id, newAgent);
    return newAgent;
  }

  async updateIdxAgent(
    id: number,
    agent: Partial<InsertIdxAgent>
  ): Promise<IdxAgent | undefined> {
    const existing = this.idxAgents.get(id);
    if (!existing) return undefined;

    const updated: IdxAgent = {
      ...existing,
      ...agent,
      updatedAt: new Date(),
    };
    this.idxAgents.set(id, updated);
    return updated;
  }

  // IDX Media methods
  async getIdxMediaForProperty(listingKey: string): Promise<IdxMedia[]> {
    return Array.from(this.idxMedia.values()).filter(
      (m) => m.listingKey === listingKey
    );
  }

  async getIdxMedia(id: number): Promise<IdxMedia | undefined> {
    return this.idxMedia.get(id);
  }

  async getIdxMediaByKey(mediaKey: string): Promise<IdxMedia | undefined> {
    return Array.from(this.idxMedia.values()).find(
      (m) => m.mediaKey === mediaKey
    );
  }

  async createIdxMedia(media: InsertIdxMedia): Promise<IdxMedia> {
    const id = this.currentId++;
    const newMedia: IdxMedia = {
      ...media,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.idxMedia.set(id, newMedia);
    return newMedia;
  }

  async updateIdxMedia(
    id: number,
    media: Partial<InsertIdxMedia>
  ): Promise<IdxMedia | undefined> {
    const existing = this.idxMedia.get(id);
    if (!existing) return undefined;

    const updated: IdxMedia = {
      ...existing,
      ...media,
      updatedAt: new Date(),
    };
    this.idxMedia.set(id, updated);
    return updated;
  }

  // IDX Sync Log methods
  async getIdxSyncLogs(limit?: number): Promise<IdxSyncLog[]> {
    let logs = Array.from(this.idxSyncLogs.values()).sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    if (limit) {
      logs = logs.slice(0, limit);
    }

    return logs;
  }

  async getIdxSyncLog(id: number): Promise<IdxSyncLog | undefined> {
    return this.idxSyncLogs.get(id);
  }

  async createIdxSyncLog(log: InsertIdxSyncLog): Promise<IdxSyncLog> {
    const id = this.currentId++;
    const newLog: IdxSyncLog = { ...log, id };
    this.idxSyncLogs.set(id, newLog);
    return newLog;
  }

  async updateIdxSyncLog(
    id: number,
    log: Partial<InsertIdxSyncLog>
  ): Promise<IdxSyncLog | undefined> {
    const existing = this.idxSyncLogs.get(id);
    if (!existing) return undefined;

    const updated: IdxSyncLog = { ...existing, ...log };
    this.idxSyncLogs.set(id, updated);
    return updated;
  }

  // Template methods
  async getTemplate(): Promise<any> {
    return {
      id: "default-template",
      companyName: "Bjork Group",
      companyDescription:
        "Discover exceptional homes with Nebraska's premier luxury real estate team",
      heroTitle: "Luxury is an Experience",
      primaryColor: "#D4B895",
      secondaryColor: "#1A1A1A",
    };
  }

  async updateTemplate(template: any): Promise<any> {
    // For MemStorage, we just return the updated template
    // In a real implementation, this would save to database
    return template;
  }

  // User-specific template methods for MemStorage
  async getTemplateByUser(userId: number): Promise<any> {
    // For development, return default template regardless of user
    return this.getTemplate();
  }

  async updateTemplateByUser(userId: number, template: any): Promise<any> {
    // For development, just return the template
    return template;
  }

  async createTemplateForUser(userId: number, template: any): Promise<any> {
    // For development, just return the template with the userId
    return { ...template, userId };
  }
}

// DatabaseStorage implementation using real PostgreSQL
export class DatabaseStorage implements IStorage {
  constructor() {
    // In development mode, warn if database is not available
    if (!db && process.env.NODE_ENV === "development") {
      console.warn(
        "DatabaseStorage: No database connection available in development mode"
      );
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProperties(search?: PropertySearch): Promise<Property[]> {
    // For now, return empty array - properties will be added via MLS sync or admin
    return [];
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return property || undefined;
  }

  async getPropertyByMLS(mlsId: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.mlsId, mlsId));
    return property || undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async updateProperty(
    id: number,
    property: Partial<InsertProperty>
  ): Promise<Property | undefined> {
    const [updated] = await db
      .update(properties)
      .set(property)
      .where(eq(properties.id, id))
      .returning();
    return updated || undefined;
  }

  async updatePropertyStyle(
    id: number,
    styleData: {
      architecturalStyle?: string;
      secondaryStyle?: string;
      styleConfidence?: number;
      styleFeatures?: string[];
      styleAnalyzed?: boolean;
    }
  ): Promise<Property | undefined> {
    const [updated] = await db
      .update(properties)
      .set(styleData)
      .where(eq(properties.id, id))
      .returning();
    return updated || undefined;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return await db.select().from(properties).limit(6);
  }

  async getLuxuryProperties(): Promise<Property[]> {
    return await db.select().from(properties).limit(10);
  }

  // Community methods
  async getCommunities(): Promise<Community[]> {
    return await db.select().from(communities);
  }

  async getCommunity(slug: string): Promise<Community | undefined> {
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug));
    return community || undefined;
  }

  async createCommunity(community: InsertCommunity): Promise<Community> {
    const [newCommunity] = await db
      .insert(communities)
      .values(community)
      .returning();
    return newCommunity;
  }

  // Blog methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  // Lead methods
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  // Tracking methods
  async getTrackingCodes(active?: boolean): Promise<TrackingCode[]> {
    return await db.select().from(trackingCodes);
  }

  async createTrackingCode(code: InsertTrackingCode): Promise<TrackingCode> {
    const [newCode] = await db.insert(trackingCodes).values(code).returning();
    return newCode;
  }

  async updateTrackingCode(
    id: number,
    code: Partial<InsertTrackingCode>
  ): Promise<TrackingCode | undefined> {
    const [updated] = await db
      .update(trackingCodes)
      .set(code)
      .where(eq(trackingCodes.id, id))
      .returning();
    return updated || undefined;
  }

  // Market Stats methods
  async getMarketStats(): Promise<MarketStats[]> {
    return await db.select().from(marketStats);
  }

  async createMarketStats(stats: InsertMarketStats): Promise<MarketStats> {
    const [newStats] = await db.insert(marketStats).values(stats).returning();
    return newStats;
  }

  async updateMarketStats(
    id: number,
    stats: Partial<InsertMarketStats>
  ): Promise<MarketStats | undefined> {
    const [updated] = await db
      .update(marketStats)
      .set(stats)
      .where(eq(marketStats.id, id))
      .returning();
    return updated || undefined;
  }

  // IDX Agent methods
  async getIdxAgents(): Promise<IdxAgent[]> {
    return await db.select().from(idxAgents);
  }

  async getIdxAgent(id: number): Promise<IdxAgent | undefined> {
    const [agent] = await db
      .select()
      .from(idxAgents)
      .where(eq(idxAgents.id, id));
    return agent || undefined;
  }

  async getIdxAgentByMemberKey(
    memberKey: string
  ): Promise<IdxAgent | undefined> {
    const [agent] = await db
      .select()
      .from(idxAgents)
      .where(eq(idxAgents.memberKey, memberKey));
    return agent || undefined;
  }

  async createIdxAgent(agent: InsertIdxAgent): Promise<IdxAgent> {
    const [newAgent] = await db.insert(idxAgents).values(agent).returning();
    return newAgent;
  }

  async updateIdxAgent(
    id: number,
    agent: Partial<InsertIdxAgent>
  ): Promise<IdxAgent | undefined> {
    const [updated] = await db
      .update(idxAgents)
      .set(agent)
      .where(eq(idxAgents.id, id))
      .returning();
    return updated || undefined;
  }

  // IDX Media methods
  async getIdxMediaForProperty(listingKey: string): Promise<IdxMedia[]> {
    return await db
      .select()
      .from(idxMedia)
      .where(eq(idxMedia.listingKey, listingKey));
  }

  async getIdxMedia(id: number): Promise<IdxMedia | undefined> {
    const [media] = await db.select().from(idxMedia).where(eq(idxMedia.id, id));
    return media || undefined;
  }

  async getIdxMediaByKey(mediaKey: string): Promise<IdxMedia | undefined> {
    const [media] = await db
      .select()
      .from(idxMedia)
      .where(eq(idxMedia.mediaKey, mediaKey));
    return media || undefined;
  }

  async createIdxMedia(media: InsertIdxMedia): Promise<IdxMedia> {
    const [newMedia] = await db.insert(idxMedia).values(media).returning();
    return newMedia;
  }

  async updateIdxMedia(
    id: number,
    media: Partial<InsertIdxMedia>
  ): Promise<IdxMedia | undefined> {
    const [updated] = await db
      .update(idxMedia)
      .set(media)
      .where(eq(idxMedia.id, id))
      .returning();
    return updated || undefined;
  }

  // IDX Sync Log methods
  async getIdxSyncLogs(limit?: number): Promise<IdxSyncLog[]> {
    let query = db.select().from(idxSyncLog);
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }

  async getIdxSyncLog(id: number): Promise<IdxSyncLog | undefined> {
    const [log] = await db
      .select()
      .from(idxSyncLog)
      .where(eq(idxSyncLog.id, id));
    return log || undefined;
  }

  async createIdxSyncLog(log: InsertIdxSyncLog): Promise<IdxSyncLog> {
    const [newLog] = await db.insert(idxSyncLog).values(log).returning();
    return newLog;
  }

  async updateIdxSyncLog(
    id: number,
    log: Partial<InsertIdxSyncLog>
  ): Promise<IdxSyncLog | undefined> {
    const [updated] = await db
      .update(idxSyncLog)
      .set(log)
      .where(eq(idxSyncLog.id, id))
      .returning();
    return updated || undefined;
  }

  // Template methods
  async getTemplate(): Promise<any> {
    const [template] = await db.select().from(templates).limit(1);
    return template;
  }

  async updateTemplate(templateData: any): Promise<any> {
    const [existingTemplate] = await db.select().from(templates).limit(1);

    if (existingTemplate) {
      const [updated] = await db
        .update(templates)
        .set({ ...templateData, updatedAt: new Date() })
        .where(eq(templates.id, existingTemplate.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(templates)
        .values(templateData)
        .returning();
      return created;
    }
  }

  // User-specific template methods for DatabaseStorage
  async getTemplateByUser(userId: number): Promise<any> {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.userId, userId))
      .limit(1);
    return template;
  }

  async updateTemplateByUser(userId: number, templateData: any): Promise<any> {
    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(eq(templates.userId, userId))
      .limit(1);

    if (existingTemplate) {
      const [updated] = await db
        .update(templates)
        .set({ ...templateData, updatedAt: new Date() })
        .where(eq(templates.id, existingTemplate.id))
        .returning();
      return updated;
    } else {
      // Create new template for user
      return this.createTemplateForUser(userId, templateData);
    }
  }

  async createTemplateForUser(userId: number, templateData: any): Promise<any> {
    const [created] = await db
      .insert(templates)
      .values({
        userId,
        ...templateData,
      })
      .returning();
    return created;
  }
}

// Use DatabaseStorage when db is available, otherwise fallback to MemStorage
export const storage = db ? new DatabaseStorage() : new MemStorage();
