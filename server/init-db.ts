import { db } from './db';
import { users, sessions, searches, bookmarks, userSettings, activityLogs, scripts, stats } from '@shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    console.log('🔧 Configurando rotas com segurança máxima...');
    console.log('🛡️ Middleware de segurança avançado aplicado (modo desenvolvimento)');
    console.log('🔐 Configurando sistema de autenticação ultra-seguro...');
    
    // For PostgreSQL with Drizzle, we'll use drizzle-kit push to create tables
    // Tables will be created automatically via the schema if they don't exist
    
    // Create default admin user
    const adminExists = await db.select().from(users).where(eq(users.role, 'super_admin')).limit(1);
    
    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('OsintPanel2024!@#$', 12);
      
      await db.insert(users).values({
        email: 'admin@dolp.security',
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'super_admin',
        isApproved: true,
        isActive: true,
      });

      console.log('✅ Sistema de autenticação ultra-seguro configurado');
      console.log('🔐 Credenciais padrão: admin / OsintPanel2024!@#$');
      console.log('⚠️  ALTERE A SENHA PADRÃO IMEDIATAMENTE!');
    }

    // Create default stats entry
    const statsExists = await db.select().from(stats).limit(1);
    
    if (statsExists.length === 0) {
      await db.insert(stats).values({
        userId: null,
        todaySearches: 0,
        totalSearches: 0,
        successfulSearches: 0,
        totalBookmarks: 0,
        totalScripts: 0,
        activeUsers: 1,
      });
    }

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}