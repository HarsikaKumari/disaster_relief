import { Request, Response } from 'express';
import adminService from '../services/admin.service';

export class AdminController {
  // ========== DASHBOARD ==========
  async getDashboardStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRecentActivities(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await adminService.getRecentActivities(limit);
      res.status(200).json({ success: true, data: activities });
    } catch (error: any) {
      console.error('Recent activities error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== USERS ==========
 // ========== GET ALL USERS ==========
async getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const { role, isVerified, isActive, search, page, limit } = req.query;

    console.log('📋 Admin - getAllUsers called with:', { role, isVerified, isActive, search, page, limit });

    const result = await adminService.getAllUsers({
      role: role as string,
      isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search: search as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });

    console.log(`📋 Admin - Returning ${result.data.length} users`);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('❌ Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get users',
    });
  }
}
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async verifyUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await adminService.verifyUser(id);
      res.status(200).json({ success: true, message: 'User verified successfully', data: user });
    } catch (error: any) {
      console.error('Verify user error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await adminService.banUser(id);
      res.status(200).json({ success: true, message: 'User banned successfully', data: user });
    } catch (error: any) {
      console.error('Ban user error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await adminService.unbanUser(id);
      res.status(200).json({ success: true, message: 'User unbanned successfully', data: user });
    } catch (error: any) {
      console.error('Unban user error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async changeUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await adminService.changeUserRole(id, role);
      res.status(200).json({ success: true, message: 'User role changed successfully', data: user });
    } catch (error: any) {
      console.error('Change role error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ========== SYSTEM ==========
  async getSystemStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getSystemStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      console.error('System stats error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AdminController();