import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePropertyStyle, batchAnalyzeStyles, getStyleKeywords, SUPPORTED_STYLES } from "./ai-style-analyzer";
import IdxSyncService from "./idx-sync-service";
import { emailService } from "./email-service";
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
  // Initialize IDX sync service
  const idxSyncService = new IdxSyncService(storage);
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

  // External API proxy endpoint for featured luxury listings
  app.get("/api/properties/external/featured", async (req, res) => {
    try {
      const response = await fetch("http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?city=Omaha&min_price=200000&max_price=400000");
      if (!response.ok) {
        throw new Error(`External API returned ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch external properties:", error);
      res.status(500).json({ message: "Failed to fetch external properties", error: error.message });
    }
  });

  // AI Style Analysis endpoints
  app.post("/api/properties/:id/analyze-style", async (req, res) => {
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
      
      // Update property with style data
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

  app.get("/api/architectural-styles", async (req, res) => {
    try {
      res.json({ 
        styles: SUPPORTED_STYLES,
        keywords: SUPPORTED_STYLES.reduce((acc, style) => {
          acc[style] = getStyleKeywords(style);
          return acc;
        }, {} as Record<string, string[]>)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch styles", error });
    }
  });

  app.post("/api/properties/batch-analyze-styles", async (req, res) => {
    try {
      const properties = await storage.getProperties({});
      const imagesToAnalyze = properties
        .filter(p => !p.styleAnalyzed && p.images && p.images.length > 0)
        .map(p => ({ id: p.id.toString(), imageUrl: p.images![0] }));

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

      // Send email notifications
      if (emailService.isConfigured()) {
        try {
          // Send notification to admin
          await emailService.sendLeadNotification(lead);
          
          // Send confirmation to lead
          await emailService.sendLeadConfirmation(lead);
          
          console.log(`Email notifications sent for lead ${lead.id}`);
        } catch (emailError) {
          console.error('Failed to send email notifications:', emailError);
          // Don't fail the request if email fails
        }
      }

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

  // IDX Integration endpoints
  app.get("/api/idx/status", async (req, res) => {
    try {
      const status = await idxSyncService.getLastSyncStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get IDX status", error });
    }
  });

  app.post("/api/idx/sync", async (req, res) => {
    try {
      const { type } = req.body;
      let result;

      if (type === 'properties') {
        result = await idxSyncService.syncProperties();
      } else if (type === 'full') {
        result = await idxSyncService.fullSync();
      } else {
        return res.status(400).json({ message: "Invalid sync type. Use 'properties' or 'full'" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "IDX sync failed", error });
    }
  });

  // IDX agents endpoint removed per user request

  app.get("/api/idx/sync-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const logs = await storage.getIdxSyncLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sync logs", error });
    }
  });

  // **TEMPLATE ROUTES** - Multi-tenant customization
  app.get("/api/template", async (req, res) => {
    try {
      const template = await storage.getTemplate();
      res.json(template || {
        companyName: "Your Real Estate Company",
        agentName: "Your Name",
        agentTitle: "Principal Broker",
        companyDescription: "We believe that luxury is not a price point but an experience.",
        homesSold: 500,
        totalSalesVolume: "$200M+",
        serviceAreas: ["Your Primary City", "Your Secondary City"]
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/template", async (req, res) => {
    try {
      const template = await storage.updateTemplate(req.body);
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
