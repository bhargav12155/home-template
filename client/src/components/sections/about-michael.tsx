import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";
import { useAuth } from "@/context/auth";
import { TEMPLATE_PLACEHOLDERS, getTemplateValue } from "@/lib/template-placeholders";

import White_background from "@assets/White background.jpg";

export default function AboutMichael() {
  const { user } = useAuth();
  
  // Fetch template configuration using public endpoint with user parameter
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template/public", user?.id],
    queryFn: () => 
      fetch(`/api/template/public?user=${user?.id || 3}`)
        .then(res => res.json()),
    enabled: !!user?.id,
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src={getTemplateValue(template?.agentImageUrl, TEMPLATE_PLACEHOLDERS.agentImageUrl)}
              alt={`${getTemplateValue(template?.agentName, TEMPLATE_PLACEHOLDERS.agentName)}, Luxury Real Estate Agent`}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                console.error("Agent image loading error:", e);
                // Fallback to placeholder if agent image fails
                e.currentTarget.src = TEMPLATE_PLACEHOLDERS.agentImageUrl;
              }}
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-6">
              Meet <span className="text-bjork-beige">{getTemplateValue(template?.agentName, TEMPLATE_PLACEHOLDERS.agentName)}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              At {getTemplateValue(template?.companyName, TEMPLATE_PLACEHOLDERS.companyName)}, {getTemplateValue(template?.companyDescription, TEMPLATE_PLACEHOLDERS.companyDescription)}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With {getTemplateValue(template?.companyName, TEMPLATE_PLACEHOLDERS.companyName)}, luxury means going beyond expectations to create a friendly, personal experience that transforms the way you buy and sell real estate.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-bjork-black mb-2">{getTemplateValue(template?.homesSold, TEMPLATE_PLACEHOLDERS.homesSold)}+</div>
                <div className="text-sm text-gray-600">Homes Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-bjork-black mb-2">{getTemplateValue(template?.totalSalesVolume, TEMPLATE_PLACEHOLDERS.totalSalesVolume)}</div>
                <div className="text-sm text-gray-600">Total Sales Volume</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href="/contact">
                <Button className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                  Schedule Consultation
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-bjork-black text-bjork-black hover:bg-bjork-black hover:text-white transition-colors duration-300">
                  View Testimonials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
