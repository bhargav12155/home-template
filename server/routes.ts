import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertCommunitySchema, 
  insertBlogPostSchema, 
  insertLeadSchema, 
  contactFormSchema,
  propertySearchSchema,
  insertTrackingCodeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      const searchParams = propertySearchSchema.parse(req.query);
      const properties = await storage.getProperties(searchParams);
      res.json(properties);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters", error });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties", error });
    }
  });

  app.get("/api/properties/luxury", async (req, res) => {
    try {
      const properties = await storage.getLuxuryProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch luxury properties", error });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
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

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  // Communities endpoints
  app.get("/api/communities", async (req, res) => {
    try {
      const communities = await storage.getCommunities();
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communities", error });
    }
  });

  app.get("/api/communities/:slug", async (req, res) => {
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

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === "true";
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts", error });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
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

  // Contact/Lead endpoints
  app.post("/api/contact", async (req, res) => {
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
      res.status(201).json({ message: "Contact form submitted successfully", leadId: lead.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data", error });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads", error });
    }
  });

  // Tracking codes endpoints (admin)
  app.get("/api/tracking-codes", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const codes = await storage.getTrackingCodes(active);
      res.json(codes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking codes", error });
    }
  });

  app.post("/api/tracking-codes", async (req, res) => {
    try {
      const codeData = insertTrackingCodeSchema.parse(req.body);
      const code = await storage.createTrackingCode(codeData);
      res.status(201).json(code);
    } catch (error) {
      res.status(400).json({ message: "Invalid tracking code data", error });
    }
  });

  app.put("/api/tracking-codes/:id", async (req, res) => {
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

  // Market stats endpoint
  app.get("/api/market-stats", async (req, res) => {
    try {
      const area = req.query.area as string;
      const stats = await storage.getMarketStats(area);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market stats", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
