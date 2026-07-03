import { Request, Response } from 'express';
import prisma from '../config/prisma';

export class MapController {
  // Get all emergencies with location data
  async getEmergencies(_req: Request, res: Response): Promise<void> {
    try {
      const emergencies = await prisma.emergency.findMany({
        where: {
          status: {
            not: 'RESOLVED',
          },
        },
        select: {
          id: true,
          title: true,
          type: true,
          severity: true,
          status: true,
          latitude: true,
          longitude: true,
          location: true,
          victimCount: true,
          createdAt: true,        // ← FIX: reportedAt → createdAt
          reportedBy: {
            select: {
              name: true,
            },
          },
          assignedTo: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({
        success: true,
        data: emergencies,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all resources with location data
  async getResources(_req: Request, res: Response): Promise<void> {
    try {
      const resources = await prisma.resource.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          latitude: true,
          longitude: true,
          location: true,
          availableQty: true,
          quantity: true,
          provider: {
            select: {
              name: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: resources,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get map stats
  async getMapStats(_req: Request, res: Response): Promise<void> {
    try {
      const [totalEmergencies, activeEmergencies, totalResources, availableResources] = await Promise.all([
        prisma.emergency.count(),
        prisma.emergency.count({
          where: {
            status: {
              in: ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'],
            },
          },
        }),
        prisma.resource.count({ where: { isActive: true } }),
        prisma.resource.count({
          where: {
            status: 'AVAILABLE',
            isActive: true,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalEmergencies,
          activeEmergencies,
          totalResources,
          availableResources,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MapController();