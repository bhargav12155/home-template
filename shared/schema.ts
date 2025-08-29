import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations, sql } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  mlsId: text("mls_id").notNull().unique(),
  listingKey: text("listing_key"), // RESO Web API ListingKey
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
  standardStatus: text("standard_status"), // RESO StandardStatus
  featured: boolean("featured").default(false),
  luxury: boolean("luxury").default(false),
  images: text("images").array(),
  neighborhood: text("neighborhood"),
  schoolDistrict: text("school_district"),
  style: text("style"), // Ranch, 1.5 Story, 2 Story, Multi-level, Split Entry
  coordinates: jsonb("coordinates"), // {lat: number, lng: number}
  features: text("features").array(),
  architecturalStyle: text("architectural_style"), // Primary style (Modern, Farmhouse, etc.)
  secondaryStyle: text("secondary_style"), // Secondary style if mixed
  styleConfidence: decimal("style_confidence", { precision: 3, scale: 2 }), // AI confidence score
  styleFeatures: text("style_features").array(), // Style-specific features
  styleAnalyzed: boolean("style_analyzed").default(false), // Whether AI analysis completed
  // IDX/RESO specific fields
  listingAgentKey: text("listing_agent_key"),
  listingOfficeName: text("listing_office_name"),
  listingContractDate: timestamp("listing_contract_date"),
  daysOnMarket: integer("days_on_market"),
  originalListPrice: decimal("original_list_price", {
    precision: 12,
    scale: 2,
  }),
  mlsStatus: text("mls_status"), // MLS-specific status
  modificationTimestamp: timestamp("modification_timestamp"),
  photoCount: integer("photo_count"),
  virtualTourUrl: text("virtual_tour_url"),
  isIdxListing: boolean("is_idx_listing").default(false), // Flag for IDX vs manual listings
  idxSyncedAt: timestamp("idx_synced_at"), // Last sync timestamp
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  propertyCount: integer("property_count").default(0),
  averagePrice: decimal("average_price", { precision: 12, scale: 2 }),
  highlights: text("highlights").array(),
});

