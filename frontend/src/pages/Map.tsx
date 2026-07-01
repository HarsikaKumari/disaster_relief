import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Shield,
  Users,
  Clock,
  AlertTriangle,
  Navigation,
  Filter,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Home,
  Truck,
  Heart,
} from 'lucide-react';
import { Button } from '../components/ui/button';

// ============================================
// TYPES
// ============================================

interface EmergencyMarker {
  id: string;
  title: string;
  type: 'flood' | 'earthquake' | 'fire' | 'cyclone' | 'other';
  severity: 'high' | 'medium' | 'low';
  location: { lat: number; lng: number };
  status: 'pending' | 'assigned' | 'resolved';
  reportedAt: string;
  volunteers: number;
}

interface ResourceMarker {
  id: string;
  name: string;
  type: 'shelter' | 'food' | 'medical' | 'water' | 'rescue';
  location: { lat: number; lng: number };
  available: boolean;
  quantity?: number;
}

// ============================================
// SAMPLE DATA (Simulating Real-time)
// ============================================

const generateEmergencies = (): EmergencyMarker[] => [
  {
    id: '1',
    title: 'Flooding in South District',
    type: 'flood',
    severity: 'high',
    location: { lat: 28.6139, lng: 77.209 },
    status: 'assigned',
    reportedAt: '10 min ago',
    volunteers: 12,
  },
  {
    id: '2',
    title: 'Earthquake Tremors - North Zone',
    type: 'earthquake',
    severity: 'medium',
    location: { lat: 28.7041, lng: 77.1025 },
    status: 'pending',
    reportedAt: '25 min ago',
    volunteers: 8,
  },
  {
    id: '3',
    title: 'Fire in Industrial Area',
    type: 'fire',
    severity: 'high',
    location: { lat: 28.6692, lng: 77.4538 },
    status: 'assigned',
    reportedAt: '5 min ago',
    volunteers: 15,
  },
  {
    id: '4',
    title: 'Cyclone Warning - Coastal Area',
    type: 'cyclone',
    severity: 'high',
    location: { lat: 28.5355, lng: 77.391 },
    status: 'pending',
    reportedAt: '45 min ago',
    volunteers: 5,
  },
  {
    id: '5',
    title: 'Water Supply Disruption',
    type: 'other',
    severity: 'low',
    location: { lat: 28.5792, lng: 77.32 },
    status: 'resolved',
    reportedAt: '2 hours ago',
    volunteers: 3,
  },
];

const generateResources = (): ResourceMarker[] => [
  {
    id: 'r1',
    name: 'Community Shelter - Sector 12',
    type: 'shelter',
    location: { lat: 28.64, lng: 77.22 },
    available: true,
    quantity: 45,
  },
  {
    id: 'r2',
    name: 'Food Distribution Center',
    type: 'food',
    location: { lat: 28.68, lng: 77.18 },
    available: true,
    quantity: 200,
  },
  {
    id: 'r3',
    name: 'Medical Camp - Zone B',
    type: 'medical',
    location: { lat: 28.62, lng: 77.15 },
    available: true,
    quantity: 10,
  },
  {
    id: 'r4',
    name: 'Water Supply Point',
    type: 'water',
    location: { lat: 28.7, lng: 77.25 },
    available: false,
  },
  {
    id: 'r5',
    name: 'Rescue Team HQ',
    type: 'rescue',
    location: { lat: 28.59, lng: 77.28 },
    available: true,
    quantity: 25,
  },
];

// ============================================
// MAP COMPONENT
// ============================================

