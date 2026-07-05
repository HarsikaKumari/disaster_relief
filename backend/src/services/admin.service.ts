import prisma from '../config/prisma';
import { DashboardStats, RecentActivity, UserManagementFilters } from '../types/admin.types';

export class AdminService {
  // ========== DASHBOARD ==========
  async getDashboardStats(): Promise<DashboardStats> {
    console.log('📊 Fetching dashboard stats...');

    try {
      const [
        totalUsers, totalAdmins, totalVolunteers, totalNGOs, activeUsers, inactiveUsers,
        totalEmergencies, activeEmergencies, resolvedEmergencies, pendingEmergencies, criticalEmergencies,
        totalResources, availableResources, deployedResources, depletedResources,
        totalVolunteerHours, totalMissionsCompleted,
        resourceUtilization
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'VOLUNTEER' } }),
        prisma.user.count({ where: { role: 'NGO' } }),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: false } }),
        prisma.emergency.count(),
        prisma.emergency.count({ where: { status: { in: ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'] } } }),
        prisma.emergency.count({ where: { status: 'RESOLVED' } }),
        prisma.emergency.count({ where: { status: 'PENDING' } }),
        prisma.emergency.count({ where: { severity: 'CRITICAL' } }),
        prisma.resource.count({ where: { isActive: true } }),
        prisma.resource.count({ where: { status: 'AVAILABLE', isActive: true } }),
        prisma.resource.count({ where: { status: 'DEPLOYED', isActive: true } }),
        prisma.resource.count({ where: { status: 'DEPLETED', isActive: true } }),
        prisma.user.aggregate({ where: { role: 'VOLUNTEER' }, _sum: { totalHoursVolunteered: true } }),
        prisma.user.aggregate({ where: { role: 'VOLUNTEER' }, _sum: { completedMissions: true } }),
        prisma.resource.groupBy({ by: ['type'], _sum: { availableQty: true }, where: { isActive: true } }),
      ]);

      const [dailyTrend, weeklyTrend, monthlyTrend] = await Promise.all([
        this.getEmergencyTrendOptimized(7),
        this.getEmergencyTrendOptimized(30),
        this.getEmergencyTrendOptimized(90),
      ]);

      const responseTimeData = await this.getResponseTimeOptimized();

      const resourceUtil = resourceUtilization.reduce((acc, curr) => {
        acc[curr.type.toLowerCase() as keyof typeof acc] = curr._sum.availableQty || 0;
        return acc;
      }, { food: 0, water: 0, medical: 0, shelter: 0, transport: 0, other: 0 });

      return {
        totalUsers, totalAdmins, totalVolunteers, totalNGOs, activeUsers, inactiveUsers,
        totalEmergencies, activeEmergencies, resolvedEmergencies, pendingEmergencies, criticalEmergencies,
        totalResources, availableResources, deployedResources, depletedResources,
        totalVolunteerHours: totalVolunteerHours._sum.totalHoursVolunteered || 0,
        totalMissionsCompleted: totalMissionsCompleted._sum.completedMissions || 0,
        emergencyTrend: { daily: dailyTrend, weekly: weeklyTrend, monthly: monthlyTrend },
        resourceUtilization: resourceUtil,
        responseTime: responseTimeData,
      };
    } catch (error) {
      console.error('❌ Dashboard stats error:', error);
      throw error;
    }
  }

  async getEmergencyTrendOptimized(days: number): Promise<number[]> {
    try {
      const now = new Date();
      const queries = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        queries.push(prisma.emergency.count({
          where: { createdAt: { gte: date, lt: nextDate } },
        }));
      }
      return await Promise.all(queries);
    } catch (error) {
      return Array(days).fill(0);
    }
  }

  async getResponseTimeOptimized() {
    try {
      const emergencies = await prisma.emergency.findMany({
        where: { resolvedAt: { not: null }, assignedAt: { not: null } },
        select: { assignedAt: true, resolvedAt: true },
      });

      let avgResponseTime = 0, minResponseTime = 0, maxResponseTime = 0;
      if (emergencies.length > 0) {
        const responseTimes = emergencies
          .filter(e => e.assignedAt && e.resolvedAt)
          .map(e => (new Date(e.resolvedAt!).getTime() - new Date(e.assignedAt!).getTime()) / (1000 * 60));
        if (responseTimes.length > 0) {
          avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
          minResponseTime = Math.min(...responseTimes);
          maxResponseTime = Math.max(...responseTimes);
        }
      }
      return {
        average: Math.round(avgResponseTime * 10) / 10,
        min: Math.round(minResponseTime * 10) / 10,
        max: Math.round(maxResponseTime * 10) / 10,
      };
    } catch (error) {
      return { average: 0, min: 0, max: 0 };
    }
  }

  // ========== USERS ==========
  // ========== GET ALL USERS (FIXED) ==========
