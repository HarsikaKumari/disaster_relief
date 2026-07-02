import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Truck,
  Shield,
  Users,
  Clock,
  AlertTriangle,
  MapPin,
  Search,
  Filter,
  Plus,
  Bell,
  Menu,
  X,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Package,
  Droplet,
  Home,
  Hospital,
  Utensils,
  Ambulance,
  Wifi,
  Shirt,
  Zap,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Grid3x3,
  List,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Sidebar } from '../components/layouts/sidebar';

// ============================================
// TYPES
// ============================================

interface Resource {
  id: string;
  name: string;
  type:
    | 'food'
    | 'water'
    | 'medical'
    | 'shelter'
    | 'transport'
    | 'rescue_team'
    | 'communication'
    | 'sanitation'
    | 'clothing'
    | 'electricity'
    | 'other';
  quantity: number;
  availableQty: number;
  unit: string;
  location: string;
  provider: string;
  status: 'available' | 'in_transit' | 'deployed' | 'depleted' | 'reserved';
  expiryDate?: string;
  description?: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const sampleResources: Resource[] = [
  {
    id: 'r1',
    name: 'Food Packets - Emergency Rations',
    type: 'food',
    quantity: 500,
    availableQty: 320,
    unit: 'packets',
    location: 'Central Warehouse, Delhi',
    provider: 'NGO - FoodForAll',
    status: 'available',
    description: 'Ready-to-eat meal packets for emergency distribution.',
  },
  {
    id: 'r2',
    name: 'Water Purification Tablets',
    type: 'water',
    quantity: 10000,
    availableQty: 7500,
    unit: 'tablets',
    location: 'Medical Camp - Zone B',
    provider: 'WHO India',
    status: 'available',
    description: 'Chlorine-based water purification tablets.',
  },
  {
    id: 'r3',
    name: 'Medical Kits - Basic',
    type: 'medical',
    quantity: 200,
    availableQty: 145,
    unit: 'kits',
    location: 'Red Cross Camp, Sector 12',
    provider: 'Red Cross India',
    status: 'available',
    expiryDate: '2026-12-31',
    description: 'Basic first aid and emergency medical supplies.',
  },
  {
    id: 'r4',
    name: 'Emergency Shelter Tents',
    type: 'shelter',
    quantity: 50,
    availableQty: 35,
    unit: 'tents',
    location: 'Relief Camp - South District',
    provider: 'UNHCR',
    status: 'deployed',
    description: 'Heavy-duty emergency shelter tents for 10 people each.',
  },
  {
    id: 'r5',
    name: 'Ambulance Services',
    type: 'transport',
    quantity: 12,
    availableQty: 8,
    unit: 'vehicles',
    location: 'Emergency Response HQ',
    provider: 'State Health Department',
    status: 'available',
    description: 'Fully equipped ambulances with paramedics.',
  },
  {
    id: 'r6',
    name: 'Rescue Team - Unit Alpha',
    type: 'rescue_team',
    quantity: 5,
    availableQty: 3,
    unit: 'teams',
    location: 'Fire Station - Sector 5',
    provider: 'National Disaster Response Force',
    status: 'deployed',
    description: 'Specialized rescue team with equipment.',
  },
  {
    id: 'r7',
    name: 'Satellite Communication Devices',
    type: 'communication',
    quantity: 25,
    availableQty: 18,
    unit: 'devices',
    location: 'Control Room, Central',
    provider: 'ISRO',
    status: 'available',
    description: 'Portable satellite phones and internet devices.',
  },
  {
    id: 'r8',
    name: 'Portable Toilets',
    type: 'sanitation',
    quantity: 100,
    availableQty: 72,
    unit: 'units',
    location: 'Warehouse - North Zone',
    provider: 'UNICEF',
    status: 'reserved',
    description: 'Emergency portable sanitation units.',
  },
];

// ============================================
// RESOURCE CARD COMPONENT
// ============================================

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food':
        return <Utensils className='w-4 h-4' />;
      case 'water':
        return <Droplet className='w-4 h-4' />;
      case 'medical':
        return <Hospital className='w-4 h-4' />;
      case 'shelter':
        return <Home className='w-4 h-4' />;
      case 'transport':
        return <Truck className='w-4 h-4' />;
      case 'rescue_team':
        return <Ambulance className='w-4 h-4' />;
      case 'communication':
        return <Wifi className='w-4 h-4' />;
      case 'sanitation':
        return <Shirt className='w-4 h-4' />;
      case 'clothing':
        return <Shirt className='w-4 h-4' />;
      case 'electricity':
        return <Zap className='w-4 h-4' />;
      default:
        return <Package className='w-4 h-4' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-white border-success';
      case 'in_transit':
        return 'bg-info text-white border-info';
      case 'deployed':
        return 'bg-primary text-[#3E4636] border-primary';
      case 'depleted':
        return 'bg-error text-white border-error';
      case 'reserved':
        return 'bg-warning text-white border-warning';
      default:
        return 'bg-muted text-text-secondary border-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in_transit':
        return 'In Transit';
      case 'deployed':
        return 'Deployed';
      case 'depleted':
        return 'Depleted';
      case 'reserved':
        return 'Reserved';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'food':
        return 'Food';
      case 'water':
        return 'Water';
      case 'medical':
        return 'Medical';
      case 'shelter':
        return 'Shelter';
      case 'transport':
        return 'Transport';
      case 'rescue_team':
        return 'Rescue Team';
      case 'communication':
        return 'Communication';
      case 'sanitation':
        return 'Sanitation';
      case 'clothing':
        return 'Clothing';
      case 'electricity':
        return 'Electricity';
      default:
        return 'Other';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3'>
          <div
            className={`w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0`}
          >
            {getTypeIcon(resource.type)}
          </div>
          <div>
            <h4 className='font-semibold text-text-primary'>{resource.name}</h4>
            <div className='flex flex-wrap items-center gap-2 mt-1'>
              <Badge
                className={`text-[10px] border ${getStatusColor(resource.status)}`}
              >
                {getStatusLabel(resource.status)}
              </Badge>
              <Badge className='bg-primary/10 text-primary border-primary/20 text-[10px]'>
                {getTypeLabel(resource.type)}
              </Badge>
            </div>
          </div>
        </div>
        <button className='p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors'>
          <MoreHorizontal className='w-4 h-4 text-text-tertiary' />
        </button>
      </div>

