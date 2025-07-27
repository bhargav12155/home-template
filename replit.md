# Nebraska Real Estate Website - Bjork Group

## Overview

This is a full-stack real estate application built for Bjork Group, a luxury real estate team in Nebraska. The application features a modern frontend with property listings, community showcases, blog functionality, and comprehensive admin capabilities. It's built with React/TypeScript on the frontend, Express.js on the backend, and uses PostgreSQL with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom brand colors and design system
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Structure**: RESTful API with dedicated routes for properties, communities, blog posts, leads, and contact forms
- **Schema Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Express sessions with PostgreSQL store

### Key Components

#### Database Schema
- **Properties**: Core real estate listings with MLS integration, pricing, location, features
- **Communities**: Geographic areas/neighborhoods with descriptions and statistics
- **Blog Posts**: Content management for market insights and company news
- **Leads**: Customer inquiry tracking and management
- **Users**: Admin user management
- **Tracking Codes**: Marketing analytics and conversion tracking
- **Market Stats**: Real estate market data and trends

#### API Endpoints
- `/api/properties` - Property search, featured listings, luxury properties
- `/api/communities` - Community information and statistics
- `/api/blog` - Blog post management and display
- `/api/contact` - Contact form submissions and lead generation
- `/api/leads` - Lead management and tracking
- `/api/tracking` - Marketing tracking code management

#### Frontend Pages
- **Home**: Hero section, featured listings, communities grid, about section
- **Search**: Advanced property search with filters and results display
- **Communities**: Community showcase and detailed information
- **About**: Team information, testimonials, and company details
- **Contact**: Contact forms and lead capture
- **Blog**: Market insights and company blog
- **Admin**: Administrative interface for content and lead management

## Data Flow

1. **Property Data**: Properties are stored with comprehensive details including MLS IDs, pricing, location, features, and images
2. **Search Flow**: Users search properties using filters, which are processed server-side and returned as filtered results
3. **Lead Generation**: Contact forms and property inquiries are captured as leads and stored for follow-up
4. **Content Management**: Blog posts and community information are managed through the admin interface
5. **Analytics**: Tracking codes can be dynamically injected for marketing analytics

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Drizzle Kit**: Database migration and schema management tool

### UI/UX Libraries
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Form Management
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

### Development Tools
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server

## Deployment Strategy

### Development
- Uses Vite dev server for hot module replacement
- TSX for running TypeScript server code directly
- Environment-based configuration for database connections

### Production
- Frontend built with Vite and served as static files
- Backend bundled with ESBuild for Node.js deployment
- Database migrations managed through Drizzle Kit
- Environment variables for database connection and configuration

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- Development/production mode switching via `NODE_ENV`
- Replit-specific integrations for development environment

The application is designed as a monorepo with shared TypeScript types and schemas between frontend and backend, ensuring type safety and consistency across the entire stack. The architecture supports both development flexibility and production scalability while maintaining a luxury brand experience for the Bjork Group real estate business.