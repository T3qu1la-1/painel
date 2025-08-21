import type { Express } from "express";
import { storage } from "./storage";

export function registerAdminRoutes(app: Express) {
  
  // Get pending users for approval
  app.get("/api/admin/users/pending", async (req, res) => {
    try {
      // Get all users that are not approved yet
      const pendingUsers = await storage.getPendingUsers();
      res.json(pendingUsers);
    } catch (error: any) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch pending users" 
      });
    }
  });

  // Approve or reject user
  app.post("/api/admin/users/:userId/approve", async (req, res) => {
    try {
      const { userId } = req.params;
      const { action, reason } = req.body;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: "User ID is required" 
        });
      }

      if (!action || !['approved', 'rejected'].includes(action)) {
        return res.status(400).json({ 
          success: false, 
          error: "Valid action (approved/rejected) is required" 
        });
      }

      const result = await storage.updateUserApprovalStatus(userId, action === 'approved', reason);
      
      res.json({
        success: true,
        message: `User ${action} successfully`,
        data: result
      });
    } catch (error: any) {
      console.error("Error updating user approval:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update user approval" 
      });
    }
  });

  // Get all menu categories
  app.get("/api/admin/menu/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch categories" 
      });
    }
  });

  // Create menu category
  app.post("/api/admin/menu/categories", async (req, res) => {
    try {
      const { name, slug, description, icon, order } = req.body;
      
      if (!name || !slug || !icon) {
        return res.status(400).json({ 
          success: false, 
          error: "Name, slug and icon are required" 
        });
      }

      const category = await storage.createMenuCategory({
        name,
        slug,
        description: description || '',
        icon,
        order: order || 0,
        isActive: true
      });
      
      res.json({
        success: true,
        message: "Category created successfully",
        data: category
      });
    } catch (error: any) {
      console.error("Error creating category:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create category" 
      });
    }
  });

  // Get all menu items
  app.get("/api/admin/menu/items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error: any) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch menu items" 
      });
    }
  });

  // Create menu item
  app.post("/api/admin/menu/items", async (req, res) => {
    try {
      const { categoryId, name, slug, description, icon, route, order } = req.body;
      
      if (!categoryId || !name || !route) {
        return res.status(400).json({ 
          success: false, 
          error: "Category ID, name and route are required" 
        });
      }

      const item = await storage.createMenuItem({
        categoryId,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description || '',
        icon: icon || 'Circle',
        route,
        order: order || 0,
        isActive: true
      });
      
      res.json({
        success: true,
        message: "Menu item created successfully",
        data: item
      });
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create menu item" 
      });
    }
  });

  // Get all menu tools
  app.get("/api/admin/menu/tools", async (req, res) => {
    try {
      const tools = await storage.getMenuTools();
      res.json(tools);
    } catch (error: any) {
      console.error("Error fetching menu tools:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch menu tools" 
      });
    }
  });

  // Create menu tool
  app.post("/api/admin/menu/tools", async (req, res) => {
    try {
      const { menuItemId, name, slug, description, icon, route, apiEndpoint, toolType, config, order } = req.body;
      
      if (!menuItemId || !name || !route || !toolType) {
        return res.status(400).json({ 
          success: false, 
          error: "Menu item ID, name, route and tool type are required" 
        });
      }

      const tool = await storage.createMenuTool({
        menuItemId,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description || '',
        icon: icon || 'Tool',
        route,
        apiEndpoint,
        toolType,
        config,
        order: order || 0,
        isActive: true
      });
      
      res.json({
        success: true,
        message: "Menu tool created successfully",
        data: tool
      });
    } catch (error: any) {
      console.error("Error creating menu tool:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create menu tool" 
      });
    }
  });

  console.log("✅ Admin routes registered");
}