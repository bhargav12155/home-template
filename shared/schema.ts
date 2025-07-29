import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  mlsId: text("mls_id").notNull().unique(),
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
  featured: boolean("featured").default(false),
  luxury: boolean("luxury").default(false),
  images: text("images").array(),
  neighborhood: text("neighborhood"),
  schoolDistrict: text("school_district"),
  coordinates: jsonb("coordinates"), // {lat: number, lng: number}
  features: text("features").array(),
  architecturalStyle: text("architectural_style"), // Primary style (Modern, Farmhouse, etc.)
  secondaryStyle: text("secondary_style"), // Secondary style if mixed
  styleConfidence: decimal("style_confidence", { precision: 3, scale: 2 }), // AI confidence score
  styleFeatures: text("style_features").array(), // Style-specific features
  styleAnalyzed: boolean("style_analyzed").default(false), // Whether AI analysis completed
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
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  propertyType: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  schoolDistrict: z.string().optional(),
  luxury: z.boolean().optional(),
  featured: z.boolean().optional(),
  architecturalStyle: z.string().optional(),
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

export type ContactForm = z.infer<typeof contactFormSchema>;
export type PropertySearch = z.infer<typeof propertySearchSchema>;
