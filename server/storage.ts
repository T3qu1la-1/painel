import { db } from "./db";
import { 
  users, 
  sessions, 
  searches, 
  bookmarks, 
  userSettings, 
  activityLogs, 
  scripts, 
  stats 
} from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  Session, 
  InsertSession,
  Search, 
  InsertSearch, 
  Bookmark, 
  InsertBookmark,
  UserSettings,
  InsertUserSettings,
  ActivityLog,
  InsertActivityLog,
  Script,
  InsertScript,
  Stats, 
  InsertStats 
} from "@shared/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { 
  hashPassword, 
  encryptSensitiveData, 
  decryptSensitiveData,
  generateSessionToken,
  ADMIN_CREDENTIALS 
} from "./auth";

export interface IStorage {
  // User authentication operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  approveUser(id: string): Promise<boolean>;
  deleteUser(id: string): Promise<boolean>;
  
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<boolean>;
  deleteUserSessions(userId: string): Promise<boolean>;
  
  // Search operations (backwards compatible)
  getSearch(id: string): Promise<Search | undefined>;
  createSearch(search: InsertSearch): Promise<Search>;
  updateSearch(id: string, updates: Partial<Search>): Promise<Search | undefined>;
  getRecentSearches(limit?: number): Promise<Search[]>;
  getSearchesByType(type: string): Promise<Search[]>;
  
  // User-specific search operations
  getUserSearches(userId: string): Promise<Search[]>;
  getUserSearchById(id: string, userId: string): Promise<Search | undefined>;
  
  // Bookmark operations (backwards compatible)
  getBookmark(id: string): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;
  getAllBookmarks(): Promise<Bookmark[]>;
  getBookmarksBySearchId(searchId: string): Promise<Bookmark[]>;
  
  // User-specific bookmark operations
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  getUserBookmarkById(id: string, userId: string): Promise<Bookmark | undefined>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  
  // Activity logging
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getUserActivity(userId: string, limit?: number): Promise<ActivityLog[]>;
  
  // Scripts operations
  getScripts(userId: string): Promise<Script[]>;
  getPublicScripts(): Promise<Script[]>;
  getScriptById(id: string, userId: string): Promise<Script | undefined>;
  createScript(script: InsertScript): Promise<Script>;
  updateScript(id: string, userId: string, updates: Partial<Script>): Promise<Script | undefined>;
  deleteScript(id: string, userId: string): Promise<boolean>;
  
  // Stats operations (backwards compatible)
  getStats(): Promise<Stats>;
  updateStats(updates: Partial<Stats>): Promise<Stats>;
  
  // User-specific stats
  getUserStats(userId: string): Promise<Stats>;
  updateUserStats(userId: string, updates: Partial<InsertStats>): Promise<Stats>;
  getSystemStats(): Promise<Stats>;
  
  // Admin operations
  createDefaultAdmin(): Promise<User>;
  getPendingUsers(): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
}

class DatabaseStorage implements IStorage {
  // User authentication operations
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(user.passwordHash);
    
    const [newUser] = await db
      .insert(users)
      .values({
        ...user,
        passwordHash: hashedPassword,
      })
      .returning();
    
