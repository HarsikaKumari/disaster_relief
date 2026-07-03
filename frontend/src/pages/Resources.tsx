/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ambulance,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Droplet,
  Eye,
  Filter,
  Grid3x3,
  Home,
  Hospital,
  List,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shirt,
  Truck,
  Utensils,
  Wifi,
  XCircle,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../components/layouts/sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import api from '../lib/api';

// ============================================
// TYPES
// ============================================

interface Resource {
  id: string;
  name: string;
  type: 'FOOD' | 'WATER' | 'MEDICAL' | 'SHELTER' | 'TRANSPORT' | 'RESCUE_TEAM' | 'COMMUNICATION' | 'SANITATION' | 'CLOTHING' | 'ELECTRICITY' | 'OTHER';
  quantity: number;
  availableQty: number;
  unit: string;
  location: string;
  provider: {
    id: string;
    name: string;
    email: string;
  };
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'DEPLOYED' | 'DEPLETED' | 'RESERVED';
  expiryDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceStats {
  total: number;
  available: number;
  deployed: number;
  depleted: number;
}

// ============================================
// RESOURCE CARD COMPONENT
// ============================================

const ResourceCard = ({ resource, onRefresh }: { resource: Resource; onRefresh: () => void }) => {
  const [deploying, setDeploying] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FOOD': return <Utensils className="w-4 h-4" />;
      case 'WATER': return <Droplet className="w-4 h-4" />;
      case 'MEDICAL': return <Hospital className="w-4 h-4" />;
      case 'SHELTER': return <Home className="w-4 h-4" />;
      case 'TRANSPORT': return <Truck className="w-4 h-4" />;
      case 'RESCUE_TEAM': return <Ambulance className="w-4 h-4" />;
      case 'COMMUNICATION': return <Wifi className="w-4 h-4" />;
      case 'SANITATION': return <Shirt className="w-4 h-4" />;
      case 'CLOTHING': return <Shirt className="w-4 h-4" />;
      case 'ELECTRICITY': return <Zap className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-success text-white border-success';
      case 'IN_TRANSIT': return 'bg-info text-white border-info';
      case 'DEPLOYED': return 'bg-primary text-white border-primary';
      case 'DEPLETED': return 'bg-error text-white border-error';
      case 'RESERVED': return 'bg-warning text-white border-warning';
      default: return 'bg-muted text-text-secondary border-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Available';
      case 'IN_TRANSIT': return 'In Transit';
      case 'DEPLOYED': return 'Deployed';
      case 'DEPLETED': return 'Depleted';
      case 'RESERVED': return 'Reserved';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'FOOD': return 'Food';
      case 'WATER': return 'Water';
      case 'MEDICAL': return 'Medical';
      case 'SHELTER': return 'Shelter';
      case 'TRANSPORT': return 'Transport';
      case 'RESCUE_TEAM': return 'Rescue Team';
      case 'COMMUNICATION': return 'Communication';
      case 'SANITATION': return 'Sanitation';
      case 'CLOTHING': return 'Clothing';
      case 'ELECTRICITY': return 'Electricity';
      default: return 'Other';
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const response = await api.post('/resources/deploy', {
        resourceId: resource.id,
        emergencyId: 'demo-emergency-id', // TODO: Select emergency
        quantity: 1,
        notes: 'Deployed from dashboard',
      });
      if (response.data.success) {
        toast.success('Resource deployed successfully!');
        onRefresh();
      } else {
        toast.error(response.data.message || 'Failed to deploy');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deploy resource');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0`}>
            {getTypeIcon(resource.type)}
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">{resource.name}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className={`text-[10px] border ${getStatusColor(resource.status)}`}>
                {getStatusLabel(resource.status)}
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                {getTypeLabel(resource.type)}
              </Badge>
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20">
        <div>
          <p className="text-xs text-text-tertiary">Available</p>
          <p className="text-sm font-semibold text-text-primary">{resource.availableQty} / {resource.quantity} {resource.unit}</p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Location</p>
          <p className="text-sm text-text-secondary truncate">{resource.location}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-text-tertiary">Provider</p>
          <p className="text-sm text-text-secondary">{resource.provider?.name || 'Unknown'}</p>
        </div>
        {resource.expiryDate && (
          <div className="col-span-2">
            <p className="text-xs text-text-tertiary">Expiry Date</p>
            <p className="text-sm text-text-secondary">{new Date(resource.expiryDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
        <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={handleDeploy}
          disabled={deploying || resource.status === 'DEPLETED'}
          className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deploying ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Deploy
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// RESOURCE STAT CARD
// ============================================

const ResourceStat = ({ label, value, icon, color, isLoading }: { 
  label: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
  isLoading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">{label}</p>
        {isLoading ? (
          <div className="h-8 w-12 bg-sand-light/50 rounded-lg animate-pulse mt-0.5" />
        ) : (
          <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
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
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<ResourceStats>({
    total: 0,
    available: 0,
    deployed: 0,
    depleted: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // ========== FETCH RESOURCES ==========
  const fetchResources = async () => {
    setLoading(true);
    try {
      const [resourcesRes, statsRes] = await Promise.all([
        api.get('/resources'),
        api.get('/resources/stats'),
      ]);

      if (resourcesRes.data.success) {
        setResources(resourcesRes.data.data);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error: any) {
      console.error('Resources fetch error:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResources();
  }, []);

  // ========== FILTER RESOURCES ==========
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active="Resources"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ===== MAIN ===== */}
      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        
        {/* ===== NAVBAR ===== */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl m-3 md:m-4 p-3 shadow-lg shadow-primary/5 border border-white/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-xl hover:bg-sand-light/50"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-text-primary">Resources</h1>
                <p className="text-xs text-text-tertiary">Manage relief resources</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm">
              <Search className="w-3.5 h-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60"
              />
            </div>
            <button className="relative p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-lg shadow-primary/20">
              JD
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-3 md:p-4 space-y-4 pb-8">
          
          {/* ===== STATS ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ResourceStat
              label="Total Resources"
              value={stats.total}
              icon={<Package className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-primary to-primary-dark text-white"
              isLoading={loading}
            />
            <ResourceStat
              label="Available"
              value={stats.available}
              icon={<CheckCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-success to-success-dark text-white"
              isLoading={loading}
            />
            <ResourceStat
              label="Deployed"
              value={stats.deployed}
              icon={<Truck className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-info to-info-dark text-white"
              isLoading={loading}
            />
            <ResourceStat
              label="Depleted"
              value={stats.depleted}
              icon={<XCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-error to-error-dark text-white"
              isLoading={loading}
            />
          </div>

          {/* ===== ACTIONS BAR ===== */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search - Mobile */}
              <div className="flex-1 min-w-[150px] sm:hidden flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30">
                <Search className="w-3.5 h-3.5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-sm text-text-secondary hover:bg-white/70 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-primary/10'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-primary/10'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchResources}
                disabled={loading}
                className="p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-text-secondary hover:bg-white/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Add Resource */}
              <Link to="/resources/add" className="ml-auto">
                <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-1.5" />
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
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/20">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Types</option>
                      <option value="FOOD">🍲 Food</option>
                      <option value="WATER">💧 Water</option>
                      <option value="MEDICAL">🏥 Medical</option>
                      <option value="SHELTER">🏠 Shelter</option>
                      <option value="TRANSPORT">🚛 Transport</option>
                      <option value="RESCUE_TEAM">🚑 Rescue Team</option>
                      <option value="COMMUNICATION">📡 Communication</option>
                      <option value="SANITATION">🧹 Sanitation</option>
                      <option value="CLOTHING">👕 Clothing</option>
                      <option value="ELECTRICITY">⚡ Electricity</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Status</option>
                      <option value="AVAILABLE">✅ Available</option>
                      <option value="IN_TRANSIT">🚚 In Transit</option>
                      <option value="DEPLOYED">📦 Deployed</option>
                      <option value="DEPLETED">❌ Depleted</option>
                      <option value="RESERVED">🔒 Reserved</option>
                    </select>

                    <button
                      onClick={() => {
                        setFilterType('all');
                        setFilterStatus('all');
                        setSearchQuery('');
                      }}
                      className="h-9 px-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-secondary hover:bg-white/70 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== RESOURCES GRID ===== */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sand-light/50 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-sand-light/50 rounded-lg animate-pulse" />
                      <div className="h-4 w-20 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20">
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg shadow-primary/5 border border-white/30">
              <Package className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">No Resources Found</h3>
              <p className="text-sm text-text-tertiary mt-1">Try adjusting your filters or add a new resource.</p>
              <Link to="/resources/add">
                <Button className="mt-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Resource
                </Button>
              </Link>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'space-y-3'
            }>
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onRefresh={fetchResources} />
              ))}
            </div>
          )}

          {/* ===== FOOTER ===== */}
          <div className="text-center text-[10px] text-text-tertiary/40 py-3">
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};