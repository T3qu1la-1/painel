import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentActivity from "@/components/dashboard/recent-activity";
import SearchForm from "@/components/search/search-form";
import ResultsDisplay from "@/components/search/results-display";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Search } from "@shared/schema";

const searchTabs = [
  { id: "email", label: "Email", active: true },
  { id: "domain", label: "Domain", active: false },
  { id: "ip", label: "IP", active: false },
  { id: "phone", label: "Phone", active: false },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"email" | "domain" | "ip" | "phone">("email");
  const [currentSearch, setCurrentSearch] = useState<Search | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchComplete = (result: Search) => {
    setCurrentSearch(result);
    setIsSearching(false);
  };

  const handleGlobalSearch = (query: string) => {
    // Detect search type based on query pattern
    let detectedType: "email" | "domain" | "ip" | "phone" = "email";
    
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query)) {
      detectedType = "email";
    } else if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query)) {
      detectedType = "ip";
    } else if (/^\+?[1-9]\d{1,14}$/.test(query.replace(/[-\s\(\)]/g, ""))) {
      detectedType = "phone";
    } else if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(query)) {
      detectedType = "domain";
    }
    
    setActiveTab(detectedType);
    setIsSearching(true);
    
    // Auto-fill the search form
    const searchInput = document.querySelector(`[data-testid="input-${detectedType}-query"]`) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = query;
      // Trigger form submission
      const form = searchInput.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-800">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onGlobalSearch={handleGlobalSearch} />
        
        <main className="flex-1 overflow-auto bg-gray-800 p-4 md:p-6">
          {/* Dashboard Stats */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              {/* Search Interface */}
              <div className="mb-6">
                {/* Search Type Tabs */}
                <div className="flex space-x-2 mb-4">
                  {searchTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      variant={activeTab === tab.id ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                      )}
                      data-testid={`tab-${tab.id}`}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                <SearchForm
                  searchType={activeTab}
                  onSearchComplete={handleSearchComplete}
                />
              </div>

              {/* Results Section */}
              <ResultsDisplay 
                search={currentSearch} 
                isLoading={isSearching}
              />
            </div>

            {/* Recent Activity Sidebar */}
            <div>
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
