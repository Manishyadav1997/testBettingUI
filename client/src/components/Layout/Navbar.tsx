import { useLocation } from "wouter";
import { Bell, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { Link } from "@/App";

export default function Navbar() {
  const [location] = useLocation();
  const { user, balance, showToast } = useApp();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cricket", label: "Cricket" },
    { href: "/aviator", label: "Aviator" },
    { href: "/color-game", label: "Color Game" },
    { href: "/mini-games", label: "Mini Games" },
  ];

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    const currentPath = location.replace(/^\/testBettingUI/, '');
    return currentPath === href || (href !== '/' && currentPath.startsWith(href));
  };

  return (
    <nav className="bg-secondary-dark border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-accent-green cursor-pointer">
              BetPro
            </Link>
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? "text-accent-green"
                      : "text-gray-300 hover:text-accent-green"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="glass-morphism px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-300">Balance:</span>
              <span className="text-accent-green font-semibold ml-1">
                ₹{balance.toLocaleString()}
              </span>
            </div>
            
            <Link to="/wallet" className="block">
              <Button className="gradient-accent text-primary-dark hover:opacity-90">
                <Wallet className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </Link>

            <button
              className="relative text-gray-300 hover:text-white"
              onClick={() => showToast("3 new notifications", "info")}
            >
              <Bell className="w-6 h-6" />
              <Badge className="absolute -top-1 -right-1 bg-danger-red text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                3
              </Badge>
            </button>

            <Link to="/dashboard" className="block">
              <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
                <User className="w-4 h-4 text-primary-dark" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
