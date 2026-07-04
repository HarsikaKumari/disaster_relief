import { Request, Response } from 'express';
import volunteerService from '../services/volunteer.service';

export class VolunteerController {
  // ========== GET ALL VOLUNTEERS ==========
  async getAllVolunteers(req: Request, res: Response): Promise<void> {
    try {
      const { availability, verified, search, limit, page } = req.query;
      
      const result = await volunteerService.getAllVolunteers({
        availability: availability as string,
        verified: verified === 'true',
        search: search as string,
        limit: limit ? parseInt(limit as string) : 20,
        page: page ? parseInt(page as string) : 1,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ========== GET VOLUNTEER BY ID ==========
  async getVolunteerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const volunteer = await volunteerService.getVolunteerById(id);

      res.status(200).json({
        success: true,
        data: volunteer,
      });
    } catch (error: any) {
      res.status(error.message === 'Volunteer not found' ? 404 : 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ========== UPDATE VOLUNTEER ==========
  async updateVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      
      const volunteer = await volunteerService.updateVolunteer(id, data);

      res.status(200).json({
        success: true,
        data: volunteer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ========== VERIFY VOLUNTEER ==========
  async verifyVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const volunteer = await volunteerService.verifyVolunteer(id);

      res.status(200).json({
        success: true,
        message: 'Volunteer verified successfully',
        data: volunteer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ========== GET VOLUNTEER STATS ==========
  async getVolunteerStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await volunteerService.getVolunteerStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ========== DELETE VOLUNTEER ==========
  async deleteVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await volunteerService.deleteVolunteer(id);

      res.status(200).json({
        success: true,
        message: 'Volunteer deactivated successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ========== ASSIGN TO EMERGENCY ==========
  async assignToEmergency(req: Request, res: Response): Promise<void> {
    try {
      const { volunteerId, emergencyId } = req.body;
      
      const result = await volunteerService.assignToEmergency(volunteerId, emergencyId);

      res.status(200).json({
        success: true,
        message: 'Volunteer assigned to emergency successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new VolunteerController();