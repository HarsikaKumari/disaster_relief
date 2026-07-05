export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalVolunteers: number;
  totalNGOs: number;
  activeUsers: number;
  inactiveUsers: number;
  
  totalEmergencies: number;
  activeEmergencies: number;
  resolvedEmergencies: number;
  pendingEmergencies: number;
  criticalEmergencies: number;
  
  totalResources: number;
  availableResources: number;
  deployedResources: number;
  depletedResources: number;
  
  totalVolunteerHours: number;
  totalMissionsCompleted: number;
  
  emergencyTrend: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  
  resourceUtilization: {
    food: number;
    water: number;
    medical: number;
    shelter: number;
    transport: number;
    other: number;
  };
  
  responseTime: {
    average: number;
    min: number;
    max: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'EMERGENCY' | 'RESOURCE' | 'VOLUNTEER' | 'USER' | 'SYSTEM';
  title: string;
  description: string;
  time: Date;
  user: {
    id: string;
    name: string;
  };
  status?: string;
}

export interface UserManagementFilters {
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}