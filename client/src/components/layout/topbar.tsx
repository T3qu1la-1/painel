import { useState } from "react";
import { Menu, Search, Bell, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileMenu from "./mobile-menu";

interface TopBarProps {
  onGlobalSearch?: (query: string) => void;
}

export default function TopBar({ onGlobalSearch }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalQuery.trim() && onGlobalSearch) {
      onGlobalSearch(globalQuery.trim());
    }
  };

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-700 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu size={20} />
          </Button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleGlobalSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={16} />
              </div>
              <Input
                type="text"
                placeholder="Enter email, domain, IP address..."
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                className="osint-search-input pl-10"
                data-testid="input-global-search"
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-800 relative"
              data-testid="button-notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-800"
              data-testid="button-settings"
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}
