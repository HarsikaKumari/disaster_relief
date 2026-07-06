import { Request, Response } from 'express';
import emergencyService from '../services/emergency.service';
import { CreateEmergencyInput, UpdateEmergencyInput } from '../types/emergency.types';

export class EmergencyController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const data: CreateEmergencyInput = req.body;
      const emergency = await emergencyService.createEmergency(userId, data);
      res.status(201).json({ success: true, data: emergency });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
 
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status, severity, type } = req.query;
      const emergencies = await emergencyService.getAllEmergencies({
        status: status as string,
        severity: severity as string,
        type: type as string,
      });
      res.status(200).json({ success: true, data: emergencies });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const emergency = await emergencyService.getEmergencyById(id);
      if (!emergency) {
        res.status(404).json({ success: false, message: 'Emergency not found' });
        return;
      }
      res.status(200).json({ success: true, data: emergency });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateEmergencyInput = req.body;
      const emergency = await emergencyService.updateEmergency(id, data);
      res.status(200).json({ success: true, data: emergency });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async assign(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { assignedToId } = req.body;
      const emergency = await emergencyService.assignEmergency(id, { assignedToId });
      res.status(200).json({ success: true, data: emergency });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await emergencyService.getEmergencyStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
   async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId:string = req.body.userId;
      const existing = await emergencyService.getEmergencyById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Emergency not found' });
        return;
      }

      await emergencyService.deleteEmergency(id, userId);
      res.status(200).json({ success: true, message: 'Emergency deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new EmergencyController();