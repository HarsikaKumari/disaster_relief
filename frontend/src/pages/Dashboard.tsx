import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  Truck,
  Bell,
  Activity,
  Plus,
  CheckCircle,
  Sparkles,
  Home,
  Calendar,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sidebar } from '../components/layouts/sidebar';

const StatCard = ({
  value,
  label,
  icon,
  color,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className='bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-white/30'
  >
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-xs text-text-secondary font-medium uppercase tracking-wider'>
          {label}
        </p>
        <p className='text-2xl font-bold text-text-primary mt-0.5'>{value}</p>
      </div>
      <div
        className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10`}
      >
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
  time,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
  color: string;
}) => (
  <div className='flex items-center gap-3 p-2.5 rounded-2xl hover:bg-sand-light/30 transition-colors'>
    <div
      className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}
    >
      {icon}
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-sm font-medium text-text-primary'>{title}</p>
    </div>
    <span className='text-xs text-text-tertiary flex-shrink-0'>{time}</span>
  </div>
);

// ============================================
// MAIN DASHBOARD
// ============================================

export const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = [
    {
      value: '47',
      label: 'Total Emergencies',
      icon: <AlertTriangle className='w-4.5 h-4.5 text-[#3E4636]' />,
      color: 'bg-gradient-to-br from-primary to-primary-dark text-white',
    },
    {
      value: '12',
      label: 'Active',
      icon: <Activity className='w-4.5 h-4.5 text-[#3E4636]' />,
      color: 'bg-gradient-to-br from-accent to-accent-dark text-white',
    },
    {
      value: '156',
      label: 'Volunteers',
      icon: <Users className='w-4.5 h-4.5 text-[#3E4636]' />,
      color: 'bg-gradient-to-br from-success to-success-dark text-white',
    },
    {
      value: '34',
      label: 'Resources',
      icon: <Truck className='w-4.5 h-4.5 text-[#3E4636]' />,
      color: 'bg-gradient-to-br from-info to-info-dark text-white',
    },
  ];

  const activities = [
    {
      icon: <AlertTriangle className='w-3 h-3 text-[#3E4636]' />,
      title: 'New Emergency: Fire in Sector 5',
      time: '2 min ago',
      color: 'bg-red-300',
    },
    {
      icon: <Users className='w-3 h-3 text-white' />,
      title: 'Volunteer Team 5 deployed',
      time: '15 min ago',
      color: 'bg-success',
    },
    {
      icon: <Truck className='w-3 h-3 text-white' />,
      title: '50 Food Packets added to inventory',
      time: '1 hour ago',
      color: 'bg-info',
    },
    {
      icon: <CheckCircle className='w-3 h-3 text-white' />,
      title: 'Water supply emergency resolved',
      time: '2 hours ago',
      color: 'bg-success',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active='Dashboard'
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
            <div>
              <h1 className='text-base font-semibold text-text-primary'>
                Dashboard
              </h1>
              <p className='text-xs text-text-tertiary'>Welcome back, John!</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm'>
              <Search className='w-3.5 h-3.5 text-text-tertiary' />
              <input
                type='text'
                placeholder='Search...'
                className='border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none placeholder:text-text-tertiary/60'
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
          {/* Welcome Banner */}
          <div className='relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent/70 rounded-3xl p-6 text-[#8C9577] shadow-xl shadow-primary/20'>
            <div className='absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
            <div className='absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />
            <div className='relative flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-xl font-bold flex items-center gap-3'>
                  Welcome back, John! 👋
                  <Badge className=' bg-white/50 text[#3E4636] border-white/20 text-[10px] backdrop-blur-sm'>
                    <Sparkles className='w-2.5 h-2.5 mr-1' />
                    Live
                  </Badge>
                </h2>
                <p className='text-text-primary text-sm mt-0.5 '>
                  12 active emergencies • 156 volunteers online
                </p>
              </div>
              <Link to='/report'>
                <Button className='bg-white/90 backdrop-blur-sm text-primary hover:bg-white shadow-lg shadow-white/20 rounded-2xl border border-white/30'>
                  <Plus className='w-4 h-4 mr-1.5' />
                  Report Emergency
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                {...stat}
              />
            ))}
          </div>

          {/* Recent Activity + Quick Actions */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {/* Recent Activity */}
            <div className='lg:col-span-2 bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
                    <Activity className='w-4 h-4 text-primary' />
                  </div>
                  <h3 className='text-sm font-semibold text-text-primary'>
                    Recent Activity
                  </h3>
                </div>
                <button className='text-xs text-primary hover:text-primary-dark font-medium'>
                  View All →
                </button>
              </div>
              <div className='space-y-0.5'>
                {activities.map((item, index) => (
                  <ActivityItem
                    key={index}
                    {...item}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'>
              <h3 className='text-sm font-semibold text-text-primary mb-3'>
                Quick Actions
              </h3>
              <div className='space-0.5 flex flex-col gap-2'>
                <Link to='/report'>
                  <button className='w-full  bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-[#3E4636] rounded-2xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20'>
                    <Plus className='w-4 h-4' />
                    Report Emergency
                  </button>
                </Link>
                <Link to='/map'>
                  <button className='w-full  bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-white/30 rounded-2xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 text-text-primary shadow-sm'>
                    <MapPin className='w-4 h-4' />
                    View Live Map
                  </button>
                </Link>
                <Link to='/resources'>
                  <button className='w-full   bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-white/30 rounded-2xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 text-text-primary shadow-sm'>
                    <Truck className='w-4 h-4' />
                    Manage Resources
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Live Status + Today's Stats */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-lg shadow-success/30' />
                <h3 className='text-sm font-semibold text-text-primary'>
                  Live Status
                </h3>
              </div>
              <div className='grid grid-cols-2 gap-2.5'>
                {[
                  {
                    label: 'Emergency Response',
                    status: 'Active',
                    color: 'text-success',
                  },
                  {
                    label: 'Volunteers Online',
                    status: '156',
                    color: 'text-success',
                  },
                  {
                    label: 'Resources Available',
                    status: '34 Units',
                    color: 'text-warning',
                  },
                  {
                    label: 'System Uptime',
                    status: '99.8%',
                    color: 'text-success',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className='bg-white/30 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20 shadow-sm'
                  >
                    <p className='text-[10px] text-text-tertiary uppercase tracking-wider'>
                      {item.label}
                    </p>
                    <p className={`text-sm font-semibold ${item.color} mt-0.5`}>
                      {item.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <Calendar className='w-4 h-4 text-primary' />
                </div>
                <h3 className='text-sm font-semibold text-text-primary'>
                  Today's Overview
                </h3>
              </div>
              <div className='grid grid-cols-2 gap-2.5'>
                <div className='bg-gradient-to-br from-success/15 to-success/5 rounded-2xl p-3 text-center border border-success/10'>
                  <p className='text-xl font-bold text-success'>8</p>
                  <p className='text-[10px] text-text-tertiary'>Resolved</p>
                </div>
                <div className='bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl p-3 text-center border border-accent/10'>
                  <p className='text-xl font-bold text-accent'>3</p>
                  <p className='text-[10px] text-text-tertiary'>New Reports</p>
                </div>
                <div className='bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl p-3 text-center border border-primary/10'>
                  <p className='text-xl font-bold text-primary'>12</p>
                  <p className='text-[10px] text-text-tertiary'>Deployed</p>
                </div>
                <div className='bg-gradient-to-br from-info/15 to-info/5 rounded-2xl p-3 text-center border border-info/10'>
                  <p className='text-xl font-bold text-info'>5</p>
                  <p className='text-[10px] text-text-tertiary'>
                    Resources Used
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='text-center text-[10px] text-text-tertiary/40 py-3'>
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};
