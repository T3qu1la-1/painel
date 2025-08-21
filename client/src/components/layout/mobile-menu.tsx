import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Mail,
  Globe,
  MapPin,
  Users,
  Phone,
  History,
  Bookmark,
  Download
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Email Lookup", path: "/email-lookup", icon: Mail },
  { name: "Domain Analysis", path: "/domain-analysis", icon: Globe },
  { name: "IP Geolocation", path: "/ip-geolocation", icon: MapPin },
  { name: "Social Media", path: "/social-media", icon: Users },
  { name: "Phone Lookup", path: "/phone-lookup", icon: Phone },
];

const utilityItems = [
  { name: "Search History", path: "/search-history", icon: History },
  { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
  { name: "Export Data", path: "/export", icon: Download },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-75" data-testid="mobile-menu-overlay">
      <div className="w-64 bg-gray-900 h-full border-r border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-50">OSINT Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-50"
            data-testid="button-close-mobile-menu"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={cn(
                      "osint-nav-item cursor-pointer",
                      isActive ? "osint-nav-item-active" : "osint-nav-item-inactive"
                    )}
                    onClick={onClose}
                    data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-700">
            <div className="space-y-1">
              {utilityItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <div 
                      className={cn(
                        "osint-nav-item cursor-pointer",
                        isActive ? "osint-nav-item-active" : "osint-nav-item-inactive"
                      )}
                      onClick={onClose}
                      data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="text-gray-300" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-50" data-testid="mobile-user-name">Investigator</p>
              <p className="text-xs text-gray-400" data-testid="mobile-user-role">OSINT Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
