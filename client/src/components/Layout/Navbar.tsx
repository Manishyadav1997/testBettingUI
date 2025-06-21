import { Bell, User, Wallet, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { useNavigation } from "@/utils/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { createPath, isActive, navigate } = useNavigation();
  const { user, balance, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cricket", label: "Cricket" },
    { href: "/aviator", label: "Aviator" },
    { href: "/color-game", label: "Color Game" },
    { href: "/mini-games", label: "Mini Games" },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={`bg-secondary-dark border-b border-gray-700 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-0'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <a 
              href={createPath("/")} 
              className="text-xl md:text-2xl font-bold text-accent-green cursor-pointer whitespace-nowrap"
              onClick={(e) => handleNavClick(e, "/")}
            >
              BetPro
            </a>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="hidden md:flex space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={createPath(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-1 py-2 text-sm lg:text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-accent-green"
                      : "text-gray-300 hover:text-accent-green"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="glass-morphism px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
              <span className="text-xs md:text-sm text-gray-300">Balance:</span>
              <span className="text-accent-green font-semibold ml-1 text-sm md:text-base">
                ₹{balance.toLocaleString()}
              </span>
            </div>
            
            <a href={createPath("/wallet")} className="block">
              <Button className="gradient-accent text-primary-dark hover:opacity-90 text-xs md:text-sm h-9 md:h-10 px-3 md:px-4">
                <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                <span className="hidden sm:inline">Deposit</span>
              </Button>
            </a>

            <button
              className="relative text-gray-300 hover:text-white p-1"
              onClick={() => showToast("3 new notifications", "info")}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <Badge className="absolute -top-0.5 -right-0.5 bg-danger-red text-white text-[10px] h-4 w-4 md:h-5 md:w-5 rounded-full flex items-center justify-center p-0">
                <span className="mt-px">3</span>
              </Badge>
            </button>

            <a href={createPath("/dashboard")} className="block">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-accent-green rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-dark" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={createPath(link.href)}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-gray-800 text-accent-green'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile User Actions */}
          <div className="pt-4 border-t border-gray-700 mt-2">
            <div className="flex items-center px-3 py-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-dark" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-white">
                  {user?.username || 'Guest'}
                </div>
                <div className="text-xs text-gray-300">
                  Balance: <span className="text-accent-green font-medium">₹{balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              <a
                href={createPath("/wallet")}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={(e) => handleNavClick(e, "/wallet")}
              >
                Wallet & Deposits
              </a>
              <a
                href={createPath("/dashboard")}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={(e) => handleNavClick(e, "/dashboard")}
              >
                My Account
              </a>
              <button
                onClick={() => showToast("3 new notifications", "info")}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
              >
                <Bell className="w-5 h-5 mr-2" />
                Notifications
                <Badge className="ml-auto bg-danger-red text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  3
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