export const blogPosts = pgTable("blog_posts", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  propertyAddress: text("property_address"),
  interest: text("interest"), // buying, selling, both, investment
  message: text("message"),
  source: text("source").default("website"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trackingCodes = pgTable("tracking_codes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  type: text("type").notNull(), // pixel, script, meta
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketStats = pgTable("market_stats", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  avgPrice: decimal("avg_price", { precision: 12, scale: 2 }),
  medianPrice: decimal("median_price", { precision: 12, scale: 2 }),
  totalListings: integer("total_listings"),
  avgDaysOnMarket: integer("avg_days_on_market"),
  soldProperties: integer("sold_properties"),
  area: text("area").notNull().default("omaha"),
});

// IDX Agents table for MLS agent data
export const idxAgents = pgTable("idx_agents", {
  id: serial("id").primaryKey(),
  memberKey: text("member_key").notNull().unique(), // RESO MemberKey
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// IDX Media table for property photos and media
export const idxMedia = pgTable("idx_media", {
  id: serial("id").primaryKey(),
  mediaKey: text("media_key").notNull().unique(), // RESO MediaKey
  listingKey: text("listing_key").notNull(), // Foreign key to property
  mlsId: text("mls_id").notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull(), // Photo, VirtualTour, Video, etc.
  mediaObjectId: text("media_object_id"),
  shortDescription: text("short_description"),
  longDescription: text("long_description"),
  sequence: integer("sequence").default(0), // Order of media
  modificationTimestamp: timestamp("modification_timestamp"),
  createdAt: timestamp("created_at").defaultNow(),
});

// IDX Sync Log table to track synchronization
export const idxSyncLog = pgTable("idx_sync_log", {
  id: serial("id").primaryKey(),
  syncType: text("sync_type").notNull(), // properties, agents, media
  status: text("status").notNull(), // success, error, in_progress
  recordsProcessed: integer("records_processed").default(0),
  recordsUpdated: integer("records_updated").default(0),
  recordsCreated: integer("records_created").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertTrackingCodeSchema = createInsertSchema(trackingCodes).omit({
  id: true,
  createdAt: true,
});

export const insertMarketStatsSchema = createInsertSchema(marketStats).omit({
  id: true,
});

export const insertIdxAgentSchema = createInsertSchema(idxAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIdxMediaSchema = createInsertSchema(idxMedia).omit({
  id: true,
  createdAt: true,
});

export const insertIdxSyncLogSchema = createInsertSchema(idxSyncLog).omit({
  id: true,
});

// Contact form schema
export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  propertyAddress: z.string().optional(),
  interest: z.enum(["buying", "selling", "both", "investment"]).optional(),
  message: z.string().min(10, "Please provide more details about your goals"),
});

// Property search schema
export const propertySearchSchema = z.object({
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
  luxury: z
    .union([z.boolean(), z.string().transform((s) => s === "true")])
    .optional(),
  featured: z
    .union([z.boolean(), z.string().transform((s) => s === "true")])
    .optional(),
  architecturalStyle: z.string().optional(),
  // Extended for Paragon external queries
  status: z.enum(["Active", "Closed", "Both"]).optional(),
  days: z.coerce.number().optional(), // recent closed window in days
  limit: z.coerce.number().optional(), // max records to fetch
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communities.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertTrackingCode = z.infer<typeof insertTrackingCodeSchema>;
export type TrackingCode = typeof trackingCodes.$inferSelect;

export type InsertMarketStats = z.infer<typeof insertMarketStatsSchema>;
export type MarketStats = typeof marketStats.$inferSelect;

export type InsertIdxAgent = z.infer<typeof insertIdxAgentSchema>;
export type IdxAgent = typeof idxAgents.$inferSelect;

export type InsertIdxMedia = z.infer<typeof insertIdxMediaSchema>;
export type IdxMedia = typeof idxMedia.$inferSelect;

export type InsertIdxSyncLog = z.infer<typeof insertIdxSyncLogSchema>;
export type IdxSyncLog = typeof idxSyncLog.$inferSelect;

export type ContactForm = z.infer<typeof contactFormSchema>;

// Template system for multi-tenant customization
export const templates = pgTable("templates", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  // User ownership
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Company Information
  companyName: text("company_name")
    .notNull()
    .default("Your Real Estate Company"),
  agentName: text("agent_name").notNull().default("Your Name"),
  agentTitle: text("agent_title").default("Principal Broker"),
  agentEmail: text("agent_email"),

  // Contact Information
  phone: text("phone"),
  address: jsonb("address").default({
    street: "123 Main Street",
    city: "Your City",
    state: "Your State",
    zip: "12345",
  }),

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
  serviceAreas: text("service_areas")
    .array()
    .default(["Your Primary City", "Your Secondary City"]),

  // Brand Colors (HSL format)
  primaryColor: text("primary_color").default("hsl(20, 14.3%, 4.1%)"), // bjork-black
  accentColor: text("accent_color").default("hsl(213, 100%, 45%)"), // bjork-blue
  beigeColor: text("beige_color").default("hsl(25, 35%, 75%)"), // bjork-beige

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
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Template media files
export const templateMedia = pgTable("template_media", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").references(() => templates.id, {
    onDelete: "cascade",
  }),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // image, video, document
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  category: text("category"), // logo, hero, agent, property, testimonial

  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Template relations
export const templateRelations = relations(templates, ({ many }) => ({
  media: many(templateMedia),
}));

export const templateMediaRelations = relations(templateMedia, ({ one }) => ({
  template: one(templates, {
    fields: [templateMedia.templateId],
    references: [templates.id],
  }),
}));

// Template schemas
export const insertTemplateSchema = createInsertSchema(templates);
export const templateSchema = createInsertSchema(templates);
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export const insertTemplateMediaSchema = createInsertSchema(templateMedia);
export type TemplateMedia = typeof templateMedia.$inferSelect;
export type InsertTemplateMedia = z.infer<typeof insertTemplateMediaSchema>;
export type PropertySearch = z.infer<typeof propertySearchSchema>;

// RESO Web API specific types
export interface ResoProperty {
  ListingKey: string;
  ListingId: string;
  MlsStatus: string;
  StandardStatus: string;
  ListPrice: number;
  OriginalListPrice?: number;
  DaysOnMarket?: number;
  ListingContractDate?: string;
  ModificationTimestamp: string;
  StreetNumber?: string;
  StreetName?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  YearBuilt?: number;
  PropertyType?: string;
  PropertySubType?: string;
  ListAgentKey?: string;
  ListOfficeName?: string;
  PhotoCount?: number;
  VirtualTourURLUnbranded?: string;
  PublicRemarks?: string;
  PrivateRemarks?: string;
  Latitude?: number;
  Longitude?: number;
}

export interface ResoAgent {
  MemberKey: string;
  MemberMlsId: string;
  MemberFirstName: string;
  MemberLastName: string;
  MemberEmail?: string;
  MemberPhoneNumber?: string;
  MemberStateLicense?: string;
  OfficeKey?: string;
  OfficeName?: string;
  MemberStatus?: string;
  ModificationTimestamp: string;
}

export interface ResoMedia {
  MediaKey: string;
  MediaObjectID: string;
  ResourceRecordKey: string; // ListingKey
  MediaURL: string;
  MediaType: string;
  ShortDescription?: string;
  LongDescription?: string;
  Order?: number;
  ModificationTimestamp: string;
}

export interface IdxSearchParams {
  city?: string;
  state?: string;
  zipCode?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  status?: string[];
  limit?: number;
  offset?: number;
}
