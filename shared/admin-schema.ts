import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// Menu structure tables for admin management
export const menuCategories = pgTable("menu_categories", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  categoryId: text("category_id").notNull().references(() => menuCategories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  route: text("route").notNull(),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuTools = pgTable("menu_tools", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  menuItemId: text("menu_item_id").notNull().references(() => menuItems.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  route: text("route").notNull(),
  apiEndpoint: text("api_endpoint"),
  toolType: text("tool_type").notNull(), // 'osint', 'tool', 'analyzer', etc
  config: text("config"), // JSON config for tool
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userApprovals = pgTable("user_approvals", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  userId: text("user_id").notNull(),
  adminId: text("admin_id").notNull(),
  action: text("action").notNull(), // 'approved', 'rejected', 'pending'
  reason: text("reason"),
  reviewedAt: timestamp("reviewed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types
export type MenuCategory = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type MenuTool = typeof menuTools.$inferSelect;
export type UserApproval = typeof userApprovals.$inferSelect;

export type InsertMenuCategory = typeof menuCategories.$inferInsert;
export type InsertMenuItem = typeof menuItems.$inferInsert;
export type InsertMenuTool = typeof menuTools.$inferInsert;
export type InsertUserApproval = typeof userApprovals.$inferInsert;

// Validation schemas
export const insertMenuCategorySchema = createInsertSchema(menuCategories);
export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertMenuToolSchema = createInsertSchema(menuTools);
export const insertUserApprovalSchema = createInsertSchema(userApprovals);

export const menuCategorySchema = insertMenuCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const menuItemSchema = insertMenuItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const menuToolSchema = insertMenuToolSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type MenuCategoryForm = z.infer<typeof menuCategorySchema>;
export type MenuItemForm = z.infer<typeof menuItemSchema>;
export type MenuToolForm = z.infer<typeof menuToolSchema>;