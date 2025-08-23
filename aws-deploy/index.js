// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  properties;
  communities;
  blogPosts;
  leads;
  trackingCodes;
  marketStats;
  idxAgents;
  idxMedia;
  idxSyncLogs;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.communities = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.leads = /* @__PURE__ */ new Map();
    this.trackingCodes = /* @__PURE__ */ new Map();
    this.marketStats = /* @__PURE__ */ new Map();
    this.idxAgents = /* @__PURE__ */ new Map();
    this.idxMedia = /* @__PURE__ */ new Map();
    this.idxSyncLogs = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.seedData();
  }
  seedData() {
    const sampleProperties = [
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
        style: "2 Story",
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
        style: "1.5 Story",
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
        style: "Ranch",
        coordinates: { lat: 41.2565, lng: -96.1951 },
        features: ["Wine Cellar", "Home Theater", "Pool", "Guest Suite"]
      }
    ];
    sampleProperties.forEach((property) => {
      const id = this.currentId++;
      this.properties.set(id, { ...property, id, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    });
    const sampleCommunities = [
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
    sampleCommunities.forEach((community) => {
      const id = this.currentId++;
      this.communities.set(id, { ...community, id });
    });
    const sampleBlogPosts = [
      {
        title: "Is Getting a Home Mortgage Still Too Difficult?",
        slug: "home-mortgage-difficulty-2025",
        excerpt: "Understanding current lending standards and how they affect Nebraska homebuyers in today's market.",
        content: "Current mortgage lending standards have evolved significantly...",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2026&q=80",
        category: "Market Analysis",
        author: "Michael Bjork",
        published: true,
        createdAt: /* @__PURE__ */ new Date("2025-01-23"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-23")
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
        createdAt: /* @__PURE__ */ new Date("2025-01-20"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-20")
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
        createdAt: /* @__PURE__ */ new Date("2025-01-18"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-18")
      }
    ];
    sampleBlogPosts.forEach((post) => {
      const id = this.currentId++;
      this.blogPosts.set(id, { ...post, id });
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Property methods
  async getProperties(search) {
    let properties2 = Array.from(this.properties.values());
    if (search) {
      if (search.query) {
        const query = search.query.toLowerCase();
        properties2 = properties2.filter(
          (p) => p.title.toLowerCase().includes(query) || p.address.toLowerCase().includes(query) || p.city.toLowerCase().includes(query) || p.neighborhood?.toLowerCase().includes(query)
        );
      }
      if (search.minPrice) {
        properties2 = properties2.filter((p) => parseFloat(p.price) >= search.minPrice);
      }
      if (search.maxPrice) {
        properties2 = properties2.filter((p) => parseFloat(p.price) <= search.maxPrice);
      }
      if (search.beds) {
        properties2 = properties2.filter((p) => p.beds >= search.beds);
      }
      if (search.baths) {
        properties2 = properties2.filter((p) => parseFloat(p.baths) >= search.baths);
      }
      if (search.propertyType) {
        properties2 = properties2.filter((p) => p.propertyType === search.propertyType);
      }
      if (search.city) {
        properties2 = properties2.filter((p) => p.city.toLowerCase() === search.city.toLowerCase());
      }
      if (search.luxury) {
        properties2 = properties2.filter((p) => p.luxury === search.luxury);
      }
      if (search.featured) {
        properties2 = properties2.filter((p) => p.featured === search.featured);
      }
      if (search.architecturalStyle) {
        properties2 = properties2.filter(
          (p) => p.architecturalStyle === search.architecturalStyle || p.secondaryStyle === search.architecturalStyle
        );
      }
      if (search.neighborhood) {
        properties2 = properties2.filter((p) => p.neighborhood?.toLowerCase() === search.neighborhood.toLowerCase());
      }
      if (search.schoolDistrict) {
        properties2 = properties2.filter((p) => p.schoolDistrict?.toLowerCase() === search.schoolDistrict.toLowerCase());
      }
      if (search.style) {
        properties2 = properties2.filter((p) => p.style?.toLowerCase() === search.style.toLowerCase());
      }
    }
    return properties2.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getProperty(id) {
    return this.properties.get(id);
  }
  async getPropertyByMLS(mlsId) {
    return Array.from(this.properties.values()).find((p) => p.mlsId === mlsId);
  }
  async createProperty(property) {
    const id = this.currentId++;
    const newProperty = {
      ...property,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }
  async updateProperty(id, property) {
    const existing = this.properties.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...property,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.properties.set(id, updated);
    return updated;
  }
  async updatePropertyStyle(id, styleData) {
    const existing = this.properties.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      architecturalStyle: styleData.architecturalStyle || existing.architecturalStyle,
      secondaryStyle: styleData.secondaryStyle || existing.secondaryStyle,
      styleConfidence: styleData.styleConfidence?.toString() || existing.styleConfidence,
      styleFeatures: styleData.styleFeatures || existing.styleFeatures,
      styleAnalyzed: styleData.styleAnalyzed ?? existing.styleAnalyzed,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.properties.set(id, updated);
    return updated;
  }
  async getFeaturedProperties() {
    return Array.from(this.properties.values()).filter((p) => p.featured);
  }
  async getLuxuryProperties() {
    return Array.from(this.properties.values()).filter((p) => p.luxury);
  }
  // Community methods
  async getCommunities() {
    return Array.from(this.communities.values());
  }
  async getCommunity(slug) {
    return Array.from(this.communities.values()).find((c) => c.slug === slug);
  }
  async createCommunity(community) {
    const id = this.currentId++;
    const newCommunity = { ...community, id };
    this.communities.set(id, newCommunity);
    return newCommunity;
  }
  // Blog methods
  async getBlogPosts(published) {
    let posts = Array.from(this.blogPosts.values());
    if (published !== void 0) {
      posts = posts.filter((p) => p.published === published);
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getBlogPost(slug) {
    return Array.from(this.blogPosts.values()).find((p) => p.slug === slug);
  }
  async createBlogPost(post) {
    const id = this.currentId++;
    const newPost = {
      ...post,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  // Lead methods
  async createLead(lead) {
    const id = this.currentId++;
    const newLead = {
      ...lead,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.leads.set(id, newLead);
    return newLead;
  }
  async getLeads() {
    return Array.from(this.leads.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  // Tracking methods
  async getTrackingCodes(active) {
    let codes = Array.from(this.trackingCodes.values());
    if (active !== void 0) {
      codes = codes.filter((c) => c.active === active);
    }
    return codes;
  }
  async createTrackingCode(code) {
    const id = this.currentId++;
    const newCode = {
      ...code,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.trackingCodes.set(id, newCode);
    return newCode;
  }
  async updateTrackingCode(id, code) {
    const existing = this.trackingCodes.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...code };
    this.trackingCodes.set(id, updated);
    return updated;
  }
  // Market stats
  async getMarketStats(area) {
    let stats = Array.from(this.marketStats.values());
    if (area) {
      stats = stats.filter((s) => s.area === area);
    }
    return stats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createMarketStats(stats) {
    const id = this.currentId++;
    const newStats = { ...stats, id };
    this.marketStats.set(id, newStats);
    return newStats;
  }
  // IDX Agent methods
  async getIdxAgents() {
    return Array.from(this.idxAgents.values());
  }
  async getIdxAgent(id) {
    return this.idxAgents.get(id);
  }
  async getIdxAgentByMemberKey(memberKey) {
    return Array.from(this.idxAgents.values()).find((a) => a.memberKey === memberKey);
  }
  async createIdxAgent(agent) {
    const id = this.currentId++;
    const newAgent = {
      ...agent,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.idxAgents.set(id, newAgent);
    return newAgent;
  }
  async updateIdxAgent(id, agent) {
    const existing = this.idxAgents.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...agent,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.idxAgents.set(id, updated);
    return updated;
  }
  // IDX Media methods
  async getIdxMediaForProperty(listingKey) {
    return Array.from(this.idxMedia.values()).filter((m) => m.listingKey === listingKey);
  }
  async getIdxMedia(id) {
    return this.idxMedia.get(id);
  }
  async getIdxMediaByKey(mediaKey) {
    return Array.from(this.idxMedia.values()).find((m) => m.mediaKey === mediaKey);
  }
  async createIdxMedia(media) {
    const id = this.currentId++;
    const newMedia = {
      ...media,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.idxMedia.set(id, newMedia);
    return newMedia;
  }
  async updateIdxMedia(id, media) {
    const existing = this.idxMedia.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...media,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.idxMedia.set(id, updated);
    return updated;
  }
  // IDX Sync Log methods
  async getIdxSyncLogs(limit) {
    let logs = Array.from(this.idxSyncLogs.values()).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    if (limit) {
      logs = logs.slice(0, limit);
    }
    return logs;
  }
  async getIdxSyncLog(id) {
    return this.idxSyncLogs.get(id);
  }
  async createIdxSyncLog(log2) {
    const id = this.currentId++;
    const newLog = { ...log2, id };
    this.idxSyncLogs.set(id, newLog);
    return newLog;
  }
  async updateIdxSyncLog(id, log2) {
    const existing = this.idxSyncLogs.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...log2 };
    this.idxSyncLogs.set(id, updated);
    return updated;
  }
};
var storage = new MemStorage();

// server/ai-style-analyzer.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
var SUPPORTED_STYLES = [
  "Modern",
  "Contemporary",
  "Farmhouse",
  "Colonial",
  "Victorian",
  "Craftsman",
  "Ranch",
  "Tudor",
  "Mediterranean",
  "Mid-Century Modern",
  "Traditional",
  "Transitional",
  "Industrial",
  "Cape Cod",
  "Georgian",
  "Prairie",
  "Neoclassical",
  "Art Deco",
  "Minimalist",
  "Luxury Custom"
];
async function analyzePropertyStyle(imageUrl) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert architectural style analyst for luxury real estate. Analyze the architectural style of homes and provide detailed classifications.

Available styles: ${SUPPORTED_STYLES.join(", ")}

Respond with JSON in this exact format:
{
  "primary": "Primary architectural style",
  "secondary": "Secondary style if mixed (optional)",
  "confidence": 0.85,
  "features": ["Notable architectural features", "Design elements", "Style characteristics"]
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this property's architectural style. Focus on exterior design elements, rooflines, materials, windows, and overall aesthetic. Provide the primary style and any secondary influences."
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      primary: result.primary || "Traditional",
      secondary: result.secondary,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      features: Array.isArray(result.features) ? result.features : []
    };
  } catch (error) {
    console.error("AI style analysis failed:", error);
    return {
      primary: "Traditional",
      confidence: 0,
      features: ["Analysis unavailable"]
    };
  }
}
async function batchAnalyzeStyles(properties2) {
  const results = /* @__PURE__ */ new Map();
  const batchSize = 5;
  for (let i = 0; i < properties2.length; i += batchSize) {
    const batch = properties2.slice(i, i + batchSize);
    const promises = batch.map(async (property) => {
      const style = await analyzePropertyStyle(property.imageUrl);
      return { id: property.id, style };
    });
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ id, style }) => {
      results.set(id, style);
    });
    if (i + batchSize < properties2.length) {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
  }
  return results;
}
function getStyleKeywords(style) {
  const styleKeywords = {
    "Modern": ["clean lines", "geometric", "flat roof", "large windows", "minimal ornamentation"],
    "Contemporary": ["current trends", "mixed materials", "open floor plans", "energy efficient"],
    "Farmhouse": ["wraparound porch", "metal roof", "barn-style", "rustic", "country"],
    "Colonial": ["symmetrical", "columns", "shutters", "dormer windows", "brick or wood"],
    "Victorian": ["ornate details", "turrets", "bay windows", "decorative trim", "asymmetrical"],
    "Craftsman": ["low-pitched roof", "exposed rafters", "stone pillars", "natural materials"],
    "Ranch": ["single story", "horizontal orientation", "attached garage", "simple roofline"],
    "Tudor": ["half-timbering", "steep roofs", "stained glass", "arched doorways"],
    "Mediterranean": ["stucco walls", "red tile roof", "arched windows", "courtyards"],
    "Mid-Century Modern": ["flat planes", "post and beam", "floor-to-ceiling windows"],
    "Traditional": ["classic proportions", "conventional materials", "timeless design"],
    "Transitional": ["blend of styles", "neutral colors", "comfortable elegance"],
    "Industrial": ["exposed brick", "metal elements", "warehouse aesthetic", "urban loft"],
    "Cape Cod": ["steep roof", "central chimney", "shingle siding", "dormers"],
    "Georgian": ["formal symmetry", "brick construction", "pediment doorway"],
    "Prairie": ["horizontal lines", "low roofs", "natural integration"],
    "Neoclassical": ["columns", "pediments", "classical proportions"],
    "Art Deco": ["geometric patterns", "streamlined forms", "metallic accents"],
    "Minimalist": ["simple forms", "neutral palette", "functional design"],
    "Luxury Custom": ["high-end materials", "unique design", "premium finishes"]
  };
  return styleKeywords[style] || [];
}

// server/idx-service.ts
var IdxService = class {
  config;
  isConnected = false;
  constructor() {
    this.config = {
      baseUrl: process.env.RESO_API_URL || "",
      accessToken: process.env.RESO_ACCESS_TOKEN,
      clientId: process.env.RESO_CLIENT_ID,
      clientSecret: process.env.RESO_CLIENT_SECRET,
      username: process.env.RESO_USERNAME,
      password: process.env.RESO_PASSWORD
    };
  }
  async makeRequest(endpoint, params) {
    if (!this.config.baseUrl || this.config.baseUrl === "") {
      console.log(`IDX Service: Mock data returned for ${endpoint}`);
      return this.getMockData(endpoint);
    }
    try {
      const url = new URL(endpoint, this.config.baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "BjorkHomes-IDX-Client/1.0"
      };
      if (this.config.accessToken) {
        headers["Authorization"] = `Bearer ${this.config.accessToken}`;
      }
      const response = await fetch(url.toString(), {
        method: "GET",
        headers
      });
      if (!response.ok) {
        throw new Error(`RESO API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("IDX Service Error:", error);
      return this.getMockData(endpoint);
    }
  }
  getMockData(endpoint) {
    console.log(`Returning mock data for endpoint: ${endpoint}`);
    if (endpoint.includes("/Property")) {
      return {
        "@odata.context": "mock",
        "@odata.count": 3,
        value: [
          {
            ListingKey: "GPRMLS-001",
            ListingId: "22520502",
            MlsStatus: "Active",
            StandardStatus: "Active",
            ListPrice: 1195e3,
            OriginalListPrice: 1195e3,
            DaysOnMarket: 45,
            ListingContractDate: "2024-12-01T00:00:00Z",
            ModificationTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
            StreetNumber: "21727",
            StreetName: "Cimarron Road",
            City: "Elkhorn",
            StateOrProvince: "NE",
            PostalCode: "68022",
            BedroomsTotal: 4,
            BathroomsTotalInteger: 5,
            LivingArea: 3694,
            YearBuilt: 2020,
            PropertyType: "Residential",
            PropertySubType: "Single Family Residence",
            ListAgentKey: "AGENT-001",
            ListOfficeName: "Bjork Group - Berkshire Hathaway",
            PhotoCount: 25,
            VirtualTourURLUnbranded: "https://example.com/tour/1",
            PublicRemarks: "Stunning luxury home with modern amenities and beautiful landscaping in prestigious Elkhorn location.",
            Latitude: 41.2871,
            Longitude: -96.2394
          },
          {
            ListingKey: "GPRMLS-002",
            ListingId: "22520385",
            MlsStatus: "Active",
            StandardStatus: "Active",
            ListPrice: 85e4,
            OriginalListPrice: 875e3,
            DaysOnMarket: 23,
            ListingContractDate: "2024-12-15T00:00:00Z",
            ModificationTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
            StreetNumber: "2904",
            StreetName: "Georgian Court",
            City: "Lincoln",
            StateOrProvince: "NE",
            PostalCode: "68502",
            BedroomsTotal: 4,
            BathroomsTotalInteger: 4,
            LivingArea: 3244,
            YearBuilt: 2024,
            PropertyType: "Residential",
            PropertySubType: "Single Family Residence",
            ListAgentKey: "AGENT-002",
            ListOfficeName: "Bjork Group - Berkshire Hathaway",
            PhotoCount: 18,
            PublicRemarks: "Brand new home with contemporary design and energy-efficient features in desirable Lincoln area.",
            Latitude: 40.8136,
            Longitude: -96.7025
          },
          {
            ListingKey: "GPRMLS-003",
            ListingId: "22520377",
            MlsStatus: "Active",
            StandardStatus: "Active",
            ListPrice: 1995e3,
            OriginalListPrice: 1995e3,
            DaysOnMarket: 67,
            ListingContractDate: "2024-11-10T00:00:00Z",
            ModificationTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
            StreetNumber: "13824",
            StreetName: "Cuming Street",
            City: "Omaha",
            StateOrProvince: "NE",
            PostalCode: "68154",
            BedroomsTotal: 5,
            BathroomsTotalInteger: 6,
            LivingArea: 7460,
            YearBuilt: 2018,
            PropertyType: "Residential",
            PropertySubType: "Single Family Residence",
            ListAgentKey: "AGENT-001",
            ListOfficeName: "Bjork Group - Berkshire Hathaway",
            PhotoCount: 45,
            VirtualTourURLUnbranded: "https://example.com/tour/3",
            PublicRemarks: "Exceptional luxury home with premium finishes and extensive amenities in prestigious West Omaha location.",
            Latitude: 41.2619,
            Longitude: -96.1951
          }
        ]
      };
    }
    if (endpoint.includes("/Member")) {
      return {
        "@odata.context": "mock",
        "@odata.count": 2,
        value: [
          {
            MemberKey: "AGENT-001",
            MemberMlsId: "BG001",
            MemberFirstName: "Michael",
            MemberLastName: "Bjork",
            MemberEmail: "michael@bjorkhomes.com",
            MemberPhoneNumber: "(402) 555-0100",
            MemberStateLicense: "NE-RE-001",
            OfficeKey: "OFFICE-001",
            OfficeName: "Bjork Group - Berkshire Hathaway",
            MemberStatus: "Active",
            ModificationTimestamp: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            MemberKey: "AGENT-002",
            MemberMlsId: "BG002",
            MemberFirstName: "Sarah",
            MemberLastName: "Johnson",
            MemberEmail: "sarah@bjorkhomes.com",
            MemberPhoneNumber: "(402) 555-0101",
            MemberStateLicense: "NE-RE-002",
            OfficeKey: "OFFICE-001",
            OfficeName: "Bjork Group - Berkshire Hathaway",
            MemberStatus: "Active",
            ModificationTimestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        ]
      };
    }
    if (endpoint.includes("/Media")) {
      return {
        "@odata.context": "mock",
        "@odata.count": 0,
        value: []
      };
    }
    return {
      "@odata.context": "mock",
      "@odata.count": 0,
      value: []
    };
  }
  async testConnection() {
    try {
      const response = await this.makeRequest("/$metadata");
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error("IDX Connection Test Failed:", error);
      this.isConnected = false;
      return false;
    }
  }
  async searchProperties(params) {
    const oDataParams = {};
    const filters = [];
    if (params.city) {
      filters.push(`City eq '${params.city}'`);
    }
    if (params.state) {
      filters.push(`StateOrProvince eq '${params.state}'`);
    }
    if (params.zipCode) {
      filters.push(`PostalCode eq '${params.zipCode}'`);
    }
    if (params.minPrice) {
      filters.push(`ListPrice ge ${params.minPrice}`);
    }
    if (params.maxPrice) {
      filters.push(`ListPrice le ${params.maxPrice}`);
    }
    if (params.beds) {
      filters.push(`BedroomsTotal ge ${params.beds}`);
    }
    if (params.baths) {
      filters.push(`BathroomsTotalInteger ge ${params.baths}`);
    }
    if (params.propertyType) {
      filters.push(`PropertyType eq '${params.propertyType}'`);
    }
    if (params.status && params.status.length > 0) {
      const statusFilters = params.status.map((s) => `StandardStatus eq '${s}'`).join(" or ");
      filters.push(`(${statusFilters})`);
    } else {
      filters.push(`StandardStatus eq 'Active'`);
    }
    if (filters.length > 0) {
      oDataParams["$filter"] = filters.join(" and ");
    }
    oDataParams["$orderby"] = "ModificationTimestamp desc";
    oDataParams["$top"] = params.limit || 50;
    if (params.offset) {
      oDataParams["$skip"] = params.offset;
    }
    const response = await this.makeRequest("/Property", oDataParams);
    return response.value;
  }
  async getPropertyByListingKey(listingKey) {
    try {
      const oDataParams = {
        "$filter": `ListingKey eq '${listingKey}'`
      };
      const response = await this.makeRequest("/Property", oDataParams);
      return response.value.length > 0 ? response.value[0] : null;
    } catch (error) {
      console.error("Error fetching property by listing key:", error);
      return null;
    }
  }
  async getAgents(limit = 100) {
    const oDataParams = {
      "$filter": `MemberStatus eq 'Active'`,
      "$orderby": "MemberLastName, MemberFirstName",
      "$top": limit
    };
    const response = await this.makeRequest("/Member", oDataParams);
    return response.value;
  }
  async getMediaForProperty(listingKey) {
    const oDataParams = {
      "$filter": `ResourceRecordKey eq '${listingKey}'`,
      "$orderby": "Order"
    };
    const response = await this.makeRequest("/Media", oDataParams);
    return response.value;
  }
  // Convert RESO property to internal property format
  convertResoPropertyToInternal(resoProperty) {
    const address = [resoProperty.StreetNumber, resoProperty.StreetName].filter(Boolean).join(" ");
    return {
      mlsId: resoProperty.ListingId,
      listingKey: resoProperty.ListingKey,
      title: `${resoProperty.BedroomsTotal || 0} Bed, ${resoProperty.BathroomsTotalInteger || 0} Bath Home in ${resoProperty.City}`,
      description: resoProperty.PublicRemarks || "",
      price: resoProperty.ListPrice.toString(),
      address,
      city: resoProperty.City || "",
      state: resoProperty.StateOrProvince || "NE",
      zipCode: resoProperty.PostalCode || "",
      beds: resoProperty.BedroomsTotal || 0,
      baths: (resoProperty.BathroomsTotalInteger || 0).toString(),
      sqft: resoProperty.LivingArea || 0,
      yearBuilt: resoProperty.YearBuilt,
      propertyType: resoProperty.PropertySubType || resoProperty.PropertyType || "Residential",
      status: resoProperty.StandardStatus?.toLowerCase() || "active",
      standardStatus: resoProperty.StandardStatus,
      featured: false,
      // Set based on business logic
      luxury: resoProperty.ListPrice > 75e4,
      // Luxury threshold
      images: [],
      // Will be populated from media sync
      neighborhood: void 0,
      schoolDistrict: void 0,
      style: void 0,
      coordinates: resoProperty.Latitude && resoProperty.Longitude ? { lat: resoProperty.Latitude, lng: resoProperty.Longitude } : null,
      features: [],
      architecturalStyle: void 0,
      secondaryStyle: void 0,
      styleConfidence: void 0,
      styleFeatures: [],
      styleAnalyzed: false,
      listingAgentKey: resoProperty.ListAgentKey,
      listingOfficeName: resoProperty.ListOfficeName,
      listingContractDate: resoProperty.ListingContractDate ? new Date(resoProperty.ListingContractDate) : void 0,
      daysOnMarket: resoProperty.DaysOnMarket,
      originalListPrice: resoProperty.OriginalListPrice?.toString(),
      mlsStatus: resoProperty.MlsStatus,
      modificationTimestamp: new Date(resoProperty.ModificationTimestamp),
      photoCount: resoProperty.PhotoCount,
      virtualTourUrl: resoProperty.VirtualTourURLUnbranded,
      isIdxListing: true,
      idxSyncedAt: /* @__PURE__ */ new Date()
    };
  }
  // Convert RESO agent to internal agent format
  convertResoAgentToInternal(resoAgent) {
    return {
      memberKey: resoAgent.MemberKey,
      memberMlsId: resoAgent.MemberMlsId,
      firstName: resoAgent.MemberFirstName,
      lastName: resoAgent.MemberLastName,
      email: resoAgent.MemberEmail,
      phone: resoAgent.MemberPhoneNumber,
      officeName: resoAgent.OfficeName,
      officeKey: resoAgent.OfficeKey,
      stateLicense: resoAgent.MemberStateLicense,
      isActive: resoAgent.MemberStatus === "Active",
      modificationTimestamp: new Date(resoAgent.ModificationTimestamp)
    };
  }
  // Convert RESO media to internal media format
  convertResoMediaToInternal(resoMedia) {
    return {
      mediaKey: resoMedia.MediaKey,
      listingKey: resoMedia.ResourceRecordKey,
      mlsId: "",
      // Will need to be resolved from listing
      mediaUrl: resoMedia.MediaURL,
      mediaType: resoMedia.MediaType,
      mediaObjectId: resoMedia.MediaObjectID,
      shortDescription: resoMedia.ShortDescription,
      longDescription: resoMedia.LongDescription,
      sequence: resoMedia.Order || 0,
      modificationTimestamp: new Date(resoMedia.ModificationTimestamp)
    };
  }
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      config: {
        baseUrl: this.config.baseUrl,
        hasAccessToken: !!this.config.accessToken,
        hasClientCredentials: !!(this.config.clientId && this.config.clientSecret)
      }
    };
  }
};
var idxService = new IdxService();

// server/idx-sync-service.ts
var IdxSyncService = class {
  constructor(storage2) {
    this.storage = storage2;
  }
  async logSyncStart(syncType) {
    const log2 = await this.storage.createIdxSyncLog({
      syncType,
      status: "in_progress",
      recordsProcessed: 0,
      recordsUpdated: 0,
      recordsCreated: 0,
      startedAt: /* @__PURE__ */ new Date()
    });
    return log2.id;
  }
  async logSyncComplete(logId, status, stats, errorMessage) {
    await this.storage.updateIdxSyncLog(logId, {
      status,
      recordsProcessed: stats.processed,
      recordsUpdated: stats.updated,
      recordsCreated: stats.created,
      errorMessage,
      completedAt: /* @__PURE__ */ new Date()
    });
  }
  async syncProperties(limit = 100) {
    const logId = await this.logSyncStart("properties");
    let processed = 0;
    let created = 0;
    let updated = 0;
    try {
      console.log("Starting IDX property synchronization...");
      const resoProperties = await idxService.searchProperties({
        status: ["Active", "Pending"],
        limit
      });
      console.log(`Found ${resoProperties.length} properties from RESO API`);
      for (const resoProperty of resoProperties) {
        try {
          processed++;
          const existingProperty = await this.storage.getPropertyByMLS(resoProperty.ListingId);
          const propertyData = idxService.convertResoPropertyToInternal(resoProperty);
          if (existingProperty) {
            await this.storage.updateProperty(existingProperty.id, propertyData);
            updated++;
            console.log(`Updated property: ${resoProperty.ListingId}`);
          } else {
            await this.storage.createProperty(propertyData);
            created++;
            console.log(`Created property: ${resoProperty.ListingId}`);
          }
          await this.syncMediaForProperty(resoProperty.ListingKey, resoProperty.ListingId);
        } catch (error) {
          console.error(`Error syncing property ${resoProperty.ListingId}:`, error);
        }
      }
      const stats = { processed, updated, created };
      await this.logSyncComplete(logId, "success", stats);
      console.log(`Property sync completed: ${processed} processed, ${created} created, ${updated} updated`);
      return {
        success: true,
        stats
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      await this.logSyncComplete(logId, "error", { processed, updated, created }, errorMessage);
      console.error("Property sync failed:", error);
      return {
        success: false,
        stats: { processed, updated, created },
        error: errorMessage
      };
    }
  }
  // Agent sync removed per user request - IDX will not pull agent information from MLS
  async syncMediaForProperty(listingKey, mlsId) {
    try {
      const resoMedia = await idxService.getMediaForProperty(listingKey);
      for (const media of resoMedia) {
        try {
          const existingMedia = await this.storage.getIdxMediaByKey(media.MediaKey);
          const mediaData = {
            ...idxService.convertResoMediaToInternal(media),
            mlsId
          };
          if (existingMedia) {
            await this.storage.updateIdxMedia(existingMedia.id, mediaData);
          } else {
            await this.storage.createIdxMedia(mediaData);
          }
        } catch (error) {
          console.error(`Error syncing media ${media.MediaKey}:`, error);
        }
      }
      const property = await this.storage.getPropertyByMLS(mlsId);
      if (property && resoMedia.length > 0) {
        const imageUrls = resoMedia.filter((m) => m.MediaType === "Photo").sort((a, b) => (a.Order || 0) - (b.Order || 0)).map((m) => m.MediaURL);
        if (imageUrls.length > 0) {
          await this.storage.updateProperty(property.id, { images: imageUrls });
        }
      }
    } catch (error) {
      console.error(`Error syncing media for property ${listingKey}:`, error);
    }
  }
  async fullSync() {
    console.log("Starting full IDX synchronization...");
    const results = [];
    try {
      const isConnected = await idxService.testConnection();
      if (!isConnected) {
        console.log("IDX API not connected, using mock data for development");
      }
      const propertyResult = await this.syncProperties(50);
      results.push({ type: "properties", ...propertyResult });
      const allSuccess = results.every((r) => r.success);
      console.log("Full IDX sync completed:", {
        success: allSuccess,
        results: results.map((r) => ({ type: r.type, success: r.success, stats: r.stats }))
      });
      return {
        success: allSuccess,
        results
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Full sync failed:", error);
      return {
        success: false,
        results,
        error: errorMessage
      };
    }
  }
  async getLastSyncStatus() {
    const logs = await this.storage.getIdxSyncLogs(10);
    const summary = {
      lastSync: logs[0] || null,
      recentSyncs: logs,
      connectionStatus: idxService.getConnectionStatus()
    };
    return summary;
  }
  // Schedule automatic syncs (call this from cron job or similar)
  async scheduleSync() {
    console.log("Scheduled IDX sync starting...");
    try {
      await this.fullSync();
    } catch (error) {
      console.error("Scheduled sync failed:", error);
    }
  }
};
var idx_sync_service_default = IdxSyncService;

// server/email-service.ts
import nodemailer from "nodemailer";
var EmailService = class {
  transporter = null;
  config = null;
  constructor() {
    this.initializeTransporter();
  }
  initializeTransporter() {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (emailHost && emailPort && emailUser && emailPass) {
      this.config = {
        host: emailHost,
        port: parseInt(emailPort),
        secure: parseInt(emailPort) === 465,
        auth: {
          user: emailUser,
          pass: emailPass
        }
      };
      this.transporter = nodemailer.createTransport(this.config);
      console.log("Email service initialized with SMTP configuration");
    } else if (process.env.NODE_ENV === "development") {
      this.createTestAccount();
    } else {
      console.log("Email service not configured - email notifications disabled");
    }
  }
  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.config = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      };
      this.transporter = nodemailer.createTransport(this.config);
      console.log("Email service initialized with Ethereal test account");
    } catch (error) {
      console.error("Failed to create test email account:", error);
    }
  }
  isConfigured() {
    return this.transporter !== null;
  }
  async sendLeadNotification(lead, recipientEmail = "leads@bjorkhomes.com") {
    if (!this.transporter) {
      return { success: false, error: "Email service not configured" };
    }
    try {
      const subject = `New Lead: ${lead.firstName} ${lead.lastName} - ${lead.interest || "General Inquiry"}`;
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Lead Notification</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; }
              .lead-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .label { font-weight: bold; color: #2c3e50; }
              .value { margin-left: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Lead Notification</h1>
                <p>BjorkHomes.com</p>
              </div>
              
              <div class="content">
                <h2>Lead Details</h2>
                
                <div class="lead-info">
                  <p><span class="label">Name:</span><span class="value">${lead.firstName} ${lead.lastName}</span></p>
                  <p><span class="label">Email:</span><span class="value">${lead.email}</span></p>
                  ${lead.phone ? `<p><span class="label">Phone:</span><span class="value">${lead.phone}</span></p>` : ""}
                  ${lead.interest ? `<p><span class="label">Interest:</span><span class="value">${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}</span></p>` : ""}
                  ${lead.propertyAddress ? `<p><span class="label">Property:</span><span class="value">${lead.propertyAddress}</span></p>` : ""}
                  <p><span class="label">Date:</span><span class="value">${new Date(lead.createdAt).toLocaleString()}</span></p>
                </div>
                
                ${lead.message ? `
                  <div class="lead-info">
                    <p class="label">Message:</p>
                    <p style="margin-top: 10px; padding: 10px; background: #ecf0f1; border-radius: 3px;">${lead.message}</p>
                  </div>
                ` : ""}
              </div>
            </div>
          </body>
        </html>
      `;
      const text2 = `
New Lead Notification - BjorkHomes.com

Lead Details:
Name: ${lead.firstName} ${lead.lastName}
Email: ${lead.email}
${lead.phone ? `Phone: ${lead.phone}` : ""}
${lead.interest ? `Interest: ${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}` : ""}
${lead.propertyAddress ? `Property: ${lead.propertyAddress}` : ""}
Date: ${new Date(lead.createdAt).toLocaleString()}

${lead.message ? `Message: ${lead.message}` : ""}
      `;
      const mailOptions = {
        from: this.config?.auth.user || "noreply@bjorkhomes.com",
        to: recipientEmail,
        subject,
        html,
        text: text2
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Lead notification sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Failed to send lead notification:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  async sendLeadConfirmation(lead) {
    if (!this.transporter) {
      return { success: false, error: "Email service not configured" };
    }
    try {
      const subject = `Thank you for your interest - BjorkHomes.com`;
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Thank You for Your Interest</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; }
              .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div style="font-size: 24px; font-weight: bold;">BjorkHomes.com</div>
                <p>Luxury Real Estate in Omaha & Lincoln, Nebraska</p>
              </div>
              
              <div class="content">
                <h2>Thank You, ${lead.firstName}!</h2>
                
                <div class="info-box">
                  <p>Thank you for your interest in our luxury real estate services. We have received your inquiry and a member of our team will contact you within 24 hours.</p>
                  
                  <h3>Your Inquiry Details:</h3>
                  <ul>
                    ${lead.interest ? `<li><strong>Interest:</strong> ${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}</li>` : ""}
                    ${lead.propertyAddress ? `<li><strong>Property:</strong> ${lead.propertyAddress}</li>` : ""}
                  </ul>
                </div>
                
                <div class="info-box">
                  <h3>What's Next?</h3>
                  <ul>
                    <li>A qualified agent will review your inquiry</li>
                    <li>We'll contact you via ${lead.phone ? "phone or email" : "email"} within 24 hours</li>
                    <li>We'll provide personalized property recommendations</li>
                    <li>Schedule a consultation that fits your schedule</li>
                  </ul>
                </div>
                
                <div class="info-box">
                  <h3>Contact Information</h3>
                  <p><strong>Email:</strong> info@bjorkhomes.com</p>
                  <p><strong>Phone:</strong> (402) 555-0123</p>
                  <p><strong>Website:</strong> www.bjorkhomes.com</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
      const text2 = `
Thank You for Your Interest - BjorkHomes.com

Dear ${lead.firstName},

Thank you for your interest in our luxury real estate services. We have received your inquiry and a member of our team will contact you within 24 hours.

Your Inquiry Details:
${lead.interest ? `Interest: ${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}` : ""}
${lead.propertyAddress ? `Property: ${lead.propertyAddress}` : ""}

What's Next?
- A qualified agent will review your inquiry
- We'll contact you via ${lead.phone ? "phone or email" : "email"} within 24 hours
- We'll provide personalized property recommendations
- Schedule a consultation that fits your schedule

Contact Information:
Email: info@bjorkhomes.com
Phone: (402) 555-0123
Website: www.bjorkhomes.com

BjorkHomes.com - Your Luxury Real Estate Partner
Serving Omaha, Lincoln, and surrounding areas
      `;
      const mailOptions = {
        from: this.config?.auth.user || "noreply@bjorkhomes.com",
        to: lead.email,
        subject,
        html,
        text: text2
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Lead confirmation sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Failed to send lead confirmation:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
};
var emailService = new EmailService();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  mlsId: text("mls_id").notNull().unique(),
  listingKey: text("listing_key"),
  // RESO Web API ListingKey
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull().default("NE"),
  zipCode: text("zip_code").notNull(),
  beds: integer("beds").notNull(),
  baths: decimal("baths", { precision: 3, scale: 1 }).notNull(),
  sqft: integer("sqft").notNull(),
  yearBuilt: integer("year_built"),
  propertyType: text("property_type").notNull(),
  status: text("status").notNull().default("active"),
  standardStatus: text("standard_status"),
  // RESO StandardStatus
  featured: boolean("featured").default(false),
  luxury: boolean("luxury").default(false),
  images: text("images").array(),
  neighborhood: text("neighborhood"),
  schoolDistrict: text("school_district"),
  style: text("style"),
  // Ranch, 1.5 Story, 2 Story, Multi-level, Split Entry
  coordinates: jsonb("coordinates"),
  // {lat: number, lng: number}
  features: text("features").array(),
  architecturalStyle: text("architectural_style"),
  // Primary style (Modern, Farmhouse, etc.)
  secondaryStyle: text("secondary_style"),
  // Secondary style if mixed
  styleConfidence: decimal("style_confidence", { precision: 3, scale: 2 }),
  // AI confidence score
  styleFeatures: text("style_features").array(),
  // Style-specific features
  styleAnalyzed: boolean("style_analyzed").default(false),
  // Whether AI analysis completed
  // IDX/RESO specific fields
  listingAgentKey: text("listing_agent_key"),
  listingOfficeName: text("listing_office_name"),
  listingContractDate: timestamp("listing_contract_date"),
  daysOnMarket: integer("days_on_market"),
  originalListPrice: decimal("original_list_price", { precision: 12, scale: 2 }),
  mlsStatus: text("mls_status"),
  // MLS-specific status
  modificationTimestamp: timestamp("modification_timestamp"),
  photoCount: integer("photo_count"),
  virtualTourUrl: text("virtual_tour_url"),
  isIdxListing: boolean("is_idx_listing").default(false),
  // Flag for IDX vs manual listings
  idxSyncedAt: timestamp("idx_synced_at"),
  // Last sync timestamp
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  propertyCount: integer("property_count").default(0),
  averagePrice: decimal("average_price", { precision: 12, scale: 2 }),
  highlights: text("highlights").array()
});
var blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  image: text("image"),
  category: text("category").notNull(),
  author: text("author").notNull().default("Michael Bjork"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  propertyAddress: text("property_address"),
  interest: text("interest"),
  // buying, selling, both, investment
  message: text("message"),
  source: text("source").default("website"),
  createdAt: timestamp("created_at").defaultNow()
});
var trackingCodes = pgTable("tracking_codes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  type: text("type").notNull(),
  // pixel, script, meta
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var marketStats = pgTable("market_stats", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  avgPrice: decimal("avg_price", { precision: 12, scale: 2 }),
  medianPrice: decimal("median_price", { precision: 12, scale: 2 }),
  totalListings: integer("total_listings"),
  avgDaysOnMarket: integer("avg_days_on_market"),
  soldProperties: integer("sold_properties"),
  area: text("area").notNull().default("omaha")
});
var idxAgents = pgTable("idx_agents", {
  id: serial("id").primaryKey(),
  memberKey: text("member_key").notNull().unique(),
  // RESO MemberKey
  memberMlsId: text("member_mls_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  officeName: text("office_name"),
  officeKey: text("office_key"),
  stateLicense: text("state_license"),
  isActive: boolean("is_active").default(true),
  modificationTimestamp: timestamp("modification_timestamp"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var idxMedia = pgTable("idx_media", {
  id: serial("id").primaryKey(),
  mediaKey: text("media_key").notNull().unique(),
  // RESO MediaKey
  listingKey: text("listing_key").notNull(),
  // Foreign key to property
  mlsId: text("mls_id").notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull(),
  // Photo, VirtualTour, Video, etc.
  mediaObjectId: text("media_object_id"),
  shortDescription: text("short_description"),
  longDescription: text("long_description"),
  sequence: integer("sequence").default(0),
  // Order of media
  modificationTimestamp: timestamp("modification_timestamp"),
  createdAt: timestamp("created_at").defaultNow()
});
var idxSyncLog = pgTable("idx_sync_log", {
  id: serial("id").primaryKey(),
  syncType: text("sync_type").notNull(),
  // properties, agents, media
  status: text("status").notNull(),
  // success, error, in_progress
  recordsProcessed: integer("records_processed").default(0),
  recordsUpdated: integer("records_updated").default(0),
  recordsCreated: integer("records_created").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCommunitySchema = createInsertSchema(communities).omit({
  id: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true
});
var insertTrackingCodeSchema = createInsertSchema(trackingCodes).omit({
  id: true,
  createdAt: true
});
var insertMarketStatsSchema = createInsertSchema(marketStats).omit({
  id: true
});
var insertIdxAgentSchema = createInsertSchema(idxAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertIdxMediaSchema = createInsertSchema(idxMedia).omit({
  id: true,
  createdAt: true
});
var insertIdxSyncLogSchema = createInsertSchema(idxSyncLog).omit({
  id: true
});
var contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  propertyAddress: z.string().optional(),
  interest: z.enum(["buying", "selling", "both", "investment"]).optional(),
  message: z.string().min(10, "Please provide more details about your goals")
});
var propertySearchSchema = z.object({
  query: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  propertyType: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  schoolDistrict: z.string().optional(),
  style: z.string().optional(),
  luxury: z.boolean().optional(),
  featured: z.boolean().optional(),
  architecturalStyle: z.string().optional()
});

// server/routes.ts
async function registerRoutes(app2) {
  const idxSyncService = new idx_sync_service_default(storage);
  app2.get("/api/properties", async (req, res) => {
    try {
      const searchParams = propertySearchSchema.parse(req.query);
      const properties2 = await storage.getProperties(searchParams);
      res.json(properties2);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters", error });
    }
  });
  app2.get("/api/properties/featured", async (req, res) => {
    try {
      const properties2 = await storage.getFeaturedProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties", error });
    }
  });
  app2.get("/api/properties/luxury", async (req, res) => {
    try {
      const properties2 = await storage.getLuxuryProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch luxury properties", error });
    }
  });
  app2.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property", error });
    }
  });
  app2.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });
  app2.post("/api/properties/:id/analyze-style", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      if (!property.images || property.images.length === 0) {
        return res.status(400).json({ message: "Property has no images to analyze" });
      }
      const primaryImage = property.images[0];
      const styleAnalysis = await analyzePropertyStyle(primaryImage);
      await storage.updatePropertyStyle(id, {
        architecturalStyle: styleAnalysis.primary,
        secondaryStyle: styleAnalysis.secondary,
        styleConfidence: styleAnalysis.confidence,
        styleFeatures: styleAnalysis.features,
        styleAnalyzed: true
      });
      res.json(styleAnalysis);
    } catch (error) {
      res.status(500).json({ message: "Style analysis failed", error });
    }
  });
  app2.get("/api/architectural-styles", async (req, res) => {
    try {
      res.json({
        styles: SUPPORTED_STYLES,
        keywords: SUPPORTED_STYLES.reduce((acc, style) => {
          acc[style] = getStyleKeywords(style);
          return acc;
        }, {})
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch styles", error });
    }
  });
  app2.post("/api/properties/batch-analyze-styles", async (req, res) => {
    try {
      const properties2 = await storage.getProperties({});
      const imagesToAnalyze = properties2.filter((p) => !p.styleAnalyzed && p.images && p.images.length > 0).map((p) => ({ id: p.id.toString(), imageUrl: p.images[0] }));
      if (imagesToAnalyze.length === 0) {
        return res.json({ message: "No properties need style analysis", analyzed: 0 });
      }
      const styleResults = await batchAnalyzeStyles(imagesToAnalyze);
      let updated = 0;
      for (const [propertyId, style] of Array.from(styleResults.entries())) {
        await storage.updatePropertyStyle(parseInt(propertyId), {
          architecturalStyle: style.primary,
          secondaryStyle: style.secondary,
          styleConfidence: style.confidence,
          styleFeatures: style.features,
          styleAnalyzed: true
        });
        updated++;
      }
      res.json({ message: `Analyzed ${updated} properties`, analyzed: updated });
    } catch (error) {
      res.status(500).json({ message: "Batch analysis failed", error });
    }
  });
  app2.get("/api/communities", async (req, res) => {
    try {
      const communities2 = await storage.getCommunities();
      res.json(communities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communities", error });
    }
  });
  app2.get("/api/communities/:slug", async (req, res) => {
    try {
      const community = await storage.getCommunity(req.params.slug);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      res.json(community);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community", error });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === "true";
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts", error });
    }
  });
  app2.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post", error });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactFormSchema.parse(req.body);
      const lead = await storage.createLead({
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        propertyAddress: contactData.propertyAddress,
        interest: contactData.interest,
        message: contactData.message,
        source: "website"
      });
      if (emailService.isConfigured()) {
        try {
          await emailService.sendLeadNotification(lead);
          await emailService.sendLeadConfirmation(lead);
          console.log(`Email notifications sent for lead ${lead.id}`);
        } catch (emailError) {
          console.error("Failed to send email notifications:", emailError);
        }
      }
      res.status(201).json({ message: "Contact form submitted successfully", leadId: lead.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data", error });
    }
  });
  app2.get("/api/leads", async (req, res) => {
    try {
      const leads2 = await storage.getLeads();
      res.json(leads2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads", error });
    }
  });
  app2.get("/api/tracking-codes", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const codes = await storage.getTrackingCodes(active);
      res.json(codes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking codes", error });
    }
  });
  app2.post("/api/tracking-codes", async (req, res) => {
    try {
      const codeData = insertTrackingCodeSchema.parse(req.body);
      const code = await storage.createTrackingCode(codeData);
      res.status(201).json(code);
    } catch (error) {
      res.status(400).json({ message: "Invalid tracking code data", error });
    }
  });
  app2.put("/api/tracking-codes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTrackingCodeSchema.partial().parse(req.body);
      const code = await storage.updateTrackingCode(id, updateData);
      if (!code) {
        return res.status(404).json({ message: "Tracking code not found" });
      }
      res.json(code);
    } catch (error) {
      res.status(400).json({ message: "Invalid tracking code data", error });
    }
  });
  app2.get("/api/market-stats", async (req, res) => {
    try {
      const area = req.query.area;
      const stats = await storage.getMarketStats(area);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market stats", error });
    }
  });
  app2.get("/api/idx/status", async (req, res) => {
    try {
      const status = await idxSyncService.getLastSyncStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get IDX status", error });
    }
  });
  app2.post("/api/idx/sync", async (req, res) => {
    try {
      const { type } = req.body;
      let result;
      if (type === "properties") {
        result = await idxSyncService.syncProperties();
      } else if (type === "full") {
        result = await idxSyncService.fullSync();
      } else {
        return res.status(400).json({ message: "Invalid sync type. Use 'properties' or 'full'" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "IDX sync failed", error });
    }
  });
  app2.get("/api/idx/sync-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const logs = await storage.getIdxSyncLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sync logs", error });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
