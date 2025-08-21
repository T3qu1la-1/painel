import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { 
  insertSearchSchema,
  insertBookmarkSchema,
  insertStatsSchema,
  insertUserSchema,
  insertUserSettingsSchema,
  insertScriptSchema,
  type Search,
  type User 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createUserSession,
  isAdmin,
  sanitizeInput,
  ADMIN_CREDENTIALS
} from "./auth";
import { registerOSINTRoutes } from "./osint-routes";

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

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }

  // Get user from database
  const user = await storage.getUserById(decoded.userId);
  if (!user || !user.isActive) {
    return res.status(403).json({ message: 'Usuário inativo ou não encontrado' });
  }

  req.user = createUserSession(user);
  next();
};

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || !isAdmin(req.user)) {
    return res.status(403).json({ message: 'Acesso negado - Privilégios de administrador requeridos' });
  }
  next();
};

// Approved user middleware
const requireApproved = (req: any, res: any, next: any) => {
  if (!req.user || !req.user.isApproved) {
    return res.status(403).json({ message: 'Conta não aprovada pelo administrador' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Register OSINT routes
  registerOSINTRoutes(app);
  
  // Initialize default admin on startup
  storage.createDefaultAdmin().catch(console.error);

  // ========================
  // AUTHENTICATION ROUTES
  // ========================

  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = validateRequest(insertUserSchema, req.body);
      const { email, username, passwordHash } = validatedData;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email) || await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      // Create user (not approved by default)
      const user = await storage.createUser({
        email: sanitizeInput(email),
        username: sanitizeInput(username),
        passwordHash,
        role: 'user',
        isApproved: false,
        isActive: true,
      });

      // Log activity
      await storage.logActivity({
        userId: user.id,
        action: 'user_registered',
        details: { email, username },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.status(201).json({ 
        message: 'Conta criada! Aguarde aprovação do administrador.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isApproved: user.isApproved
        }
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { login, password } = req.body; // login can be email or username

      if (!login || !password) {
        return res.status(400).json({ message: 'Login e senha são obrigatórios' });
      }

      // Find user by email or username
      const user = await storage.getUserByEmail(login) || await storage.getUserByUsername(login);
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verify password
      const validPassword = await verifyPassword(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: 'Conta desativada' });
      }

      // Check if user is approved
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Conta aguardando aprovação do administrador' });
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.createSession({
        userId: user.id,
        token: refreshToken,
        expiresAt,
      });

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // Log activity
      await storage.logActivity({
        userId: user.id,
        action: 'user_login',
        details: { loginMethod: 'password' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        message: 'Login realizado com sucesso',
        user: createUserSession(user),
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Refresh token
  app.post("/api/auth/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token requerido' });
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(403).json({ message: 'Refresh token inválido' });
      }

      // Verify session exists
      const session = await storage.getSessionByToken(refreshToken);
      if (!session) {
        return res.status(403).json({ message: 'Sessão inválida' });
      }

      // Get user
      const user = await storage.getUserById(session.userId);
      if (!user || !user.isActive || !user.isApproved) {
        return res.status(403).json({ message: 'Usuário inativo' });
      }

      // Generate new access token
      const accessToken = generateAccessToken(user);

      res.json({ accessToken });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Logout
  app.post("/api/auth/logout", authenticateToken, async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await storage.deleteSession(refreshToken);
      }

      // Log activity
      await storage.logActivity({
        userId: req.user.id,
        action: 'user_logout',
        details: {},
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(createUserSession(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ========================
  // ADMIN ROUTES
  // ========================

  // Get pending users (admin only)
  app.get("/api/admin/users/pending", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      res.json(pendingUsers.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      })));
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Approve user (admin only)
  app.post("/api/admin/users/:id/approve", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const approved = await storage.approveUser(id);
      
      if (!approved) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.user.id,
        action: 'user_approved',
        details: { approvedUserId: id },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({ message: 'Usuário aprovado com sucesso' });
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ========================
  // BACKWARDS COMPATIBLE ROUTES (for current frontend)
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
            results = await osintService.performSocialMediaSearch(validatedData.query);
            break;
          default:
            throw new Error(`Unknown search type: ${validatedData.searchType}`);
        }
        
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