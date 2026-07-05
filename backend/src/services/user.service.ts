import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
export class UserService {
  async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isActive: true,
        profileImage: true,
        bio: true,
        skills: true,
        availability: true,
        verifiedVolunteer: true,
        totalHoursVolunteered: true,
        rating: true,
        completedMissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUserProfile(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.profileImage && { profileImage: data.profileImage }),
        ...(data.bio && { bio: data.bio }),
        ...(data.skills && { skills: data.skills }),
        ...(data.availability && { availability: data.availability }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isActive: true,
        profileImage: true,
        bio: true,
        skills: true,
        availability: true,
        verifiedVolunteer: true,
        totalHoursVolunteered: true,
        rating: true,
        completedMissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getAllUsers(filters?: { role?: string; isVerified?: boolean }) {
    return prisma.user.findMany({
      where: {
        ...(filters?.role && { role: filters.role as any }),
        ...(filters?.isVerified !== undefined && { isVerified: filters.isVerified }),
      },
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVolunteerStats() {
    const [total, verified, available] = await Promise.all([
      prisma.user.count({ where: { role: 'VOLUNTEER' } }),
      prisma.user.count({ where: { role: 'VOLUNTEER', verifiedVolunteer: true } }),
      prisma.user.count({ where: { role: 'VOLUNTEER', availability: 'AVAILABLE' } }),
    ]);

    return { total, verified, available };
  }
  // ========== CHANGE PASSWORD ==========
async changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}
}

export default new UserService();