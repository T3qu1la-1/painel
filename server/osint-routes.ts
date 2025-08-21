import type { Express } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { OSINTAPIs } from "./osint-apis";

function validateRequest(schema: z.ZodSchema, data: any) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function registerOSINTRoutes(app: Express) {
  // Authentication middleware - simplified for immediate functionality
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    // For now, allow all requests with token (will enhance later)
    req.user = { id: 'admin', role: 'super_admin', isApproved: true };
    next();
  };

  // Email OSINT
  app.post('/api/osint/email', authenticateToken, async (req: any, res) => {
    try {
      const { email } = validateRequest(z.object({ email: z.string().email() }), req.body);
      
      const searchData = {
        userId: req.user.id,
        searchType: 'email' as const,
        query: email,
        status: 'completed' as const,
        results: await OSINTAPIs.searchEmail(email)
      };

      const search = await storage.createSearch(searchData);
      res.json(search);
    } catch (error) {
      console.error('Email search error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro na busca de email' });
    }
  });

  // Domain Analysis  
  app.post('/api/osint/domain', authenticateToken, async (req: any, res) => {
    try {
      const { domain } = validateRequest(z.object({ domain: z.string().min(1) }), req.body);
      
      const searchData = {
        userId: req.user.id,
        searchType: 'domain' as const,
        query: domain,
        status: 'completed' as const,
        results: await OSINTAPIs.analyzeDomainReal(domain)
      };

      const search = await storage.createSearch(searchData);
      res.json(search);
    } catch (error) {
      console.error('Domain search error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro na análise de domínio' });
    }
  });

  // IP Geolocation
  app.post('/api/osint/ip', authenticateToken, async (req: any, res) => {
    try {
      const { ip } = validateRequest(z.object({ ip: z.string().min(1) }), req.body);
      
      const searchData = {
        userId: req.user.id,
        searchType: 'ip' as const,
        query: ip,
        status: 'completed' as const,
        results: await OSINTAPIs.getIPLocationReal(ip)
      };

      const search = await storage.createSearch(searchData);
      res.json(search);
    } catch (error) {
      console.error('IP search error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro na geolocalização de IP' });
    }
  });

  // Phone Lookup
  app.post('/api/osint/phone', authenticateToken, async (req: any, res) => {
    try {
      const { phone } = validateRequest(z.object({ phone: z.string().min(1) }), req.body);
      
      const searchData = {
        userId: req.user.id,
        searchType: 'phone' as const,
        query: phone,
        status: 'completed' as const,
        results: await OSINTAPIs.lookupPhoneReal(phone)
      };

      const search = await storage.createSearch(searchData);
      res.json(search);
    } catch (error) {
      console.error('Phone search error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro na busca de telefone' });
    }
  });

  // Social Media Search
  app.post('/api/osint/social', authenticateToken, async (req: any, res) => {
    try {
      const { username } = validateRequest(z.object({ username: z.string().min(1) }), req.body);
      
      const searchData = {
        userId: req.user.id,
        searchType: 'social' as const,
        query: username,
        status: 'completed' as const,
        results: await OSINTAPIs.searchSocialMediaReal(username)
      };

      const search = await storage.createSearch(searchData);
      res.json(search);
    } catch (error) {
      console.error('Social search error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro na busca de redes sociais' });
    }
  });

  // Get search history
  app.get('/api/searches', authenticateToken, async (req: any, res) => {
    try {
      const searches = await storage.getUserSearches(req.user.id);
      res.json({ searches });
    } catch (error) {
      console.error('Get searches error:', error);
      res.status(500).json({ message: 'Erro ao buscar histórico' });
    }
  });

  // Delete search
  app.delete('/api/searches/:id', authenticateToken, async (req: any, res) => {
    try {
      await storage.deleteSearch(req.params.id, req.user.id);
      res.json({ message: 'Busca deletada com sucesso' });
    } catch (error) {
      console.error('Delete search error:', error);
      res.status(500).json({ message: 'Erro ao deletar busca' });
    }
  });

  // Bookmark routes
  app.post('/api/bookmarks', authenticateToken, async (req: any, res) => {
    try {
      const data = validateRequest(
        z.object({
          searchId: z.string(),
          title: z.string(),
          notes: z.string().optional()
        }),
        req.body
      );

      const bookmark = await storage.createBookmark({
        ...data,
        userId: req.user.id
      });

      res.json(bookmark);
    } catch (error) {
      console.error('Create bookmark error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro ao criar bookmark' });
    }
  });

  app.get('/api/bookmarks', authenticateToken, async (req: any, res) => {
    try {
      const bookmarks = await storage.getUserBookmarks(req.user.id);
      res.json({ bookmarks });
    } catch (error) {
      console.error('Get bookmarks error:', error);
      res.status(500).json({ message: 'Erro ao buscar bookmarks' });
    }
  });

  // Dashboard stats
  app.get('/api/stats', authenticateToken, async (req: any, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
  });
}