      <div className='grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20'>
        <div>
          <p className='text-xs text-text-tertiary'>Available</p>
          <p className='text-sm font-semibold text-text-primary'>
            {resource.availableQty} / {resource.quantity} {resource.unit}
          </p>
        </div>
        <div>
          <p className='text-xs text-text-tertiary'>Location</p>
          <p className='text-sm text-text-secondary truncate'>
            {resource.location}
          </p>
        </div>
        <div className='col-span-2'>
          <p className='text-xs text-text-tertiary'>Provider</p>
          <p className='text-sm text-text-secondary'>{resource.provider}</p>
        </div>
        {resource.expiryDate && (
          <div className='col-span-2'>
            <p className='text-xs text-text-tertiary'>Expiry Date</p>
            <p className='text-sm text-text-secondary'>{resource.expiryDate}</p>
          </div>
        )}
      </div>

      <div className='flex gap-2 mt-3 pt-3 border-t border-white/20'>
        <button className='flex-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1'>
          <Eye className='w-3.5 h-3.5' />
          View
        </button>
        <button className='flex-1 bg-primary hover:bg-primary-dark text-[#3E4636] rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1'>
          <CheckCircle className='w-3.5 h-3.5' />
          Deploy
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// RESOURCE STAT CARD
// ============================================

const ResourceStat = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'
  >
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-xs text-text-tertiary font-medium uppercase tracking-wider'>
          {label}
        </p>
        <p className='text-2xl font-bold text-text-primary mt-0.5'>{value}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

// ============================================
// MAIN RESOURCES PAGE
// ============================================

export const Resources = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const stats = [
    {
      label: 'Total Resources',
      value: '34',
      icon: <Package className='w-4 h-4 text-[#5C2220]' />,
      color: 'bg-gradient-to-br from-primary to-primary-dark text-white',
    },
    {
      label: 'Available',
      value: '18',
      icon: <CheckCircle className='w-4 h-4 text-[#5C2220]' />,
      color: 'bg-gradient-to-br from-success to-success-dark text-white',
    },
    {
      label: 'Deployed',
      value: '10',
      icon: <Truck className='w-4 h-4 text-[#5C2220]' />,
      color: 'bg-gradient-to-br from-info to-info-dark text-white',
    },
    {
      label: 'Depleted',
      value: '6',
      icon: <XCircle className='w-4 h-4 text-[#5C2220]' />,
      color: 'bg-gradient-to-br from-error to-error-dark text-white',
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || resource.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active='Resources'
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
                <Truck className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h1 className='text-base font-semibold text-text-primary'>
                  Resources
                </h1>
                <p className='text-xs text-text-tertiary'>
                  Manage relief resources
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm'>
              <Search className='w-3.5 h-3.5 text-text-tertiary' />
              <input
                type='text'
                placeholder='Search resources...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60'
              />
            </div>
            <button className='relative p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors'>
              <Bell className='w-5 h-5 text-text-secondary' />
              <span className='absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30' />
            </button>
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-[#3E4636] font-semibold text-xs flex-shrink-0 shadow-lg shadow-primary/20'>
              JD
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className='p-3 md:p-4 space-y-4 pb-8'>
          {/* ===== STATS ===== */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {stats.map((stat, index) => (
              <ResourceStat
                key={index}
                {...stat}
              />
            ))}
          </div>

          {/* ===== ACTIONS BAR ===== */}
          <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'>
            <div className='flex flex-wrap items-center gap-3'>
              {/* Search - Mobile */}
              <div className='flex-1 min-w-[150px] sm:hidden flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30'>
                <Search className='w-3.5 h-3.5 text-text-tertiary' />
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60'
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center gap-1.5 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-sm text-text-secondary hover:bg-white/70 transition-colors'
              >
                <Filter className='w-4 h-4' />
                Filters
                {showFilters ? (
                  <ChevronUp className='w-3.5 h-3.5' />
                ) : (
                  <ChevronDown className='w-3.5 h-3.5' />
                )}
              </button>

              {/* View Mode */}
              <div className='flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 p-1'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-black' : 'text-text-secondary hover:bg-primary/10'}`}
                >
                  <Grid3x3 className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-black' : 'text-text-secondary hover:bg-primary/10'}`}
                >
                  <List className='w-4 h-4' />
                </button>
              </div>

              {/* Add Resource */}
              <Link
                to='/resources/add'
                className='ml-auto'
              >
                <Button className='bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-[#3E4636] rounded-xl shadow-lg shadow-primary/20'>
                  <Plus className='w-4 h-4 mr-1.5' />
                  Add Resource
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='overflow-hidden'
                >
                  <div className='flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/20'>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className='h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
                    >
                      <option value='all'>All Types</option>
                      <option value='food'>🍲 Food</option>
                      <option value='water'>💧 Water</option>
                      <option value='medical'>🏥 Medical</option>
                      <option value='shelter'>🏠 Shelter</option>
                      <option value='transport'>🚛 Transport</option>
                      <option value='rescue_team'>🚑 Rescue Team</option>
                      <option value='communication'>📡 Communication</option>
                      <option value='sanitation'>🧹 Sanitation</option>
                      <option value='clothing'>👕 Clothing</option>
                      <option value='electricity'>⚡ Electricity</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className='h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
                    >
                      <option value='all'>All Status</option>
                      <option value='available'>✅ Available</option>
                      <option value='in_transit'>🚚 In Transit</option>
                      <option value='deployed'>📦 Deployed</option>
                      <option value='depleted'>❌ Depleted</option>
                      <option value='reserved'>🔒 Reserved</option>
                    </select>

                    <button
                      onClick={() => {
                        setFilterType('all');
                        setFilterStatus('all');
                        setSearchQuery('');
                      }}
                      className='h-9 px-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-secondary hover:bg-white/70 transition-colors'
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== RESOURCES GRID ===== */}
          {filteredResources.length === 0 ? (
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg shadow-primary/5 border border-white/30'>
              <Package className='w-16 h-16 text-text-tertiary/30 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-text-primary'>
                No Resources Found
              </h3>
              <p className='text-sm text-text-tertiary mt-1'>
                Try adjusting your filters or add a new resource.
              </p>
              <Link to='/resources/add'>
                <Button className='mt-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/20'>
                  <Plus className='w-4 h-4 mr-1.5' />
                  Add Resource
                </Button>
              </Link>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-3'
              }
            >
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />
              ))}
            </div>
          )}

          {/* ===== FOOTER ===== */}
          <div className='text-center text-[10px] text-text-tertiary/40 py-3'>
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};
