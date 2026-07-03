export interface CreateEmergencyInput {
  title: string;
  type: 'FLOOD' | 'EARTHQUAKE' | 'FIRE' | 'CYCLONE' | 'LANDSLIDE' | 'PANDEMIC' | 'ACCIDENT' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  victimName?: string;
  victimPhone?: string;
  victimCount?: number;
  images?: string[];
}

export interface UpdateEmergencyInput {
  title?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'PENDING' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  victimCount?: number;
  resolutionNotes?: string;
}

export interface AssignEmergencyInput {
  assignedToId: string;
}

export interface EmergencyResponse {
  id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  reportedBy: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  victimCount: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}