    // Create default user settings
    await db.insert(userSettings).values({
      userId: newUser.id,
      theme: 'dark',
      language: 'pt-BR',
      encryptionEnabled: true,
      notificationsEnabled: true,
    });
    
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async approveUser(id: string): Promise<boolean> {
    const [updatedUser] = await db
      .update(users)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return !!updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Session operations
  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values({
        ...session,
        token: generateSessionToken(),
      })
      .returning();
    
    return newSession;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.token, token),
        sql`${sessions.expiresAt} > NOW()`
      ));
    
    return session;
  }

  async deleteSession(token: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.token, token));
    return result.rowCount > 0;
  }

  async deleteUserSessions(userId: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.userId, userId));
    return result.rowCount > 0;
  }

  // Search operations (backwards compatible)
  async getSearch(id: string): Promise<Search | undefined> {
    const [search] = await db.select().from(searches).where(eq(searches.id, id));
    return this.decryptSearchIfNeeded(search);
  }

  async createSearch(search: InsertSearch): Promise<Search> {
    const processedSearch = this.encryptSearchIfNeeded(search);
    
    const [newSearch] = await db
      .insert(searches)
      .values(processedSearch)
      .returning();
    
    return newSearch;
  }

  async updateSearch(id: string, updates: Partial<Search>): Promise<Search | undefined> {
    const [updatedSearch] = await db
      .update(searches)
      .set(updates)
      .where(eq(searches.id, id))
      .returning();
    
    return this.decryptSearchIfNeeded(updatedSearch);
  }

  async getRecentSearches(limit = 10): Promise<Search[]> {
    const searchList = await db
      .select()
      .from(searches)
      .orderBy(desc(searches.createdAt))
      .limit(limit);
    
    return searchList.map(search => this.decryptSearchIfNeeded(search)).filter(Boolean) as Search[];
  }

  async getSearchesByType(type: string): Promise<Search[]> {
    const searchList = await db
      .select()
      .from(searches)
      .where(eq(searches.searchType, type))
      .orderBy(desc(searches.createdAt));
    
    return searchList.map(search => this.decryptSearchIfNeeded(search)).filter(Boolean) as Search[];
  }

  // User-specific search operations
  async getUserSearches(userId: string): Promise<Search[]> {
    const userSearches = await db
      .select()
      .from(searches)
      .where(eq(searches.userId, userId))
      .orderBy(desc(searches.createdAt));
    
    return userSearches.map(search => this.decryptSearchIfNeeded(search)).filter(Boolean) as Search[];
  }

  async getUserSearchById(id: string, userId: string): Promise<Search | undefined> {
    const [search] = await db
      .select()
      .from(searches)
      .where(and(eq(searches.id, id), eq(searches.userId, userId)));
    
    return this.decryptSearchIfNeeded(search);
  }

  // Bookmark operations (backwards compatible)
  async getBookmark(id: string): Promise<Bookmark | undefined> {
    const [bookmark] = await db.select().from(bookmarks).where(eq(bookmarks.id, id));
    return bookmark;
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const [newBookmark] = await db
      .insert(bookmarks)
      .values(bookmark)
      .returning();
    
    return newBookmark;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    const result = await db.delete(bookmarks).where(eq(bookmarks.id, id));
    return result.rowCount > 0;
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return await db
      .select()
      .from(bookmarks)
      .orderBy(desc(bookmarks.createdAt));
  }

  async getBookmarksBySearchId(searchId: string): Promise<Bookmark[]> {
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.searchId, searchId))
      .orderBy(desc(bookmarks.createdAt));
  }

  // User-specific bookmark operations
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));
  }

  async getUserBookmarkById(id: string, userId: string): Promise<Bookmark | undefined> {
    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)));
    
    return bookmark;
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    
    return settings;
  }

  async updateUserSettings(userId: string, settingsUpdate: Partial<InsertUserSettings>): Promise<UserSettings> {
    const [settings] = await db
      .update(userSettings)
      .set({ ...settingsUpdate, updatedAt: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();
    
    return settings;
  }

  // Activity logging
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(activity)
      .returning();
    
    return log;
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  // Scripts operations
  async getScripts(userId: string): Promise<Script[]> {
    return await db
      .select()
      .from(scripts)
      .where(eq(scripts.userId, userId))
      .orderBy(desc(scripts.createdAt));
  }

  async getPublicScripts(): Promise<Script[]> {
    return await db
      .select()
      .from(scripts)
      .where(eq(scripts.isPublic, true))
      .orderBy(desc(scripts.createdAt));
  }

  async getScriptById(id: string, userId: string): Promise<Script | undefined> {
    const [script] = await db
      .select()
      .from(scripts)
      .where(and(eq(scripts.id, id), eq(scripts.userId, userId)));
    
    return script;
  }

  async createScript(script: InsertScript): Promise<Script> {
    const [newScript] = await db
      .insert(scripts)
      .values(script)
      .returning();
    
    return newScript;
  }

  async updateScript(id: string, userId: string, updates: Partial<Script>): Promise<Script | undefined> {
    const [updatedScript] = await db
      .update(scripts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(scripts.id, id), eq(scripts.userId, userId)))
      .returning();
    
    return updatedScript;
  }

  async deleteScript(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(scripts)
      .where(and(eq(scripts.id, id), eq(scripts.userId, userId)));
    
    return result.rowCount > 0;
  }

  // Stats operations (backwards compatible)
  async getStats(): Promise<Stats> {
    return this.getSystemStats();
  }

  async updateStats(updates: Partial<Stats>): Promise<Stats> {
    // For backwards compatibility, treat as system stats update
    return this.getSystemStats();
  }

  // User-specific stats
  async getUserStats(userId: string): Promise<Stats> {
    const [userStats] = await db
      .select()
      .from(stats)
      .where(eq(stats.userId, userId))
      .orderBy(desc(stats.date))
      .limit(1);
    
    return userStats || this.getSystemStats();
  }

  async updateUserStats(userId: string, updates: Partial<InsertStats>): Promise<Stats> {
    const [updatedStats] = await db
      .insert(stats)
      .values({ ...updates, userId })
      .onConflictDoUpdate({
        target: [stats.userId],
        set: updates,
      })
      .returning();
    
    return updatedStats;
  }

  async getSystemStats(): Promise<Stats> {
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalSearchesToday = await db
      .select({ count: count() })
      .from(searches)
      .where(sql`DATE(${searches.createdAt}) = CURRENT_DATE`);
    
    const totalBookmarks = await db.select({ count: count() }).from(bookmarks);
    const totalScripts = await db.select({ count: count() }).from(scripts);
    
    return {
      id: 'system_stats',
      userId: null,
      date: new Date(),
      todaySearches: totalSearchesToday[0].count,
      totalSearches: totalSearchesToday[0].count,
      successfulSearches: Math.floor(totalSearchesToday[0].count * 0.85),
      totalBookmarks: totalBookmarks[0].count,
      totalScripts: totalScripts[0].count,
      activeUsers: totalUsers[0].count,
    };
  }

  // Admin operations
  async createDefaultAdmin(): Promise<User> {
    // Check if admin already exists
    const existingAdmin = await this.getUserByUsername(ADMIN_CREDENTIALS.username);
    if (existingAdmin) return existingAdmin;
    
    const admin = await this.createUser({
      email: ADMIN_CREDENTIALS.email,
      username: ADMIN_CREDENTIALS.username,
      passwordHash: ADMIN_CREDENTIALS.password,
      role: 'super_admin',
      isApproved: true,
      isActive: true,
    });
    
    return admin;
  }

  async getPendingUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isApproved, false))
      .orderBy(desc(users.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  // Helper methods for encryption
  private encryptSearchIfNeeded(search: InsertSearch): InsertSearch {
    if (search.isEncrypted && search.results) {
      try {
        const encryptedResults = encryptSensitiveData(JSON.stringify(search.results));
        return { ...search, results: JSON.parse(encryptedResults) };
      } catch (error) {
        console.error('Error encrypting search results:', error);
      }
    }
    return search;
  }

  private decryptSearchIfNeeded(search: Search | undefined): Search | undefined {
    if (!search) return undefined;
    
    if (search.isEncrypted && search.results) {
      try {
        const decryptedResults = decryptSensitiveData(JSON.stringify(search.results));
        return { ...search, results: JSON.parse(decryptedResults) };
      } catch (error) {
        console.error('Error decrypting search results:', error);
      }
    }
    return search;
  }
}

export const storage = new DatabaseStorage();