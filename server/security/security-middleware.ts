import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { authManager } from './auth-manager';

/**
 * Middleware de segurança avançado com rate limiting
 */
export const securityRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela
  message: {
    error: 'Muitas requisições de seu IP. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limit para recursos estáticos
    return req.path.startsWith('/static/') || req.path.startsWith('/assets/');
  }
});

/**
 * Rate limiting específico para login (mais restritivo)
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED'
  },
  skipSuccessfulRequests: true, // Não conta requests bem-sucedidos
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Configuração de segurança do Helmet (relaxada para desenvolvimento)
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Permitir scripts inline para desenvolvimento
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"], // Permitir WebSockets para desenvolvimento
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      childSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Para compatibilidade
  hsts: false // Desabilitar HSTS em desenvolvimento
});

/**
 * Middleware de autenticação JWT
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      error: 'Token de acesso requerido',
      code: 'NO_TOKEN'
    });
  }
  
  const decoded = authManager.verifyAuthToken(token);
  if (!decoded) {
    return res.status(403).json({
      error: 'Token inválido ou expirado',
      code: 'INVALID_TOKEN'
    });
  }
  
  // Adiciona informações do usuário ao request
  (req as any).user = decoded;
  next();
};

/**
 * Middleware para verificar role de administrador
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'administrator') {
    return res.status(403).json({
      error: 'Acesso restrito a administradores',
      code: 'ADMIN_REQUIRED'
    });
  }
  
  next();
};

/**
 * Middleware para sanitizar entrada de dados
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove caracteres potencialmente perigosos
  const sanitize = (str: string): string => {
    return str.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<[^>]*>/g, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+=/gi, '')
              .trim();
  };
  
  // Sanitiza body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    }
  }
  
  // Sanitiza query params
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitize(req.query[key] as string);
      }
    }
  }
  
  next();
};

/**
 * Middleware de logging de segurança
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();
  
  // Log de requisições suspeitas
  const suspiciousPaths = ['/admin', '/api/admin', '/.env', '/config', '/wp-admin'];
  const suspiciousParams = ['../../../', '<script', 'SELECT * FROM', 'UNION SELECT'];
  
  let suspicious = false;
  
  // Verifica caminhos suspeitos
  if (suspiciousPaths.some(path => url.toLowerCase().includes(path.toLowerCase()))) {
    suspicious = true;
  }
  
  // Verifica parâmetros suspeitos
  const queryString = JSON.stringify(req.query);
  const bodyString = JSON.stringify(req.body);
  if (suspiciousParams.some(param => 
    queryString.toLowerCase().includes(param.toLowerCase()) ||
    bodyString.toLowerCase().includes(param.toLowerCase())
  )) {
    suspicious = true;
  }
  
  if (suspicious) {
    console.log(`🚨 SUSPICIOUS REQUEST: ${timestamp} - ${ip} - ${method} ${url} - ${userAgent}`);
  }
  
  next();
};

/**
 * Middleware de validação de origem
 */
export const validateOrigin = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin') || req.get('Referer') || '';
  const allowedOrigins = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'https://3bda9aa1-14a0-47d6-ab49-d1b113e80772-00-im66rv6n2uf0.spock.replit.dev',
    process.env.REPLIT_URL || '',
    process.env.ALLOWED_ORIGIN || ''
  ].filter(Boolean);
  
  // Permite requisições sem origem (ex: Postman, mobile apps)
  if (!origin) {
    return next();
  }
  
  // Permitir todas as origens do replit.dev e localhost
  if (origin.includes('replit.dev') || origin.includes('localhost') || origin === '') {
    return next();
  }
  
  const isAllowed = allowedOrigins.some(allowed => 
    origin.startsWith(allowed) || allowed === '*'
  );
  
  if (!isAllowed) {
    console.log(`🚫 BLOCKED ORIGIN: ${origin} - ${req.ip}`);
    return res.status(403).json({
      error: 'Origem não autorizada',
      code: 'UNAUTHORIZED_ORIGIN'
    });
  }
  
  next();
};

/**
 * Aplicar todas as medidas de segurança
 */
export const applySecurityMiddleware = (app: any) => {
  // Headers de segurança (apenas em produção)
  if (process.env.NODE_ENV === 'production') {
    app.use(securityHeaders);
  }
  
  // Rate limiting geral
  app.use(securityRateLimit);
  
  // Logging de segurança
  app.use(securityLogger);
  
  // Sanitização de entrada
  app.use(sanitizeInput);
  
  // Validação de origem (apenas em produção)
  if (process.env.NODE_ENV === 'production') {
    app.use(validateOrigin);
  }
  
  console.log('🛡️ Middleware de segurança avançado aplicado (modo desenvolvimento)');
};