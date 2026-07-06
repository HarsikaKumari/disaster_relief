import { Request, Response } from 'express';
import resourceService from '../services/resource.service';
import { CreateResourceInput, UpdateResourceInput, ResourceRequestInput, ResourceDeploymentInput } from '../types/resource.types';
import prisma from '../config/prisma';

export class ResourceController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const data: CreateResourceInput = req.body;
      const resource = await resourceService.createResource(userId, data);
      res.status(201).json({ success: true, data: resource });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { type, status } = req.query;
      const resources = await resourceService.getAllResources({
        type: type as string,
        status: status as string,
      });
      res.status(200).json({ success: true, data: resources });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await resourceService.getResourceById(id);
      if (!resource) {
        res.status(404).json({ success: false, message: 'Resource not found' });
        return;
      }
      res.status(200).json({ success: true, data: resource });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateResourceInput = req.body;
      const resource = await resourceService.updateResource(id, data);
      res.status(200).json({ success: true, data: resource });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async requestResource(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const data: ResourceRequestInput = req.body;
      const request = await resourceService.requestResource(userId, data);
      res.status(201).json({ success: true, data: request });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deployResource(req: Request, res: Response): Promise<void> {
    try {
      const data: ResourceDeploymentInput = req.body;
      const deployment = await resourceService.deployResource(data);
      res.status(201).json({ success: true, data: deployment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await resourceService.getResourceStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async getDeployments(_req: Request, res: Response): Promise<void> {
  try {
      const deployments = await resourceService.getDeployments();
      res.status(200).json({
        success: true,
        data: deployments,
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async updateDeploymentStatus(req: Request, res: Response): Promise<void> {
  try {
    const { deploymentId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['IN_TRANSIT', 'DELIVERED', 'RETURNED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed: IN_TRANSIT, DELIVERED, RETURNED',
      });
      return;
    }

    const deployment = await prisma.resourceDeployment.update({
      where: { id: deploymentId },
      data: {
        status,
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(notes && { notes }),
      },
      include: {
        resource: true,
        emergency: true,
      },
    });

    if (status === 'DELIVERED') {
      await prisma.resource.update({
        where: { id: deployment.resourceId },
        data: {
          availableQty: {
            decrement: deployment.quantity,
          },
        },
      });
    }

    if (status === 'RETURNED') {
      await prisma.resource.update({
        where: { id: deployment.resourceId },
        data: {
          availableQty: {
            increment: deployment.quantity,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      data: deployment,
    });
  } catch (error: any) {
    console.error('Update deployment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
}

export default new ResourceController();