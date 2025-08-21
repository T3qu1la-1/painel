import crypto from 'crypto';

// Chaves de criptografia (em produção, devem estar em variáveis de ambiente)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Deriva uma chave segura usando PBKDF2
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * Criptografa dados usando AES-256-GCM
 */
export function encrypt(data: string, password?: string): string {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const key = password ? deriveKey(password, salt) : Buffer.from(ENCRYPTION_KEY, 'hex');
    
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(salt);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combina salt + iv + tag + encrypted data
    const combined = Buffer.concat([
      salt,
      iv, 
      tag,
      Buffer.from(encrypted, 'hex')
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    throw new Error('Falha na criptografia: ' + error.message);
  }
}

/**
 * Descriptografa dados usando AES-256-GCM
 */
export function decrypt(encryptedData: string, password?: string): string {
  try {
    const combined = Buffer.from(encryptedData, 'base64');
    
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    const key = password ? deriveKey(password, salt) : Buffer.from(ENCRYPTION_KEY, 'hex');
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAuthTag(tag);
    decipher.setAAD(salt);
    
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Falha na descriptografia: ' + error.message);
  }
}

/**
 * Gera hash seguro usando bcrypt com salt alto
 */
export function hashPassword(password: string): string {
  const bcrypt = require('bcryptjs');
  return bcrypt.hashSync(password, 16); // Salt rounds = 16 para segurança máxima
}

/**
 * Verifica senha contra hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const bcrypt = require('bcryptjs');
  return bcrypt.compareSync(password, hash);
}

/**
 * Gera token JWT seguro
 */
export function generateSecureToken(payload: any): string {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
  
  return jwt.sign(payload, secret, {
    expiresIn: '24h',
    algorithm: 'HS256',
    issuer: 'osint-panel',
    audience: 'osint-users'
  });
}

/**
 * Verifica token JWT
 */
export function verifyToken(token: string): any {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
  
  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: 'osint-panel',
    audience: 'osint-users'
  });
}

/**
 * Gera chave aleatória segura
 */
export function generateSecureKey(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}