import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home,
  Mail,
  Globe,
  MapPin,
  Users,
  Phone,
  History,
  Bookmark,
  Download,
  Search,
  User
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

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-700">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-50">OSINT Panel</span>
          </div>
        </div>

        {/* Navigation Menu */}
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
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                      data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
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
              <p className="text-sm font-medium text-gray-50" data-testid="user-name">Investigator</p>
              <p className="text-xs text-gray-400" data-testid="user-role">OSINT Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
