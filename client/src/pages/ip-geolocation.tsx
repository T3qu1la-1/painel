import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import SearchForm from "@/components/search/search-form";
import ResultsDisplay from "@/components/search/results-display";
import type { Search } from "@shared/schema";

export default function IPGeolocation() {
  const [currentSearch, setCurrentSearch] = useState<Search | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchComplete = (result: Search) => {
    setCurrentSearch(result);
    setIsSearching(false);
  };

  const handleGlobalSearch = (query: string) => {
    setIsSearching(true);
    // Auto-fill the search form
    const searchInput = document.querySelector('[data-testid="input-ip-query"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = query;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-800">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onGlobalSearch={handleGlobalSearch} />
        
        <main className="flex-1 overflow-auto bg-gray-800 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-50 mb-2">IP Geolocation</h1>
              <p className="text-gray-400">
                Identify geographic location and network information for IP addresses
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <SearchForm
                  searchType="ip"
                  onSearchComplete={handleSearchComplete}
                />
              </div>

              <div>
                <ResultsDisplay 
                  search={currentSearch} 
                  isLoading={isSearching}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
