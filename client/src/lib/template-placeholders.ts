// Placeholder content for new users who haven't customized their template yet
export const TEMPLATE_PLACEHOLDERS = {
  // Company Information
  companyName: "Your Real Estate Company",
  agentName: "Your Name",
  agentTitle: "Principal Broker",
  agentEmail: "your-email@company.com",

  // Hero Section
  heroTitle: "Ready to Find Your Dream Home?",
  heroSubtitle:
    "Let's start your luxury real estate journey today. Our team is here to make your home buying or selling experience exceptional.",

  // Contact Information
  contactPhone: "(555) 123-4567",
  contactPhoneText: "Call or text anytime",
  officeAddress: "123 Main Street",
  officeCity: "Your City",
  officeState: "Your State",
  officeZip: "12345",

  // Company Description & Bio
  companyDescription:
    "We believe that luxury is not a price point but an experience. Our commitment to delivering unparalleled service, attention to detail, and a personalized approach ensures that every client feels like a priority.",
  agentBio:
    "Professional real estate agent with years of experience helping clients achieve their real estate goals. Dedicated to providing exceptional service and expertise in the local market.",

  // Statistics
  homesSold: 100,
  totalSalesVolume: "$50M+",
  yearsExperience: 10,
  clientSatisfaction: "99%",

  // Service Areas
  serviceAreas: [
    "Your Primary City",
    "Your Secondary City",
    "Surrounding Areas",
  ],

  // Placeholder Images (using professional real estate stock images)
  heroImageUrl:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  agentImageUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  logoUrl:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",

  // Default Colors
  primaryColor: "hsl(20, 14.3%, 4.1%)",
  accentColor: "hsl(213, 100%, 45%)",
  beigeColor: "hsl(25, 35%, 75%)",
};

// Helper function to get template value with fallback
export const getTemplateValue = <T>(
  templateValue: T | null | undefined,
  placeholderValue: T
): T => {
  return templateValue != null && templateValue !== ""
    ? templateValue
    : placeholderValue;
};

// Helper function to check if template has custom content
export const hasCustomContent = (template: any) => {
  if (!template) return false;

  // Check if user has uploaded any custom images
  const hasCustomImages =
    template.agentImageUrl && !template.agentImageUrl.includes("unsplash.com");

  // Check if user has customized basic info
  const hasCustomInfo =
    template.companyName !== TEMPLATE_PLACEHOLDERS.companyName &&
    template.agentName !== TEMPLATE_PLACEHOLDERS.agentName;

  return hasCustomImages || hasCustomInfo;
};
