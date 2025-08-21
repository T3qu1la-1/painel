import { apiRequest } from "./queryClient";

export interface OSINTResult {
  id: string;
  searchType: string;
  query: string;
  status: 'pending' | 'completed' | 'failed';
  results: any;
  createdAt: string;
}

// Email OSINT Service
export async function searchEmail(email: string): Promise<OSINTResult> {
  try {
    const response = await apiRequest("/api/osint/email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response;
  } catch (error) {
    throw new Error(`Email search failed: ${error.message}`);
  }
}

// Domain Analysis Service
export async function analyzeDomain(domain: string): Promise<OSINTResult> {
  try {
    const response = await apiRequest("/api/osint/domain", {
      method: "POST", 
      body: JSON.stringify({ domain }),
    });
    return response;
  } catch (error) {
    throw new Error(`Domain analysis failed: ${error.message}`);
  }
}

// IP Geolocation Service
export async function getIPLocation(ip: string): Promise<OSINTResult> {
  try {
    const response = await apiRequest("/api/osint/ip", {
      method: "POST",
      body: JSON.stringify({ ip }),
    });
    return response;
  } catch (error) {
    throw new Error(`IP location failed: ${error.message}`);
  }
}

// Phone Number Lookup Service
export async function lookupPhone(phone: string): Promise<OSINTResult> {
  try {
    const response = await apiRequest("/api/osint/phone", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    return response;
  } catch (error) {
    throw new Error(`Phone lookup failed: ${error.message}`);
  }
}

// Social Media Search Service
export async function searchSocialMedia(username: string): Promise<OSINTResult> {
  try {
    const response = await apiRequest("/api/osint/social", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return response;
  } catch (error) {
    throw new Error(`Social media search failed: ${error.message}`);
  }
}

// Get Search History
export async function getSearchHistory(): Promise<OSINTResult[]> {
  try {
    const response = await apiRequest("/api/searches");
    return response.searches || [];
  } catch (error) {
    throw new Error(`Failed to fetch search history: ${error.message}`);
  }
}

// Bookmark Search
export async function bookmarkSearch(searchId: string, title: string, notes?: string): Promise<any> {
  try {
    const response = await apiRequest("/api/bookmarks", {
      method: "POST",
      body: JSON.stringify({ searchId, title, notes }),
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to bookmark search: ${error.message}`);
  }
}

// Get Bookmarks
export async function getBookmarks(): Promise<any[]> {
  try {
    const response = await apiRequest("/api/bookmarks");
    return response.bookmarks || [];
  } catch (error) {
    throw new Error(`Failed to fetch bookmarks: ${error.message}`);
  }
}

// Delete Search
export async function deleteSearch(searchId: string): Promise<any> {
  try {
    const response = await apiRequest(`/api/searches/${searchId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to delete search: ${error.message}`);
  }
}

// Get Dashboard Stats
export async function getDashboardStats(): Promise<any> {
  try {
    const response = await apiRequest("/api/stats");
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
  }
}