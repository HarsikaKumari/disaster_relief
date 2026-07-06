import prisma from "../config/prisma";
import {
  UpdateVolunteerInput,
  VolunteerFilters,
} from "../types/volunteer.types";

export class VolunteerService {
  // ========== GET ALL VOLUNTEERS ==========
 async getAllVolunteers(filters: VolunteerFilters = {}) {
    const { availability,  search, limit = 20, page = 1 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      role: "VOLUNTEER",
      isActive: true,
    };

    if (availability) {
      where.availability = availability;
    }

    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { skills: { has: search } },
      ];
    }

    const [volunteers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
          bio: true,
          skills: true,
          availability: true,
          verifiedVolunteer: true,
          verificationDate: true,
          totalHoursVolunteered: true,
          rating: true,
          completedMissions: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true, // ✅ Debug - see who is verified
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
      }),
      prisma.user.count({ where }),
    ]);


    return {
      data: volunteers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
}

  // ========== GET VOLUNTEER BY ID ==========
  async getVolunteerById(volunteerId: string) {
    const volunteer = await prisma.user.findUnique({
      where: {
        id: volunteerId,
        role: "VOLUNTEER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        bio: true,
        skills: true,
        availability: true,
        verifiedVolunteer: true,
        verificationDate: true,
        totalHoursVolunteered: true,
        rating: true,
        completedMissions: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelation: true,
        createdAt: true,
        updatedAt: true,
        assignedEmergencies: {
          where: {
            status: {
              in: ["ASSIGNED", "IN_PROGRESS"],
            },
          },
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          take: 5,
        },
      },
    });

    if (!volunteer) {
      throw new Error("Volunteer not found");
    }

    return volunteer;
  }

  // ========== UPDATE VOLUNTEER ==========
  async updateVolunteer(volunteerId: string, data: UpdateVolunteerInput) {
    return prisma.user.update({
      where: { id: volunteerId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.bio && { bio: data.bio }),
        ...(data.skills && { skills: data.skills }),
        ...(data.availability && { availability: data.availability }),
        ...(data.verifiedVolunteer !== undefined && {
          verifiedVolunteer: data.verifiedVolunteer,
          ...(data.verifiedVolunteer && { verificationDate: new Date() }),
        }),
        ...(data.emergencyContactName && {
          emergencyContactName: data.emergencyContactName,
        }),
        ...(data.emergencyContactPhone && {
          emergencyContactPhone: data.emergencyContactPhone,
        }),
        ...(data.emergencyContactRelation && {
          emergencyContactRelation: data.emergencyContactRelation,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        bio: true,
        skills: true,
        availability: true,
        verifiedVolunteer: true,
        verificationDate: true,
        totalHoursVolunteered: true,
        rating: true,
        completedMissions: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        updatedAt: true,
      },
    });
  }

  // ========== VERIFY VOLUNTEER ==========
  async verifyVolunteer(volunteerId: string) {
    return prisma.user.update({
      where: { id: volunteerId, role: "VOLUNTEER" },
      data: {
        verifiedVolunteer: true,
        verificationDate: new Date(),
      },
    });
  }

  // ========== UNVERIFY VOLUNTEER ==========
  async unverifyVolunteer(volunteerId: string) {
    return prisma.user.update({
      where: { id: volunteerId, role: "VOLUNTEER" },
      data: {
        verifiedVolunteer: false,
        verificationDate: null,
      },
    });
  }

  // ========== GET VOLUNTEER STATS ==========
  async getVolunteerStats() {
    const [total, available, verified, unverified] = await Promise.all([
      prisma.user.count({ where: { role: "VOLUNTEER", isActive: true } }),
      prisma.user.count({
        where: { role: "VOLUNTEER", availability: "AVAILABLE", isActive: true },
      }),
      prisma.user.count({
        where: { role: "VOLUNTEER", verifiedVolunteer: true, isActive: true },
      }),
      prisma.user.count({
        where: { role: "VOLUNTEER", verifiedVolunteer: false, isActive: true },
      }),
    ]);

    const totalHours = await prisma.user.aggregate({
      where: { role: "VOLUNTEER", isActive: true },
      _sum: {
        totalHoursVolunteered: true,
      },
    });

    return {
      total,
      available,
      verified,      // ✅ Admin verified volunteers
      unverified,    // ✅ Not admin verified yet
      totalHoursVolunteered: totalHours._sum.totalHoursVolunteered || 0,
    };
  }

  // ========== DELETE VOLUNTEER ==========
  async deleteVolunteer(volunteerId: string) {
    // Soft delete - just deactivate
    return prisma.user.update({
      where: { id: volunteerId },
      data: {
        isActive: false,
      },
    });
  }

  // ========== ASSIGN VOLUNTEER TO EMERGENCY ==========
  async assignToEmergency(volunteerId: string, emergencyId: string) {
    return prisma.emergency.update({
      where: { id: emergencyId },
      data: {
        assignedToId: volunteerId,
        assignedAt: new Date(),
        status: "ASSIGNED",
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  // ========== CHANGE PASSWORD ==========
  async changePassword(volunteerId: string, newPassword: string) {
    // Password hashing will be done in controller
    return prisma.user.update({
      where: { id: volunteerId },
      data: {
        password: newPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });
  }

  // ========== GET VOLUNTEER BY EMAIL ==========
  async getVolunteerByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email, role: "VOLUNTEER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        bio: true,
        skills: true,
        availability: true,
        verifiedVolunteer: true,
        totalHoursVolunteered: true,
        rating: true,
        completedMissions: true,
      },
    });
  }

  // ========== GET VOLUNTEER STATS BY ID ==========
  async getVolunteerStatsById(volunteerId: string) {
    const stats = await prisma.user.findUnique({
      where: { id: volunteerId, role: "VOLUNTEER" },
      select: {
        id: true,
        name: true,
        totalHoursVolunteered: true,
        completedMissions: true,
        rating: true,
        verifiedVolunteer: true,
        _count: {
          select: {
            assignedEmergencies: true,
          },
        },
      },
    });

    if (!stats) {
      throw new Error("Volunteer not found");
    }

    return stats;
  }
}

export default new VolunteerService();