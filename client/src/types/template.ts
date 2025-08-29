export interface Template {
  id?: number;
  companyName?: string;
  agentName?: string;
  agentTitle?: string;
  agentEmail?: string;
  companyDescription?: string;

  // Hero section fields
  heroTitle?: string;
  heroSubtitle?: string;

  // Contact information fields
  contactPhone?: string;
  contactPhoneText?: string;
  officeAddress?: string;
  officeCity?: string;
  officeState?: string;
  officeZip?: string;

  homesSold?: number;
  totalSalesVolume?: string;
  serviceAreas?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
  heroVideoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
