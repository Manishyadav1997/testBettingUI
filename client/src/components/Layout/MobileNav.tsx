import { Home, Trophy, Gamepad2, Wallet, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigation } from '@/utils/navigation';
import { Badge } from '@/components/ui/badge';
import React from 'react';

// Add this to your global CSS or in your layout component:
// html { padding-bottom: 64px; } /* Height of mobile nav + some padding */

export default function MobileNav() {
  const { createPath, isActive, navigate } = useNavigation();
  const { balance } = useApp();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/cricket", icon: Trophy, label: "Sports" },
    { href: "/mini-games", icon: Gamepad2, label: "Games" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/dashboard", icon: User, label: "Profile" },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary-dark border-t border-gray-700 z-50 md:hidden shadow-lg">
      <div className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <a
              key={item.href}
              href={createPath(item.href)}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`flex-1 flex flex-col items-center py-2 px-1 sm:px-2 transition-colors ${
                active ? 'text-accent-green' : 'text-gray-300 hover:text-accent-green'
              }`}
              style={{ minWidth: '60px' }}
            >
              {item.href === '/wallet' ? (
                <div className="relative">
                  <Wallet className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 bg-accent-green text-primary-dark text-xs h-4 w-4 rounded-full flex items-center justify-center p-0 text-[10px]">
                    {Math.floor(balance / 1000)}K
                  </Badge>
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-[10px] xs:text-xs mt-1 text-center px-1">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
