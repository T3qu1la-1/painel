import { 
  type Search, 
  type InsertSearch, 
  type Bookmark, 
  type InsertBookmark,
  type Stats,
  type InsertStats 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Search operations
  getSearch(id: string): Promise<Search | undefined>;
  createSearch(search: InsertSearch): Promise<Search>;
  updateSearch(id: string, updates: Partial<Search>): Promise<Search | undefined>;
  getRecentSearches(limit?: number): Promise<Search[]>;
  getSearchesByType(type: string): Promise<Search[]>;
  
  // Bookmark operations
  getBookmark(id: string): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;
  getAllBookmarks(): Promise<Bookmark[]>;
  getBookmarksBySearchId(searchId: string): Promise<Bookmark[]>;
  
  // Stats operations
  getStats(): Promise<Stats>;
  updateStats(stats: InsertStats): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private searches: Map<string, Search>;
  private bookmarks: Map<string, Bookmark>;
  private stats: Stats;

  constructor() {
    this.searches = new Map();
    this.bookmarks = new Map();
    this.stats = {
      id: randomUUID(),
      date: new Date(),
      todaySearches: "0",
      successRate: "0",
      totalBookmarks: "0",
      apiCredits: "2847"
    };
  }

  async getSearch(id: string): Promise<Search | undefined> {
    return this.searches.get(id);
  }

  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const id = randomUUID();
    const search: Search = {
      ...insertSearch,
      id,
      results: insertSearch.results || null,
      createdAt: new Date()
    };
    this.searches.set(id, search);
    
    // Update today's searches count
    const currentCount = parseInt(this.stats.todaySearches);
    this.stats.todaySearches = (currentCount + 1).toString();
    
    return search;
  }

  async updateSearch(id: string, updates: Partial<Search>): Promise<Search | undefined> {
    const search = this.searches.get(id);
    if (!search) return undefined;
    
    const updatedSearch = { ...search, ...updates };
    this.searches.set(id, updatedSearch);
    
    // Update success rate if status changed to completed
    if (updates.status === "completed") {
      const totalSearches = this.searches.size;
      const completedSearches = Array.from(this.searches.values())
        .filter(s => s.status === "completed").length;
      this.stats.successRate = ((completedSearches / totalSearches) * 100).toFixed(1);
    }
    
    return updatedSearch;
  }

  async getRecentSearches(limit = 10): Promise<Search[]> {
    return Array.from(this.searches.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getSearchesByType(type: string): Promise<Search[]> {
    return Array.from(this.searches.values())
      .filter(search => search.searchType === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBookmark(id: string): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = {
      ...insertBookmark,
      id,
      notes: insertBookmark.notes || null,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    
    // Update bookmarks count
    this.stats.totalBookmarks = this.bookmarks.size.toString();
    
    return bookmark;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    const deleted = this.bookmarks.delete(id);
    if (deleted) {
      this.stats.totalBookmarks = this.bookmarks.size.toString();
    }
    return deleted;
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBookmarksBySearchId(searchId: string): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.searchId === searchId);
  }

  async getStats(): Promise<Stats> {
    return this.stats;
  }

  async updateStats(statsUpdate: InsertStats): Promise<Stats> {
    this.stats = { ...this.stats, ...statsUpdate };
    return this.stats;
  }
}

export const storage = new MemStorage();
