import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { templates } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface TemplateRequest extends Request {
  template?: {
    id: string;
    companyName: string;
    agentName: string;
    subdomain?: string;
    customDomain?: string;
    [key: string]: any;
  };
}

/**
 * Middleware to load template data based on subdomain or domain
 * For now, we'll use a default template or the first available template
 */
export async function loadTemplate(
  req: TemplateRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!db) {
      console.log("No database connection - using default template");
      req.template = getDefaultTemplate();
      return next();
    }

    // For now, get the first template or create a demo template
    const [existingTemplate] = await db.select().from(templates).limit(1);
    
    if (existingTemplate) {
      req.template = existingTemplate;
    } else {
      // No template exists, use default template data
      req.template = getDefaultTemplate();
    }
    
    next();
  } catch (error) {
    console.error("Template loading error:", error);
    req.template = getDefaultTemplate();
    next();
  }
}

/**
 * Default template data when no custom template is configured
 */
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
    isConfigured: false, // Flag to show "not configured" message
    isActive: true
  };
}

/**
 * Check if template is properly configured
 */
export function isTemplateConfigured(template: any): boolean {
  return template && 
         template.id !== "default" &&
         template.companyName !== "Your Real Estate Company" &&
         template.agentName !== "Your Name";
}

export { getDefaultTemplate };
