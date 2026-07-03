import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';

export class DashboardController {
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRecentActivities(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const activities = await dashboardService.getRecentActivities(limit);
      res.status(200).json({ success: true, data: activities });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new DashboardController();