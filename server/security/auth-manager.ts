import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { encrypt, decrypt, hashPassword, verifyPassword, generateSecureToken, verifyToken } from './encryption';

interface AdminCredentials {
  username: string;
  password: string;
  email: string;
  role: string;
  created: string;
  lastLogin?: string;
}

class AuthManager {
  private adminCredentialsPath: string;
  private masterKey: string;
  private rateLimitMap: Map<string, { attempts: number; lastAttempt: number }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos
  
  constructor() {
    this.adminCredentialsPath = path.join(__dirname, 'admin-credentials.json.enc');
    this.masterKey = process.env.MASTER_KEY || 'OSINT_PANEL_SECURE_2024_ENCRYPTION_KEY';
    this.initializeAdminCredentials();
  }
  
  /**
   * Inicializa credenciais do admin se não existirem
   */
  private initializeAdminCredentials(): void {
    try {
      if (!fs.existsSync(this.adminCredentialsPath)) {
        const defaultAdmin: AdminCredentials = {
          username: 'catalyst',
          password: hashPassword('Celo0506'),
          email: 'catalyst@osint-panel.local',
          role: 'administrator',
          created: new Date().toISOString()
        };
        
        this.saveAdminCredentials(defaultAdmin);
        console.log('✅ Credenciais de admin criadas com segurança máxima');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar credenciais:', error.message);
    }
  }
  
  /**
   * Carrega credenciais do admin do arquivo criptografado
   */
  private loadAdminCredentials(): AdminCredentials | null {
    try {
      if (!fs.existsSync(this.adminCredentialsPath)) {
        return null;
      }
      
      const encryptedData = fs.readFileSync(this.adminCredentialsPath, 'utf8');
      const decryptedData = decrypt(encryptedData, this.masterKey);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('❌ Erro ao carregar credenciais:', error.message);
      return null;
    }
  }
  
  /**
   * Salva credenciais do admin no arquivo criptografado
   */
  private saveAdminCredentials(credentials: AdminCredentials): void {
    try {
      const jsonData = JSON.stringify(credentials, null, 2);
      const encryptedData = encrypt(jsonData, this.masterKey);
      fs.writeFileSync(this.adminCredentialsPath, encryptedData, 'utf8');
    } catch (error) {
      console.error('❌ Erro ao salvar credenciais:', error.message);
      throw error;
    }
  }
  
  /**
   * Verifica rate limiting por IP
   */
  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(ip);
    
    if (!record) {
      this.rateLimitMap.set(ip, { attempts: 1, lastAttempt: now });
      return true;
    }
    
    // Reset se passou o tempo de lockout
    if (now - record.lastAttempt > this.LOCKOUT_DURATION) {
      this.rateLimitMap.set(ip, { attempts: 1, lastAttempt: now });
      return true;
    }
    
    // Verifica se excedeu tentativas
    if (record.attempts >= this.MAX_ATTEMPTS) {
      return false;
    }
    
    record.attempts++;
    record.lastAttempt = now;
    return true;
  }
  
  /**
   * Reset do rate limit após login bem-sucedido
   */
  private resetRateLimit(ip: string): void {
    this.rateLimitMap.delete(ip);
  }
  
  /**
   * Autentica usuário com segurança máxima
   */
  public authenticate(username: string, password: string, ip: string): { success: boolean; token?: string; message: string; } {
    try {
      // Verifica rate limiting
      if (!this.checkRateLimit(ip)) {
        console.log(`⚠️ Tentativa de login bloqueada por rate limit: ${ip}`);
        return {
          success: false,
          message: 'Muitas tentativas falhadas. Tente novamente em 15 minutos.'
        };
      }
      
      // Carrega credenciais
      const adminCreds = this.loadAdminCredentials();
      if (!adminCreds) {
        return {
          success: false,
          message: 'Erro interno do sistema'
        };
      }
      
      // Verifica credenciais
      if (username !== adminCreds.username || !verifyPassword(password, adminCreds.password)) {
        console.log(`⚠️ Tentativa de login inválida: ${username} de ${ip}`);
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }
      
      // Login bem-sucedido
      this.resetRateLimit(ip);
      
      // Atualiza último login
      adminCreds.lastLogin = new Date().toISOString();
      this.saveAdminCredentials(adminCreds);
      
      // Gera token JWT
      const token = generateSecureToken({
        username: adminCreds.username,
        role: adminCreds.role,
        email: adminCreds.email,
        loginTime: Date.now()
      });
      
      console.log(`✅ Login bem-sucedido: ${username} de ${ip}`);
      
      return {
        success: true,
        token,
        message: 'Autenticação bem-sucedida'
      };
      
    } catch (error) {
      console.error('❌ Erro na autenticação:', error.message);
      return {
        success: false,
        message: 'Erro interno do sistema'
      };
    }
  }
  
  /**
   * Verifica token JWT
   */
  public verifyAuthToken(token: string): any {
    try {
      return verifyToken(token);
    } catch (error) {
      console.log(`⚠️ Token inválido: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Atualiza senha do admin
   */
  public updateAdminPassword(oldPassword: string, newPassword: string): boolean {
    try {
      const adminCreds = this.loadAdminCredentials();
      if (!adminCreds) return false;
      
      if (!verifyPassword(oldPassword, adminCreds.password)) {
        return false;
      }
      
      adminCreds.password = hashPassword(newPassword);
      this.saveAdminCredentials(adminCreds);
      
      console.log('✅ Senha de admin atualizada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar senha:', error.message);
      return false;
    }
  }
  
  /**
   * Obter informações do admin (sem senha)
   */
  public getAdminInfo(): Partial<AdminCredentials> | null {
    try {
      const adminCreds = this.loadAdminCredentials();
      if (!adminCreds) return null;
      
      const { password, ...safeInfo } = adminCreds;
      return safeInfo;
    } catch (error) {
      console.error('❌ Erro ao obter informações do admin:', error.message);
      return null;
    }
  }
}

export const authManager = new AuthManager();