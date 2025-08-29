CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"image" text,
	"category" text NOT NULL,
	"author" text DEFAULT 'Michael Bjork' NOT NULL,
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"property_count" integer DEFAULT 0,
	"average_price" numeric(12, 2),
	"highlights" text[],
	CONSTRAINT "communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "idx_agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_key" text NOT NULL,
	"member_mls_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"office_name" text,
	"office_key" text,
	"state_license" text,
	"is_active" boolean DEFAULT true,
	"modification_timestamp" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "idx_agents_member_key_unique" UNIQUE("member_key"),
	CONSTRAINT "idx_agents_member_mls_id_unique" UNIQUE("member_mls_id")
);
--> statement-breakpoint
CREATE TABLE "idx_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_key" text NOT NULL,
	"listing_key" text NOT NULL,
	"mls_id" text NOT NULL,
	"media_url" text NOT NULL,
	"media_type" text NOT NULL,
	"media_object_id" text,
	"short_description" text,
	"long_description" text,
	"sequence" integer DEFAULT 0,
	"modification_timestamp" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "idx_media_media_key_unique" UNIQUE("media_key")
);
--> statement-breakpoint
CREATE TABLE "idx_sync_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"sync_type" text NOT NULL,
	"status" text NOT NULL,
	"records_processed" integer DEFAULT 0,
	"records_updated" integer DEFAULT 0,
	"records_created" integer DEFAULT 0,
	"error_message" text,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"property_address" text,
	"interest" text,
	"message" text,
	"source" text DEFAULT 'website',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"avg_price" numeric(12, 2),
	"median_price" numeric(12, 2),
	"total_listings" integer,
	"avg_days_on_market" integer,
	"sold_properties" integer,
	"area" text DEFAULT 'omaha' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"mls_id" text NOT NULL,
	"listing_key" text,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text DEFAULT 'NE' NOT NULL,
	"zip_code" text NOT NULL,
	"beds" integer NOT NULL,
	"baths" numeric(3, 1) NOT NULL,
	"sqft" integer NOT NULL,
	"year_built" integer,
	"property_type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"standard_status" text,
	"featured" boolean DEFAULT false,
	"luxury" boolean DEFAULT false,
	"images" text[],
	"neighborhood" text,
	"school_district" text,
	"style" text,
	"coordinates" jsonb,
	"features" text[],
	"architectural_style" text,
	"secondary_style" text,
	"style_confidence" numeric(3, 2),
	"style_features" text[],
	"style_analyzed" boolean DEFAULT false,
	"listing_agent_key" text,
	"listing_office_name" text,
	"listing_contract_date" timestamp,
	"days_on_market" integer,
	"original_list_price" numeric(12, 2),
	"mls_status" text,
	"modification_timestamp" timestamp,
	"photo_count" integer,
	"virtual_tour_url" text,
	"is_idx_listing" boolean DEFAULT false,
	"idx_synced_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "properties_mls_id_unique" UNIQUE("mls_id")
);
--> statement-breakpoint
CREATE TABLE "template_media" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" varchar,
	"file_name" text NOT NULL,
	"original_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"mime_type" text,
	"category" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" text DEFAULT 'Your Real Estate Company' NOT NULL,
	"agent_name" text DEFAULT 'Your Name' NOT NULL,
	"agent_title" text DEFAULT 'Principal Broker',
	"agent_email" text,
	"phone" text,
	"address" jsonb DEFAULT '{"street":"123 Main Street","city":"Your City","state":"Your State","zip":"12345"}'::jsonb,
	"hero_title" text DEFAULT 'Ready to Find Your Dream Home?',
	"hero_subtitle" text DEFAULT 'Let''s start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.',
	"contact_phone" text DEFAULT '(402) 522-6131',
	"contact_phone_text" text DEFAULT 'Call or text anytime',
	"office_address" text DEFAULT '331 Village Pointe Plaza',
	"office_city" text DEFAULT 'Omaha',
	"office_state" text DEFAULT 'NE',
	"office_zip" text DEFAULT '68130',
	"company_description" text DEFAULT 'We believe that luxury is not a price point but an experience.',
	"agent_bio" text DEFAULT 'Professional real estate agent with years of experience.',
	"homes_sold" integer DEFAULT 500,
	"total_sales_volume" text DEFAULT '$200M+',
	"years_experience" integer DEFAULT 15,
	"client_satisfaction" text DEFAULT '98%',
	"service_areas" text[] DEFAULT '{"Your Primary City","Your Secondary City"}',
	"primary_color" text DEFAULT 'hsl(20, 14.3%, 4.1%)',
	"accent_color" text DEFAULT 'hsl(213, 100%, 45%)',
	"beige_color" text DEFAULT 'hsl(25, 35%, 75%)',
	"logo_url" text,
	"hero_image_url" text,
	"agent_image_url" text,
	"hero_video_url" text,
	"mls_id" text,
	"mls_api_key" text,
	"mls_region" text,
	"subdomain" text,
	"custom_domain" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "templates_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE "tracking_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "template_media" ADD CONSTRAINT "template_media_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;