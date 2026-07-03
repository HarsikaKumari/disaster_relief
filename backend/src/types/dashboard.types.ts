export interface DashboardStats {
  totalEmergencies: number;
  activeEmergencies: number;
  availableVolunteers: number;
  resourcesAvailable: number;
  resolvedToday: number;
  averageResponseTime: number;
}

export interface RecentActivity {
  id: string;
  type: 'EMERGENCY' | 'RESOURCE' | 'VOLUNTEER' | 'SYSTEM';
  title: string;
  description: string;
  time: Date;
  status?: string;
}