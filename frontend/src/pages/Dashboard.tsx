/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Menu,
  Plus,
  Search,
  Sparkles,
  Truck,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../components/layouts/sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import api from '../lib/api';

// ============================================
// TYPES
// ============================================

interface DashboardStats {
  totalEmergencies: number;
  activeEmergencies: number;
  availableVolunteers: number;
  resourcesAvailable: number;
  resolvedToday: number;
  responseTime: number;
}

interface Activity {
  id: string;
  type: 'EMERGENCY' | 'RESOURCE' | 'VOLUNTEER' | 'SYSTEM';
  title: string;
  description: string;
  time: string;
  status?: string;
}

interface Emergency {
  id: string;
  title: string;
  type: 'flood' | 'earthquake' | 'fire' | 'cyclone' | 'other';
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved';
  location: string;
  reportedAt: string;
  reportedBy: string;
  victimCount: number;
}

// ============================================
// STAT CARD
// ============================================

const StatCard = ({ 
  value, 
  label, 
  icon, 
  color,
  isLoading 
}: { 
  value: string | number; 
  label: string; 
  icon: React.ReactNode; 
  color: string;
  isLoading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-white/30"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{label}</p>
        {isLoading ? (
          <div className="h-8 w-16 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// ============================================
// ACTIVITY ITEM
// ============================================

const ActivityItem = ({ 
  icon, 
  title, 
  description, 
  time, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  time: string; 
  color: string;
}) => (
  <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-sand-light/30 transition-colors">
    <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="text-xs text-text-tertiary truncate">{description}</p>
    </div>
    <span className="text-xs text-text-tertiary flex-shrink-0">{time}</span>
  </div>
);

// ============================================
// EMERGENCY CARD
// ============================================

const EmergencyCard = ({ emergency }: { emergency: Emergency }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-error text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-success text-white';
      default: return 'bg-primary text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'assigned': return 'bg-info/20 text-info border-info/30';
      case 'in_progress': return 'bg-primary/20 text-primary border-primary/30';
      case 'resolved': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-muted/20 text-text-secondary border-muted/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'earthquake': return '🏔️';
      case 'fire': return '🔥';
      case 'cyclone': return '🌀';
      default: return '📍';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(79, 88, 68, 0.15)' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-4 border border-sand-dark/20 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
          {getTypeIcon(emergency.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-text-primary text-sm truncate">
              {emergency.title}
            </h4>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(emergency.status)} flex-shrink-0`}>
              {emergency.status.replace('_', ' ')}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className={`text-[10px] px-2 py-0.5 rounded-full ${getSeverityColor(emergency.severity)}`}>
              {emergency.severity.toUpperCase()}
            </div>
            <span className="text-xs text-text-tertiary">{emergency.location}</span>
            <span className="text-xs text-text-tertiary">👥 {emergency.victimCount}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-text-tertiary">{emergency.reportedAt}</span>
            <span className="text-xs text-text-tertiary">by {emergency.reportedBy}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN DASHBOARD
// ============================================

export const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmergencies: 0,
    activeEmergencies: 0,
    availableVolunteers: 0,
    resourcesAvailable: 0,
    resolvedToday: 0,
    responseTime: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [userName, setUserName] = useState('John');

  // ========== FETCH DASHBOARD DATA ==========
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get user info
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.name) {
          setUserName(user.name.split(' ')[0]);
        }

        // Fetch stats
        const statsRes = await api.get('/dashboard/stats');
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        // Fetch recent activities
        const activitiesRes = await api.get('/dashboard/activities?limit=5');
        if (activitiesRes.data.success) {
          setActivities(activitiesRes.data.data);
        }

        // Fetch recent emergencies
        const emergenciesRes = await api.get('/emergencies?limit=5');
        if (emergenciesRes.data.success) {
          // Transform API data to match component format
          const formattedEmergencies = emergenciesRes.data.data.map((e: any) => ({
            id: e.id,
            title: e.title,
            type: e.type.toLowerCase(),
            severity: e.severity.toLowerCase(),
            status: e.status.toLowerCase().replace('_', '_'),
            location: e.location,
            reportedAt: new Date(e.createdAt).toLocaleDateString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }),
            reportedBy: e.reportedBy?.name || 'Unknown',
            victimCount: e.victimCount || 1,
          }));
          setEmergencies(formattedEmergencies);
        }
      } catch (error: any) {
        console.error('Dashboard fetch error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds (simulate real-time)
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ========== LOGOUT ==========
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active="Dashboard"
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
            <div>
              <h1 className="text-base font-semibold text-text-primary">Dashboard</h1>
              <p className="text-xs text-text-tertiary">Welcome back, {userName}!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm">
              <Search className="w-3.5 h-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search..."
                className="border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none placeholder:text-text-tertiary/60"
              />
            </div>
            <button className="relative p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30" />
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-lg shadow-primary/20 hover:opacity-80 transition-opacity"
            >
              JD
            </button>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-3 md:p-4 space-y-4 pb-8">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent/70 rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                   <span className="text-white ">Welcome back,{userName}! 👋</span>
                  <Badge className="bg-white/20 text-white border-white/20 text-[10px] backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    Live
                  </Badge>
                </h2>
                <p className="text-white/80 text-sm mt-0.5">
                  {stats.activeEmergencies} active emergencies • {stats.availableVolunteers} volunteers online
                </p>
              </div>
              <Link to="/report">
                <Button className="bg-white/90 backdrop-blur-sm text-primary hover:bg-white shadow-lg shadow-white/20 rounded-2xl border border-white/30">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Report Emergency
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard
              value={loading ? '...' : stats.totalEmergencies}
              label="Total Emergencies"
              icon={<AlertTriangle className="w-4.5 h-4.5 text-white" />}
              color="bg-gradient-to-br from-primary to-primary-dark text-white"
              isLoading={loading}
            />
            <StatCard
              value={loading ? '...' : stats.activeEmergencies}
              label="Active"
              icon={<Activity className="w-4.5 h-4.5 text-white" />}
              color="bg-gradient-to-br from-red-500 to-red-800/50 text-white"
              isLoading={loading}
            />
            <StatCard
              value={loading ? '...' : stats.availableVolunteers}
              label="Volunteers"
              icon={<Users className="w-4.5 h-4.5 text-white" />}
              color="bg-gradient-to-br from-emerald-200 to-emerald-500 text-white"
              isLoading={loading}
            />
            <StatCard
              value={loading ? '...' : stats.resourcesAvailable}
              label="Resources"
              icon={<Truck className="w-4.5 h-4.5 text-white" />}
              color="bg-gradient-to-br from-violet-200 to-violet-500 text-white"
              isLoading={loading}
            />
            <StatCard
              value={loading ? '...' : `${stats.responseTime} min`}
              label="Avg Response"
              icon={<Clock className="w-4.5 h-4.5 text-white" />}
              color="bg-gradient-to-br from-yellow-200 to-yellow-500 text-white"
              isLoading={loading}
            />
            <StatCard
              value={loading ? '...' : stats.resolvedToday}
              label="Resolved Today"
              icon={<CheckCircle className="w-4.5 h-4.5 text-white" />}
              color="bg-gradient-to-br from-emerald-200 to-emerald-500 text-white"
              isLoading={loading}
            />
          </div>

          {/* Recent Activity + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
                </div>
                <button className="text-xs text-primary hover:text-primary-dark font-medium">View All →</button>
              </div>
              <div className="space-y-0.5">
                {loading ? (
                  // Loading skeletons
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl">
                      <div className="w-8 h-8 rounded-xl bg-sand-light/50 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-48 bg-sand-light/50 rounded-lg animate-pulse" />
                        <div className="h-3 w-32 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                      </div>
                      <div className="h-3 w-16 bg-sand-light/50 rounded-lg animate-pulse" />
                    </div>
                  ))
                ) : activities.length > 0 ? (
                  activities.map((item, index) => (
                    <ActivityItem
                      key={index}
                      icon={item.type === 'EMERGENCY' ? <AlertTriangle className="w-3 h-3 text-white" /> : <CheckCircle className="w-3 h-3 text-white" />}
                      title={item.title}
                      description={item.description}
                      time={new Date(item.time).toLocaleDateString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                      color={item.type === 'EMERGENCY' ? 'bg-accent' : 'bg-success'}
                    />
                  ))
                ) : (
                  <p className="text-sm text-text-tertiary text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
              <div className="space-y-3.5 flex flex-col">
                <Link to="/report">
                  <button className="w-full bg-gradient-to-r cursor-pointer  from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-2xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Report Emergency
                  </button>
                </Link>
                <Link to="/map">
                  <button className="w-full bg-white/50  cursor-pointer backdrop-blur-sm hover:bg-white/70 border border-white/30 rounded-2xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 text-text-primary shadow-sm">
                    <MapPin className="w-4 h-4" />
                    View Live Map
                  </button>
                </Link>
                <Link to="/resources">
                  <button className="w-full bg-white/50  cursor-pointer backdrop-blur-sm hover:bg-white/70 border border-white/30 rounded-2xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 text-text-primary shadow-sm">
                    <Truck className="w-4 h-4" />
                    Manage Resources
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Live Status + Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-lg shadow-success/30" />
                <h3 className="text-sm font-semibold text-text-primary">Live Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Emergency Response', status: stats.activeEmergencies > 0 ? 'Active' : 'Standby', color: stats.activeEmergencies > 0 ? 'text-success' : 'text-text-tertiary' },
                  { label: 'Volunteers Online', status: stats.availableVolunteers.toString(), color: 'text-success' },
                  { label: 'Resources Available', status: stats.resourcesAvailable.toString(), color: 'text-warning' },
                  { label: 'System Uptime', status: '99.8%', color: 'text-success' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/30 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20 shadow-sm">
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wider">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.color} mt-0.5`}>
                      {loading ? '...' : item.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">Today's Overview</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gradient-to-br from-success/15 to-success/5 rounded-2xl p-3 text-center border border-success/10">
                  <p className="text-xl font-bold text-success">{loading ? '...' : stats.resolvedToday}</p>
                  <p className="text-[10px] text-text-tertiary">Resolved</p>
                </div>
                <div className="bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl p-3 text-center border border-accent/10">
                  <p className="text-xl font-bold text-accent">{loading ? '...' : stats.activeEmergencies}</p>
                  <p className="text-[10px] text-text-tertiary">Active</p>
                </div>
                <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl p-3 text-center border border-primary/10">
                  <p className="text-xl font-bold text-primary">{loading ? '...' : stats.availableVolunteers}</p>
                  <p className="text-[10px] text-text-tertiary">Volunteers</p>
                </div>
                <div className="bg-gradient-to-br from-info/15 to-info/5 rounded-2xl p-3 text-center border border-info/10">
                  <p className="text-xl font-bold text-info">{loading ? '...' : stats.resourcesAvailable}</p>
                  <p className="text-[10px] text-text-tertiary">Resources</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Emergencies */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-text-primary">Recent Emergencies</h3>
                <Badge className="bg-error/10 text-error border-error/20 text-[10px]">
                  {loading ? '...' : emergencies.filter(e => e.status !== 'resolved').length} Active
                </Badge>
              </div>
              <Link to="/emergencies" className="text-xs text-primary hover:text-primary-dark font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/20">
                    <div className="w-10 h-10 rounded-xl bg-sand-light/50 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-48 bg-sand-light/50 rounded-lg animate-pulse" />
                      <div className="h-3 w-32 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                    </div>
                  </div>
                ))
              ) : emergencies.length > 0 ? (
                emergencies.slice(0, 5).map((emergency) => (
                  <EmergencyCard key={emergency.id} emergency={emergency} />
                ))
              ) : (
                <p className="text-sm text-text-tertiary text-center py-4">No emergencies reported</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-text-tertiary/40 py-3">
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};