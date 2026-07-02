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
  Menu,
  Search,
  Bell,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sidebar } from '../components/layouts/sidebar';

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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active='Live Map'
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ===== MAIN ===== */}
      <div className='flex-1 min-w-0 overflow-y-auto h-screen'>
        {/* ===== NAVBAR ===== */}
        <div className='bg-white/50 backdrop-blur-xl rounded-2xl m-3 md:m-4 p-3 shadow-lg shadow-primary/5 border border-white/30 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setMobileOpen(true)}
              className='md:hidden p-1.5 rounded-xl hover:bg-sand-light/50'
            >
              <Menu className='w-5 h-5 text-text-secondary' />
            </button>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
                <MapPin className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h1 className='text-base font-semibold text-text-primary'>
                  Live Map
                </h1>
                <p className='text-xs text-text-tertiary'>
                  Real-time emergency tracking
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm'>
              <Search className='w-3.5 h-3.5 text-text-tertiary' />
              <input
                type='text'
                placeholder='Search location...'
                className='border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60'
              />
            </div>
            <button className='relative p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors'>
              <Bell className='w-5 h-5 text-text-secondary' />
              <span className='absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30' />
            </button>
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-lg shadow-primary/20'>
              JD
            </div>
          </div>
        </div>

        {/* ===== MAP CONTROLS ===== */}
        <div className='px-3 md:px-4 flex flex-wrap items-center gap-2 mb-3'>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className='h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
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
            className={`h-9 px-3 rounded-xl text-sm font-medium transition-colors ${
              showEmergencies
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-white/50 text-text-secondary border border-white/30'
            }`}
          >
            🚨 Emergencies
          </button>

          <button
            onClick={() => setShowResources(!showResources)}
            className={`h-9 px-3 rounded-xl text-sm font-medium transition-colors ${
              showResources
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-white/50 text-text-secondary border border-white/30'
            }`}
          >
            📦 Resources
          </button>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className='h-9 px-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-60 shadow-primary'
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>

        {/* ===== MAP AREA ===== */}
        <div className='px-3 md:px-4 pb-4'>
          <div className='relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-sand-light to-secondary/20 border border-white/30 shadow-lg shadow-primary/5 h-[calc(100vh-300px)]'>
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
                  className='absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10'
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
                  className='absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10'
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
            <div className='absolute bottom-4 right-4 flex flex-col gap-1.5 z-20'>
              <button
                onClick={() => setZoom((z) => Math.min(z + 1, 20))}
                className='w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft hover:shadow-medium transition-shadow flex items-center justify-center text-primary border border-white/30'
              >
                <ZoomIn className='w-4 h-4' />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 1, 1))}
                className='w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft hover:shadow-medium transition-shadow flex items-center justify-center text-primary border border-white/30'
              >
                <ZoomOut className='w-4 h-4' />
              </button>
            </div>

            {/* Legend */}
            <div className='absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-soft border border-white/30 text-xs z-20'>
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
            <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-soft border border-white/30 text-xs text-text-secondary z-20'>
              🗺️ {filteredEmergencies.length} emergencies • {resources.length}{' '}
              resources • Zoom: {zoom}x
            </div>
          </div>
        </div>

        {/* ===== EMERGENCY FEED SIDEBAR (Right) ===== */}
        <div className='px-3 md:px-4 pb-4'>
          <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='font-semibold text-text-primary text-sm'>
                Emergency Feed
              </h3>
              <span className='text-xs text-text-secondary'>
                {filteredEmergencies.length} active
              </span>
            </div>

            {filteredEmergencies.length === 0 ? (
              <div className='text-center py-6 text-text-tertiary'>
                <AlertTriangle className='w-8 h-8 mx-auto mb-2 opacity-50' />
                <p className='text-sm'>No emergencies reported</p>
              </div>
            ) : (
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {filteredEmergencies.map((emergency) => (
                  <motion.div
                    key={emergency.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedEmergency?.id === emergency.id
                        ? 'border-primary bg-primary/5 shadow-soft'
                        : 'border-white/30 hover:border-primary/30 hover:bg-sand-light/30'
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

            <div className='mt-3 pt-3 border-t border-white/20'>
              <Link to='/report'>
                <button className='w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20'>
                  <AlertTriangle className='w-4 h-4' />
                  Report Emergency
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center text-[10px] text-text-tertiary/40 py-3'>
          © 2026 Disaster Relief Coordination Platform
        </div>
      </div>
    </div>
  );
};
