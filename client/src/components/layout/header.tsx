import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import logoImage from "@assets/2408BjorkGroupFinalLogo1_Bjork Group Black_1753648529804.png";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Bjork Group" 
              className="h-12 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`text-soft-black hover:text-bjork-blue transition-colors duration-300 ${
                  location === item.href ? 'text-bjork-blue font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-8">
                <div className="flex items-center">
                  <img 
                    src={logoImage} 
                    alt="Bjork Group" 
                    className="h-10 w-auto"
                  />
                </div>
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg text-soft-black hover:text-bjork-blue transition-colors duration-300 ${
                      location === item.href ? 'text-bjork-blue font-medium' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-bjork-black text-white hover:bg-bjork-blue transition-colors duration-300">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
