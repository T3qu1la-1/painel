import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto-js';
import forge from 'node-forge';
import type { User, Session } from '@shared/schema';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'dolp-secure-jwt-secret-key-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dolp-refresh-secret-key-2024';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dolp-e2e-encryption-master-key-2024';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// JWT Token management
export function generateAccessToken(user: Pick<User, 'id' | 'email' | 'username' | 'role'>): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(user: Pick<User, 'id'>): string {
  return jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAccessToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

// End-to-end encryption for sensitive data
export function encryptSensitiveData(data: string): string {
  try {
    const encrypted = crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decryptSensitiveData(encryptedData: string): string {
  try {
    const decrypted = crypto.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return decrypted.toString(crypto.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// RSA key pair generation for advanced encryption
export function generateRSAKeyPair(): { publicKey: string; privateKey: string } {
  const keypair = forge.pki.rsa.generateKeyPair(2048);
  
  return {
    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keypair.privateKey)
  };
}

export function encryptWithPublicKey(data: string, publicKeyPem: string): string {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data, 'RSA-OAEP');
  return forge.util.encode64(encrypted);
}

export function decryptWithPrivateKey(encryptedData: string, privateKeyPem: string): string {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decrypted = privateKey.decrypt(forge.util.decode64(encryptedData), 'RSA-OAEP');
  return decrypted;
}

// Session token generation
export function generateSessionToken(): string {
  return crypto.lib.WordArray.random(256/8).toString(crypto.enc.Hex);
}

// Secure random string generation
export function generateSecureRandomString(length: number = 32): string {
  return crypto.lib.WordArray.random(length/2).toString(crypto.enc.Hex);
}

// API key validation and encryption
export function encryptAPIKey(apiKey: string, userKey?: string): string {
  const key = userKey || ENCRYPTION_KEY;
  return crypto.AES.encrypt(apiKey, key).toString();
}

export function decryptAPIKey(encryptedApiKey: string, userKey?: string): string {
  const key = userKey || ENCRYPTION_KEY;
  const decrypted = crypto.AES.decrypt(encryptedApiKey, key);
  return decrypted.toString(crypto.enc.Utf8);
}

// Rate limiting helpers
export function generateRateLimitKey(ip: string, userId?: string): string {
  return `rate_limit:${userId || ip}:${Date.now()}`;
}

// Admin credentials obfuscation
export const ADMIN_CREDENTIALS = {
  // Disguised as regular user credentials
  username: 'DataAnalyst2024',
  email: 'support@dolpdata.com',
  password: 'SecureAnalytics!2024#Dolp'
};

// Role verification
export function isAdmin(user: User): boolean {
  return user.role === 'admin' || user.role === 'super_admin';
}

export function isSuperAdmin(user: User): boolean {
  return user.role === 'super_admin';
}

// IP validation and security
export function validateIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// User session management
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: string;
  isApproved: boolean;
  isActive: boolean;
}

export function createUserSession(user: User): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    isApproved: user.isApproved,
    isActive: user.isActive
  };
}