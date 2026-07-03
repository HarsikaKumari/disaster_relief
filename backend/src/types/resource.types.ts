export interface CreateResourceInput {
  name: string;
  type: 'FOOD' | 'WATER' | 'MEDICAL' | 'SHELTER' | 'TRANSPORT' | 'RESCUE_TEAM' | 'COMMUNICATION' | 'SANITATION' | 'CLOTHING' | 'ELECTRICITY' | 'OTHER';
  description?: string;
  quantity: number;
  availableQty: number;
  unit: string;
  latitude: number;
  longitude: number;
  location: string;
  expiryDate?: Date;
}

export interface UpdateResourceInput {
  name?: string;
  description?: string;
  quantity?: number;
  availableQty?: number;
  unit?: string;
  location?: string;
  status?: 'AVAILABLE' | 'IN_TRANSIT' | 'DEPLOYED' | 'DEPLETED' | 'RESERVED';
  expiryDate?: Date;
}

export interface ResourceRequestInput {
  emergencyId: string;
  resourceId: string;
  requestedQty: number;
  notes?: string;
}

export interface ResourceDeploymentInput {
  resourceId: string;
  emergencyId: string;
  quantity: number;
  notes?: string;
}