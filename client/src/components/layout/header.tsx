import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import logoImage from "@assets/2408BjorkGroupFinalLogo1_Bjork Group Black Square BHHS_1753648666870.png";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Bjork Group" 
              className="h-20 w-auto drop-shadow-sm"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => {
              if ('dropdown' in item && item.dropdown) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-soft-black hover:text-bjork-blue transition-colors duration-300 bg-transparent border-none outline-none">
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg">
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} className="p-0">
                          <Link 
                            href={dropdownItem.href}
                            className="w-full px-3 py-2 text-soft-black hover:text-bjork-blue hover:bg-gray-50 transition-colors duration-300"
                          >
                            {dropdownItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`text-soft-black hover:text-bjork-blue transition-colors duration-300 ${
                    location === item.href ? 'text-bjork-blue font-medium' : ''
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
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
                {NAVIGATION_ITEMS.map((item) => {
                  if ('dropdown' in item && item.dropdown) {
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="text-lg font-medium text-soft-black">{item.name}</div>
                        <div className="pl-4 space-y-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => setIsOpen(false)}
                              className="block text-base text-gray-600 hover:text-bjork-blue transition-colors duration-300"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
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
                  );
                })}
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
