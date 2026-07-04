import prisma from '../config/prisma';
import { NotificationType } from '@prisma/client';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  emergencyId?: string;
  resourceId?: string;
  priority?: 0 | 1 | 2;
}

export class NotificationService {
  // ========== CREATE NOTIFICATION ==========
  async createNotification(data: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        emergencyId: data.emergencyId,
        resourceId: data.resourceId,
        priority: data.priority || 0,
        isRead: false,
      },
    });
  }

  // ========== BULK CREATE (Multiple Users) ==========
  async bulkCreateNotifications(
    userIds: string[],
    data: Omit<CreateNotificationInput, 'userId'>
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      emergencyId: data.emergencyId,
      resourceId: data.resourceId,
      priority: data.priority || 0,
      isRead: false,
    }));

    return prisma.notification.createMany({
      data: notifications,
    });
  }

  // ========== GET USER NOTIFICATIONS ==========
  async getUserNotifications(
    userId: string,
    options?: { limit?: number; offset?: number; unreadOnly?: boolean }
  ) {
    const { limit = 20, offset = 0, unreadOnly = false } = options || {};

    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      pagination: {
        total,
        limit,
        offset,
        unreadCount: await this.getUnreadCount(userId),
      },
    };
  }

  // ========== GET UNREAD COUNT ==========
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // ========== MARK AS READ ==========
  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // ========== MARK ALL AS READ ==========
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // ========== DELETE NOTIFICATION ==========
  async deleteNotification(notificationId: string, userId: string) {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  // ========== DELETE ALL READ ==========
  async deleteAllRead(userId: string) {
    return prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });
  }

  // ========== SEND EMERGENCY ALERT ==========
  async sendEmergencyAlert(emergencyId: string) {
    const emergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
      include: {
        reportedBy: true,
      },
    });

    if (!emergency) return;

    // Get all admins and available volunteers
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'VOLUNTEER', availability: 'AVAILABLE' },
        ],
        isActive: true,
      },
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    await this.bulkCreateNotifications(userIds, {
      type: 'EMERGENCY_ALERT',
      title: `🚨 New Emergency Reported`,
      message: `${emergency.title} - ${emergency.location}`,
      link: `/emergencies/${emergency.id}`,
      emergencyId: emergency.id,
      priority: emergency.severity === 'CRITICAL' ? 2 : 
                emergency.severity === 'HIGH' ? 1 : 0,
    });

    return { sentTo: userIds.length };
  }

  // ========== SEND ASSIGNMENT NOTIFICATION ==========
  async sendAssignmentNotification(emergencyId: string, volunteerId: string) {
    const emergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
    });

    if (!emergency) return;

    // To Volunteer
    await this.createNotification({
      userId: volunteerId,
      type: 'VOLUNTEER_ASSIGNMENT',
      title: '📋 New Assignment',
      message: `You have been assigned to: ${emergency.title}`,
      link: `/emergencies/${emergency.id}`,
      emergencyId: emergency.id,
      priority: emergency.severity === 'CRITICAL' ? 2 : 1,
    });

    // To Admin (confirmation)
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true },
    });

    await this.bulkCreateNotifications(
      admins.map((a) => a.id),
      {
        type: 'VOLUNTEER_ASSIGNMENT',
        title: '✅ Volunteer Assigned',
        message: `Volunteer assigned to: ${emergency.title}`,
        link: `/emergencies/${emergency.id}`,
        emergencyId: emergency.id,
        priority: 1,
      }
    );

    return { success: true };
  }

  // ========== SEND STATUS UPDATE ==========
  async sendStatusUpdateNotification(emergencyId: string, newStatus: string) {
    const emergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
      include: {
        assignedTo: true,
        reportedBy: true,
      },
    });

    if (!emergency) return;

    const userIds = [];
    if (emergency.assignedTo) userIds.push(emergency.assignedTo.id);
    if (emergency.reportedBy) userIds.push(emergency.reportedBy.id);

    // Also notify all admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true },
    });
    admins.forEach((a) => userIds.push(a.id));

    await this.bulkCreateNotifications(
      userIds,
      {
        type: 'STATUS_UPDATE',
        title: '📊 Status Update',
        message: `Emergency "${emergency.title}" status changed to ${newStatus.replace('_', ' ')}`,
        link: `/emergencies/${emergency.id}`,
        emergencyId: emergency.id,
        priority: newStatus === 'RESOLVED' ? 1 : 0,
      }
    );

    return { success: true };
  }

  // ========== SEND RESOURCE UPDATE ==========
  async sendResourceUpdateNotification(resourceId: string) {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) return;

    // Notify admins and volunteers
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'VOLUNTEER', isActive: true },
        ],
        isActive: true,
      },
      select: { id: true },
    });

    await this.bulkCreateNotifications(
      users.map((u) => u.id),
      {
        type: 'RESOURCE_UPDATE',
        title: '📦 Resource Update',
        message: `${resource.name} updated - ${resource.availableQty} ${resource.unit} available`,
        link: `/resources/${resource.id}`,
        resourceId: resource.id,
        priority: 0,
      }
    );

    return { success: true };
  }

  // ========== GET NOTIFICATION STATS ==========
  async getNotificationStats(userId: string) {
    const [total, unread, highPriority] = await Promise.all([
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false,
          priority: 2,
        },
      }),
    ]);

    return {
      total,
      unread,
      highPriority,
    };
  }
}

export default new NotificationService();