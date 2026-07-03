import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Award,
  Star,
  CheckCircle,
  XCircle,
  Bell,
  Menu,
  Search,
  Users,
  Edit,
  Trash2,
  MessageCircle,
  Calendar,
  Clock,
  Briefcase,
  Heart,
  FileText,
  MoreHorizontal,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sidebar } from '../components/layouts/sidebar';
import { Navbar } from '../components/layouts/Navbar';

// ============================================
// SAMPLE VOLUNTEER DATA
// ============================================

const volunteerData = {
  id: '1',
  name: 'Amit Kumar',
  email: 'amit@example.com',
  phone: '+91 98765 43210',
  location: 'Delhi, India',
  skills: ['First Aid', 'Rescue', 'Driving', 'Leadership'],
  availability: 'AVAILABLE',
  rating: 4.9,
  missionsCompleted: 47,
  hoursVolunteered: 1280,
  status: 'Active',
  joinedDate: 'Jan 2024',
  bio: 'Experienced rescue volunteer with over 5 years of disaster response experience. Specialized in urban search and rescue operations.',
  emergencyContact: 'Priya Kumar',
  emergencyPhone: '+91 98765 43211',
  recentMissions: [
    { title: 'Fire in Sector 5', date: '2 days ago', status: 'Completed' },
    {
      title: 'Flood Relief - South District',
      date: '1 week ago',
      status: 'Completed',
    },
    {
      title: 'Earthquake Response - North Zone',
      date: '2 weeks ago',
      status: 'Completed',
    },
  ],
};

// ============================================
// VIEW VOLUNTEER PAGE
// ============================================

export const ViewVolunteer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [volunteer] = useState(volunteerData);

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
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      <Sidebar
        active='Volunteers'
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className='flex-1 min-w-0 overflow-y-auto h-screen'>
        {/* Navbar */}
       <Navbar 
          title="View Volunteer" 
          subtitle={`Details of ${volunteer.name}`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className='p-3 md:p-4 pb-8 space-y-4'>
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30'
          >
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-primary/20'>
                  {volunteer.name.charAt(0)}
                </div>
                <div>
                  <h2 className='text-xl font-bold text-text-primary'>
                    {volunteer.name}
                  </h2>
                  <div className='flex flex-wrap items-center gap-2 mt-1.5'>
                    <Badge
                      className={`text-[11px] border ${getAvailabilityColor(volunteer.availability)}`}
                    >
                      {getAvailabilityLabel(volunteer.availability)}
                    </Badge>
                    <Badge
                      className={`text-[11px] border ${getStatusColor(volunteer.status)}`}
                    >
                      {volunteer.status}
                    </Badge>
                    <div className='flex items-center gap-0.5 text-warning'>
                      <Star className='w-4 h-4 fill-warning text-warning' />
                      <span className='text-sm font-medium text-text-primary'>
                        {volunteer.rating}
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary'>
                    <span className='flex items-center gap-1'>
                      <MapPin className='w-4 h-4 text-text-tertiary' />
                      {volunteer.location}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Phone className='w-4 h-4 text-text-tertiary' />
                      {volunteer.phone}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Mail className='w-4 h-4 text-text-tertiary' />
                      {volunteer.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  className='border-white/30 text-text-secondary hover:bg-white/50 rounded-xl text-sm'
                >
                  <Edit className='w-4 h-4 mr-1.5' />
                  Edit
                </Button>
                <Button
                  variant='outline'
                  className='border-error/20 text-error hover:bg-error/10 hover:border-error rounded-xl text-sm'
                >
                  <Trash2 className='w-4 h-4 mr-1.5' />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center'>
              <p className='text-2xl font-bold text-primary'>
                {volunteer.missionsCompleted}
              </p>
              <p className='text-xs text-text-tertiary mt-0.5'>
                Missions Completed
              </p>
            </div>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center'>
              <p className='text-2xl font-bold text-primary'>
                {volunteer.hoursVolunteered}
              </p>
              <p className='text-xs text-text-tertiary mt-0.5'>
                Hours Volunteered
              </p>
            </div>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center'>
              <p className='text-2xl font-bold text-primary'>
                {volunteer.joinedDate}
              </p>
              <p className='text-xs text-text-tertiary mt-0.5'>Joined</p>
            </div>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center'>
              <p className='text-2xl font-bold text-primary'>
                {volunteer.rating} ⭐
              </p>
              <p className='text-xs text-text-tertiary mt-0.5'>Rating</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Left Column - Bio & Skills */}
            <div className='md:col-span-2 space-y-4'>
              {/* Bio */}
              <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
                <h3 className='text-sm font-semibold text-text-primary mb-2 flex items-center gap-2'>
                  <FileText className='w-4 h-4 text-text-tertiary' />
                  About
                </h3>
                <p className='text-sm text-text-secondary leading-relaxed'>
                  {volunteer.bio}
                </p>
              </div>

              {/* Skills */}
              <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
                <h3 className='text-sm font-semibold text-text-primary mb-2 flex items-center gap-2'>
                  <Briefcase className='w-4 h-4 text-text-tertiary' />
                  Skills & Expertise
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {volunteer.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      className='bg-primary/10 text-primary border-primary/20 text-[10px]'
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
                <h3 className='text-sm font-semibold text-text-primary mb-2 flex items-center gap-2'>
                  <Heart className='w-4 h-4 text-text-tertiary' />
                  Emergency Contact
                </h3>
                <div className='space-y-1'>
                  <p className='text-sm text-text-secondary'>
                    {volunteer.emergencyContact}
                  </p>
                  <p className='text-sm text-text-secondary flex items-center gap-1.5'>
                    <Phone className='w-3.5 h-3.5 text-text-tertiary' />
                    {volunteer.emergencyPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Recent Missions */}
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
              <h3 className='text-sm font-semibold text-text-primary mb-3 flex items-center gap-2'>
                <TrendingUp className='w-4 h-4 text-text-tertiary' />
                Recent Missions
              </h3>
              <div className='space-y-3'>
                {volunteer.recentMissions.map((mission, i) => (
                  <div
                    key={i}
                    className='p-3 rounded-xl bg-sand-light/30 border border-white/20'
                  >
                    <p className='text-sm font-medium text-text-primary'>
                      {mission.title}
                    </p>
                    <div className='flex items-center justify-between mt-1'>
                      <span className='text-xs text-text-tertiary flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {mission.date}
                      </span>
                      <Badge className='bg-success/10 text-success border-success/20 text-[10px]'>
                        {mission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <Button className='flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl h-11'>
              <MessageCircle className='w-4 h-4 mr-2' />
              Message Volunteer
            </Button>
            <Button className='flex-1 bg-success hover:bg-success-dark text-white rounded-xl h-11'>
              <CheckCircle className='w-4 h-4 mr-2' />
              Assign to Mission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
