import { useQuery } from "@tanstack/react-query";
import { Search, CheckCircle, Bookmark, Coins } from "lucide-react";
import type { Stats } from "@shared/schema";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="osint-stat-card animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Searches",
      value: stats?.todaySearches || "0",
      icon: Search,
      bgColor: "bg-blue-600",
      testId: "stat-today-searches"
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || "0"}%`,
      icon: CheckCircle,
      bgColor: "bg-green-600",
      testId: "stat-success-rate"
    },
    {
      title: "Bookmarks",
      value: stats?.totalBookmarks || "0",
      icon: Bookmark,
      bgColor: "bg-yellow-600",
      testId: "stat-bookmarks"
    },
    {
      title: "API Credits",
      value: stats?.apiCredits || "0",
      icon: Coins,
      bgColor: "bg-purple-600",
      testId: "stat-api-credits"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="osint-stat-card" data-testid={stat.testId}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-50" data-testid={`${stat.testId}-value`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className="text-white" size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
