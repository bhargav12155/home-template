import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/sections/hero";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useParams } from "wouter";

interface AgentTemplate {
  id: string;
  companyName: string;
  agentName: string;
  agentTitle: string;
  agentEmail: string;
  companyDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactPhoneText: string;
  officeAddress: string;
  officeCity: string;
  officeState: string;
  officeZip: string;
  homesSold: number;
  totalSalesVolume: string;
  yearsExperience: number;
  serviceAreas: string[];
  logoUrl?: string;
  heroVideoUrl?: string;
  agentImageUrl?: string;
  agent: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    customSlug: string;
    fullName: string;
  };
}

export default function AgentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);

  // Fetch agent template by slug
  const { data: template, error, isError } = useQuery<AgentTemplate>({
    queryKey: ["/api/agent", slug, "template"],
    queryFn: async () => {
      const response = await fetch(`/api/agent/${slug}/template`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Agent not found");
        }
        throw new Error("Failed to load agent template");
      }
      return response.json();
    },
    enabled: !!slug,
    retry: 1,
  });

  useEffect(() => {
    setIsLoading(!template && !isError);
  }, [template, isError]);

  // Update document title based on agent
  useEffect(() => {
    if (template) {
      document.title = `${template.agentName} - ${template.companyName}`;
    }
  }, [template]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200"></div>
          <div className="h-screen bg-gray-300"></div>
        </div>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error?.message || "The real estate agent you're looking for doesn't exist or is not available."}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Looking for:</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">/{slug}</code>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Header with Agent Branding */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              {template.logoUrl ? (
                <img 
                  src={template.logoUrl} 
                  alt={template.companyName} 
                  className="h-20 w-auto drop-shadow-sm"
                />
              ) : (
                <div className="h-20 w-32 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">
                    {template.companyName}
                  </span>
                </div>
              )}
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-soft-black hover:text-blue-600 transition-colors">
                About {template.agent.firstName}
              </a>
              <a href="#properties" className="text-soft-black hover:text-blue-600 transition-colors">
                Properties
              </a>
              <a href="#contact" className="text-soft-black hover:text-blue-600 transition-colors">
                Contact
              </a>
              <a 
                href={`tel:${template.contactPhone}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {template.contactPhone}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Agent's Custom Content */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          {template.heroVideoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ filter: 'none' }}
            >
              <source src={template.heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-600"></div>
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pt-16">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
              {template.heroTitle || `${template.agent.firstName}'s Real Estate`}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed">
              {template.heroSubtitle || template.companyDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#properties"
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg"
              >
                View Properties
              </a>
              <a 
                href="#contact"
                className="border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-blue-900 transition-colors text-lg"
              >
                Contact {template.agent.firstName}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Info Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Meet {template.agent.fullName}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {template.companyDescription}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{template.homesSold || 0}</div>
                  <div className="text-sm text-gray-500">Homes Sold</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{template.totalSalesVolume || "$0"}</div>
                  <div className="text-sm text-gray-500">Sales Volume</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{template.yearsExperience || 0}+</div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{template.serviceAreas?.length || 0}</div>
                  <div className="text-sm text-gray-500">Service Areas</div>
                </div>
              </div>

              {template.serviceAreas && template.serviceAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {template.serviceAreas.map((area, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              {template.agentImageUrl ? (
                <img 
                  src={template.agentImageUrl}
                  alt={template.agent.fullName}
                  className="w-64 h-64 rounded-full mx-auto object-cover shadow-lg"
                />
              ) : (
                <div className="w-64 h-64 rounded-full mx-auto bg-gray-200 flex items-center justify-center shadow-lg">
                  <span className="text-gray-500 text-lg">
                    {template.agent.firstName?.[0]}{template.agent.lastName?.[0]}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                {template.agent.fullName}
              </h3>
              <p className="text-gray-600">{template.agentTitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to Work with {template.agent.firstName}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {template.contactPhone && (
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Call/Text</h3>
                <a 
                  href={`tel:${template.contactPhone}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {template.contactPhone}
                </a>
                {template.contactPhoneText && (
                  <p className="text-sm text-gray-500 mt-1">{template.contactPhoneText}</p>
                )}
              </div>
            )}
            
            {template.agentEmail && (
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <a 
                  href={`mailto:${template.agentEmail}`}
                  className="text-blue-600 hover:text-blue-700 font-medium break-all"
                >
                  {template.agentEmail}
                </a>
              </div>
            )}
            
            {(template.officeAddress || template.officeCity) && (
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Office</h3>
                <div className="text-gray-600 text-sm">
                  {template.officeAddress && <div>{template.officeAddress}</div>}
                  {template.officeCity && (
                    <div>
                      {template.officeCity}, {template.officeState} {template.officeZip}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 {template.companyName}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Powered by {template.agent.fullName} • {window.location.hostname}/agent/{template.agent.customSlug}
          </p>
        </div>
      </footer>
    </div>
  );
}
