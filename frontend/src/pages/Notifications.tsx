import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Truck,
  Users,
  Clock,
  Settings,
  Menu,
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  Calendar,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Eye,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sidebar } from '../components/layouts/sidebar';
import { Navbar } from '../components/layouts/Navbar';

// ============================================
// TYPES
// ============================================

interface Notification {
  id: string;
  type:
    | 'EMERGENCY_ALERT'
    | 'RESOURCE_UPDATE'
    | 'VOLUNTEER_ASSIGNMENT'
    | 'STATUS_UPDATE'
    | 'MESSAGE'
    | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
  priority: 'high' | 'medium' | 'low';
}

// ============================================
// SAMPLE DATA
// ============================================

const notificationsData: Notification[] = [
  {
    id: '1',
    type: 'EMERGENCY_ALERT',
    title: '🚨 New Emergency Reported',
    message:
      'Major fire in Sector 5 Industrial Area. Immediate response needed.',
    time: '2 min ago',
    isRead: false,
    link: '/emergencies/1',
    priority: 'high',
  },
  {
    id: '2',
    type: 'VOLUNTEER_ASSIGNMENT',
    title: '📋 Volunteer Assignment',
    message:
      'You have been assigned to the flood relief mission in South District.',
    time: '15 min ago',
    isRead: false,
    link: '/emergencies/2',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'RESOURCE_UPDATE',
    title: '📦 Resource Update',
    message: '50 Food Packets added to Central Warehouse inventory.',
    time: '1 hour ago',
    isRead: false,
    link: '/resources',
    priority: 'low',
  },
  {
    id: '4',
    type: 'STATUS_UPDATE',
    title: '✅ Status Update',
    message: 'Emergency #EM-2024-003 has been resolved successfully.',
    time: '2 hours ago',
    isRead: true,
    link: '/emergencies/3',
    priority: 'low',
  },
  {
    id: '5',
    type: 'MESSAGE',
    title: '💬 New Message',
    message:
      'Rescue Team Alpha: We need additional medical supplies at the site.',
    time: '3 hours ago',
    isRead: true,
    link: '/chat',
    priority: 'medium',
  },
  {
    id: '6',
    type: 'SYSTEM',
    title: '⚙️ System Update',
    message: 'Platform maintenance scheduled for tonight at 2 AM IST.',
    time: '5 hours ago',
    isRead: true,
    priority: 'low',
  },
  {
    id: '7',
    type: 'EMERGENCY_ALERT',
    title: '🚨 Emergency Alert',
    message:
      'Cyclone warning issued for coastal areas. Prepare for evacuation.',
    time: '1 day ago',
    isRead: true,
    link: '/emergencies',
    priority: 'high',
  },
];

