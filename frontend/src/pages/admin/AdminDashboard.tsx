/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Award,
    CheckCircle,
    Clock,
    Crown,
    Download,
    Eye,
    Lock,
    MoreHorizontal,
    RefreshCw,
    Search,
    Trash2,
    Truck,
    Unlock,
    UserCheck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Navbar } from '../../components/layouts/Navbar';
import { Sidebar } from '../../components/layouts/sidebar';
import { Badge } from '../../components/ui/badge';
import api from '../../lib/api';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'VOLUNTEER' | 'CITIZEN' | 'NGO';
  isVerified: boolean;
  isActive: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  verifiedVolunteer: boolean;
  totalHoursVolunteered: number;
  completedMissions: number;
}

interface Stats {
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
  responseTime: { average: number; min: number; max: number };
}

// ============================================
// DARK SKELETON COMPONENTS
// ============================================

const StatCardSkeleton = () => (
  <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-3 w-20 bg-gray-700/30 rounded-lg animate-pulse" />
        <div className="h-8 w-16 bg-gray-700/30 rounded-lg animate-pulse mt-2" />
      </div>
      <div className="w-11 h-11 rounded-xl bg-gray-700/30 animate-pulse" />
    </div>
  </div>
);


const TableSkeleton = () => (
  <div className="border-b border-white/10">
    <div className="flex items-center gap-3 py-3 px-3">
      <div className="w-8 h-8 rounded-full bg-gray-700/30 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-32 bg-gray-700/30 rounded-lg animate-pulse" />
        <div className="h-3 w-48 bg-gray-700/30 rounded-lg animate-pulse mt-1" />
      </div>
      <div className="h-5 w-16 bg-gray-700/30 rounded-lg animate-pulse" />
      <div className="h-5 w-16 bg-gray-700/30 rounded-lg animate-pulse" />
      <div className="h-5 w-16 bg-gray-700/30 rounded-lg animate-pulse" />
    </div>
  </div>
);

// ============================================
// STAT CARD
// ============================================

