var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/s3-config.ts
import { S3Client } from "@aws-sdk/client-s3";
function getS3Url(key) {
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
}
function generateFileKey(folder, userId, fileName) {
  const timestamp2 = Date.now();
  const extension = fileName.split(".").pop();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${S3_CONFIG.folders[folder]}user-${userId}/${timestamp2}-${sanitizedFileName}`;
}
var S3_CONFIG, s3Client;
var init_s3_config = __esm({
  "server/s3-config.ts"() {
    "use strict";
    S3_CONFIG = {
      // AWS Configuration
      region: process.env.AWS_REGION || "us-east-2",
      bucket: process.env.S3_BUCKET_NAME || "home-template-images",
      // Cost Optimization Settings
      storageClass: "STANDARD_IA",
      // Cheaper for infrequently accessed files
      // Image Upload Settings
      maxFileSize: 50 * 1024 * 1024,
      // 50MB max per image
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      // File Organization
      folders: {
        templates: "templates/",
        // User template images
        properties: "properties/",
        // Property listing images
        agents: "agents/",
        // Agent profile images
        logos: "logos/",
        // Company logos
        heroes: "heroes/"
        // Hero/banner images
      }
    };
    s3Client = new S3Client({
      region: S3_CONFIG.region
      // No explicit credentials needed - AWS CloudShell/EB provides them automatically
    });
    console.log(
      `S3: Configured for bucket '${S3_CONFIG.bucket}' in region '${S3_CONFIG.region}'`
    );
  }
});

// server/s3-service.ts
var s3_service_exports = {};
__export(s3_service_exports, {
  deleteFromS3: () => deleteFromS3,
  getPresignedUploadUrl: () => getPresignedUploadUrl,
  getPresignedUrl: () => getPresignedUrl,
  listUserFiles: () => listUserFiles,
  uploadToS3: () => uploadToS3
});
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
async function uploadToS3(options) {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }
  const { folder, userId, fileName, contentType, buffer } = options;
  if (!S3_CONFIG.allowedTypes.includes(contentType)) {
    throw new Error(
      `File type ${contentType} is not allowed. Allowed types: ${S3_CONFIG.allowedTypes.join(
        ", "
      )}`
    );
  }
  if (buffer.length > S3_CONFIG.maxFileSize) {
    throw new Error(
      `File size ${buffer.length} exceeds maximum allowed size of ${S3_CONFIG.maxFileSize} bytes`
    );
  }
  const key = generateFileKey(folder, userId, fileName);
  try {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      StorageClass: S3_CONFIG.storageClass,
      Metadata: {
        userId: userId.toString(),
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        originalFileName: fileName
      }
    });
    await s3Client.send(command);
    return {
      key,
      url: getS3Url(key),
      bucket: S3_CONFIG.bucket
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error(
      `Failed to upload file to S3: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
async function deleteFromS3(key) {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error(
      `Failed to delete file from S3: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
async function getPresignedUrl(key, expiresIn = 3600) {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }
  try {
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key
    });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Presigned URL error:", error);
    throw new Error(
      `Failed to generate presigned URL: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
async function getPresignedUploadUrl(folder, userId, fileName, contentType) {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }
  if (!S3_CONFIG.allowedTypes.includes(contentType)) {
    throw new Error(`File type ${contentType} is not allowed`);
  }
  const key = generateFileKey(folder, userId, fileName);
  try {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      ContentType: contentType,
      StorageClass: S3_CONFIG.storageClass
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return {
      uploadUrl,
      key,
      finalUrl: getS3Url(key)
    };
  } catch (error) {
    console.error("Presigned upload URL error:", error);
    throw new Error(
      `Failed to generate presigned upload URL: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
async function listUserFiles(folder, userId) {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }
  try {
    const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
    const prefix = `${S3_CONFIG.folders[folder]}user-${userId}/`;
    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.bucket,
      Prefix: prefix
    });
    const response = await s3Client.send(command);
    return response.Contents?.map((obj) => obj.Key).filter(Boolean) || [];
  } catch (error) {
    console.error("List files error:", error);
    throw new Error(
      `Failed to list files: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
var init_s3_service = __esm({
  "server/s3-service.ts"() {
    "use strict";
    init_s3_config();
  }
});

// server/index.ts
import "dotenv/config";
import express from "express";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import cookieParser from "cookie-parser";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  communities: () => communities,
  contactFormSchema: () => contactFormSchema,
  idxAgents: () => idxAgents,
  idxMedia: () => idxMedia,
  idxSyncLog: () => idxSyncLog,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertCommunitySchema: () => insertCommunitySchema,
  insertIdxAgentSchema: () => insertIdxAgentSchema,
  insertIdxMediaSchema: () => insertIdxMediaSchema,
  insertIdxSyncLogSchema: () => insertIdxSyncLogSchema,
  insertLeadSchema: () => insertLeadSchema,
  insertMarketStatsSchema: () => insertMarketStatsSchema,
  insertPropertySchema: () => insertPropertySchema,
  insertTemplateMediaSchema: () => insertTemplateMediaSchema,
  insertTemplateSchema: () => insertTemplateSchema,
  insertTrackingCodeSchema: () => insertTrackingCodeSchema,
  insertUserSchema: () => insertUserSchema,
  leads: () => leads,
  marketStats: () => marketStats,
  properties: () => properties,
  propertySearchSchema: () => propertySearchSchema,
  templateMedia: () => templateMedia,
  templateMediaRelations: () => templateMediaRelations,
  templateRelations: () => templateRelations,
  templateSchema: () => templateSchema,
  templates: () => templates,
  trackingCodes: () => trackingCodes,
  users: () => users
});
import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations, sql } from "drizzle-orm";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  customSlug: text("custom_slug").unique(),
  // NEW: Custom URL slug
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`)
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
  originalListPrice: decimal("original_list_price", {
    precision: 12,
    scale: 2
  }),
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
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  beds: z.coerce.number().optional(),
  baths: z.coerce.number().optional(),
  propertyType: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  schoolDistrict: z.string().optional(),
  style: z.string().optional(),
  luxury: z.union([z.boolean(), z.string().transform((s) => s === "true")]).optional(),
  featured: z.union([z.boolean(), z.string().transform((s) => s === "true")]).optional(),
  architecturalStyle: z.string().optional(),
  // Extended for Paragon external queries
  status: z.enum(["Active", "Closed", "Both"]).optional(),
  days: z.coerce.number().optional(),
  // recent closed window in days
  limit: z.coerce.number().optional()
  // max records to fetch
});
var templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // User ownership
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade"
  }).notNull(),
  // Company Information
  companyName: text("company_name").notNull().default("Your Real Estate Company"),
  agentName: text("agent_name").notNull().default("Your Name"),
  agentTitle: text("agent_title").default("Principal Broker"),
  agentEmail: text("agent_email"),
  // Contact Information
  phone: text("phone"),
  address: jsonb("address").default({
    street: "123 Main Street",
    city: "Your City",
    state: "Your State",
    zip: "12345"
  }),
  // Hero Section Content
  heroTitle: text("hero_title").default("Ready to Find Your Dream Home?"),
  heroSubtitle: text("hero_subtitle").default(
    "Let's start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional."
  ),
  // Contact Information for Hero/Contact sections
  contactPhone: text("contact_phone").default("(402) 522-6131"),
  contactPhoneText: text("contact_phone_text").default("Call or text anytime"),
  officeAddress: text("office_address").default("331 Village Pointe Plaza"),
  officeCity: text("office_city").default("Omaha"),
  officeState: text("office_state").default("NE"),
  officeZip: text("office_zip").default("68130"),
  // Company Description & Bio
  companyDescription: text("company_description").default(
    "We believe that luxury is not a price point but an experience."
  ),
  agentBio: text("agent_bio").default(
    "Professional real estate agent with years of experience."
  ),
  // Statistics
  homesSold: integer("homes_sold").default(500),
  totalSalesVolume: text("total_sales_volume").default("$200M+"),
  yearsExperience: integer("years_experience").default(15),
  clientSatisfaction: text("client_satisfaction").default("98%"),
  // Service Areas
  serviceAreas: text("service_areas").array().default(["Your Primary City", "Your Secondary City"]),
  // Brand Colors (HSL format)
  primaryColor: text("primary_color").default("hsl(20, 14.3%, 4.1%)"),
  // bjork-black
  accentColor: text("accent_color").default("hsl(213, 100%, 45%)"),
  // bjork-blue
  beigeColor: text("beige_color").default("hsl(25, 35%, 75%)"),
  // bjork-beige
  // Media URLs (stored as file paths)
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  agentImageUrl: text("agent_image_url"),
  heroVideoUrl: text("hero_video_url"),
  // MLS Integration
  mlsId: text("mls_id"),
  mlsApiKey: text("mls_api_key"),
  mlsRegion: text("mls_region"),
  // Domain/Subdomain
  subdomain: text("subdomain").unique(),
  customDomain: text("custom_domain"),
  // Status
  isActive: boolean("is_active").default(true),
  // Metadata
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`)
});
var templateMedia = pgTable("template_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").references(() => templates.id, {
    onDelete: "cascade"
  }),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  // image, video, document
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  category: text("category"),
  // logo, hero, agent, property, testimonial
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var templateRelations = relations(templates, ({ many }) => ({
  media: many(templateMedia)
}));
var templateMediaRelations = relations(templateMedia, ({ one }) => ({
  template: one(templates, {
    fields: [templateMedia.templateId],
    references: [templates.id]
  })
}));
var insertTemplateSchema = createInsertSchema(templates);
var templateSchema = createInsertSchema(templates);
var insertTemplateMediaSchema = createInsertSchema(templateMedia);

