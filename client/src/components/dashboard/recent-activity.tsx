import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Mail, Globe, MapPin, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Search } from "@shared/schema";

const getSearchIcon = (searchType: string) => {
  switch (searchType) {
    case "email":
      return Mail;
    case "domain":
      return Globe;
    case "ip":
      return MapPin;
    default:
      return Mail;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "failed":
      return AlertCircle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-400";
    case "failed":
      return "text-red-400";
    default:
      return "text-yellow-400";
  }
};

const getIconColor = (searchType: string) => {
  switch (searchType) {
    case "email":
      return "bg-blue-600";
    case "domain":
      return "bg-green-600";
    case "ip":
      return "bg-red-600";
    default:
      return "bg-blue-600";
  }
};

export default function RecentActivity() {
  const { data: searches, isLoading } = useQuery<Search[]>({
    queryKey: ["/api/searches/recent"],
  });

  if (isLoading) {
    return (
      <div className="osint-card p-6">
        <h3 className="text-lg font-semibold text-gray-50 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-md animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-20"></div>
                </div>
              </div>
              <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentSearches = searches?.slice(0, 5) || [];

  return (
    <div className="osint-card p-6">
      <h3 className="text-lg font-semibold text-gray-50 mb-4" data-testid="recent-activity-title">
        Recent Activity
      </h3>
      
      {recentSearches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400" data-testid="no-recent-activity">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentSearches.map((search) => {
            const SearchIcon = getSearchIcon(search.searchType);
            const StatusIcon = getStatusIcon(search.status);
            const iconColor = getIconColor(search.searchType);
            const statusColor = getStatusColor(search.status);
            
            return (
              <div 
                key={search.id} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-md"
                data-testid={`recent-search-${search.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center`}>
                    <SearchIcon className="text-white" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-50" data-testid={`search-query-${search.id}`}>
                      {search.query}
                    </p>
                    <p className="text-xs text-gray-400" data-testid={`search-time-${search.id}`}>
                      {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <StatusIcon className={statusColor} size={16} data-testid={`search-status-${search.id}`} />
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="ghost"
        className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium"
        data-testid="button-view-all-history"
      >
        View All History
      </Button>
    </div>
  );
}
