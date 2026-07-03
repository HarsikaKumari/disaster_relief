import prisma from '../config/prisma';
import emergencyService from './emergency.service';
import resourceService from './resource.service';
import userService from './user.service';

export class DashboardService {
  async getDashboardStats() {
    const [emergencyStats, resourceStats, volunteerStats] = await Promise.all([
      emergencyService.getEmergencyStats(),
      resourceService.getResourceStats(),
      userService.getVolunteerStats(),
    ]);

    return {
      totalEmergencies: emergencyStats.total,
      activeEmergencies: emergencyStats.active,
      resolvedToday: emergencyStats.resolved,
      resourcesAvailable: resourceStats.available,
      availableVolunteers: volunteerStats.available,
      responseTime: 4.5, // Can be calculated from actual data
    };
  }

  async getRecentActivities(limit: number = 5) {
    const [emergencies, deployments, updates] = await Promise.all([
      prisma.emergency.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reportedBy: {
            select: { name: true },
          },
        },
      }),
      prisma.resourceDeployment.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          resource: true,
          emergency: true,
        },
      }),
      prisma.emergencyUpdate.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          emergency: true,
          updatedBy: {
            select: { name: true },
          },
        },
      }),
    ]);

    const activities = [
      ...emergencies.map(e => ({
        id: e.id,
        type: 'EMERGENCY' as const,
        title: `New Emergency Reported: ${e.title}`,
        description: `Reported by ${e.reportedBy.name}`,
        time: e.createdAt,
        status: e.status,
      })),
      ...deployments.map(d => ({
        id: d.id,
        type: 'RESOURCE' as const,
        title: `${d.resource.name} Deployed`,
        description: `To ${d.emergency.title}`,
        time: d.createdAt,
        status: d.status,
      })),
      ...updates.map(u => ({
        id: u.id,
        type: 'SYSTEM' as const,
        title: `Emergency Update: ${u.message}`,
        description: `Updated by ${u.updatedByName}`,
        time: u.createdAt,
        status: u.status,
      })),
    ];

    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit);
  }
}

export default new DashboardService();