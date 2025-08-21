import { Express, Request, Response } from "express";
import { authManager } from "./security/auth-manager";
import { loginRateLimit, authenticateToken, requireAdmin } from "./security/security-middleware";

/**
 * Authentication setup
 */
export function setupAuth(app: Express) {
  
  /**
   * Endpoint de login com máxima segurança
   */
  app.post('/api/auth/login', loginRateLimit, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validação de entrada
      if (!username || !password) {
        return res.status(400).json({
          error: 'Username e senha são obrigatórios',
          code: 'MISSING_CREDENTIALS'
        });
      }
      
      // Obter IP real do cliente
      const clientIP = req.ip || 
                      req.connection.remoteAddress ||
                      req.socket.remoteAddress ||
                      '0.0.0.0';
      
      console.log(`Login attempt: ${username} from ${clientIP}`);
      
      // Autenticação
      const result = authManager.authenticate(username, password, clientIP);
      
      if (result.success) {
        res.status(200).json({
          message: result.message,
          token: result.token,
          user: {
            username,
            role: 'administrator',
            authenticated: true
          }
        });
      } else {
        res.status(401).json({
          error: result.message,
          code: 'AUTHENTICATION_FAILED'
        });
      }
      
    } catch (error) {
      console.error('❌ Erro no endpoint de login:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  });
  
  /**
   * Endpoint para verificar token
   */
  app.get('/api/auth/verify', authenticateToken, (req: Request, res: Response) => {
    const user = (req as any).user;
    res.status(200).json({
      valid: true,
      user: {
        username: user.username,
        role: user.role,
        email: user.email,
        authenticated: true
      }
    });
  });
  
  /**
   * Endpoint para logout
   */
  app.post('/api/auth/logout', authenticateToken, (req: Request, res: Response) => {
    // JWT é stateless, então apenas confirma o logout
    console.log(`🔓 Logout realizado: ${(req as any).user.username}`);
    res.status(200).json({
      message: 'Logout realizado com sucesso'
    });
  });
  
  /**
   * Endpoint para obter informações do usuário
   */
  app.get('/api/user', authenticateToken, (req: Request, res: Response) => {
    const user = (req as any).user;
    res.status(200).json({
      username: user.username,
      role: user.role,
      email: user.email,
      authenticated: true,
      loginTime: user.loginTime
    });
  });
  
  /**
   * Endpoint para atualizar senha (apenas admin)
   */
  app.post('/api/auth/change-password', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          error: 'Senha atual e nova senha são obrigatórias'
        });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({
          error: 'Nova senha deve ter pelo menos 8 caracteres'
        });
      }
      
      const success = authManager.updateAdminPassword(oldPassword, newPassword);
      
      if (success) {
        res.status(200).json({
          message: 'Senha atualizada com sucesso'
        });
      } else {
        res.status(400).json({
          error: 'Senha atual incorreta'
        });
      }
      
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  });
  
  /**
   * Endpoint para obter informações do admin (sem senha)
   */
  app.get('/api/auth/admin-info', authenticateToken, requireAdmin, (req: Request, res: Response) => {
    const adminInfo = authManager.getAdminInfo();
    if (adminInfo) {
      res.status(200).json(adminInfo);
    } else {
      res.status(404).json({
        error: 'Informações do admin não encontradas'
      });
    }
  });
  
  console.log('✅ Authentication system configured');
  console.log('🔐 Default credentials: catalyst / Celo0506');
}