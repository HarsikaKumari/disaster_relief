import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  User,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  Shield,
  Award,
  Star,
  CheckCircle,
  XCircle,
  Bell,
  Menu,
  Search as SearchIcon,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sidebar } from '../components/layouts/sidebar';
import { Navbar } from '../components/layouts/Navbar';

// ============================================
// TYPES
// ============================================

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  rating: number;
  missionsCompleted: number;
  hoursVolunteered: number;
  status: 'Active' | 'Inactive' | 'Pending';
  joinedDate: string;
  avatar?: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const volunteersData: Volunteer[] = [
  {
    id: '1',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    skills: ['First Aid', 'Rescue', 'Driving'],
    availability: 'AVAILABLE',
    rating: 4.9,
    missionsCompleted: 47,
    hoursVolunteered: 1280,
    status: 'Active',
    joinedDate: 'Jan 2024',
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91 98765 43211',
    location: 'Mumbai, India',
    skills: ['Medical', 'Counseling', 'Communication'],
    availability: 'BUSY',
    rating: 4.8,
    missionsCompleted: 35,
    hoursVolunteered: 950,
    status: 'Active',
    joinedDate: 'Mar 2024',
  },
  {
    id: '3',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43212',
    location: 'Bangalore, India',
    skills: ['Logistics', 'Driving', 'First Aid'],
    availability: 'AVAILABLE',
    rating: 4.7,
    missionsCompleted: 28,
    hoursVolunteered: 720,
    status: 'Active',
    joinedDate: 'Jun 2024',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    phone: '+91 98765 43213',
    location: 'Chennai, India',
    skills: ['Medical', 'Rescue', 'Swimming'],
    availability: 'OFF_DUTY',
    rating: 4.9,
    missionsCompleted: 52,
    hoursVolunteered: 1500,
    status: 'Active',
    joinedDate: 'Dec 2023',
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    email: 'vikram@example.com',
    phone: '+91 98765 43214',
    location: 'Hyderabad, India',
    skills: ['Communication', 'Logistics', 'Driving'],
    availability: 'AVAILABLE',
    rating: 4.5,
    missionsCompleted: 18,
    hoursVolunteered: 450,
    status: 'Pending',
    joinedDate: 'Aug 2024',
  },
];

// ============================================
// VOLUNTEER CARD
// ============================================

const VolunteerCard = ({ volunteer }: { volunteer: Volunteer }) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'bg-success text-white border-success';
      case 'BUSY':
        return 'bg-warning text-white border-warning';
      case 'OFF_DUTY':
        return 'bg-muted text-text-secondary border-muted';
      default:
        return 'bg-primary text-white';
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'Available';
      case 'BUSY':
        return 'Busy';
      case 'OFF_DUTY':
        return 'Off Duty';
      default:
        return availability;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success/10 text-success border-success/20';
      case 'Inactive':
        return 'bg-error/10 text-error border-error/20';
      case 'Pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-text-secondary border-muted/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300'
    >
      <div className='flex items-start gap-4'>
        {/* Avatar */}
        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg shadow-primary/20'>
          {volunteer.name.charAt(0)}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2'>
            <div>
              <h4 className='font-semibold text-text-primary'>
                {volunteer.name}
              </h4>
              <div className='flex flex-wrap items-center gap-2 mt-0.5'>
                <Badge
                  className={`text-[10px] border ${getAvailabilityColor(volunteer.availability)}`}
                >
                  {getAvailabilityLabel(volunteer.availability)}
                </Badge>
                <Badge
                  className={`text-[10px] border ${getStatusColor(volunteer.status)}`}
                >
                  {volunteer.status}
                </Badge>
                <div className='flex items-center gap-0.5 text-warning'>
                  <Star className='w-3.5 h-3.5 fill-warning text-warning' />
                  <span className='text-xs font-medium text-text-primary'>
                    {volunteer.rating}
                  </span>
                </div>
              </div>
            </div>
            <button className='p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors'>
              <MoreHorizontal className='w-4 h-4 text-text-tertiary' />
            </button>
          </div>

          <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary'>
            <span className='flex items-center gap-1'>
              <MapPin className='w-3.5 h-3.5 text-text-tertiary' />
              {volunteer.location}
            </span>
            <span className='flex items-center gap-1'>
              <Phone className='w-3.5 h-3.5 text-text-tertiary' />
              {volunteer.phone}
            </span>
            <span className='flex items-center gap-1'>
              <Mail className='w-3.5 h-3.5 text-text-tertiary' />
              {volunteer.email}
            </span>
          </div>

          <div className='flex flex-wrap gap-1.5 mt-2'>
            {volunteer.skills.map((skill, i) => (
              <Badge
                key={i}
                className='bg-primary/10 text-primary border-primary/20 text-[10px]'
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className='grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/20'>
            <div className='text-center'>
              <p className='text-lg font-bold text-primary'>
                {volunteer.missionsCompleted}
              </p>
              <p className='text-[10px] text-text-tertiary'>Missions</p>
            </div>
            <div className='text-center'>
              <p className='text-lg font-bold text-primary'>
                {volunteer.hoursVolunteered}
              </p>
              <p className='text-[10px] text-text-tertiary'>Hours</p>
            </div>
            <div className='text-center'>
              <p className='text-lg font-bold text-primary'>
                {volunteer.joinedDate}
              </p>
              <p className='text-[10px] text-text-tertiary'>Joined</p>
            </div>
          </div>

          <div className='flex gap-2 mt-3 pt-3 border-t border-white/20'>
            <button className='flex-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1'>
              <Link to={`/volunteers/${volunteer.id}`}>
                <Eye className='w-3.5 h-3.5' />
                View
              </Link>
            </button>

            <button className='flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1'>
              <MessageCircle className='w-3.5 h-3.5' />
              Message
            </button>
            <button className='flex-1 bg-success/10 hover:bg-success/20 text-success rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1'>
              <CheckCircle className='w-3.5 h-3.5' />
              Assign
            </button>
          </div>
        </div>
      </div>
    </motion.div>
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
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: string; up: boolean };
}) => (
  <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-xs text-text-tertiary font-medium uppercase tracking-wider'>
          {label}
        </p>
        <p className='text-2xl font-bold text-text-primary mt-0.5'>{value}</p>
        {trend && (
          <p
            className={`text-xs font-medium ${trend.up ? 'text-success' : 'text-error'} mt-0.5`}
          >
            {trend.value}
          </p>
        )}
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </div>
);