async getAllUsers(filters: UserManagementFilters = {}) {
  try {
    const { role, isVerified, isActive, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    // ✅ Fix: Role filter - case insensitive
    if (role && role !== 'all') {
      where.role = role;
    }

    // ✅ Fix: Boolean filters
    if (isVerified !== undefined && isVerified !== null) {
      where.isVerified = isVerified;
    }

    if (isActive !== undefined && isActive !== null) {
      where.isActive = isActive;
    }

    // ✅ Fix: Search filter
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    console.log('🔍 Admin - Fetching users with where:', JSON.stringify(where, null, 2));

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          isActive: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          verifiedVolunteer: true,
          totalHoursVolunteered: true,
          completedMissions: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.user.count({ where }),
    ]);

    console.log(`✅ Admin - Found ${users.length} users, Total: ${total}`);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('❌ Get all users error:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      },
    };
  }
}
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        isVerified: true, isActive: true, profileImage: true,
        bio: true, skills: true, availability: true,
        verifiedVolunteer: true, verificationDate: true,
        totalHoursVolunteered: true, rating: true, completedMissions: true,
        emergencyContactName: true, emergencyContactPhone: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async verifyUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isVerified: true, verifiedVolunteer: true, verificationDate: new Date() },
    });
  }

  async banUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async unbanUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }

  async changeUserRole(userId: string, role: string) {
    const validRoles = ['ADMIN', 'VOLUNTEER', 'CITIZEN', 'NGO'];
    if (!validRoles.includes(role)) throw new Error('Invalid role');
    return prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
  }

  async deleteUser(userId: string) {
    return prisma.user.delete({ where: { id: userId } });
  }

  // ========== RECENT ACTIVITIES ==========
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const [emergencies, deployments, volunteerVerifications] = await Promise.all([
        prisma.emergency.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { reportedBy: { select: { id: true, name: true } } },
        }),
        prisma.resourceDeployment.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { resource: true, emergency: { select: { id: true, title: true } } },
        }),
        prisma.user.findMany({
          take: limit,
          where: { verifiedVolunteer: true, verificationDate: { not: null } },
          orderBy: { verificationDate: 'desc' },
          select: { id: true, name: true, verificationDate: true },
        }),
      ]);

      const activities: RecentActivity[] = [];

      emergencies.forEach((e) => {
        activities.push({
          id: e.id,
          type: 'EMERGENCY',
          title: `New Emergency: ${e.title}`,
          description: `${e.type} - ${e.location}`,
          time: e.createdAt,
          user: { id: e.reportedBy.id, name: e.reportedBy.name },
          status: e.status,
        });
      });

      deployments.forEach((d) => {
        activities.push({
          id: d.id,
          type: 'RESOURCE',
          title: `${d.resource.name} Deployed`,
          description: `To ${d.emergency?.title || 'Emergency'}`,
          time: d.createdAt,
          user: { id: 'system', name: 'System' },
          status: d.status,
        });
      });

      volunteerVerifications.forEach((v) => {
        activities.push({
          id: v.id,
          type: 'VOLUNTEER',
          title: `Volunteer Verified`,
          description: `${v.name} is now verified`,
          time: v.verificationDate!,
          user: { id: v.id, name: v.name },
          status: 'Verified',
        });
      });

      return activities
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  }

  // ========== SYSTEM ==========
  async getSystemStats() {
    try {
      const [totalChatRooms, totalMessages, totalNotifications] = await Promise.all([
        prisma.chatRoom.count(),
        prisma.chatMessage.count(),
        prisma.notification.count(),
      ]);

      const activeChats = await prisma.chatRoom.count({
        where: { updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      });

      return {
        totalChatRooms,
        activeChats,
        totalMessages,
        totalNotifications,
        unreadNotifications: await prisma.notification.count({ where: { isRead: false } }),
      };
    } catch (error) {
      return { totalChatRooms: 0, activeChats: 0, totalMessages: 0, totalNotifications: 0, unreadNotifications: 0 };
    }
  }
}

export default new AdminService();