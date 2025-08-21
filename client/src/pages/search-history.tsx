import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Filter, Download, Trash2, Mail, Globe, MapPin, Phone, Users } from "lucide-react";
import type { Search as SearchType } from "@shared/schema";

const getSearchIcon = (searchType: string) => {
  switch (searchType) {
    case "email":
      return Mail;
    case "domain":
      return Globe;
    case "ip":
      return MapPin;
    case "phone":
      return Phone;
    case "social":
      return Users;
    default:
      return Search;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="osint-status-badge osint-status-success">Completed</Badge>;
    case "failed":
      return <Badge className="osint-status-badge osint-status-error">Failed</Badge>;
    case "pending":
      return <Badge className="osint-status-badge osint-status-warning">Pending</Badge>;
    default:
      return <Badge className="osint-status-badge osint-status-info">{status}</Badge>;
  }
};

export default function SearchHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: searches, isLoading } = useQuery<SearchType[]>({
    queryKey: ["/api/searches"],
  });

  const deleteSearchMutation = useMutation({
    mutationFn: async (searchId: string) => {
      await apiRequest("DELETE", `/api/searches/${searchId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/searches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/searches/recent"] });
      toast({
        title: "Search deleted",
        description: "Search has been removed from history",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete",
        description: error.message || "Failed to delete search",
        variant: "destructive",
      });
    },
  });

  const handleExportHistory = () => {
    if (!searches || searches.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no searches in your history",
        variant: "destructive",
      });
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalSearches: searches.length,
      searches: searches.map(search => ({
        id: search.id,
        query: search.query,
        searchType: search.searchType,
        status: search.status,
        createdAt: search.createdAt,
        hasResults: !!search.results,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osint-search-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: "Search history has been exported successfully",
    });
  };

  const filteredSearches = searches?.filter(search => {
    const matchesSearch = search.query.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = typeFilter === "all" || search.searchType === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-800">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-auto bg-gray-800 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-50 mb-2" data-testid="page-title">
                  Search History
                </h1>
                <p className="text-gray-400" data-testid="page-description">
                  View and manage your OSINT investigation history
                </p>
              </div>
              <Button
                onClick={handleExportHistory}
                className="osint-button-primary"
                data-testid="button-export-history"
              >
                <Download className="mr-2" size={16} />
                Export History
              </Button>
            </div>

            {/* Filters */}
            <div className="osint-card p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search in history..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="osint-search-input pl-10"
                      data-testid="input-search-filter"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={16} />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40 osint-search-input" data-testid="select-type-filter">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="ip">IP Address</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="osint-card">
              {isLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-600 rounded w-48 mb-2"></div>
                            <div className="h-3 bg-gray-600 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="w-20 h-6 bg-gray-600 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredSearches.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-50 mb-2" data-testid="no-history-title">
                    No search history found
                  </h3>
                  <p className="text-gray-400" data-testid="no-history-description">
                    {searchFilter || typeFilter !== "all" 
                      ? "No searches match your current filters" 
                      : "Start performing searches to build your history"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredSearches.map((search) => {
                    const SearchIcon = getSearchIcon(search.searchType);
                    
                    return (
                      <div 
                        key={search.id} 
                        className="p-4 hover:bg-gray-800 transition-colors"
                        data-testid={`history-item-${search.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <SearchIcon className="text-white" size={18} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-50" data-testid={`search-query-${search.id}`}>
                                  {search.query}
                                </span>
                                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                                  {search.searchType.toUpperCase()}
                                </Badge>
                                {getStatusBadge(search.status)}
                              </div>
                              <p className="text-sm text-gray-400 mt-1" data-testid={`search-date-${search.id}`}>
                                {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {search.results && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                                data-testid={`button-view-results-${search.id}`}
                              >
                                View Results
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSearchMutation.mutate(search.id)}
                              disabled={deleteSearchMutation.isPending}
                              className="text-red-400 hover:text-red-300"
                              data-testid={`button-delete-${search.id}`}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Summary */}
            {filteredSearches.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm" data-testid="history-summary">
                  Showing {filteredSearches.length} of {searches?.length || 0} total searches
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