// ============================================
// MAIN VOLUNTEERS PAGE
// ============================================

export const Volunteers = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [volunteers, setVolunteers] = useState(volunteersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const stats = {
    total: volunteers.length,
    available: volunteers.filter((v) => v.availability === 'AVAILABLE').length,
    active: volunteers.filter((v) => v.status === 'Active').length,
    pending: volunteers.filter((v) => v.status === 'Pending').length,
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvailability =
      filterAvailability === 'all' || v.availability === filterAvailability;
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesAvailability && matchesStatus;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      <Sidebar
        active='Volunteers'
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className='flex-1 min-w-0 overflow-y-auto h-screen'>
        {/* Navbar */}
         <Navbar 
          title="Volunteers" 
          subtitle={`Manage and view all volunteers`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className='p-3 md:p-4 pb-8 space-y-4'>
          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <StatCard
              label='Total Volunteers'
              value={stats.total}
              icon={<Users className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-primary to-primary-dark text-white'
            />
            <StatCard
              label='Available'
              value={stats.available}
              icon={<CheckCircle className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-success to-success-dark text-white'
              trend={{ value: '+12 this week', up: true }}
            />
            <StatCard
              label='Active'
              value={stats.active}
              icon={<Heart className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-info to-info-dark text-white'
            />
            <StatCard
              label='Pending'
              value={stats.pending}
              icon={<Clock className='w-4 h-4 text-white' />}
              color='bg-gradient-to-br from-warning to-warning-dark text-white'
              trend={{ value: '5 need review', up: false }}
            />
          </div>

          {/* Actions */}
          <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex-1 min-w-[150px] sm:hidden flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30'>
                <SearchIcon className='w-3.5 h-3.5 text-text-tertiary' />
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none'
                />
              </div>

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
              <div className='ml-auto' />
              <Link to='/volunteers/add'>
                <Button className='bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20 ml-auto'>
                  <Plus className='w-4 h-4 mr-1.5' />
                  Add Volunteer
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
                      value={filterAvailability}
                      onChange={(e) => setFilterAvailability(e.target.value)}
                      className='h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
                    >
                      <option value='all'>All Availability</option>
                      <option value='AVAILABLE'>✅ Available</option>
                      <option value='BUSY'>🟡 Busy</option>
                      <option value='OFF_DUTY'>⚪ Off Duty</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className='h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
                    >
                      <option value='all'>All Status</option>
                      <option value='Active'>✅ Active</option>
                      <option value='Inactive'>❌ Inactive</option>
                      <option value='Pending'>⏳ Pending</option>
                    </select>

                    <button
                      onClick={() => {
                        setFilterAvailability('all');
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

          {/* Volunteers Grid */}
          {filteredVolunteers.length === 0 ? (
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/30'>
              <Users className='w-16 h-16 text-text-tertiary/30 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-text-primary'>
                No Volunteers Found
              </h3>
              <p className='text-sm text-text-tertiary mt-1'>
                Try adjusting your filters or add a new volunteer.
              </p>
              <Button className='mt-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl'>
                <Plus className='w-4 h-4 mr-1.5' />
                Add Volunteer
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4'>
              {filteredVolunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
