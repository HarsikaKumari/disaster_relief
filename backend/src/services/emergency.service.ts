import prisma from '../config/prisma';
import { CreateEmergencyInput, UpdateEmergencyInput, AssignEmergencyInput } from '../types/emergency.types';

export class EmergencyService {
  async createEmergency(userId: string, data: CreateEmergencyInput) {
    return prisma.emergency.create({
      data: {
        title: data.title,
        type: data.type,
        severity: data.severity,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        victimName: data.victimName,
        victimPhone: data.victimPhone,
        victimCount: data.victimCount || 1,
        images: data.images || [],
        reportedById: userId,
      },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getAllEmergencies(filters?: { status?: string; severity?: string; type?: string }) {
    return prisma.emergency.findMany({
      where: {
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.severity && { severity: filters.severity as any }),
        ...(filters?.type && { type: filters.type as any }),
      },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmergencyById(emergencyId: string) {
    return prisma.emergency.findUnique({
      where: { id: emergencyId },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        resourceRequests: {
          include: {
            resource: true,
          },
        },
      },
    });
  }

  async updateEmergency(emergencyId: string, data: UpdateEmergencyInput) {
    return prisma.emergency.update({
      where: { id: emergencyId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.severity && { severity: data.severity }),
        ...(data.status && { status: data.status }),
        ...(data.description && { description: data.description }),
        ...(data.location && { location: data.location }),
        ...(data.latitude && { latitude: data.latitude }),
        ...(data.longitude && { longitude: data.longitude }),
        ...(data.victimCount && { victimCount: data.victimCount }),
        ...(data.resolutionNotes && { resolutionNotes: data.resolutionNotes }),
        ...(data.status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async assignEmergency(emergencyId: string, data: AssignEmergencyInput) {
    return prisma.emergency.update({
      where: { id: emergencyId },
      data: {
        assignedToId: data.assignedToId,
        assignedAt: new Date(),
        status: 'ASSIGNED',
      },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getEmergencyStats() {
    const [total, active, resolved, pending] = await Promise.all([
      prisma.emergency.count(),
      prisma.emergency.count({ where: { status: { in: ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.emergency.count({ where: { status: 'RESOLVED' } }),
      prisma.emergency.count({ where: { status: 'PENDING' } }),
    ]);

    return { total, active, resolved, pending };
  }

  async getNearbyEmergencies(lat: number, lng: number, radius: number = 10) {
    return prisma.$queryRaw`
      SELECT * FROM emergencies
      WHERE ST_Distance(
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      ) <= ${radius * 1000}
      AND status != 'RESOLVED'
      ORDER BY created_at DESC
      LIMIT 20
    `;
  }

  async deleteEmergency(emergencyId: string) {
    return prisma.emergency.delete({
      where: { id: emergencyId },
    });
  }
}

export default new EmergencyService();