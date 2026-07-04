export interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  profileImage?: string;
  bio?: string;
  skills: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY' | 'UNREACHABLE';
  verifiedVolunteer: boolean;
  verificationDate?: Date;
  totalHoursVolunteered: number;
  rating: number;
  completedMissions: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateVolunteerInput {
  name?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  availability?: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY' | 'UNREACHABLE';
  verifiedVolunteer?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface VolunteerFilters {
  availability?: string;
  verified?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}