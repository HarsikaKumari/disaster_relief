import prisma from '../config/prisma';
import { CreateEmergencyInput, UpdateEmergencyInput, AssignEmergencyInput } from '../types/emergency.types';
import notificationService from './notification.service';

export class EmergencyService {
  // ========== CREATE EMERGENCY ==========
  async createEmergency(userId: string, data: CreateEmergencyInput) {
    const emergency = await prisma.emergency.create({
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

    // ✅ Send notification to admins and volunteers
    await notificationService.sendEmergencyAlert(emergency.id);

    // ✅ Add timeline entry
    await prisma.emergencyTimeline.create({
      data: {
        emergencyId: emergency.id,
        action: 'CREATED',
        description: `Emergency "${emergency.title}" reported by ${emergency.reportedBy?.name || 'Unknown'}`,
        performedById: userId,
        metadata: {
          type: emergency.type,
          severity: emergency.severity,
          location: emergency.location,
        },
      },
    });

    return emergency;
  }

  // ========== GET ALL EMERGENCIES ==========
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

  // ========== GET EMERGENCY BY ID ==========
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
          include: {
            updatedBy: {
              select: { id: true, name: true },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
          include: {
            performedBy: {
              select: { id: true, name: true },
            },
          },
        },
        resourceRequests: {
          include: {
            resource: true,
          },
        },
      },
    });
  }

  // ========== UPDATE EMERGENCY ==========
  async updateEmergency(emergencyId: string, data: UpdateEmergencyInput) {
    const oldEmergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
    });

    const emergency = await prisma.emergency.update({
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
        // @ts-ignore
        ...(data.images && { images: data.images }),
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

    // ✅ Send notification if status changed
    if (data.status) {
      await notificationService.sendStatusUpdateNotification(emergencyId, data.status);
    }

    // ✅ Add timeline entry for status change
    if (data.status && data.status !== oldEmergency?.status) {
      await prisma.emergencyTimeline.create({
        data: {
          emergencyId,
          action: 'STATUS_CHANGED',
          description: `Status changed from ${oldEmergency?.status} to ${data.status}`,
          performedById: emergency.reportedBy?.id || '',
          metadata: { oldStatus: oldEmergency?.status, newStatus: data.status },
        },
      });
    }

    return emergency;
  }

  // ========== ASSIGN EMERGENCY ==========
  async assignEmergency(emergencyId: string, data: AssignEmergencyInput) {
    const emergency = await prisma.emergency.update({
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

    // ✅ Send assignment notification to volunteer and admins
    await notificationService.sendAssignmentNotification(emergencyId, data.assignedToId);

    // ✅ Add timeline entry for assignment
    await prisma.emergencyTimeline.create({
      data: {
        emergencyId,
        action: 'ASSIGNED',
        description: `Assigned to ${emergency.assignedTo?.name || 'Unknown'}`,
        performedById: emergency.reportedBy?.id || '',
        metadata: { assignedToId: data.assignedToId },
      },
    });

    return emergency;
  }

  // ========== ADD EMERGENCY UPDATE ==========
  async addEmergencyUpdate(emergencyId: string, userId: string, data: {
    status: string;
    message: string;
    location?: string;
    images?: string[];
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const update = await prisma.emergencyUpdate.create({
      data: {
        emergencyId,
        status: data.status as any,
        message: data.message,
        location: data.location,
        updatedById: userId,
        updatedByName: user?.name || 'Unknown',
        images: data.images || [], 
      },
      include: {
        updatedBy: {
          select: { id: true, name: true },
        },
      },
    });

    // ✅ Update emergency status
    await prisma.emergency.update({
      where: { id: emergencyId },
      data: {
        status: data.status as any,
      },
    });

    // ✅ Add timeline entry
    await prisma.emergencyTimeline.create({
      data: {
        emergencyId,
        action: 'UPDATED',
        description: data.message,
        performedById: userId,
        metadata: { status: data.status, location: data.location },
      },
    });

    return update;
  }

  // ========== ADD IMAGES TO EMERGENCY ==========
  async addEmergencyImages(emergencyId: string, imageUrls: string[]) {
    const emergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
    });

    if (!emergency) throw new Error('Emergency not found');

    const updatedImages = [...(emergency.images || []), ...imageUrls];

    const updatedEmergency = await prisma.emergency.update({
      where: { id: emergencyId },
      data: {
        images: updatedImages,
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

    // ✅ Add timeline entry for images
    await prisma.emergencyTimeline.create({
      data: {
        emergencyId,
        action: 'IMAGES_ADDED',
        description: `${imageUrls.length} image(s) added to emergency`,
        performedById: emergency.reportedById|| '',
        metadata: { imageCount: imageUrls.length, images: imageUrls },
      },
    });

    return updatedEmergency;
  }

  // ========== GET EMERGENCY TIMELINE ==========
  async getEmergencyTimeline(emergencyId: string) {
    return prisma.emergencyTimeline.findMany({
      where: { emergencyId },
      include: {
        performedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ========== GET EMERGENCY UPDATES ==========
  async getEmergencyUpdates(emergencyId: string) {
    return prisma.emergencyUpdate.findMany({
      where: { emergencyId },
      include: {
        updatedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ========== GET EMERGENCY STATS ==========
  async getEmergencyStats() {
    const [total, active, resolved, pending] = await Promise.all([
      prisma.emergency.count(),
      prisma.emergency.count({ where: { status: { in: ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.emergency.count({ where: { status: 'RESOLVED' } }),
      prisma.emergency.count({ where: { status: 'PENDING' } }),
    ]);

    return { total, active, resolved, pending };
  }

  // ========== GET NEARBY EMERGENCIES ==========
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

  // ========== DELETE EMERGENCY ==========
  async deleteEmergency(emergencyId: string, user:string) {
    // ✅ Add timeline entry for deletion
    console.log(user)
    await prisma.emergencyTimeline.create({
      data: {
        emergencyId,
        action: 'DELETED',
        description: 'Emergency deleted',
        // @ts-ignore
        performedById: user,
        metadata: { deletedAt: new Date() },
      },
    });

    return prisma.emergency.delete({
      where: { id: emergencyId },
    });
  }
}

export default new EmergencyService();