// ============================================
// NOTIFICATION CARD
// ============================================

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY_ALERT':
        return 'bg-error text-white';
      case 'VOLUNTEER_ASSIGNMENT':
        return 'bg-primary text-white';
      case 'RESOURCE_UPDATE':
        return 'bg-success text-white';
      case 'STATUS_UPDATE':
        return 'bg-info text-white';
      case 'MESSAGE':
        return 'bg-warning text-white';
      case 'SYSTEM':
        return 'bg-muted text-text-secondary';
      default:
        return 'bg-primary text-white';
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-error';
      case 'medium':
        return 'border-l-4 border-warning';
      case 'low':
        return 'border-l-4 border-success';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY_ALERT':
        return <AlertTriangle className='w-4 h-4' />;
      case 'VOLUNTEER_ASSIGNMENT':
        return <Users className='w-4 h-4' />;
      case 'RESOURCE_UPDATE':
        return <Truck className='w-4 h-4' />;
      case 'STATUS_UPDATE':
        return <CheckCircle className='w-4 h-4' />;
      case 'MESSAGE':
        return <MessageCircle className='w-4 h-4' />;
      case 'SYSTEM':
        return <Settings className='w-4 h-4' />;
      default:
        return <Bell className='w-4 h-4' />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className={`bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${getPriorityBorder(notification.priority)} ${!notification.isRead ? 'bg-white/70' : ''}`}
    >
      <div className='flex items-start gap-3'>
        <div
          className={`w-9 h-9 rounded-xl ${getTypeColor(notification.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}
        >
          {getTypeIcon(notification.type)}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2'>
            <p className='text-sm font-semibold text-text-primary'>
              {notification.title}
            </p>
            {!notification.isRead && (
              <div className='w-2 h-2 rounded-full bg-error flex-shrink-0 mt-1.5' />
            )}
          </div>
          <p className='text-sm text-text-secondary mt-0.5'>
            {notification.message}
          </p>
          <div className='flex items-center gap-3 mt-1.5'>
            <span className='text-xs text-text-tertiary flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              {notification.time}
            </span>
            {notification.link && (
              <Link
                to={notification.link}
                className='text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-0.5'
              >
                View <ArrowRight className='w-3 h-3' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// NOTIFICATIONS STATS
// ============================================

const NotificationStats = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className='bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 text-center hover:shadow-md transition-shadow'>
    <div
      className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto`}
    >
      {icon}
    </div>
    <p className='text-xl font-bold text-text-primary mt-2'>{value}</p>
    <p className='text-xs text-text-tertiary'>{label}</p>
  </div>
);

// ============================================
// MAIN NOTIFICATIONS PAGE
// ============================================

export const Notifications = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      <Sidebar
        active='Notifications'
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className='flex-1 min-w-0 overflow-y-auto h-screen'>
        {/* Navbar */}
        <Navbar
          title='Notifications'
          subtitle={`Notifications Overview`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className='p-3 md:p-4 pb-8 space-y-4'>
          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <NotificationStats
              label='Total'
              value={notifications.length}
              icon={<Bell className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-primary to-primary-dark text-white'
            />
            <NotificationStats
              label='Unread'
              value={unreadCount}
              icon={<AlertTriangle className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-error to-error-dark text-white'
            />
            <NotificationStats
              label='Read'
              value={notifications.length - unreadCount}
              icon={<CheckCircle className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-success to-success-dark text-white'
            />
            <NotificationStats
              label='High Priority'
              value={notifications.filter((n) => n.priority === 'high').length}
              icon={<AlertTriangle className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-warning to-warning-dark text-white'
            />
          </div>

          {/* Actions */}
          <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className='flex items-center gap-1.5 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-sm text-text-secondary hover:bg-white/70 transition-colors'
                >
                  <Filter className='w-4 h-4' />
                  Filter
                  {showFilters ? (
                    <ChevronUp className='w-3.5 h-3.5' />
                  ) : (
                    <ChevronDown className='w-3.5 h-3.5' />
                  )}
                </button>
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant='outline'
                    className='border-white/30 text-text-secondary hover:bg-white/50 rounded-xl text-sm h-9'
                  >
                    <CheckCircle className='w-4 h-4 mr-1.5' />
                    Mark All Read
                  </Button>
                )}
              </div>
              <span className='text-xs text-text-tertiary'>
                {notifications.length} notifications
              </span>
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
                  <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/20'>
                    {[
                      'all',
                      'EMERGENCY_ALERT',
                      'VOLUNTEER_ASSIGNMENT',
                      'RESOURCE_UPDATE',
                      'STATUS_UPDATE',
                      'MESSAGE',
                      'SYSTEM',
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          filterType === type
                            ? 'bg-primary text-white'
                            : 'bg-white/50 text-text-secondary hover:bg-white/70'
                        }`}
                      >
                        {type === 'all' ? 'All' : type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications List */}
          <div className='space-y-3'>
            {filteredNotifications.length === 0 ? (
              <div className='bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/30'>
                <Bell className='w-16 h-16 text-text-tertiary/30 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-text-primary'>
                  No Notifications
                </h3>
                <p className='text-sm text-text-tertiary mt-1'>
                  You're all caught up!
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