// server/db.ts
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import ws from "ws";
import path from "path";
import { fileURLToPath } from "url";
var { Pool: PgPool } = pg;
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
neonConfig.webSocketConstructor = ws;
var DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URL || null;
var pool = null;
var db = null;
if (DATABASE_URL) {
  try {
    if (/neon\./i.test(DATABASE_URL) || /neon.tech/i.test(DATABASE_URL)) {
      pool = new NeonPool({ connectionString: DATABASE_URL });
      db = neonDrizzle({ client: pool, schema: schema_exports });
      console.log("DB: connected using Neon serverless driver");
    } else {
      const isRDS = DATABASE_URL.includes("rds.amazonaws.com");
      const poolConfig = {
        connectionString: DATABASE_URL,
        max: 10
      };
      if (isRDS) {
        poolConfig.ssl = {
          rejectUnauthorized: false,
          checkServerIdentity: () => void 0
        };
        console.log("DB: Using AWS RDS with SSL bypass for development");
      }
      pool = new PgPool(poolConfig);
      db = pgDrizzle(pool, { schema: schema_exports });
      console.log("DB: connected using pg (RDS/Postgres) driver with SSL");
    }
  } catch (err) {
    console.error(
      `DB: initialization failure: ${err.message}. Continuing without DB.`
    );
  }
} else {
  if (true) {
    console.error(
      "DB: FATAL - DATABASE_URL not set in production. The app will run without persistent storage."
    );
  } else {
    console.log(
      "Development mode: DATABASE_URL not set, falling back to in-memory storage (MemStorage)."
    );
  }
}

// server/storage.ts
import { eq } from "drizzle-orm";

