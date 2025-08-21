import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchSchema, insertBookmarkSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

function validateRequest(schema: z.ZodSchema, data: any) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(fromZodError(error).toString());
    }
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get recent searches for dashboard
  app.get("/api/searches/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const searches = await storage.getRecentSearches(limit);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  // Get all searches with optional type filter
  app.get("/api/searches", async (req, res) => {
    try {
      const type = req.query.type as string;
      let searches;
      
      if (type) {
        searches = await storage.getSearchesByType(type);
      } else {
        searches = await storage.getRecentSearches(100); // Get more for full history
      }
      
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch searches" });
    }
  });

  // Create new search
  app.post("/api/searches", async (req, res) => {
    try {
      const validatedData = validateRequest(insertSearchSchema, req.body);
      
      // Create the search record first
      const search = await storage.createSearch(validatedData);
      
      // Perform the actual OSINT lookup based on search type
      const osintService = await import("../client/src/lib/osint-services");
      
      try {
        let results;
        switch (validatedData.searchType) {
          case "email":
            results = await osintService.performEmailLookup(validatedData.query);
            break;
          case "domain":
            results = await osintService.performDomainAnalysis(validatedData.query);
            break;
          case "ip":
            results = await osintService.performIPGeolocation(validatedData.query);
            break;
          case "phone":
            results = await osintService.performPhoneLookup(validatedData.query);
            break;
          case "social":
            results = await osintService.performSocialMediaLookup(validatedData.query);
            break;
          default:
            throw new Error("Invalid search type");
        }
        
        // Update search with results
        const updatedSearch = await storage.updateSearch(search.id, {
          results,
          status: "completed"
        });
        
        res.json(updatedSearch);
      } catch (osintError) {
        // Update search with error status
        await storage.updateSearch(search.id, {
          status: "failed",
          results: { error: osintError instanceof Error ? osintError.message : "OSINT lookup failed" }
        });
        
        res.status(400).json({ 
          message: "OSINT lookup failed", 
          error: osintError instanceof Error ? osintError.message : "Unknown error" 
        });
      }
      
    } catch (error) {
      res.status(400).json({ message: "Invalid search data" });
    }
  });

  // Get specific search
  app.get("/api/searches/:id", async (req, res) => {
    try {
      const search = await storage.getSearch(req.params.id);
      if (!search) {
        return res.status(404).json({ message: "Search not found" });
      }
      res.json(search);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch search" });
    }
  });

  // Get all bookmarks
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getAllBookmarks();
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark
  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = validateRequest(insertBookmarkSchema, req.body);
      const bookmark = await storage.createBookmark(validatedData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ message: "Invalid bookmark data" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBookmark(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
