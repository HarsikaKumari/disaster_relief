/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit,
    Filter,
    Loader2,
    MapPin,
    Package,
    RefreshCw,
    Search,
    Truck,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from '../components/layouts/Navbar';
import { Sidebar } from '../components/layouts/sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import api from '../lib/api';

// ============================================
// TYPES
// ============================================

interface Deployment {
  id: string;
  resourceId: string;
  emergencyId: string;
  quantity: number;
  deployedAt: string;
  deliveredAt?: string;
  status: 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';
  notes?: string;
  resource: {
    id: string;
    name: string;
    type: string;
    unit: string;
    location: string;
  };
  emergency: {
    id: string;
    title: string;
    location: string;
    severity: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DeploymentStats {
  total: number;
  inTransit: number;
  delivered: number;
  returned: number;
}

// ============================================
// DEPLOYMENT CARD
// ============================================

const DeploymentCard = ({ 
  deployment, 
  onStatusUpdate 
}: { 
  deployment: Deployment; 
  onStatusUpdate: () => void;
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(deployment.status);
  const [notes, setNotes] = useState(deployment.notes || '');
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'DELIVERED':
        return 'bg-success/20 text-success border-success/30';
      case 'RETURNED':
        return 'bg-muted/20 text-text-secondary border-muted/30';
      default:
        return 'bg-muted/20 text-text-secondary border-muted/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return '🚚 In Transit';
      case 'DELIVERED':
        return '✅ Delivered';
      case 'RETURNED':
        return '↩️ Returned';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'FOOD':
        return '🍲 Food';
      case 'WATER':
        return '💧 Water';
      case 'MEDICAL':
        return '🏥 Medical';
      case 'SHELTER':
        return '🏠 Shelter';
      case 'TRANSPORT':
        return '🚛 Transport';
      case 'RESCUE_TEAM':
        return '🚑 Rescue';
      case 'COMMUNICATION':
        return '📡 Communication';
      case 'SANITATION':
        return '🧹 Sanitation';
      case 'CLOTHING':
        return '👕 Clothing';
      case 'ELECTRICITY':
        return '⚡ Electricity';
      default:
        return '📦 Other';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-error text-white';
      case 'HIGH':
        return 'bg-error/80 text-white';
      case 'MEDIUM':
        return 'bg-warning text-white';
      case 'LOW':
        return 'bg-success text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  // ========== UPDATE STATUS ==========
  const handleStatusUpdate = async () => {
    if (newStatus === deployment.status && notes === (deployment.notes || '')) {
      toast.info('No changes to update');
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put(`/resources/deployments/${deployment.id}/status`, {
        status: newStatus,
        notes,
      });

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        setShowStatusModal(false);
        onStatusUpdate();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">{deployment.resource.name}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className={`text-[10px] border ${getStatusColor(deployment.status)}`}>
                  {getStatusLabel(deployment.status)}
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  {getTypeLabel(deployment.resource.type)}
                </Badge>
                <Badge className={`text-[10px] border ${getSeverityColor(deployment.emergency.severity)}`}>
                  {deployment.emergency.severity}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">{deployment.quantity}</span>
            <span className="text-xs text-text-tertiary">{deployment.resource.unit}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20">
          <div>
            <p className="text-xs text-text-tertiary">Emergency</p>
            <Link
              to={`/emergencies/${deployment.emergency.id}`}
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
            >
              {deployment.emergency.title}
              <ArrowRight className="w-3 h-3" />
            </Link>
            <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {deployment.emergency.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Resource Location</p>
            <p className="text-sm text-text-secondary flex items-center gap-1">
              <MapPin className="w-3 h-3 text-text-tertiary" />
              {deployment.resource.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Deployed At</p>
            <p className="text-sm text-text-secondary flex items-center gap-1">
              <Clock className="w-3 h-3 text-text-tertiary" />
              {new Date(deployment.deployedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Delivery Status</p>
            {deployment.deliveredAt ? (
              <p className="text-sm text-success flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Delivered {new Date(deployment.deliveredAt).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-sm text-warning flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending Delivery
              </p>
            )}
          </div>
          {deployment.notes && (
            <div className="col-span-2">
              <p className="text-xs text-text-tertiary">Notes</p>
              <p className="text-sm text-text-secondary">{deployment.notes}</p>
            </div>
          )}
        </div>

        {/* ✅ UPDATE STATUS BUTTON */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <button
            onClick={() => setShowStatusModal(true)}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </motion.div>

      {/* ============================================
      STATUS UPDATE MODAL
      ============================================ */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Update Status</h3>
                  <p className="text-xs text-text-tertiary">{deployment.resource.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full h-11 px-4 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/80 transition-colors"
                >
                  <option value="IN_TRANSIT">🚚 In Transit</option>
                  <option value="DELIVERED">✅ Delivered</option>
                  <option value="RETURNED">↩️ Returned</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about delivery..."
                  rows={3}
                  className="w-full bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-tertiary/50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 border-white/30 text-text-secondary hover:bg-white/50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Update
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// ============================================
// STAT CARD
// ============================================

const StatCard = ({
  label,
  value,
  icon,
  color,
  isLoading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}) => (
  <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
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
  </div>
);

// ============================================
// MAIN VIEW DEPLOYMENTS PAGE
// ============================================

export const ViewDeployments = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [stats, setStats] = useState<DeploymentStats>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    returned: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // ========== FETCH DEPLOYMENTS ==========
  const fetchDeployments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/resources/deployments');
      if (response.data.success) {
        setDeployments(response.data.data);
        const total = response.data.data.length;
        const inTransit = response.data.data.filter((d: Deployment) => d.status === 'IN_TRANSIT').length;
        const delivered = response.data.data.filter((d: Deployment) => d.status === 'DELIVERED').length;
        const returned = response.data.data.filter((d: Deployment) => d.status === 'RETURNED').length;
        setStats({ total, inTransit, delivered, returned });
      }
    } catch (error: any) {
      console.error('Fetch deployments error:', error);
      toast.error('Failed to load deployments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDeployments();
  }, []);

  // ========== FILTER DEPLOYMENTS ==========
  const filteredDeployments = deployments.filter((d) => {
    const matchesSearch =
      d.resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.emergency.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.emergency.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Resources"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar
          title="Resource Deployments"
          subtitle="Track deployed resources"
          onMenuClick={() => setMobileOpen(true)}
        />

        <div className="p-3 md:p-4 pb-8 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Total Deployments"
              value={stats.total}
              icon={<Truck className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-primary to-primary-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="In Transit"
              value={stats.inTransit}
              icon={<Clock className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-warning to-warning-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Delivered"
              value={stats.delivered}
              icon={<CheckCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-success to-success-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Returned"
              value={stats.returned}
              icon={<XCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-muted to-muted-dark text-white"
              isLoading={loading}
            />
          </div>

          {/* Actions */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[150px] sm:hidden flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30">
                <Search className="w-3.5 h-3.5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-sm text-text-secondary hover:bg-white/70 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={fetchDeployments}
                disabled={loading}
                className="p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-text-secondary hover:bg-white/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <Link to="/resources" className="ml-auto">
                <Button className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/20">
                  <Package className="w-4 h-4 mr-1.5" />
                  Resources
                </Button>
              </Link>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/20">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="IN_TRANSIT">🚚 In Transit</option>
                  <option value="DELIVERED">✅ Delivered</option>
                  <option value="RETURNED">↩️ Returned</option>
                </select>

                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setSearchQuery('');
                  }}
                  className="h-9 px-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-secondary hover:bg-white/70 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Deployments List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
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
          ) : filteredDeployments.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/30">
              <Truck className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">No Deployments Found</h3>
              <p className="text-sm text-text-tertiary mt-1">
                Resources will appear here once they are deployed to emergencies.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDeployments.map((deployment) => (
                <DeploymentCard
                  key={deployment.id}
                  deployment={deployment}
                  onStatusUpdate={fetchDeployments}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};