// server/external-api.ts
var ExternalPropertyAPI = class {
  baseUrl = "http://gbcma.us-east-2.elasticbeanstalk.com/api";
  async getPropertiesForCity(city, options = {}) {
    try {
      const params = new URLSearchParams({
        city,
        ...options.minPrice && { min_price: options.minPrice.toString() },
        ...options.maxPrice && { max_price: options.maxPrice.toString() }
      });
      const response = await fetch(`${this.baseUrl}/cma-comparables?${params}`, {
        headers: {
          "Accept": "*/*",
          "User-Agent": "BjorkHomes/1.0"
        }
      });
      if (!response.ok) {
        console.error(`CMA API error: ${response.status} ${response.statusText}`);
        return [];
      }
      const data = await response.json();
      const properties2 = Array.isArray(data) ? data : data.properties || [];
      const sortedProperties = properties2.filter((p) => p.price && p.price > 0).sort((a, b) => (b.price || 0) - (a.price || 0));
      return options.limit ? sortedProperties.slice(0, options.limit) : sortedProperties;
    } catch (error) {
      console.error("Error fetching properties from CMA API:", error);
      return [];
    }
  }
  async getLuxuryProperties() {
    try {
      const [omahaProperties, lincolnProperties] = await Promise.all([
        this.getPropertiesForCity("Omaha", { minPrice: 5e5, maxPrice: 2e6, limit: 10 }),
        this.getPropertiesForCity("Lincoln", { minPrice: 4e5, maxPrice: 15e5, limit: 10 })
      ]);
      const allProperties = [...omahaProperties, ...lincolnProperties].sort((a, b) => (b.price || 0) - (a.price || 0));
      return allProperties.slice(0, 6);
    } catch (error) {
      console.error("Error fetching luxury properties:", error);
      return [];
    }
  }
  // Transform CMA API data to our property schema
  transformToProperty(cmaProperty) {
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
      sqft: cmaProperty.sqft || 2e3,
      yearBuilt: cmaProperty.year_built || 2020,
      propertyType: cmaProperty.property_type || "Single Family",
      status: "active",
      featured: true,
      luxury: (cmaProperty.price || 0) > 4e5,
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  generatePropertyTitle(property) {
    const price = property.price ? `$${(property.price / 1e3).toFixed(0)}K` : "";
    const city = property.city || "Nebraska";
    const beds = property.beds || 3;
    const baths = property.baths || 2;
    return `${beds}BR/${baths}BA Luxury Home in ${city} ${price}`.trim();
  }
  generateDescription(property) {
    const city = property.city || "Nebraska";
    const sqft = property.sqft ? `${property.sqft.toLocaleString()} sq ft` : "spacious";
    const year = property.year_built ? `built in ${property.year_built}` : "modern construction";
    return `Beautiful luxury home in ${city} featuring ${sqft} of ${year} living space with premium finishes and modern amenities.`;
  }
  generatePropertyImages(property) {
    if (property.photos && property.photos.length > 0) {
      return property.photos;
    }
    return [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ];
  }
  extractNeighborhood(property) {
    if (property.address) {
      const parts = property.address.split(",");
      if (parts.length > 1) {
        return parts[parts.length - 2].trim();
      }
    }
    return property.city ? `${property.city} Area` : "Downtown";
  }
  getSchoolDistrict(city) {
    const districts = {
      "Omaha": "Omaha Public Schools",
      "Lincoln": "Lincoln Public Schools",
      "Elkhorn": "Elkhorn Public Schools",
      "Bellevue": "Bellevue Public Schools",
      "Papillion": "Papillion La Vista Schools"
    };
    return districts[city || ""] || "Local School District";
  }
  getPropertyStyle(property) {
    if (property.year_built && property.year_built > 2010) return "2 Story";
    if (property.sqft && property.sqft > 3e3) return "2 Story";
    return "Ranch";
  }
  getDefaultCoordinates(city) {
    const coordinates = {
      "Omaha": { lat: 41.2565, lng: -95.9345 },
      "Lincoln": { lat: 40.8136, lng: -96.7026 },
      "Elkhorn": { lat: 41.2871, lng: -96.2394 },
      "Bellevue": { lat: 41.137, lng: -95.9145 },
      "Papillion": { lat: 41.1544, lng: -96.0422 }
    };
    return coordinates[city || ""] || coordinates["Omaha"];
  }
  generateFeatures(property) {
    const features = ["Luxury Finishes"];
    if (property.sqft && property.sqft > 2500) {
      features.push("Spacious Layout");
    }
    if (property.year_built && property.year_built > 2015) {
      features.push("Modern Amenities");
    }
    if ((property.price || 0) > 6e5) {
      features.push("Premium Location", "High-End Features");
    }
    return features;
  }
  determineArchitecturalStyle(property) {
    if (property.year_built && property.year_built > 2015) return "Modern";
    if (property.year_built && property.year_built > 2e3) return "Contemporary";
    return "Traditional";
  }
  getStyleFeatures(property) {
    const year = property.year_built || 2020;
    if (year > 2015) {
      return ["Open concept", "Large windows", "Clean lines", "Modern finishes"];
    }
    return ["Classic design", "Quality craftsmanship", "Timeless appeal"];
  }
};
var externalPropertyAPI = new ExternalPropertyAPI();

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
        styleFeatures: [
          "Clean lines",
          "Large windows",
          "Open concept",
          "Minimalist design"
        ],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
        ],
        neighborhood: "Cimarron Ridge",
        schoolDistrict: "Elkhorn Public Schools",
        style: "2 Story",
        coordinates: { lat: 41.2871, lng: -96.2394 },
        features: [
          "Gourmet Kitchen",
          "Master Suite",
          "3-Car Garage",
          "Covered Patio"
        ]
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
        styleFeatures: [
          "Smart home integration",
          "Energy-efficient design",
          "Open layouts",
          "Contemporary finishes"
        ],
        styleAnalyzed: true,
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
        ],
        neighborhood: "Georgian Heights",
        schoolDistrict: "Lincoln Public Schools",
        style: "1.5 Story",
        coordinates: { lat: 40.8136, lng: -96.7025 },
        features: [
          "Smart Home Technology",
          "Open Floor Plan",
          "Luxury Finishes"
        ]
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
        styleFeatures: [
          "Symmetrical facade",
          "Classical proportions",
          "Premium finishes",
          "Formal layouts"
        ],
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
      this.properties.set(id, {
        ...property,
        id,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
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
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
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
        properties2 = properties2.filter(
          (p) => parseFloat(p.price) >= search.minPrice
        );
      }
      if (search.maxPrice) {
        properties2 = properties2.filter(
          (p) => parseFloat(p.price) <= search.maxPrice
        );
      }
      if (search.beds) {
        properties2 = properties2.filter((p) => p.beds >= search.beds);
      }
      if (search.baths) {
        properties2 = properties2.filter(
          (p) => parseFloat(p.baths) >= search.baths
        );
      }
      if (search.propertyType) {
        properties2 = properties2.filter(
          (p) => p.propertyType === search.propertyType
        );
      }
      if (search.city) {
        properties2 = properties2.filter(
          (p) => p.city.toLowerCase() === search.city.toLowerCase()
        );
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
        properties2 = properties2.filter(
          (p) => p.neighborhood?.toLowerCase() === search.neighborhood.toLowerCase()
        );
      }
      if (search.schoolDistrict) {
        properties2 = properties2.filter(
          (p) => p.schoolDistrict?.toLowerCase() === search.schoolDistrict.toLowerCase()
        );
      }
      if (search.style) {
        properties2 = properties2.filter(
          (p) => p.style?.toLowerCase() === search.style.toLowerCase()
        );
      }
    }
    return properties2.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
    try {
      const externalProperties = await externalPropertyAPI.getLuxuryProperties();
      if (externalProperties.length > 0) {
        return externalProperties.map(
          (prop) => externalPropertyAPI.transformToProperty(prop)
        );
      }
      return Array.from(this.properties.values()).filter((p) => p.featured);
    } catch (error) {
      console.error(
        "Error fetching featured properties from external API:",
        error
      );
      return Array.from(this.properties.values()).filter((p) => p.featured);
    }
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
    return posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
    return stats.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
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
    return Array.from(this.idxAgents.values()).find(
      (a) => a.memberKey === memberKey
    );
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
    return Array.from(this.idxMedia.values()).filter(
      (m) => m.listingKey === listingKey
    );
  }
  async getIdxMedia(id) {
    return this.idxMedia.get(id);
  }
  async getIdxMediaByKey(mediaKey) {
    return Array.from(this.idxMedia.values()).find(
      (m) => m.mediaKey === mediaKey
    );
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
    let logs = Array.from(this.idxSyncLogs.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    if (limit) {
      logs = logs.slice(0, limit);
    }
    return logs;
  }
  async getIdxSyncLog(id) {
    return this.idxSyncLogs.get(id);
  }
  async createIdxSyncLog(log) {
    const id = this.currentId++;
    const newLog = { ...log, id };
    this.idxSyncLogs.set(id, newLog);
    return newLog;
  }
  async updateIdxSyncLog(id, log) {
    const existing = this.idxSyncLogs.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...log };
    this.idxSyncLogs.set(id, updated);
    return updated;
  }
  // Template methods
  async getTemplate() {
    return {
      id: "default-template",
      companyName: "Bjork Group",
      companyDescription: "Discover exceptional homes with Nebraska's premier luxury real estate team",
      heroTitle: "Luxury is an Experience",
      primaryColor: "#D4B895",
      secondaryColor: "#1A1A1A"
    };
  }
  async updateTemplate(template) {
    return template;
  }
  // User-specific template methods for MemStorage
  async getTemplateByUser(userId) {
    const userKey = `template_user_${userId}`;
    if (this.templates.has(userKey)) {
      return this.templates.get(userKey);
    }
    const defaultTemplate = this.getTemplate();
    this.templates.set(userKey, defaultTemplate);
    return defaultTemplate;
  }
  async updateTemplateByUser(userId, template) {
    const userKey = `template_user_${userId}`;
    this.templates.set(userKey, template);
    return template;
  }
  async createTemplateForUser(userId, template) {
    const userKey = `template_user_${userId}`;
    const templateWithUserId = { ...template, userId };
    this.templates.set(userKey, templateWithUserId);
    return templateWithUserId;
  }
};
var DatabaseStorage = class {
  constructor() {
    if (!db && false) {
      console.warn(
        "DatabaseStorage: No database connection available in development mode"
      );
    }
  }
  async getUser(id) {
    if (!db) return void 0;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getProperties(search) {
    return [];
  }
  async getProperty(id) {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || void 0;
  }
  async getPropertyByMLS(mlsId) {
    const [property] = await db.select().from(properties).where(eq(properties.mlsId, mlsId));
    return property || void 0;
  }
  async createProperty(property) {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }
  async updateProperty(id, property) {
    const [updated] = await db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return updated || void 0;
  }
  async updatePropertyStyle(id, styleData) {
    const [updated] = await db.update(properties).set(styleData).where(eq(properties.id, id)).returning();
    return updated || void 0;
  }
  async getFeaturedProperties() {
    return await db.select().from(properties).limit(6);
  }
  async getLuxuryProperties() {
    return await db.select().from(properties).limit(10);
  }
  // Community methods
  async getCommunities() {
    return await db.select().from(communities);
  }
  async getCommunity(slug) {
    const [community] = await db.select().from(communities).where(eq(communities.slug, slug));
    return community || void 0;
  }
  async createCommunity(community) {
    const [newCommunity] = await db.insert(communities).values(community).returning();
    return newCommunity;
  }
  // Blog methods
  async getBlogPosts(published) {
    return await db.select().from(blogPosts);
  }
  async getBlogPost(slug) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || void 0;
  }
  async createBlogPost(post) {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  // Lead methods
  async createLead(lead) {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }
  async getLeads() {
    return await db.select().from(leads);
  }
  // Tracking methods
  async getTrackingCodes(active) {
    return await db.select().from(trackingCodes);
  }
  async createTrackingCode(code) {
    const [newCode] = await db.insert(trackingCodes).values(code).returning();
    return newCode;
  }
  async updateTrackingCode(id, code) {
    const [updated] = await db.update(trackingCodes).set(code).where(eq(trackingCodes.id, id)).returning();
    return updated || void 0;
  }
  // Market Stats methods
  async getMarketStats() {
    return await db.select().from(marketStats);
  }
  async createMarketStats(stats) {
    const [newStats] = await db.insert(marketStats).values(stats).returning();
    return newStats;
  }
  async updateMarketStats(id, stats) {
    const [updated] = await db.update(marketStats).set(stats).where(eq(marketStats.id, id)).returning();
    return updated || void 0;
  }
  // IDX Agent methods
  async getIdxAgents() {
    return await db.select().from(idxAgents);
  }
  async getIdxAgent(id) {
    const [agent] = await db.select().from(idxAgents).where(eq(idxAgents.id, id));
    return agent || void 0;
  }
  async getIdxAgentByMemberKey(memberKey) {
    const [agent] = await db.select().from(idxAgents).where(eq(idxAgents.memberKey, memberKey));
    return agent || void 0;
  }
  async createIdxAgent(agent) {
    const [newAgent] = await db.insert(idxAgents).values(agent).returning();
    return newAgent;
  }
  async updateIdxAgent(id, agent) {
    const [updated] = await db.update(idxAgents).set(agent).where(eq(idxAgents.id, id)).returning();
    return updated || void 0;
  }
  // IDX Media methods
  async getIdxMediaForProperty(listingKey) {
    return await db.select().from(idxMedia).where(eq(idxMedia.listingKey, listingKey));
  }
  async getIdxMedia(id) {
    const [media] = await db.select().from(idxMedia).where(eq(idxMedia.id, id));
    return media || void 0;
  }
  async getIdxMediaByKey(mediaKey) {
    const [media] = await db.select().from(idxMedia).where(eq(idxMedia.mediaKey, mediaKey));
    return media || void 0;
  }
  async createIdxMedia(media) {
    const [newMedia] = await db.insert(idxMedia).values(media).returning();
    return newMedia;
  }
  async updateIdxMedia(id, media) {
    const [updated] = await db.update(idxMedia).set(media).where(eq(idxMedia.id, id)).returning();
    return updated || void 0;
  }
  // IDX Sync Log methods
  async getIdxSyncLogs(limit) {
    let query = db.select().from(idxSyncLog);
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  async getIdxSyncLog(id) {
    const [log] = await db.select().from(idxSyncLog).where(eq(idxSyncLog.id, id));
    return log || void 0;
  }
  async createIdxSyncLog(log) {
    const [newLog] = await db.insert(idxSyncLog).values(log).returning();
    return newLog;
  }
  async updateIdxSyncLog(id, log) {
    const [updated] = await db.update(idxSyncLog).set(log).where(eq(idxSyncLog.id, id)).returning();
    return updated || void 0;
  }
  // Template methods
  async getTemplate() {
    const [template] = await db.select().from(templates).limit(1);
    return template;
  }
  async updateTemplate(templateData) {
    const [existingTemplate] = await db.select().from(templates).limit(1);
    if (existingTemplate) {
      const [updated] = await db.update(templates).set({ ...templateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(templates.id, existingTemplate.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(templates).values(templateData).returning();
      return created;
    }
  }
  // User-specific template methods for DatabaseStorage
  async getTemplateByUser(userId) {
    const [template] = await db.select().from(templates).where(eq(templates.userId, userId)).limit(1);
    return template;
  }
  async updateTemplateByUser(userId, templateData) {
    const [existingTemplate] = await db.select().from(templates).where(eq(templates.userId, userId)).limit(1);
    if (existingTemplate) {
      const [updated] = await db.update(templates).set({ ...templateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(templates.id, existingTemplate.id)).returning();
      return updated;
    } else {
      return this.createTemplateForUser(userId, templateData);
    }
  }
  async createTemplateForUser(userId, templateData) {
    const [created] = await db.insert(templates).values({
      userId,
      ...templateData
    }).returning();
    return created;
  }
};
var storage = db ? new DatabaseStorage() : new MemStorage();

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
    const log = await this.storage.createIdxSyncLog({
      syncType,
      status: "in_progress",
      recordsProcessed: 0,
      recordsUpdated: 0,
      recordsCreated: 0,
      startedAt: /* @__PURE__ */ new Date()
    });
    return log.id;
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
    } else if (false) {
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

// server/auth-middleware.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq as eq2 } from "drizzle-orm";
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
async function authenticateUser(req, res, next) {
  try {
    let token = req.headers.authorization?.replace("Bearer ", "");
    if (!token && req.cookies.authToken) {
      token = req.cookies.authToken;
    }
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        code: "NO_TOKEN"
      });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token.",
        code: "INVALID_TOKEN"
      });
    }
    if (!db) {
      return res.status(500).json({ message: "Database connection not available" });
    }
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      isActive: users.isActive
    }).from(users).where(eq2(users.id, decoded.id));
    if (!user) {
      return res.status(401).json({
        message: "User not found.",
        code: "USER_NOT_FOUND"
      });
    }
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated.",
        code: "ACCOUNT_INACTIVE"
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Authentication failed.",
      code: "AUTH_ERROR"
    });
  }
}
async function optionalAuth(req, res, next) {
  try {
    let token = req.headers.authorization?.replace("Bearer ", "");
    if (!token && req.cookies.authToken) {
      token = req.cookies.authToken;
    }
    if (!token) {
      return next();
    }
    const decoded = verifyToken(token);
    if (!decoded || !db) {
      return next();
    }
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      isActive: users.isActive
    }).from(users).where(eq2(users.id, decoded.id));
    if (user && user.isActive) {
      req.user = user;
    }
    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next();
  }
}
function validateRegistrationData(data) {
  const errors = [];
  if (!data.username || data.username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Valid email address is required");
  }
  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
async function loginUser(credentials) {
  if (!db) {
    throw new Error("Database connection not available");
  }
  const [user] = await db.select().from(users).where(eq2(users.email, credentials.email));
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }
  const isValidPassword = await verifyPassword(
    credentials.password,
    user.password
  );
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }
  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email
  });
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  };
}
async function registerUser(data) {
  if (!db) {
    throw new Error("Database connection not available");
  }
  const validation = validateRegistrationData(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  const [existingUser] = await db.select().from(users).where(eq2(users.email, data.email));
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const [existingUsername] = await db.select().from(users).where(eq2(users.username, data.username));
  if (existingUsername) {
    throw new Error("Username is already taken");
  }
  const hashedPassword = await hashPassword(data.password);
  const [newUser] = await db.insert(users).values({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    isActive: true
  }).returning({
    id: users.id,
    username: users.username,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName
  });
  const token = generateToken({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  });
  return {
    token,
    user: newUser
  };
}

// server/routes.ts
function generateMarketInsightPosts(properties2) {
  if (!properties2 || properties2.length === 0) return [];
  const posts = [];
  const currentDate = /* @__PURE__ */ new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const totalProperties = properties2.length;
  const averagePrice = properties2.reduce(
    (sum, prop) => sum + (prop.listPrice || prop.soldPrice || 0),
    0
  ) / totalProperties;
  const averageSqft = properties2.reduce((sum, prop) => sum + (prop.sqft || 0), 0) / totalProperties;
  const pricePerSqft = averagePrice / averageSqft;
  const neighborhoods = properties2.reduce((acc, prop) => {
    const neighborhood = prop.subdivision || prop.city;
    if (!acc[neighborhood]) acc[neighborhood] = [];
    acc[neighborhood].push(prop);
    return acc;
  }, {});
  posts.push({
    id: 1,
    title: `Omaha Real Estate Market Report - ${formattedDate}`,
    slug: "omaha-market-report-" + currentDate.toISOString().split("T")[0],
    excerpt: `Current market analysis of ${totalProperties} properties showing average price of $${Math.round(
      averagePrice
    ).toLocaleString()}`,
    content: `# Omaha Real Estate Market Analysis

**Market Overview for ${formattedDate}**

Our latest analysis of ${totalProperties} properties in the Omaha area reveals important market trends:

## Key Market Statistics
- **Average List Price**: $${Math.round(averagePrice).toLocaleString()}
- **Average Square Footage**: ${Math.round(averageSqft).toLocaleString()} sq ft
- **Average Price Per Square Foot**: $${Math.round(pricePerSqft)}
- **Properties Analyzed**: ${totalProperties}

## Market Insights
The Omaha real estate market continues to show strong fundamentals with properties ranging from $${Math.min(
      ...properties2.map((p) => p.listPrice || p.soldPrice || 0)
    ).toLocaleString()} to $${Math.max(
      ...properties2.map((p) => p.listPrice || p.soldPrice || 0)
    ).toLocaleString()}.

${Object.keys(neighborhoods).length > 1 ? `## Neighborhood Highlights
${Object.entries(neighborhoods).slice(0, 5).map(
      ([name, props]) => `- **${name}**: ${props.length} properties, avg $${Math.round(
        props.reduce(
          (sum, p) => sum + (p.listPrice || p.soldPrice || 0),
          0
        ) / props.length
      ).toLocaleString()}`
    ).join("\n")}` : ""}

*Data sourced from current MLS listings and recent sales.*`,
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    published: true,
    featured: true,
    createdAt: currentDate,
    updatedAt: currentDate
  });
  const priceRanges = {
    "Under $200k": properties2.filter(
      (p) => (p.listPrice || p.soldPrice || 0) < 2e5
    ).length,
    "$200k-$300k": properties2.filter((p) => {
      const price = p.listPrice || p.soldPrice || 0;
      return price >= 2e5 && price < 3e5;
    }).length,
    "$300k-$400k": properties2.filter((p) => {
      const price = p.listPrice || p.soldPrice || 0;
      return price >= 3e5 && price < 4e5;
    }).length,
    "Over $400k": properties2.filter(
      (p) => (p.listPrice || p.soldPrice || 0) >= 4e5
    ).length
  };
  posts.push({
    id: 2,
    title: "Understanding Omaha Home Price Ranges: Where to Find Value",
    slug: "omaha-price-ranges-analysis",
    excerpt: "Comprehensive breakdown of property availability across different price segments in the Omaha market.",
    content: `# Understanding Omaha Home Price Ranges

Finding the right home at the right price requires understanding the current market distribution. Here's what our latest data shows:

## Price Distribution Analysis
${Object.entries(priceRanges).map(
      ([range, count]) => `- **${range}**: ${count} properties (${Math.round(
        count / totalProperties * 100
      )}% of market)`
    ).join("\n")}

## What This Means for Buyers
- **First-time buyers**: ${priceRanges["Under $200k"]} homes available under $200k
- **Move-up buyers**: Strong selection in the $200k-$400k range with ${priceRanges["$200k-$300k"] + priceRanges["$300k-$400k"]} properties
- **Luxury buyers**: ${priceRanges["Over $400k"]} premium properties available

The current market offers opportunities across all price points, with particularly strong inventory in the middle price ranges.

*Contact our team to explore properties in your preferred price range.*`,
    category: "Buyer Guide",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    published: true,
    featured: false,
    createdAt: new Date(currentDate.getTime() - 864e5),
    // 1 day ago
    updatedAt: new Date(currentDate.getTime() - 864e5)
  });
  const investmentProperties = properties2.filter(
    (p) => (p.listPrice || p.soldPrice || 0) < averagePrice
  );
  posts.push({
    id: 3,
    title: "Investment Opportunities in Omaha Real Estate",
    slug: "omaha-investment-opportunities",
    excerpt: `Discover ${investmentProperties.length} potential investment properties below market average pricing.`,
    content: `# Investment Opportunities in Omaha

The Omaha real estate market presents compelling investment opportunities for both new and experienced investors.

## Current Investment Landscape
- **Below-Average Pricing**: ${investmentProperties.length} properties priced below the market average of $${Math.round(
      averagePrice
    ).toLocaleString()}
- **Average Price Per Square Foot**: $${Math.round(
      pricePerSqft
    )} provides good value compared to national averages
- **Diverse Property Types**: Options ranging from single-family homes to multi-unit properties

## Key Investment Metrics
- **Market Average Price**: $${Math.round(averagePrice).toLocaleString()}
- **Value Properties**: Properties starting at $${Math.min(
      ...investmentProperties.map((p) => p.listPrice || p.soldPrice || 0)
    ).toLocaleString()}
- **Potential ROI**: Favorable cap rates in emerging neighborhoods

## Why Invest in Omaha?
- Strong job market with Fortune 500 companies
- Stable property values with consistent appreciation
- Growing population and economic development
- Affordable compared to coastal markets

*Ready to explore investment opportunities? Contact us for a personalized market analysis.*`,
    category: "Investment",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    published: true,
    featured: false,
    createdAt: new Date(currentDate.getTime() - 1728e5),
    // 2 days ago
    updatedAt: new Date(currentDate.getTime() - 1728e5)
  });
  return posts;
}
async function registerRoutes(app2) {
  app2.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "bjork-homes-real-estate"
    });
  });
  const paragonCache = /* @__PURE__ */ new Map();
  const PARAGON_TTL_MS = 6e4;
  app2.get("/api/paragon/properties", async (req, res) => {
    try {
      const {
        minPrice,
        maxPrice,
        city = "omaha",
        status = "Active",
        // Active | Closed | Both
        days = "30",
        // recent days for closed
        limit = "50",
        noCache = "0",
        includeImages = "0"
        // when 1, attempt to pull media (best-effort)
      } = req.query;
      const sinceDate = (() => {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() - (parseInt(days, 10) || 30));
        return d.toISOString().split("T")[0];
      })();
      const normalizedCity = city.toLowerCase();
      let priceClause = "";
      if (minPrice && maxPrice) {
        priceClause = `((ListPrice ge ${minPrice} and ListPrice le ${maxPrice}) or (ClosePrice ge ${minPrice} and ClosePrice le ${maxPrice}))`;
      } else if (minPrice) {
        priceClause = `(ListPrice ge ${minPrice} or ClosePrice ge ${minPrice})`;
      } else if (maxPrice) {
        priceClause = `(ListPrice le ${maxPrice} or ClosePrice le ${maxPrice})`;
      }
      const cityClause = `tolower(City) eq '${normalizedCity}'`;
      let statusClause = "";
      if (status.toLowerCase() === "active") {
        statusClause = `StandardStatus eq 'Active'`;
      } else if (status.toLowerCase() === "closed") {
        statusClause = `(StandardStatus eq 'Closed' and CloseDate ge ${sinceDate})`;
      } else if (status.toLowerCase() === "both") {
        statusClause = `((StandardStatus eq 'Active') or (StandardStatus eq 'Closed' and CloseDate ge ${sinceDate}))`;
      }
      const filterParts = [cityClause];
      if (priceClause) filterParts.push(priceClause);
      if (statusClause) filterParts.push(statusClause);
      const filter = encodeURIComponent(filterParts.join(" and "));
      const select = encodeURIComponent(
        [
          "ListingKey",
          "City",
          "UnparsedAddress",
          "ListPrice",
          "ClosePrice",
          "CloseDate",
          "PostalCode",
          "StateOrProvince",
          "BedroomsTotal",
          "BathroomsTotalInteger",
          "AboveGradeFinishedArea",
          "YearBuilt",
          "SubdivisionName",
          "Latitude",
          "Longitude",
          "StandardStatus"
        ].join(",")
      );
      const accessToken = process.env.PARAGON_ACCESS_TOKEN || "429b18690390adfa776f0b727dfc78cc";
      const top = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
      const url = `https://api.paragonapi.com/api/v2/OData/bk9/Properties?access_token=${accessToken}&$filter=${filter}&$select=${select}&$orderby=ListPrice%20desc&$top=${top}`;
      const cacheKey = url;
      const now = Date.now();
      const normalizeId = (v) => (v || "").trim().toLowerCase();
      const excludedMlsIdsRaw = ["655d2b69f2d8ddd5f56afd5312a543ca"];
      const excludedMlsIds = new Set(
        excludedMlsIdsRaw.map((id) => normalizeId(id))
      );
      const cached = paragonCache.get(cacheKey);
      if (noCache !== "1" && cached && now - cached.ts < PARAGON_TTL_MS) {
        const cleanedData = cached.data.data.filter(
          (p) => !excludedMlsIds.has(normalizeId(p.mlsId))
        );
        let finalPayload = cached.data;
        if (cleanedData.length !== cached.data.data.length) {
          finalPayload = { ...cached.data, data: cleanedData };
          paragonCache.set(cacheKey, { ts: now, data: finalPayload });
        }
        return res.json({ ...finalPayload, cached: true });
      }
      const r = await fetch(url, { headers: { Accept: "application/json" } });
      if (!r.ok) {
        const body = await r.text();
        return res.status(500).json({
          message: "Failed to fetch Paragon properties",
          error: `Paragon API ${r.status}: ${body}`,
          request: { url, filter: decodeURIComponent(filter) }
        });
      }
      const data = await r.json();
      const rawItems = data.value || data.data || [];
      if (!Array.isArray(rawItems)) {
        console.warn("Unexpected Paragon response shape", Object.keys(data));
      }
      const mapped = rawItems.map((p) => {
        const media = Array.isArray(p.Media) ? p.Media : [];
        const imageUrls = media.sort((a, b) => (a?.Order || 0) - (b?.Order || 0)).slice(0, 5).map((m) => m?.MediaURL).filter(Boolean);
        return {
          id: p.ListingKey || Math.random().toString(36).slice(2),
          mlsId: p.ListingKey,
          listingKey: p.ListingKey,
          title: `${p.BedroomsTotal || "?"} Bed ${p.BathroomsTotalInteger || "?"} Bath in ${p.City}`,
          description: null,
          price: String(p.ListPrice || p.ClosePrice || 0),
          address: p.UnparsedAddress,
          city: p.City,
          state: p.StateOrProvince,
          zipCode: p.PostalCode,
          beds: p.BedroomsTotal || 0,
          baths: String(p.BathroomsTotalInteger || 0),
          sqft: p.AboveGradeFinishedArea || 0,
          yearBuilt: p.YearBuilt || null,
          propertyType: p.PropertySubType || "Residential",
          status: (p.StandardStatus || "").toLowerCase(),
          standardStatus: p.StandardStatus,
          featured: (p.ListPrice || p.ClosePrice || 0) >= 15e4,
          luxury: (p.ListPrice || p.ClosePrice || 0) >= 4e5,
          images: imageUrls,
          neighborhood: p.SubdivisionName || null,
          schoolDistrict: null,
          style: null,
          coordinates: { lat: p.Latitude, lng: p.Longitude },
          features: [],
          architecturalStyle: null,
          secondaryStyle: null,
          styleConfidence: null,
          styleFeatures: [],
          styleAnalyzed: false,
          listingAgentKey: null,
          listingOfficeName: null,
          listingContractDate: null,
          daysOnMarket: null,
          originalListPrice: p.ListPrice || null,
          mlsStatus: p.StandardStatus,
          modificationTimestamp: p.CloseDate || null,
          photoCount: media.length || 0,
          virtualTourUrl: null,
          isIdxListing: true,
          idxSyncedAt: /* @__PURE__ */ new Date(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
      });
      const cleaned = mapped.filter(
        (p) => !excludedMlsIds.has(normalizeId(p.mlsId))
      );
      if (mapped.length !== cleaned.length) {
        console.log(
          `Excluded ${mapped.length - cleaned.length} listing(s) by MLS id filter.`
        );
      }
      if (includeImages === "1") {
        const needImages = cleaned.filter((p) => !p.images.length);
        const MAX_ENRICH = 20;
        const subset = needImages.slice(0, MAX_ENRICH);
        if (subset.length) {
          const detailPromises = subset.map(async (prop) => {
            try {
              const detailUrl = `https://api.paragonapi.com/api/v2/OData/bk9/Property('${prop.mlsId}')?access_token=${accessToken}`;
              const dr = await fetch(detailUrl, {
                headers: { Accept: "application/json" }
              });
              if (!dr.ok) return;
              const dj = await dr.json();
              const media = Array.isArray(dj.Media) ? dj.Media : [];
              const imgs = media.sort((a, b) => (a?.Order || 0) - (b?.Order || 0)).slice(0, 5).map((m) => m?.MediaURL).filter(Boolean);
              if (imgs.length) {
                prop.images = imgs;
                prop.photoCount = media.length || imgs.length;
              }
            } catch (e) {
            }
          });
          await Promise.all(detailPromises);
        }
      }
      const payload = {
        data: cleaned,
        source: "paragon",
        query: {
          city: normalizedCity,
          minPrice,
          maxPrice,
          status,
          sinceDate: status.toLowerCase() === "closed" || status.toLowerCase() === "both" ? sinceDate : null,
          limit: top,
          includeImages: includeImages === "1"
        },
        cached: false
      };
      paragonCache.set(cacheKey, { ts: now, data: payload });
      res.json(payload);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch Paragon properties",
        error: error?.message || String(error)
      });
    }
  });
  const idxSyncService = new idx_sync_service_default(storage);
  app2.get("/api/properties", async (req, res) => {
    try {
      const searchParams = propertySearchSchema.parse(req.query);
      if (false) {
        const paragonParams = new URLSearchParams({
          city: searchParams.city || "lincoln",
          // Default to Lincoln, NE as per header
          status: "Active",
          limit: (searchParams.limit || 20).toString(),
          includeImages: "1"
        });
        if (searchParams.minPrice) {
          paragonParams.set("minPrice", searchParams.minPrice.toString());
        }
        if (searchParams.maxPrice) {
          paragonParams.set("maxPrice", searchParams.maxPrice.toString());
        }
        if (searchParams.featured) {
          paragonParams.delete("minPrice");
          paragonParams.delete("maxPrice");
          paragonParams.set("minPrice", "150000");
        }
        if (searchParams.luxury) {
          paragonParams.delete("minPrice");
          paragonParams.delete("maxPrice");
          paragonParams.set("minPrice", "400000");
        }
        const paragonUrl = `http://localhost:5080/api/paragon/properties?${paragonParams}`;
        try {
          const response = await fetch(paragonUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
              let filteredData = data.data;
              if (searchParams.beds) {
                filteredData = filteredData.filter(
                  (prop) => prop.beds >= searchParams.beds
                );
              }
              if (searchParams.baths) {
                filteredData = filteredData.filter(
                  (prop) => parseFloat(prop.baths) >= searchParams.baths
                );
              }
              if (searchParams.propertyType) {
                filteredData = filteredData.filter(
                  (prop) => prop.propertyType?.toLowerCase().includes(searchParams.propertyType.toLowerCase()) || searchParams.propertyType === "Single Family" && (prop.propertyType?.toLowerCase().includes("residential") || prop.propertyType?.toLowerCase().includes("single"))
                );
              }
              if (searchParams.query) {
                const query = searchParams.query.toLowerCase();
                filteredData = filteredData.filter(
                  (prop) => prop.address?.toLowerCase().includes(query) || prop.city?.toLowerCase().includes(query) || prop.neighborhood?.toLowerCase().includes(query) || prop.zipCode?.includes(query)
                );
              }
              const finalLimit = searchParams.limit || 20;
              filteredData = filteredData.slice(0, finalLimit);
              res.json({
                data: filteredData,
                total: filteredData.length,
                hasMore: false,
                page: 1
              });
              return;
            }
            res.json(data);
            return;
          }
        } catch (error) {
          console.error("Error calling Paragon API:", error);
        }
        if (searchParams.featured || searchParams.luxury) {
          const luxuryProperties = await externalPropertyAPI2.getLuxuryProperties();
          const transformedProperties2 = luxuryProperties.map(
            (p) => externalPropertyAPI2.transformToProperty(p)
          );
          const limitedProperties = searchParams.limit ? transformedProperties2.slice(0, searchParams.limit) : transformedProperties2;
          res.json(limitedProperties);
          return;
        }
        const city = searchParams.city || "Lincoln";
        const externalProperties = await externalPropertyAPI2.getPropertiesForCity(city, {
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          limit: searchParams.limit || 20
        });
        const transformedProperties = externalProperties.map(
          (p) => externalPropertyAPI2.transformToProperty(p)
        );
        res.json(transformedProperties);
        return;
      }
      const properties2 = await storage.getProperties(searchParams);
      res.json(properties2);
    } catch (error) {
      console.error("Properties endpoint error:", error);
      res.status(400).json({ message: "Invalid search parameters", error });
    }
  });
  app2.get("/api/properties/featured", async (req, res) => {
    try {
      const {
        propertyType,
        minPrice,
        maxPrice,
        beds,
        baths,
        location,
        features,
        sortBy,
        limit = 20
      } = req.query;
      if (false) {
        const paragonParams = new URLSearchParams({
          city: location || "lincoln",
          status: "Active",
          limit: limit.toString(),
          includeImages: "1",
          minPrice: minPrice ? minPrice.toString() : "150000"
          // Featured minimum
        });
        if (maxPrice) paragonParams.set("maxPrice", maxPrice.toString());
        if (beds) paragonParams.set("beds", beds.toString());
        if (baths) paragonParams.set("baths", baths.toString());
        const paragonUrl = `http://localhost:5080/api/paragon/properties?${paragonParams}`;
        try {
          const response = await fetch(paragonUrl);
          if (response.ok) {
            let data = await response.json();
            if (data.properties) {
              let filteredProperties = data.properties;
              if (propertyType && propertyType !== "any") {
                filteredProperties = filteredProperties.filter((prop) => {
                  const propType = prop.PropertyType?.toLowerCase() || "";
                  switch (propertyType) {
                    case "single-family":
                      return propType.includes("residential") || propType.includes("single");
                    case "condo":
                      return propType.includes("condo") || propType.includes("condominium");
                    case "townhouse":
                      return propType.includes("townhouse") || propType.includes("town");
                    case "luxury":
                      return (prop.ListPrice || 0) >= 5e5;
                    default:
                      return true;
                  }
                });
              }
              if (features && typeof features === "string") {
                const requestedFeatures = features.split(",");
                filteredProperties = filteredProperties.filter((prop) => {
                  const propFeatures = [
                    prop.PublicRemarks || "",
                    prop.PrivateRemarks || "",
                    prop.InteriorFeatures || "",
                    prop.ExteriorFeatures || ""
                  ].join(" ").toLowerCase();
                  return requestedFeatures.some((feature) => {
                    const featureLower = feature.toLowerCase();
                    return propFeatures.includes(featureLower) || propFeatures.includes(featureLower.replace(/\s+/g, "")) || propFeatures.includes(featureLower.replace("-", " "));
                  });
                });
              }
              if (sortBy) {
                filteredProperties = filteredProperties.sort(
                  (a, b) => {
                    switch (sortBy) {
                      case "price-low":
                        return (a.ListPrice || 0) - (b.ListPrice || 0);
                      case "price-high":
                        return (b.ListPrice || 0) - (a.ListPrice || 0);
                      case "beds":
                        return (b.BedroomsTotal || 0) - (a.BedroomsTotal || 0);
                      case "size":
                        return (b.LivingArea || 0) - (a.LivingArea || 0);
                      case "newest":
                      default:
                        return new Date(b.ModificationTimestamp || 0).getTime() - new Date(a.ModificationTimestamp || 0).getTime();
                    }
                  }
                );
              }
              data.properties = filteredProperties;
              data.total = filteredProperties.length;
            }
            res.json(data);
            return;
          }
        } catch (paragonError) {
          console.log("Paragon API error, falling back to database");
        }
      }
      const properties2 = await storage.getFeaturedProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties", error });
    }
  });
  app2.get("/api/properties/search", async (req, res) => {
    try {
      const searchParams = propertySearchSchema.parse(req.query);
      if (false) {
        const paragonParams = new URLSearchParams({
          city: searchParams.city || "lincoln",
          status: "Active",
          limit: (searchParams.limit || 20).toString(),
          includeImages: "1"
        });
        if (searchParams.minPrice) {
          paragonParams.set("minPrice", searchParams.minPrice.toString());
        }
        if (searchParams.maxPrice) {
          paragonParams.set("maxPrice", searchParams.maxPrice.toString());
        }
        if (searchParams.featured) {
          if (!searchParams.minPrice) {
            paragonParams.set("minPrice", "150000");
          }
        }
        const paragonUrl = `http://localhost:5080/api/paragon/properties?${paragonParams}`;
        try {
          const response = await fetch(paragonUrl);
          if (response.ok) {
            const data = await response.json();
            res.json(data);
            return;
          }
        } catch (paragonError) {
          console.log("Paragon API error, falling back to database");
        }
      }
      const properties2 = await storage.getProperties(searchParams);
      res.json(properties2);
    } catch (error) {
      console.error("Properties search endpoint error:", error);
      res.status(400).json({ message: "Invalid search parameters", error });
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
  app2.get("/api/property/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (false) {
        try {
          let paragonUrl = `https://api.paragonapi.com/api/v2/OData/bk9/Property('${id}')?access_token=429b18690390adfa776f0b727dfc78cc&$expand=Media`;
          let response = await fetch(paragonUrl);
          let paragonData = null;
          if (response.ok) {
            paragonData = await response.json();
          } else {
            console.log(`Direct lookup failed for ID: ${id}, trying search...`);
            const searchUrl = `http://localhost:5080/api/paragon/properties?city=lincoln&limit=100&includeImages=1`;
            const searchResponse = await fetch(searchUrl);
            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              const matchingProperty = searchData.data?.find(
                (prop) => prop.id === id || prop.mlsId === id || prop.listingKey === id
              );
              if (matchingProperty) {
                paragonData = {
                  ListingKey: matchingProperty.mlsId || matchingProperty.id,
                  BedroomsTotal: matchingProperty.beds,
                  BathroomsTotalInteger: parseInt(matchingProperty.baths) || 0,
                  PropertySubType: matchingProperty.propertyType,
                  City: matchingProperty.city,
                  PublicRemarks: matchingProperty.description,
                  ListPrice: parseInt(matchingProperty.price) || 0,
                  UnparsedAddress: matchingProperty.address,
                  StateOrProvince: matchingProperty.state,
                  PostalCode: matchingProperty.zipCode,
                  LivingArea: matchingProperty.sqft,
                  AboveGradeFinishedArea: matchingProperty.sqft,
                  YearBuilt: matchingProperty.yearBuilt,
                  PropertyType: matchingProperty.propertyType,
                  StandardStatus: matchingProperty.standardStatus || "Active",
                  SubdivisionName: matchingProperty.neighborhood,
                  Latitude: matchingProperty.coordinates?.lat,
                  Longitude: matchingProperty.coordinates?.lng,
                  Media: matchingProperty.images?.map(
                    (url, index) => ({
                      MediaURL: url,
                      Order: index
                    })
                  ) || []
                };
              }
            }
          }
          if (paragonData) {
            const property2 = {
              id: parseInt(id) || Math.floor(Math.random() * 1e6),
              mlsId: paragonData.ListingKey,
              listingKey: paragonData.ListingKey,
              title: `${paragonData.BedroomsTotal || "N/A"} Bed, ${paragonData.BathroomsTotalInteger || "N/A"} Bath ${paragonData.PropertySubType || "Home"} in ${paragonData.City}`,
              description: paragonData.PublicRemarks || `Beautiful ${(paragonData.PropertySubType || "home").toLowerCase()} in ${paragonData.City}`,
              price: (paragonData.ListPrice || 0).toString(),
              address: paragonData.UnparsedAddress || "",
              city: paragonData.City || "",
              state: paragonData.StateOrProvince || "NE",
              zipCode: paragonData.PostalCode || "",
              beds: paragonData.BedroomsTotal || 0,
              baths: (paragonData.BathroomsTotalInteger || 0).toString(),
              sqft: paragonData.LivingArea || paragonData.AboveGradeFinishedArea || 0,
              yearBuilt: paragonData.YearBuilt || null,
              propertyType: paragonData.PropertyType || "Residential",
              status: (paragonData.StandardStatus || "Active").toLowerCase(),
              standardStatus: paragonData.StandardStatus || "Active",
              featured: (paragonData.ListPrice || 0) >= 25e4,
              luxury: (paragonData.ListPrice || 0) >= 4e5,
              images: paragonData.Media && Array.isArray(paragonData.Media) ? paragonData.Media.sort(
                (a, b) => (a.Order || 0) - (b.Order || 0)
              ).map((m) => m.MediaURL).filter(Boolean) : [],
              neighborhood: paragonData.SubdivisionName || null,
              schoolDistrict: paragonData.ElementarySchool || null,
              style: paragonData.PropertySubType || null,
              coordinates: paragonData.Latitude && paragonData.Longitude ? {
                lat: parseFloat(paragonData.Latitude),
                lng: parseFloat(paragonData.Longitude)
              } : null,
              features: [],
              architecturalStyle: paragonData.PropertySubType || null,
              secondaryStyle: null,
              styleConfidence: null,
              styleFeatures: [],
              styleAnalyzed: false,
              listingAgentKey: paragonData.ListAgentKey || null,
              listingOfficeName: paragonData.ListOfficeName || null,
              listingContractDate: paragonData.ContractStatusChangeDate || null,
              daysOnMarket: paragonData.DaysOnMarket || null,
              originalListPrice: paragonData.OriginalListPrice?.toString() || null,
              mlsStatus: paragonData.MlsStatus || paragonData.StandardStatus,
              modificationTimestamp: paragonData.ModificationTimestamp || null,
              photoCount: paragonData.PhotosCount || (paragonData.Media ? paragonData.Media.length : 0),
              virtualTourUrl: paragonData.VirtualTourURLUnbranded || null,
              isIdxListing: true,
              idxSyncedAt: /* @__PURE__ */ new Date(),
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            };
            res.json({ property: property2, success: true });
            return;
          }
        } catch (error) {
          console.error("Error fetching from Paragon API:", error);
        }
      }
      if (false) {
        return res.status(404).json({
          message: "Property not found",
          success: false,
          note: "Development mode: Paragon API lookup failed"
        });
      }
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        return res.status(400).json({ message: "Invalid property ID", success: false });
      }
      const property = await storage.getProperty(numericId);
      if (!property) {
        return res.status(404).json({ message: "Property not found", success: false });
      }
      res.json({ property, success: true });
    } catch (error) {
      console.error("Property details endpoint error:", error);
      res.status(500).json({ message: "Failed to fetch property", error, success: false });
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
  app2.get("/api/properties/external/featured", async (req, res) => {
    try {
      const response = await fetch(
        "http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?city=Omaha&min_price=200000&max_price=400000"
      );
      if (!response.ok) {
        throw new Error(
          `External API returned ${response.status}: ${response.statusText}`
        );
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch external properties:", error);
      res.status(500).json({
        message: "Failed to fetch external properties",
        error: error?.message || String(error)
      });
    }
  });
  app2.get("/api/cma-comparables", async (req, res) => {
    try {
      const {
        city = "Omaha",
        min_price = "150000",
        max_price = "350000",
        ...otherParams
      } = req.query;
      const queryParams = new URLSearchParams({
        city,
        min_price,
        max_price,
        ...Object.fromEntries(
          Object.entries(otherParams).map(([key, value]) => [
            key,
            String(value)
          ])
        )
      });
      const externalUrl = `http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?${queryParams}`;
      const response = await fetch(externalUrl);
      if (!response.ok) {
        throw new Error(
          `External API returned ${response.status}: ${response.statusText}`
        );
      }
      const raw = await response.json();
      const normalized = Array.isArray(raw?.data) ? raw : { data: Array.isArray(raw) ? raw : [], raw };
      res.json(normalized);
    } catch (error) {
      console.error("Failed to fetch CMA data:", error);
      res.status(500).json({
        message: "Failed to fetch CMA data",
        error: error?.message || String(error)
      });
    }
  });
  app2.get("/api/communities", async (req, res) => {
    try {
      if (false) {
        const staticCommunities = [
          {
            id: 1,
            name: "Benson",
            slug: "benson",
            city: "Omaha",
            state: "NE",
            description: "Historic neighborhood with vibrant arts scene and walkable streets.",
            averagePrice: 185e3,
            medianPrice: 175e3,
            pricePerSqft: 95,
            averageDaysOnMarket: 35,
            inventoryCount: 85,
            schoolDistrict: "Omaha Public Schools",
            walkScore: 78,
            transitScore: 45,
            bikeScore: 65,
            demographics: { medianAge: 34, medianIncome: 52e3 },
            amenities: [
              "Historic Architecture",
              "Art Galleries",
              "Local Restaurants",
              "Parks"
            ],
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          },
          {
            id: 2,
            name: "Dundee",
            slug: "dundee",
            city: "Omaha",
            state: "NE",
            description: "Upscale neighborhood known for historic homes and tree-lined streets.",
            averagePrice: 425e3,
            medianPrice: 395e3,
            pricePerSqft: 180,
            averageDaysOnMarket: 28,
            inventoryCount: 42,
            schoolDistrict: "Omaha Public Schools",
            walkScore: 82,
            transitScore: 38,
            bikeScore: 72,
            demographics: { medianAge: 42, medianIncome: 85e3 },
            amenities: [
              "Historic Homes",
              "Elmwood Park",
              "Happy Hollow Country Club",
              "Memorial Park"
            ],
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          },
          {
            id: 3,
            name: "Blackstone",
            slug: "blackstone",
            city: "Omaha",
            state: "NE",
            description: "Trendy district with excellent dining and entertainment options.",
            averagePrice: 275e3,
            medianPrice: 255e3,
            pricePerSqft: 125,
            averageDaysOnMarket: 31,
            inventoryCount: 58,
            schoolDistrict: "Omaha Public Schools",
            walkScore: 88,
            transitScore: 52,
            bikeScore: 78,
            demographics: { medianAge: 29, medianIncome: 62e3 },
            amenities: [
              "Restaurants",
              "Entertainment",
              "Walkable",
              "Historic Character"
            ],
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }
        ];
        res.json(staticCommunities);
        return;
      }
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
      try {
        const response = await fetch(
          "http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?city=Omaha&min_price=150000&max_price=350000"
        );
        if (response.ok) {
          const externalData = await response.json();
          const properties2 = externalData.data || [];
          const marketInsightPosts = generateMarketInsightPosts(properties2);
          return res.json(marketInsightPosts);
        }
      } catch (externalError) {
        console.log(
          "External data not available, falling back to local blog posts"
        );
      }
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
      res.status(201).json({
        message: "Contact form submitted successfully",
        leadId: lead.id
      });
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
  app2.get("/api/market-stats", async (_req, res) => {
    try {
      const stats = await storage.getMarketStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch market stats",
        error: error?.message || String(error)
      });
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
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: "production",
      version: "1.0.0"
    });
  });
  app2.get("/api/template/public", async (req, res) => {
    try {
      let template = await storage.getTemplate();
      if (!template) {
        const defaultTemplate = {
          companyName: "Bjork Group Real Estate",
          agentName: "Real Estate Expert",
          agentTitle: "Principal Broker",
          agentEmail: "contact@bjorkgroup.com",
          companyDescription: "Discover exceptional homes with Nebraska's premier luxury real estate team",
          heroTitle: "Ready to Find Your Dream Home?",
          heroSubtitle: "Let's start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.",
          contactPhone: "(402) 522-6131",
          contactPhoneText: "Call or text anytime",
          officeAddress: "331 Village Pointe Plaza",
          officeCity: "Omaha",
          officeState: "NE",
          officeZip: "68130",
          homesSold: 500,
          totalSalesVolume: "$250M+",
          serviceAreas: ["Omaha", "Lincoln", "Elkhorn", "Papillion"],
          phone: "(402) 555-0123",
          logoUrl: "https://home-template-images.s3.us-east-2.amazonaws.com/logos/user-1/2408BjorkGroupFinalLogo1_Bjork%20Group%20Black%20Square%20BHHS_1753648666870.png",
          address: {
            street: "123 Main Street",
            city: "Omaha",
            state: "NE",
            zip: "68102"
          }
        };
        template = defaultTemplate;
      }
      console.log("Public template endpoint returning:", template);
      res.json(template);
    } catch (error) {
      console.error("Error fetching public template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });
  app2.get(
    "/api/template",
    authenticateUser,
    async (req, res) => {
      try {
        const userId = req.user.id;
        let template = await storage.getTemplateByUser(userId);
        if (!template) {
          const defaultTemplate = {
            companyName: `${req.user.firstName || req.user.username}'s Real Estate Company`,
            agentName: `${req.user.firstName || req.user.username} ${req.user.lastName || ""}`.trim(),
            agentTitle: "Principal Broker",
            agentEmail: req.user.email,
            companyDescription: "We believe that luxury is not a price point but an experience.",
            homesSold: 0,
            totalSalesVolume: "$0",
            serviceAreas: ["Your Primary City", "Your Secondary City"],
            phone: "",
            address: {
              street: "123 Main Street",
              city: "Your City",
              state: "Your State",
              zip: "12345"
            }
          };
          template = await storage.createTemplateForUser(
            userId,
            defaultTemplate
          );
        }
        res.json(template);
      } catch (error) {
        console.error("Error fetching user template:", error);
        res.status(500).json({ message: "Failed to fetch template" });
      }
    }
  );
  app2.post(
    "/api/template",
    authenticateUser,
    async (req, res) => {
      try {
        const userId = req.user.id;
        console.log(
          `Template update for user ${userId}:`,
          JSON.stringify(req.body, null, 2)
        );
        const requiredFields = ["companyName", "agentName"];
        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res.status(400).json({
              message: `Missing required field: ${field}`,
              received: req.body
            });
          }
        }
        const cleanedData = Object.entries(req.body).reduce(
          (acc, [key, value]) => {
            if (value === "") {
              acc[key] = null;
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
        console.log(
          `Cleaned template data for user ${userId}:`,
          JSON.stringify(cleanedData, null, 2)
        );
        const template = await storage.updateTemplateByUser(
          userId,
          cleanedData
        );
        console.log("User template updated successfully:", template);
        res.json(template);
      } catch (error) {
        console.error("Error updating user template:", error);
        console.error(
          "Error stack:",
          error instanceof Error ? error.stack : "No stack trace"
        );
        res.status(500).json({
          message: "Failed to update template",
          error: error instanceof Error ? error.message : "Unknown error",
          details: req.body
        });
      }
    }
  );
  app2.post(
    "/api/upload/presigned-url",
    authenticateUser,
    async (req, res) => {
      try {
        const { filename, contentType, folder } = req.body;
        if (!filename || !contentType) {
          return res.status(400).json({
            message: "Filename and content type are required"
          });
        }
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif"
        ];
        if (!allowedTypes.includes(contentType)) {
          return res.status(400).json({
            message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
          });
        }
        const { getPresignedUploadUrl: getPresignedUploadUrl2 } = await Promise.resolve().then(() => (init_s3_service(), s3_service_exports));
        const uploadFolder = folder || "uploads";
        const userId = req.user.id;
        const result = await getPresignedUploadUrl2(
          uploadFolder,
          userId,
          filename,
          contentType
        );
        res.json(result);
      } catch (error) {
        console.error("Error generating presigned URL:", error);
        res.status(500).json({
          message: "Failed to generate upload URL",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );
  app2.post(
    "/api/upload/image",
    authenticateUser,
    async (req, res) => {
      try {
        res.status(501).json({
          message: "Use /api/upload/presigned-url for file uploads"
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
          message: "Failed to upload image",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );
  app2.get("/api/agent/:slug/template", async (req, res) => {
    try {
      const { slug } = req.params;
      console.log(`Looking for agent with slug: ${slug}`);
      let user = await storage.getUserBySlug(slug);
      if (!user) {
        return res.status(404).json({
          message: "Agent not found",
          slug
        });
      }
      const template = await storage.getTemplateByUser(user.id);
      if (!template) {
        return res.status(404).json({
          message: "Agent template not found",
          slug
        });
      }
      const publicTemplate = {
        ...template,
        agent: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          customSlug: user.customSlug,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim()
        }
      };
      console.log(`Found template for agent: ${publicTemplate.agent.fullName}`);
      res.json(publicTemplate);
    } catch (error) {
      console.error("Error fetching agent template:", error);
      res.status(500).json({ message: "Failed to fetch agent template" });
    }
  });
  app2.get("/api/agent/:slug/profile", async (req, res) => {
    try {
      const { slug } = req.params;
      let user = await storage.getUserBySlug(slug);
      if (!user) {
        return res.status(404).json({ message: "Agent not found" });
      }
      const template = await storage.getTemplateByUser(user.id);
      const publicProfile = {
        id: user.id,
        username: user.username,
        customSlug: user.customSlug,
        displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        companyName: template?.companyName || `${user.firstName}'s Real Estate`,
        agentName: template?.agentName || user.firstName,
        agentTitle: template?.agentTitle || "Real Estate Agent",
        companyDescription: template?.companyDescription || "Professional real estate services",
        serviceAreas: template?.serviceAreas || [],
        homesSold: template?.homesSold || 0,
        totalSalesVolume: template?.totalSalesVolume || "$0",
        yearsExperience: template?.yearsExperience || 0,
        contactPhone: template?.contactPhone || "",
        officeAddress: template?.officeAddress || "",
        officeCity: template?.officeCity || "",
        officeState: template?.officeState || "",
        officeZip: template?.officeZip || "",
        isActive: user.isActive !== false
      };
      res.json(publicProfile);
    } catch (error) {
      console.error("Error fetching agent profile:", error);
      res.status(500).json({ message: "Failed to fetch agent profile" });
    }
  });
  app2.get("/api/agent/:slug/properties", async (req, res) => {
    try {
      const { slug } = req.params;
      const { limit = 20, featured, luxury } = req.query;
      let user = await storage.getUserBySlug(slug);
      if (!user) {
        return res.status(404).json({ message: "Agent not found" });
      }
      const searchParams = {
        limit: parseInt(limit),
        featured: featured === "true",
        luxury: luxury === "true"
        // agentId: user.id, // When you implement agent-specific properties
      };
      const properties2 = await storage.getProperties(searchParams);
      res.json({
        ...properties2,
        agent: {
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          username: user.username,
          customSlug: user.customSlug
        }
      });
    } catch (error) {
      console.error("Error fetching agent properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.get("/api/user/profile", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.post("/api/user/custom-slug", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { customSlug } = req.body;
      if (!customSlug || typeof customSlug !== "string") {
        return res.status(400).json({ message: "Valid custom slug is required" });
      }
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(customSlug)) {
        return res.status(400).json({
          message: "Custom slug can only contain lowercase letters, numbers, and hyphens"
        });
      }
      if (customSlug.length < 3) {
        return res.status(400).json({
          message: "Custom slug must be at least 3 characters long"
        });
      }
      const updatedUser = await storage.setUserCustomSlug(userId, customSlug);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating custom slug:", error);
      if (error instanceof Error && error.message.includes("already taken")) {
        res.status(409).json({ message: "This custom URL is already taken" });
      } else {
        res.status(500).json({ message: "Failed to update custom URL" });
      }
    }
  });
  app2.get("/api/agents/directory", async (req, res) => {
    try {
      const users2 = await storage.getAllActiveUsers();
      const publicDirectory = users2.map((user) => ({
        id: user.id,
        username: user.username,
        displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        customSlug: user.customSlug || user.username,
        profileUrl: `/agent/${user.customSlug || user.username}`,
        isActive: user.isActive
      }));
      res.json(publicDirectory);
    } catch (error) {
      console.error("Error fetching agents directory:", error);
      res.status(500).json({ message: "Failed to fetch agents directory" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/template-middleware.ts
async function loadTemplate(req, res, next) {
  try {
    if (!db) {
      console.log("No database connection - using default template");
      req.template = getDefaultTemplate();
      return next();
    }
    const [existingTemplate] = await db.select().from(templates).limit(1);
    if (existingTemplate) {
      req.template = existingTemplate;
    } else {
      req.template = getDefaultTemplate();
    }
    next();
  } catch (error) {
    console.error("Template loading error:", error);
    req.template = getDefaultTemplate();
    next();
  }
}
function getDefaultTemplate() {
  return {
    id: "default",
    companyName: "Bjork Group Real Estate",
    agentName: "Mandy Visty",
    agentTitle: "Principal Broker",
    agentEmail: "mandy@bjorkgroup.com",
    phone: "(402) 555-0123",
    address: {
      street: "123 Main Street",
      city: "Omaha",
      state: "Nebraska",
      zip: "68102"
    },
    companyDescription: "We believe that luxury is not a price point but an experience. With over 15 years of experience in the Omaha market, we provide personalized service to help you find your dream home.",
    agentBio: "Professional real estate agent with years of experience serving the greater Omaha area.",
    homesSold: 500,
    totalSalesVolume: "$200M+",
    yearsExperience: 15,
    clientSatisfaction: "98%",
    serviceAreas: ["Omaha", "Bellevue", "Papillion", "La Vista"],
    primaryColor: "hsl(20, 14.3%, 4.1%)",
    accentColor: "hsl(213, 100%, 45%)",
    beigeColor: "hsl(25, 35%, 75%)",
    isConfigured: false,
    // Flag to show "not configured" message
    isActive: true
  };
}

// server/auth-routes.ts
import { Router } from "express";
var router = Router();
router.post("/register", async (req, res) => {
  try {
    const registrationData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    const result = await registerUser(registrationData);
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: false,
      // Allow HTTP for AWS EB (EB handles HTTPS termination)
      sameSite: "lax",
      // Less restrictive for cross-origin requests in production
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      path: "/"
      // Ensure cookie is available for all routes
    });
    res.status(201).json({
      message: "Registration successful",
      user: result.user,
      token: result.token
      // Also return token for client-side storage if needed
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed"
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password
    };
    if (!credentials.email || !credentials.password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }
    const result = await loginUser(credentials);
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: false,
      // Allow HTTP for AWS EB (EB handles HTTPS termination)
      sameSite: "lax",
      // Less restrictive for cross-origin requests in production
      maxAge: 7 * 24 * 60 * 60 * 1e3,
      // 7 days
      path: "/"
      // Ensure cookie is available for all routes
    });
    res.json({
      message: "Login successful",
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed"
    });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
});
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({
    user: req.user
  });
});
router.get("/check", (req, res) => {
  res.json({
    isAuthenticated: !!req.user,
    user: req.user || null
  });
});

// server/upload-routes.ts
init_s3_service();
init_s3_config();
import { Router as Router2 } from "express";
import multer from "multer";
var router2 = Router2();
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: S3_CONFIG.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (S3_CONFIG.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${S3_CONFIG.allowedTypes.join(
            ", "
          )}`
        )
      );
    }
  }
});
router2.post(
  "/image",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { folder = "templates" } = req.body;
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`
        });
      }
      const uploadOptions = {
        folder,
        userId: req.user.id,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        buffer: req.file.buffer
      };
      const result = await uploadToS3(uploadOptions);
      res.json({
        message: "File uploaded successfully",
        file: {
          key: result.key,
          url: result.url,
          bucket: result.bucket,
          folder,
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Upload failed"
      });
    }
  }
);
router2.post(
  "/presigned-url",
  authenticateUser,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { fileName, contentType, folder = "templates" } = req.body;
      if (!fileName || !contentType) {
        return res.status(400).json({
          message: "fileName and contentType are required"
        });
      }
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`
        });
      }
      const result = await getPresignedUploadUrl(
        folder,
        req.user.id,
        fileName,
        contentType
      );
      res.json({
        message: "Presigned URL generated successfully",
        upload: result
      });
    } catch (error) {
      console.error("Presigned URL error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to generate presigned URL"
      });
    }
  }
);
router2.delete(
  "/:key(*)",
  authenticateUser,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { key } = req.params;
      if (!key) {
        return res.status(400).json({ message: "File key is required" });
      }
      const userPrefix = `user-${req.user.id}/`;
      if (!key.includes(userPrefix)) {
        return res.status(403).json({
          message: "You can only delete your own files"
        });
      }
      await deleteFromS3(key);
      res.json({
        message: "File deleted successfully",
        key
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Delete failed"
      });
    }
  }
);
router2.get(
  "/user-files/:folder",
  authenticateUser,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { folder } = req.params;
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`
        });
      }
      const { listUserFiles: listUserFiles2 } = await Promise.resolve().then(() => (init_s3_service(), s3_service_exports));
      const files = await listUserFiles2(
        folder,
        req.user.id
      );
      res.json({
        folder,
        files: files.map((key) => ({
          key,
          url: `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`
        }))
      });
    } catch (error) {
      console.error("List files error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to list files"
      });
    }
  }
);

// server/index.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
      console.log(logLine);
    }
  });
  next();
});
app.use(optionalAuth);
app.use(loadTemplate);
app.use("/api/auth", router);
app.use("/api/upload", router2);
(async () => {
  const server = await registerRoutes(app);
  if (false) {
    const { setupVite } = await null;
    await setupVite(app, server);
  } else {
    const publicDir = path2.join(__dirname2, "public");
    app.use(express.static(publicDir));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path2.join(publicDir, "index.html"));
    });
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const port = parseInt(
    process.env.PORT || (true ? "8080" : "5080"),
    10
  );
  server.listen(port, "0.0.0.0", () => {
    console.log(`serving on port ${port}`);
    (async () => {
      if (!db) {
        console.log(
          "DB: no database object initialized (likely development / missing DATABASE_URL)"
        );
        return;
      }
      try {
        const result = await db.execute(`SELECT NOW() as now`);
        const now = Array.isArray(result) ? result[0]?.now : void 0;
        const [tpl] = await db.select().from(templates).limit(1);
        console.log(
          `DB: connected. NOW()=${now}. templates.count=${tpl ? 1 : 0}`
        );
      } catch (err) {
        console.log(`DB: connection/query failed: ${err.message}`);
      }
    })();
  });
  app.get("/api/db-health", async (_req, res) => {
    if (!db) {
      return res.status(503).json({ ok: false, message: "No db instance (likely not configured)" });
    }
    try {
      const result = await db.execute(`SELECT NOW() as now`);
      const now = Array.isArray(result) ? result[0]?.now : void 0;
      const [tpl] = await db.select().from(templates).limit(1);
      res.json({ ok: true, now, hasTemplate: !!tpl });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
})();
