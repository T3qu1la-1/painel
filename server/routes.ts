import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSearchSchema,
  insertBookmarkSchema,
  insertStatsSchema,
  type Search
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";
import { applySecurityMiddleware, authenticateToken, requireAdmin } from "./security/security-middleware";
import { registerOSINTRoutes } from "./osint-routes";
import { registerRealAPIRoutes } from "./routes-real-apis";
import { registerAdminRoutes } from "./admin-routes";

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
  // Apply security middleware
  applySecurityMiddleware(app);
  
  // Setup authentication
  setupAuth(app);
  
  // Registrar rotas OSINT
  registerOSINTRoutes(app);
  
  // Registrar APIs reais
  registerRealAPIRoutes(app);
  
  // Registrar rotas administrativas
  registerAdminRoutes(app);

  // ========================
  // API ROUTES PROTEGIDAS
  // ========================

  // Get dashboard stats (backwards compatible)
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get recent searches for dashboard (backwards compatible)
  app.get("/api/searches/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const searches = await storage.getRecentSearches(limit);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  // Get all searches with optional type filter (backwards compatible)
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

  // Create new search (backwards compatible)
  app.post("/api/searches", async (req, res) => {
    try {
      const validatedData = validateRequest(insertSearchSchema, req.body);
      
      // Add default userId if not provided (backwards compatibility)
      if (!validatedData.userId) {
        validatedData.userId = "anonymous";
      }
      
      // Create the search record first
      const search = await storage.createSearch(validatedData);
      
      // Simulação de resultados OSINT (implementação real virá depois)
      try {
        let results = {
          query: validatedData.query,
          searchType: validatedData.searchType,
          timestamp: new Date().toISOString(),
          results: [],
          status: 'completed'
        };
        
        // Update search with results
        const updatedSearch = await storage.updateSearch(search.id, {
          results,
          status: "completed"
        });
        
        res.status(201).json(updatedSearch);
      } catch (osintError) {
        console.error("OSINT lookup error:", osintError);
        
        // Update search with error status
        await storage.updateSearch(search.id, {
          status: "failed",
          results: { error: "Failed to perform lookup" }
        });
        
        res.status(500).json({ 
          message: "Search created but lookup failed",
          searchId: search.id 
        });
      }
    } catch (error) {
      console.error("Error creating search:", error);
      res.status(500).json({ message: "Failed to create search" });
    }
  });

  // Get search by ID (backwards compatible)
  app.get("/api/searches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const search = await storage.getSearch(id);
      
      if (!search) {
        return res.status(404).json({ message: "Search not found" });
      }
      
      res.json(search);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch search" });
    }
  });

  // Update search (backwards compatible)
  app.patch("/api/searches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedSearch = await storage.updateSearch(id, req.body);
      
      if (!updatedSearch) {
        return res.status(404).json({ message: "Search not found" });
      }
      
      res.json(updatedSearch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update search" });
    }
  });

  // Get all bookmarks (backwards compatible)
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getAllBookmarks();
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark (backwards compatible)
  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = validateRequest(insertBookmarkSchema, req.body);
      
      // Add default userId if not provided (backwards compatibility)
      if (!validatedData.userId) {
        validatedData.userId = "anonymous";
      }
      
      const bookmark = await storage.createBookmark(validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  // Delete bookmark (backwards compatible)
  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBookmark(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // Get bookmarks by search ID (backwards compatible)
  app.get("/api/searches/:searchId/bookmarks", async (req, res) => {
    try {
      const { searchId } = req.params;
      const bookmarks = await storage.getBookmarksBySearchId(searchId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Get current user route
  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}