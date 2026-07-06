import prisma from '../config/prisma';
import { CreateResourceInput, UpdateResourceInput, ResourceRequestInput, ResourceDeploymentInput } from '../types/resource.types';

export class ResourceService {
  async createResource(userId: string, data: CreateResourceInput) {
    return prisma.resource.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        quantity: data.quantity,
        availableQty: data.availableQty || data.quantity,
        unit: data.unit || 'units',
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
        providerId: userId,
        providerName: (await prisma.user.findUnique({ where: { id: userId } }))?.name || '',
        expiryDate: data.expiryDate,
      },
    });
  }

  async getAllResources(filters?: { type?: string; status?: string }) {
    return prisma.resource.findMany({
      where: {
        ...(filters?.type && { type: filters.type as any }),
        ...(filters?.status && { status: filters.status as any }),
        isActive: true,
      },
      include: {
        provider: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResourceById(resourceId: string) {
    return prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        provider: {
          select: { id: true, name: true, email: true },
        },
        requests: {
          include: {
            emergency: true,
          },
        },
        deployments: {
          include: {
            emergency: true,
          },
        },
      },
    });
  }

  async updateResource(resourceId: string, data: UpdateResourceInput) {
    return prisma.resource.update({
      where: { id: resourceId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.quantity && { quantity: data.quantity }),
        ...(data.availableQty && { availableQty: data.availableQty }),
        ...(data.unit && { unit: data.unit }),
        ...(data.location && { location: data.location }),
        ...(data.status && { status: data.status }),
        ...(data.expiryDate && { expiryDate: data.expiryDate }),
      },
    });
  }

  async requestResource(userId: string, data: ResourceRequestInput) {
    const resource = await prisma.resource.findUnique({
      where: { id: data.resourceId },
    });

    if (!resource) throw new Error('Resource not found');

    return prisma.resourceRequest.create({
      data: {
        emergencyId: data.emergencyId,
        resourceId: data.resourceId,
        requestedQty: data.requestedQty,
        requestedById: userId,
        notes: data.notes,
      },
      include: {
        emergency: true,
        resource: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async deployResource(data: ResourceDeploymentInput) {
    const resource = await prisma.resource.findUnique({
      where: { id: data.resourceId },
    });

    if (!resource) throw new Error('Resource not found');
    if (resource.availableQty < data.quantity) throw new Error('Insufficient quantity available');

    // Update available quantity
    await prisma.resource.update({
      where: { id: data.resourceId },
      data: {
        availableQty: resource.availableQty - data.quantity,
        status: data.quantity === resource.availableQty ? 'DEPLOYED' : 'AVAILABLE',
      },
    });

    return prisma.resourceDeployment.create({
      data: {
        resourceId: data.resourceId,
        emergencyId: data.emergencyId,
        quantity: data.quantity,
        notes: data.notes,
        status: 'IN_TRANSIT',
      },
      include: {
        resource: true,
        emergency: true,
      },
    });
  }

  async getResourceStats() {
    const [total, available, deployed, depleted] = await Promise.all([
      prisma.resource.count({ where: { isActive: true } }),
      prisma.resource.count({ where: { status: 'AVAILABLE', isActive: true } }),
      prisma.resource.count({ where: { status: 'DEPLOYED', isActive: true } }),
      prisma.resource.count({ where: { status: 'DEPLETED', isActive: true } }),
    ]);

    return { total, available, deployed, depleted };
  }
  async getDeployments() {
    return prisma.resourceDeployment.findMany({
      include: {
        resource: true,
        emergency: true,
      },
      orderBy: {
        deployedAt: 'desc',
      },
    });
  }
}

export default new ResourceService();