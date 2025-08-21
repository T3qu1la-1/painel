import { db, sqlite } from './db';
import { users, sessions, searches, bookmarks, userSettings, activityLogs, scripts, stats } from '@shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        is_approved INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        last_login INTEGER,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS searches (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        query TEXT NOT NULL,
        search_type TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'osint',
        results TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        is_encrypted INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        search_id TEXT NOT NULL,
        title TEXT NOT NULL,
        notes TEXT,
        tags TEXT,
        is_encrypted INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (search_id) REFERENCES searches(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL UNIQUE,
        theme TEXT NOT NULL DEFAULT 'dark',
        language TEXT NOT NULL DEFAULT 'pt-BR',
        encryption_enabled INTEGER NOT NULL DEFAULT 1,
        notifications_enabled INTEGER NOT NULL DEFAULT 1,
        api_keys TEXT,
        preferences TEXT,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS scripts (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        script_content TEXT NOT NULL,
        is_public INTEGER NOT NULL DEFAULT 0,
        is_encrypted INTEGER NOT NULL DEFAULT 1,
        tags TEXT,
        execution_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS stats (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        date INTEGER DEFAULT (unixepoch()) NOT NULL,
        today_searches INTEGER NOT NULL DEFAULT 0,
        total_searches INTEGER NOT NULL DEFAULT 0,
        successful_searches INTEGER NOT NULL DEFAULT 0,
        total_bookmarks INTEGER NOT NULL DEFAULT 0,
        total_scripts INTEGER NOT NULL DEFAULT 0,
        active_users INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create indexes
    sqlite.exec(`CREATE INDEX IF NOT EXISTS user_email_idx ON users(email)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS user_username_idx ON users(username)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS session_token_idx ON sessions(token)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS search_user_idx ON searches(user_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS search_type_idx ON searches(search_type)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS bookmark_user_idx ON bookmarks(user_id)`);

    // Create default admin user
    const adminExists = await db.select().from(users).where(eq(users.role, 'super_admin')).limit(1);
    
    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('dolpSecure2025!', 12);
      
      await db.insert(users).values({
        email: 'admin@dolp.security',
        username: 'dolpmaster',
        passwordHash: hashedPassword,
        role: 'super_admin',
        isApproved: true,
        isActive: true,
      });

      console.log('✅ Admin user created: dolpmaster / dolpSecure2025!');
    }

    // Create default stats entry
    const statsExists = await db.select().from(stats).where(eq(stats.userId, null)).limit(1);
    
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
      
      console.log('✅ System stats initialized');
    }

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}