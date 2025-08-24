import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/template";

import White_background from "@assets/White background.jpg";

export default function AboutMichael() {
  // Fetch template configuration
  const { data: template } = useQuery<Template>({
    queryKey: ["/api/template"],
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src={White_background}
              alt={`${template?.agentName || 'Michael Bjork'}, Luxury Real Estate Agent`}
              className="w-full h-96 object-contain rounded-lg shadow-lg bg-white"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-light text-bjork-black mb-6">
              Meet <span className="text-bjork-beige">{template?.agentName || 'Michael Bjork'}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              At {template?.companyName || 'Bjork Group Real Estate'}, we believe that luxury is not a price point but an experience. Our commitment to delivering unparalleled service, attention to detail, and a personalized approach ensures that every client feels like a priority, no matter their budget.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With {template?.companyName || 'Bjork Group'}, luxury means going beyond expectations to create a friendly, personal experience that transforms the way you buy and sell real estate in Nebraska.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-bjork-black mb-2">{template?.homesSold || 500}+</div>
                <div className="text-sm text-gray-600">Homes Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-bjork-black mb-2">{template?.totalSalesVolume || '$200M+'}</div>
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
