import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob, index } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User authentication system
export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"), // user, admin, super_admin
  isApproved: integer("is_approved", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Session management
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// OSINT searches
export const searches = sqliteTable("searches", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  query: text("query").notNull(),
  searchType: text("search_type").notNull(), // email, domain, ip, phone, social, shodan, etc
  category: text("category").notNull().default("osint"), // osint, security, scripts
  results: text("results", { mode: "json" }),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  isEncrypted: integer("is_encrypted", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Bookmarks system
export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  searchId: text("search_id").references(() => searches.id).notNull(),
  title: text("title").notNull(),
  notes: text("notes"),
  tags: text("tags", { mode: "json" }),
  isEncrypted: integer("is_encrypted", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// User preferences and settings
export const userSettings = sqliteTable("user_settings", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull().unique(),
  theme: text("theme").notNull().default("dark"), // dark, light
  language: text("language").notNull().default("pt-BR"),
  encryptionEnabled: integer("encryption_enabled", { mode: "boolean" }).notNull().default(false),
  notificationsEnabled: integer("notifications_enabled", { mode: "boolean" }).notNull().default(true),
  apiKeys: text("api_keys", { mode: "json" }),
  preferences: text("preferences", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Activity logs
export const activityLogs = sqliteTable("activity_logs", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  details: text("details", { mode: "json" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Scripts and tools management
export const scripts = sqliteTable("scripts", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // termux, bash, python, etc
  scriptContent: text("script_content").notNull(),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  isEncrypted: integer("is_encrypted", { mode: "boolean" }).notNull().default(false),
  tags: text("tags", { mode: "json" }),
  executionCount: integer("execution_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// System statistics
export const stats = sqliteTable("stats", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  date: integer("date", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  todaySearches: integer("today_searches").notNull().default(0),
  totalSearches: integer("total_searches").notNull().default(0),
  successfulSearches: integer("successful_searches").notNull().default(0),
  totalBookmarks: integer("total_bookmarks").notNull().default(0),
  totalScripts: integer("total_scripts").notNull().default(0),
  activeUsers: integer("active_users").notNull().default(0),
});

// Indexes for better performance
export const userEmailIndex = index("user_email_idx").on(users.email);
export const userUsernameIndex = index("user_username_idx").on(users.username);
export const sessionTokenIndex = index("session_token_idx").on(sessions.token);
export const searchUserIndex = index("search_user_idx").on(searches.userId);
export const searchTypeIndex = index("search_type_idx").on(searches.searchType);
export const bookmarkUserIndex = index("bookmark_user_idx").on(bookmarks.userId);

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertSearchSchema = createInsertSchema(searches).omit({
  id: true,
  createdAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertScriptSchema = createInsertSchema(scripts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  executionCount: true,
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  date: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Search = typeof searches.$inferSelect;
export type InsertSearch = z.infer<typeof insertSearchSchema>;

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type Script = typeof scripts.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;

export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;

// OSINT result types
export interface EmailLookupResult {
  valid: boolean;
  provider: string;
  disposable: boolean;
  catchAll: boolean | null;
  breaches: Array<{
    name: string;
    date: string;
    dataTypes: string[];
  }>;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  additionalInfo?: {
    location?: string;
    company?: string;
    phone?: string;
  };
}

export interface DomainAnalysisResult {
  domain: string;
  registrar: string;
  creationDate: string;
  expirationDate: string;
  nameservers: string[];
  whoisInfo: Record<string, any>;
  subdomains: string[];
  technologies: string[];
  securityInfo: {
    ssl: boolean;
    malware: boolean;
    phishing: boolean;
  };
}

export interface IPGeolocationResult {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  organization: string;
  asn: string;
  vpn: boolean;
  proxy: boolean;
  threatLevel: string;
}

export interface PhoneLookupResult {
  number: string;
  country: string;
  carrier: string;
  lineType: string;
  valid: boolean;
  location: {
    city?: string;
    region?: string;
  };
}

export interface SocialMediaResult {
  platform: string;
  username: string;
  profileUrl: string;
  verified: boolean;
  followers?: number;
  posts?: number;
  bio?: string;
}