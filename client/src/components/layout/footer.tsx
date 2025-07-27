import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import logoImage from "@assets/2408BjorkGroupFinalLogo1_Bjork Group Black Square BHHS_1753648666870.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="Bjork Group" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Nebraska's premier luxury real estate team, delivering exceptional service and unparalleled results in Omaha, Lincoln, and surrounding communities.
            </p>
            <div className="flex space-x-4">
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-bjork-beige text-white p-2 rounded-full hover:bg-bjork-blue transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={SOCIAL_LINKS.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-bjork-beige text-white p-2 rounded-full hover:bg-bjork-blue transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={SOCIAL_LINKS.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-bjork-beige text-white p-2 rounded-full hover:bg-bjork-blue transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-bjork-beige text-white p-2 rounded-full hover:bg-bjork-blue transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-medium text-bjork-black mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/search" className="hover:text-bjork-blue transition-colors duration-300">Search Homes</Link></li>
              <li><Link href="/search?luxury=true" className="hover:text-bjork-blue transition-colors duration-300">Luxury Listings</Link></li>
              <li><Link href="/communities" className="hover:text-bjork-blue transition-colors duration-300">Communities</Link></li>
              <li><Link href="/blog" className="hover:text-bjork-blue transition-colors duration-300">Market Reports</Link></li>
              <li><Link href="/about" className="hover:text-bjork-blue transition-colors duration-300">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-medium text-bjork-black mb-4">Services</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/buyers" className="hover:text-bjork-blue transition-colors duration-300">Buyer Representation</Link></li>
              <li><Link href="/sellers" className="hover:text-bjork-blue transition-colors duration-300">Seller Services</Link></li>
              <li><Link href="/valuation" className="hover:text-bjork-blue transition-colors duration-300">Property Valuation</Link></li>
              <li><Link href="/investment" className="hover:text-bjork-blue transition-colors duration-300">Investment Properties</Link></li>
              <li><Link href="/relocation" className="hover:text-bjork-blue transition-colors duration-300">Relocation Services</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-gray-600 mb-4 md:mb-0">
              <p>&copy; 2025 Bjork Group Real Estate. All rights reserved.</p>
              <p className="text-sm mt-1">{CONTACT_INFO.brokerage}</p>
            </div>
            <div className="text-center md:text-right text-gray-600">
              <p className="text-sm">
                MLS data courtesy of Great Plains REALTORS® Multiple Listing Service, Inc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
