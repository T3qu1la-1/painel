import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searches = pgTable("searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  searchType: varchar("search_type", { length: 50 }).notNull(), // email, domain, ip, phone, social
  results: jsonb("results"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  searchId: varchar("search_id").references(() => searches.id).notNull(),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").defaultNow().notNull(),
  todaySearches: text("today_searches").notNull().default("0"),
  successRate: text("success_rate").notNull().default("0"),
  totalBookmarks: text("total_bookmarks").notNull().default("0"),
  apiCredits: text("api_credits").notNull().default("0"),
});

export const insertSearchSchema = createInsertSchema(searches).omit({
  id: true,
  createdAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  date: true,
});

export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;

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