export const Map = () => {
  const [emergencies, setEmergencies] = useState<EmergencyMarker[]>(
    generateEmergencies(),
  );
  const [resources, setResources] =
    useState<ResourceMarker[]>(generateResources());
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyMarker | null>(null);
  const [showResources, setShowResources] = useState(true);
  const [showEmergencies, setShowEmergencies] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(12);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update emergency status or add new one
      const newEmergency: EmergencyMarker = {
        id: `new-${Date.now()}`,
        title: `New ${['Flood', 'Earthquake', 'Fire', 'Cyclone'][Math.floor(Math.random() * 4)]} Report`,
        type: ['flood', 'earthquake', 'fire', 'cyclone'][
          Math.floor(Math.random() * 4)
        ] as any,
        severity: ['high', 'medium', 'low'][
          Math.floor(Math.random() * 3)
        ] as any,
        location: {
          lat: 28.5 + Math.random() * 0.4,
          lng: 77.0 + Math.random() * 0.5,
        },
        status: 'pending',
        reportedAt: 'Just now',
        volunteers: Math.floor(Math.random() * 10) + 1,
      };
      setEmergencies((prev) => [newEmergency, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEmergencies(generateEmergencies());
      setResources(generateResources());
      setIsLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-error text-white';
      case 'medium':
        return 'bg-warning text-white';
      case 'low':
        return 'bg-success text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flood':
        return '🌊';
      case 'earthquake':
        return '🏔️';
      case 'fire':
        return '🔥';
      case 'cyclone':
        return '🌀';
      default:
        return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'assigned':
        return 'bg-info/20 text-info';
      case 'resolved':
        return 'bg-success/20 text-success';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'shelter':
        return '🏠';
      case 'food':
        return '🍲';
      case 'medical':
        return '🏥';
      case 'water':
        return '💧';
      case 'rescue':
        return '🚑';
      default:
        return '📍';
    }
  };

  const filteredEmergencies =
    filterType === 'all'
      ? emergencies
      : emergencies.filter((e) => e.type === filterType);

  return (
    <div className='min-h-screen bg-gradient-to-b from-sand-light via-white to-secondary/20 pt-20 flex flex-col'>
      {/* ========== HEADER ========== */}
      <div className='bg-white/95 backdrop-blur-xl border-b border-sand-dark/20 py-4 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
              <MapPin className='w-5 h-5 text-primary' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-primary'>Live Map</h1>
              <p className='text-xs text-text-secondary'>
                Real-time emergency tracking
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 flex-wrap'>
            {/* Filters */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className='h-9 px-3 bg-sand-light/50 border-sand-dark/30 rounded-lg text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
            >
              <option value='all'>All Types</option>
              <option value='flood'>🌊 Flood</option>
              <option value='earthquake'>🏔️ Earthquake</option>
              <option value='fire'>🔥 Fire</option>
              <option value='cyclone'>🌀 Cyclone</option>
              <option value='other'>📌 Other</option>
            </select>

            <button
              onClick={() => setShowEmergencies(!showEmergencies)}
              className={`h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                showEmergencies
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-sand-light/50 text-text-secondary border border-sand-dark/30'
              }`}
            >
              🚨 Emergencies
            </button>

            <button
              onClick={() => setShowResources(!showResources)}
              className={`h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                showResources
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'bg-sand-light/50 text-text-secondary border border-sand-dark/30'
              }`}
            >
              📦 Resources
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className='h-9 px-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5 disabled:opacity-60'
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ========== MAP & SIDEBAR ========== */}
      <div className='flex-1 flex flex-col md:flex-row'>
        {/* ===== MAP AREA ===== */}
        <div className='flex-1 relative min-h-[400px] md:min-h-[calc(100vh-180px)] bg-sand-light/30'>
          {/* Map Visualization - Interactive SVG/Canvas */}
          <div className='absolute inset-0 p-4'>
            <div className='w-full h-full rounded-2xl bg-gradient-to-br from-primary/5 via-sand-light to-secondary/20 border border-sand-dark/20 relative overflow-hidden'>
              {/* Grid Lines */}
              <div className='absolute inset-0 opacity-10'>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className='absolute w-full border-t border-primary/20'
                    style={{ top: `${i * 5}%` }}
                  />
                ))}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className='absolute h-full border-l border-primary/20'
                    style={{ left: `${i * 5}%` }}
                  />
                ))}
              </div>

              {/* Emergency Markers */}
              {showEmergencies &&
                filteredEmergencies.map((emergency) => (
                  <motion.button
                    key={emergency.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedEmergency(emergency)}
                    className='absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer'
                    style={{
                      left: `${((emergency.location.lng - 77.0) / 0.5) * 100}%`,
                      top: `${((emergency.location.lat - 28.5) / 0.4) * 100}%`,
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${getSeverityColor(emergency.severity)} flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse-slow`}
                    >
                      <span className='text-sm'>
                        {getTypeIcon(emergency.type)}
                      </span>
                    </div>
                    <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-text-primary opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-0.5 rounded-full shadow-sm'>
                      {emergency.title.slice(0, 20)}
                    </div>
                  </motion.button>
                ))}

              {/* Resource Markers */}
              {showResources &&
                resources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer'
                    style={{
                      left: `${((resource.location.lng - 77.0) / 0.5) * 100}%`,
                      top: `${((resource.location.lat - 28.5) / 0.4) * 100}%`,
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${resource.available ? 'bg-success/20 border-2 border-success' : 'bg-error/20 border-2 border-error'} flex items-center justify-center`}
                    >
                      <span className='text-xs'>
                        {getResourceIcon(resource.type)}
                      </span>
                    </div>
                    <div className='absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm'>
                      {resource.name.slice(0, 15)}
                    </div>
                  </motion.div>
                ))}

              {/* Zoom Controls */}
              <div className='absolute bottom-4 right-4 flex flex-col gap-1.5'>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 1, 20))}
                  className='w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg shadow-soft hover:shadow-medium transition-shadow flex items-center justify-center text-primary border border-sand-dark/20'
                >
                  <ZoomIn className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 1, 1))}
                  className='w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg shadow-soft hover:shadow-medium transition-shadow flex items-center justify-center text-primary border border-sand-dark/20'
                >
                  <ZoomOut className='w-4 h-4' />
                </button>
              </div>

              {/* Legend */}
              <div className='absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-soft border border-sand-dark/20 text-xs'>
                <p className='font-semibold text-text-primary mb-1.5'>Legend</p>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-error' />
                    <span className='text-text-secondary'>High Severity</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-warning' />
                    <span className='text-text-secondary'>Medium Severity</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-success' />
                    <span className='text-text-secondary'>Low Severity</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-success/50 border border-success' />
                    <span className='text-text-secondary'>
                      Resource Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Map Info */}
              <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-soft border border-sand-dark/20 text-xs text-text-secondary'>
                🗺️ {filteredEmergencies.length} emergencies • {resources.length}{' '}
                resources • Zoom: {zoom}x
              </div>
            </div>
          </div>
        </div>

        {/* ===== SIDEBAR ===== */}
        <div className='w-full md:w-80 lg:w-96 bg-white/95 backdrop-blur-xl border-l border-sand-dark/20 p-4 max-h-[400px] md:max-h-[calc(100vh-180px)] overflow-y-auto'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-text-primary'>Emergency Feed</h3>
            <span className='text-xs text-text-secondary'>
              {filteredEmergencies.length} active
            </span>
          </div>

          {filteredEmergencies.length === 0 ? (
            <div className='text-center py-8 text-text-tertiary'>
              <AlertTriangle className='w-8 h-8 mx-auto mb-2 opacity-50' />
              <p className='text-sm'>No emergencies reported</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {filteredEmergencies.map((emergency) => (
                <motion.div
                  key={emergency.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedEmergency?.id === emergency.id
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'border-sand-dark/20 hover:border-primary/30 hover:bg-sand-light/30'
                  }`}
                  onClick={() => setSelectedEmergency(emergency)}
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-1.5'>
                        <span>{getTypeIcon(emergency.type)}</span>
                        <p className='font-medium text-sm text-text-primary truncate'>
                          {emergency.title}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 mt-1 flex-wrap'>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${getSeverityColor(emergency.severity)}`}
                        >
                          {emergency.severity}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(emergency.status)}`}
                        >
                          {emergency.status}
                        </span>
                        <span className='text-[10px] text-text-tertiary'>
                          {emergency.reportedAt}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-1 text-xs text-text-secondary'>
                      <Users className='w-3 h-3' />
                      {emergency.volunteers}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className='mt-4 pt-4 border-t border-sand-dark/20'>
            <Link to='/report'>
              <button className='w-full h-9 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2'>
                <AlertTriangle className='w-4 h-4' />
                Report Emergency
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
