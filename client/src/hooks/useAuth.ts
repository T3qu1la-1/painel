import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  isApproved: boolean;
  isActive: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get stored user data
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("access_token");

  // Query to fetch current user from server
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!storedToken) return null;
      return await apiRequest("/api/auth/me");
    },
    enabled: !!storedToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Initialize auth state
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  const isAuthenticated = !!user && !!storedToken;
  const isApproved = user?.isApproved ?? false;

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    queryClient.clear();
    window.location.href = "/login";
  };

  const refreshUserData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  };

  return {
    user,
    isAuthenticated,
    isApproved,
    isLoading: isLoading || !isInitialized,
    error,
    logout,
    refreshUserData,
  };
}