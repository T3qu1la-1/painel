import { Request, Response, Router } from 'express';
import { db } from '../db';
import { menuCategories, menuItems } from '@shared/schema';
import { desc, eq } from 'drizzle-orm';
import { authenticateToken } from '../security/security-middleware';

const router = Router();

// Admin middleware - only admins can manage menus
const requireAdmin = (req: Request, res: Response, next: Function) => {
  const user = (req as any).user;
  if (!user || user.role !== 'administrator') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all menu categories
router.get('/categories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const categories = await db
      .select()
      .from(menuCategories)
      .orderBy(menuCategories.order, menuCategories.name);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all menu items
router.get('/items', authenticateToken, async (req: Request, res: Response) => {
  try {
    const items = await db
      .select()
      .from(menuItems)
      .orderBy(menuItems.order, menuItems.name);
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu items by category
router.get('/categories/:categoryId/items', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    
    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId))
      .orderBy(menuItems.order, menuItems.name);
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching category items:', error);
    res.status(500).json({ error: 'Failed to fetch category items' });
  }
});

// Create menu category (Admin only)
router.post('/categories', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, slug, description, icon, order = 0 } = req.body;
    
    if (!name || !slug || !icon) {
      return res.status(400).json({ error: 'Name, slug, and icon are required' });
    }
    
    const newCategory = await db
      .insert(menuCategories)
      .values({
        name,
        slug,
        description,
        icon,
        order,
        isActive: true
      })
      .returning();
    
    res.status(201).json(newCategory[0]);
  } catch (error: any) {
    console.error('Error creating menu category:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Category slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Create menu item (Admin only)
router.post('/items', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { categoryId, name, slug, description, icon, url, route, order = 0 } = req.body;
    
    if (!categoryId || !name || !slug) {
      return res.status(400).json({ error: 'Category ID, name, and slug are required' });
    }
    
    // Validate that at least one of url or route is provided
    if (!url && !route) {
      return res.status(400).json({ error: 'Either URL or route must be provided' });
    }
    
    const newItem = await db
      .insert(menuItems)
      .values({
        categoryId,
        name,
        slug,
        description,
        icon,
        url,
        route,
        order,
        isActive: true
      })
      .returning();
    
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Update menu category (Admin only)
router.put('/categories/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, order, isActive } = req.body;
    
    const updatedCategory = await db
      .update(menuCategories)
      .set({
        name,
        slug,
        description,
        icon,
        order,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(menuCategories.id, id))
      .returning();
    
    if (updatedCategory.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json(updatedCategory[0]);
  } catch (error) {
    console.error('Error updating menu category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Update menu item (Admin only)
router.put('/items/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId, name, slug, description, icon, url, route, order, isActive } = req.body;
    
    const updatedItem = await db
      .update(menuItems)
      .set({
        categoryId,
        name,
        slug,
        description,
        icon,
        url,
        route,
        order,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(menuItems.id, id))
      .returning();
    
    if (updatedItem.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.status(200).json(updatedItem[0]);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu category (Admin only)
router.delete('/categories/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First delete all items in this category
    await db.delete(menuItems).where(eq(menuItems.categoryId, id));
    
    // Then delete the category
    const deletedCategory = await db
      .delete(menuCategories)
      .where(eq(menuCategories.id, id))
      .returning();
    
    if (deletedCategory.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Delete menu item (Admin only)
router.delete('/items/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedItem = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();
    
    if (deletedItem.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;