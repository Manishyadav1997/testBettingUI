import { Link, useLocation } from "wouter";
import { Home, Trophy, Gamepad2, Wallet, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/cricket", icon: Trophy, label: "Sports" },
    { href: "/mini-games", icon: Gamepad2, label: "Games" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/dashboard", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary-dark border-t border-gray-700 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  isActive
                    ? "text-accent-green"
                    : "text-gray-400 hover:text-accent-green"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
