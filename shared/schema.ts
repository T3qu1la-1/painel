import { sql } from "drizzle-orm";
import { pgTable, text, integer, boolean, timestamp, varchar, json, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User authentication system
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  username: varchar("username").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  role: varchar("role").notNull().default("user"), // user, admin, super_admin
  isApproved: boolean("is_approved").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Session management
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// OSINT searches
export const searches = pgTable("searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  query: text("query").notNull(),
  searchType: varchar("search_type").notNull(), // email, domain, ip, phone, social, shodan, etc
  category: varchar("category").notNull().default("osint"), // osint, security, scripts
  results: json("results"),
  status: varchar("status").notNull().default("pending"), // pending, completed, failed
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Bookmarks system
export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  searchId: varchar("search_id").references(() => searches.id).notNull(),
  title: text("title").notNull(),
  notes: text("notes"),
  tags: json("tags"),
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// User preferences and settings
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  theme: varchar("theme").notNull().default("dark"), // dark, light
  language: varchar("language").notNull().default("pt-BR"),
  encryptionEnabled: boolean("encryption_enabled").notNull().default(true),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  apiKeys: json("api_keys"), // Encrypted API keys storage
  preferences: json("preferences"),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Activity logs
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: varchar("action").notNull(),
  details: json("details"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Scripts and tools management
export const scripts = pgTable("scripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // termux, bash, python, etc
  scriptContent: text("script_content").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  tags: json("tags"),
  executionCount: integer("execution_count").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// System statistics
export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  date: timestamp("date").default(sql`now()`).notNull(),
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