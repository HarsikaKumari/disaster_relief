import { Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const user = await userService.getUserProfile(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const data = req.body;
      const user = await userService.updateUserProfile(userId, data);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { role, isVerified } = req.query;
      const users = await userService.getAllUsers({
        role: role as string,
        isVerified: isVerified === 'true',
      });
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // ========== CHANGE PASSWORD ==========
async changePassword(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
}

export default new UserController();