const StatCard = ({ title, value, icon, color, onClick, isLoading }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    onClick={onClick}
    className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">{title}</p>
        {isLoading ? (
          <div className="h-8 w-16 bg-gray-700/30 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// ============================================
// USER TABLE
// ============================================

const UserTable = ({ users, loading, onRefresh }: any) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const handleAction = async (action: string, userId: string) => {
    try {
      let response;
      switch (action) {
        case 'verify':
          response = await api.post(`/admin/users/${userId}/verify`);
          break;
        case 'ban':
          response = await api.put(`/admin/users/${userId}/ban`);
          break;
        case 'unban':
          response = await api.put(`/admin/users/${userId}/unban`);
          break;
        case 'delete':
          response = await api.delete(`/admin/users/${userId}`);
          break;
        case 'make-admin':
          response = await api.put(`/admin/users/${userId}/role`, { role: 'ADMIN' });
          break;
        default:
          return;
      }
      if (response?.data.success) {
        toast.success(`User ${action}ed successfully`);
        onRefresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} user`);
    }
    setShowActionModal(false);
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-error/10 text-error border-error/20',
      VOLUNTEER: 'bg-success/10 text-success border-success/20',
      NGO: 'bg-info/10 text-info border-info/20',
      CITIZEN: 'bg-primary/10 text-primary border-primary/20',
    };
    return styles[role as keyof typeof styles] || styles.CITIZEN;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? 'bg-success/10 text-success border-success/20' 
      : 'bg-error/10 text-error border-error/20';
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Users</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
            {users.length} total
          </Badge>
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-sand-light/50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-text-secondary ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">User</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Role</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Verified</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Hours</th>
              <th className="text-right py-3 px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // ✅ Dark Gray/Black Skeleton Loading for Table
              Array(5).fill(0).map((_, i) => (
                <TableSkeleton key={i} />
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-text-tertiary">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: User) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-sand-light/20 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-tertiary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={`text-[10px] ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={`text-[10px] ${getStatusBadge(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={`text-[10px] ${user.isVerified ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    {user.totalHoursVolunteered || 0}h
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setSelectedUser(user); setShowActionModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-sand-light/50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4 text-text-tertiary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-bold text-text-primary mb-2">User Actions</h3>
            <p className="text-sm text-text-secondary mb-4">
              Manage <span className="font-semibold">{selectedUser.name}</span>
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleAction('verify', selectedUser.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sand-light/50 transition-colors text-left"
              >
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Verify User</span>
              </button>
              <button
                onClick={() => handleAction('make-admin', selectedUser.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sand-light/50 transition-colors text-left"
              >
                <Crown className="w-4 h-4 text-warning" />
                <span>Make Admin</span>
              </button>
              {selectedUser.isActive ? (
                <button
                  onClick={() => handleAction('ban', selectedUser.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 transition-colors text-left text-error"
                >
                  <Lock className="w-4 h-4" />
                  <span>Ban User</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction('unban', selectedUser.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-success/10 transition-colors text-left text-success"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unban User</span>
                </button>
              )}
              <button
                onClick={() => handleAction('delete', selectedUser.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 transition-colors text-left text-error"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
            </div>
            <button
              onClick={() => setShowActionModal(false)}
              className="w-full mt-4 py-2.5 bg-sand-light/50 rounded-xl text-text-secondary hover:bg-sand-light/70 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN ADMIN DASHBOARD
// ============================================

export const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings'>('overview');

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/users?limit=100'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (error: any) {
      console.error('Admin dashboard error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // ========== STATS CARDS ==========
  const statCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-4.5 h-4.5 text-white" />, color: 'bg-gradient-to-br from-primary to-primary-dark text-white' },
    { title: 'Active Emergencies', value: stats.activeEmergencies, icon: <AlertTriangle className="w-4.5 h-4.5 text-white" />, color: 'bg-gradient-to-br from-error to-error-dark text-white' },
    { title: 'Available Resources', value: stats.availableResources, icon: <Truck className="w-4.5 h-4.5 text-white" />, color: 'bg-gradient-to-br from-success to-success-dark text-white' },
    { title: 'Active Volunteers', value: stats.totalVolunteers, icon: <Users className="w-4.5 h-4.5 text-white" />, color: 'bg-gradient-to-br from-info to-info-dark text-white' },
    { title: 'Response Time', value: `${stats.responseTime.average}m`, icon: <Clock className="w-4.5 h-4.5 text-white" />, color: 'bg-gradient-to-br from-warning to-warning-dark text-white' },
    { title: 'Missions Done', value: stats.totalMissionsCompleted, icon: <Award className="w-4.5 h-4.5 text-white" />, color: 'bg-gradient-to-br from-success to-success-dark text-white' },
  ] : [];

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar active="Admin Panel" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar title="Admin Panel" subtitle="Complete platform control" onMenuClick={() => setMobileOpen(true)} />

        <div className="p-3 md:p-4 pb-8 space-y-4">
          
          <div className="flex gap-2 bg-white/50 backdrop-blur-md rounded-2xl p-1 border border-white/30">
            {['overview', 'users', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-text-secondary hover:bg-sand-light/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <StatCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} isLoading={false} />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Emergency Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-error/10 hover:bg-error/20 text-error rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      View All Emergencies
                    </button>
                    <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Resolve Critical
                    </button>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Volunteer Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-success/10 hover:bg-success/20 text-success rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Verify Pending Volunteers
                    </button>
                    <button className="w-full bg-info/10 hover:bg-info/20 text-info rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      View All Volunteers
                    </button>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Resource Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-info/10 hover:bg-info/20 text-info rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Truck className="w-4 h-4" />
                      Manage Resources
                    </button>
                    <button className="w-full bg-warning/10 hover:bg-warning/20 text-warning rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              {/* Filters */}
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30">
                    <Search className="w-3.5 h-3.5 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none placeholder:text-text-tertiary/60"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VOLUNTEER">Volunteer</option>
                    <option value="CITIZEN">Citizen</option>
                    <option value="NGO">NGO</option>
                  </select>
                  <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <UserTable 
                users={filteredUsers} 
                loading={loading} 
                onRefresh={fetchData} 
              />
            </>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30">
              <h3 className="text-lg font-bold text-text-primary mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-sand-light/30 rounded-xl border border-white/20">
                  <div>
                    <p className="font-medium text-text-primary">Maintenance Mode</p>
                    <p className="text-sm text-text-tertiary">Put the platform in maintenance mode</p>
                  </div>
                  <button className="px-4 py-2 bg-warning/10 text-warning rounded-xl text-sm font-medium hover:bg-warning/20 transition-colors">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-sand-light/30 rounded-xl border border-white/20">
                  <div>
                    <p className="font-medium text-text-primary">Export Data</p>
                    <p className="text-sm text-text-tertiary">Export all platform data as CSV</p>
                  </div>
                  <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-sand-light/30 rounded-xl border border-white/20">
                  <div>
                    <p className="font-medium text-text-primary">Clear Cache</p>
                    <p className="text-sm text-text-tertiary">Clear all system cache</p>
                  </div>
                  <button className="px-4 py-2 bg-error/10 text-error rounded-xl text-sm font-medium hover:bg-error/20 transition-colors">
                    Clear Cache
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-sand-light/30 rounded-xl border border-white/20">
                  <div>
                    <p className="font-medium text-text-primary">System Logs</p>
                    <p className="text-sm text-text-tertiary">View all system activity logs</p>
                  </div>
                  <button className="px-4 py-2 bg-info/10 text-info rounded-xl text-sm font-medium hover:bg-info/20 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};