/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from '../components/layouts/Navbar';
import { Sidebar } from '../components/layouts/sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import api from '../lib/api';

// ============================================
// TYPES
// ============================================

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  skills: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY' | 'UNREACHABLE';
  rating: number;
  completedMissions: number;
  totalHoursVolunteered: number;
  verifiedVolunteer: boolean;
  status: 'Active' | 'Inactive' | 'Pending';
  joinedDate: string;
  profileImage?: string;
  bio?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  assignedEmergencies?: any[];
}

// ============================================
// VIEW VOLUNTEER PAGE
// ============================================

export const ViewVolunteer = () => {
  const { id } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [recentMissions, setRecentMissions] = useState<any[]>([]);

  // ========== FETCH VOLUNTEER DETAILS ==========
  const fetchVolunteerDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get(`/volunteers/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        setVolunteer({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location || 'N/A',
          skills: data.skills || [],
          availability: data.availability || 'AVAILABLE',
          rating: data.rating || 4.5,
          completedMissions: data.completedMissions || 0,
          totalHoursVolunteered: data.totalHoursVolunteered || 0,
          verifiedVolunteer: data.verifiedVolunteer || false,
          status: data.isActive ? 'Active' : 'Inactive',
          joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
          profileImage: data.profileImage,
          bio: data.bio || 'No bio provided',
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
        });
        setRecentMissions(data.assignedEmergencies || []);
      } else {
        toast.error('Failed to load volunteer details');
      }
    } catch (error: any) {
      console.error('Fetch volunteer error:', error);
      toast.error(error.response?.data?.message || 'Failed to load volunteer details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVolunteerDetails();
  }, [id]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE': return 'bg-success text-white border-success';
      case 'BUSY': return 'bg-warning text-white border-warning';
      case 'OFF_DUTY': return 'bg-muted text-text-secondary border-muted';
      case 'UNREACHABLE': return 'bg-error text-white border-error';
      default: return 'bg-primary text-white';
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE': return 'Available';
      case 'BUSY': return 'Busy';
      case 'OFF_DUTY': return 'Off Duty';
      case 'UNREACHABLE': return 'Unreachable';
      default: return availability;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/10 text-success border-success/20';
      case 'Inactive': return 'bg-error/10 text-error border-error/20';
      case 'Pending': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-text-secondary border-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-secondary mt-4">Loading volunteer details...</p>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary">Volunteer Not Found</h2>
          <p className="text-text-secondary mt-2">The volunteer you're looking for doesn't exist.</p>
          <Link to="/volunteers">
            <Button className="mt-4 bg-primary text-white">Back to Volunteers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      <Sidebar active='Volunteers' mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

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
                    <Badge className={`text-[11px] border ${getAvailabilityColor(volunteer.availability)}`}>
                      {getAvailabilityLabel(volunteer.availability)}
                    </Badge>
                    <Badge className={`text-[11px] border ${getStatusColor(volunteer.status)}`}>
                      {volunteer.status}
                    </Badge>
                    {volunteer.verifiedVolunteer && (
                      <Badge className="bg-success/10 text-success border-success/20 text-[11px]">
                        <CheckCircle className="w-3 h-3 mr-0.5" />
                        Verified
                      </Badge>
                    )}
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
              
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center'>
              <p className='text-2xl font-bold text-primary'>
                {volunteer.completedMissions}
              </p>
              <p className='text-xs text-text-tertiary mt-0.5'>Missions Completed</p>
            </div>
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center'>
              <p className='text-2xl font-bold text-primary'>
                {volunteer.totalHoursVolunteered}
              </p>
              <p className='text-xs text-text-tertiary mt-0.5'>Hours Volunteered</p>
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
                  {volunteer.bio || 'No bio provided'}
                </p>
              </div>

              {/* Skills */}
              <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
                <h3 className='text-sm font-semibold text-text-primary mb-2 flex items-center gap-2'>
                  <Briefcase className='w-4 h-4 text-text-tertiary' />
                  Skills & Expertise
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {volunteer.skills.length > 0 ? (
                    volunteer.skills.map((skill, i) => (
                      <Badge key={i} className='bg-primary/10 text-primary border-primary/20 text-[10px]'>
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className='text-sm text-text-tertiary'>No skills added</p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
                <h3 className='text-sm font-semibold text-text-primary mb-2 flex items-center gap-2'>
                  <Heart className='w-4 h-4 text-text-tertiary' />
                  Emergency Contact
                </h3>
                {volunteer.emergencyContactName ? (
                  <div className='space-y-1'>
                    <p className='text-sm text-text-secondary'>
                      {volunteer.emergencyContactName}
                    </p>
                    <p className='text-sm text-text-secondary flex items-center gap-1.5'>
                      <Phone className='w-3.5 h-3.5 text-text-tertiary' />
                      {volunteer.emergencyContactPhone || 'N/A'}
                    </p>
                  </div>
                ) : (
                  <p className='text-sm text-text-tertiary'>No emergency contact provided</p>
                )}
              </div>
            </div>

            {/* Right Column - Recent Missions */}
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30'>
              <h3 className='text-sm font-semibold text-text-primary mb-3 flex items-center gap-2'>
                <TrendingUp className='w-4 h-4 text-text-tertiary' />
                Recent Missions
              </h3>
              {recentMissions.length === 0 ? (
                <p className='text-sm text-text-tertiary text-center py-4'>No recent missions</p>
              ) : (
                <div className='space-y-3'>
                  {recentMissions.map((mission, i) => (
                    <div key={i} className='p-3 rounded-xl bg-sand-light/30 border border-white/20'>
                      <p className='text-sm font-medium text-text-primary'>
                        {mission.title}
                      </p>
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-xs text-text-tertiary flex items-center gap-1'>
                          <Clock className='w-3 h-3' />
                          {new Date(mission.createdAt).toLocaleDateString()}
                        </span>
                        <Badge className={`text-[10px] ${
                          mission.status === 'RESOLVED' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {mission.status?.replace('_', ' ') || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
         
        </div>
      </div>
    </div>
  );
};