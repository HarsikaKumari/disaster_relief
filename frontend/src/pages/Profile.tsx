/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Award,
  Bell,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Edit,
  Heart,
  LogOut,
  Mail,
  Menu,
  Phone,
  Save,
  Search,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../components/layouts/sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';
import { Navbar } from '../components/layouts/Navbar';

// ============================================
// TYPES
// ============================================

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  profileImage?: string;
  bio?: string;
  skills: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY' | 'UNREACHABLE';
  verifiedVolunteer: boolean;
  totalHoursVolunteered: number;
  rating: number;
  completedMissions: number;
  createdAt: string;
  updatedAt: string;
}

interface ProfileStats {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

// ============================================
// MAIN PROFILE PAGE
// ============================================

export const Profile = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/profile');
        if (response.data.success) {
          const profile = response.data.data;
          setUser(profile);
          setFormData({
            name: profile.name || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            skills: profile.skills?.join(', ') || '',
          });
        } else {
          toast.error('Failed to load profile');
        }
      } catch (error: any) {
        console.error('Profile fetch error:', error);
        toast.error(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const response = await api.put('/users/profile', payload);
      if (response.data.success) {
        setUser(response.data.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
      });
    }
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const stats: ProfileStats[] = [
    {
      label: 'Emergencies Handled',
      value: user?.completedMissions?.toString() || '0',
      icon: <AlertTriangle className='w-4 h-4' />,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Hours Volunteered',
      value: user?.totalHoursVolunteered?.toString() || '0',
      icon: <Clock className='w-4 h-4' />,
      color: 'bg-warning/10 text-warning',
    },
    {
      label: 'Rating',
      value: user?.rating?.toString() || '0',
      icon: <Star className='w-4 h-4' />,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Missions Completed',
      value: user?.completedMissions?.toString() || '0',
      icon: <CheckCircle className='w-4 h-4' />,
      color: 'bg-info/10 text-info',
    },
  ];

  const badges = [
    {
      icon: <Award className='w-4 h-4' />,
      label: 'Top Responder',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: <Star className='w-4 h-4' />,
      label: '5+ Years Service',
      color: 'bg-warning/10 text-warning',
    },
    {
      icon: <CheckCircle className='w-4 h-4' />,
      label: 'Verified Volunteer',
      color: 'bg-success/10 text-success',
    },
    {
      icon: <Heart className='w-4 h-4' />,
      label: 'Humanitarian Award',
      color: 'bg-primary/10 text-primary',
    },
  ];

  const recentActivities = [
    {
      title: 'Coordinated relief for Fire in Sector 5',
      time: '2 hours ago',
      status: 'Completed',
    },
    {
      title: 'Deployed 50 Food Packets to South District',
      time: '1 day ago',
      status: 'Completed',
    },
    {
      title: 'Volunteer Training Session Conducted',
      time: '3 days ago',
      status: 'Completed',
    },
    {
      title: 'Resource Audit Completed',
      time: '1 week ago',
      status: 'Completed',
    },
  ];

  if (loading && !user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-text-secondary mt-4'>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active='Profile'
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ===== MAIN ===== */}
      <div className='flex-1 min-w-0 overflow-y-auto h-screen'>
        {/* ===== NAVBAR ===== */}
        <Navbar
          title='Profile'
          subtitle={`Manage your profile, ${user?.name || 'User'}!`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* ===== CONTENT ===== */}
        <div className='p-3 md:p-4 space-y-4 pb-8'>
          {/* ===== PROFILE HEADER ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent/70 rounded-3xl p-6 text-white shadow-xl shadow-primary/20'
          >
            <div className='absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
            <div className='absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />

            <div className='relative flex flex-col md:flex-row md:items-center gap-6'>
              {/* Avatar */}
              <div className='relative'>
                <div className='w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-black/10'>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button className='absolute bottom-0 right-0 p-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-colors'>
                  <Camera className='w-4 h-4 text-white' />
                </button>
              </div>

              <div className='flex-1'>
                <div className='flex flex-wrap items-center gap-3'>
                  <h2 className='text-2xl font-bold'>{user?.name || 'User'}</h2>
                  <Badge className='bg-white/20 text-white border-white/20 text-[10px] backdrop-blur-sm'>
                    {user?.role || 'User'}
                  </Badge>
                  {user?.isVerified && (
                    <Badge className='bg-success/20 text-white border-success/30 text-[10px] backdrop-blur-sm'>
                      <CheckCircle className='w-2.5 h-2.5 mr-1 text-green-500' />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className='text-white/70 text-sm mt-0.5'>
                  {user?.bio || 'No bio yet'}
                </p>
                <div className='flex flex-wrap gap-4 mt-3 text-sm text-white/60'>
                  <span className='flex items-center gap-1.5'>
                    <Mail className='w-3.5 h-3.5' />
                    {user?.email || 'No email'}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Phone className='w-3.5 h-3.5' />
                    {user?.phone || 'No phone'}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='w-3.5 h-3.5' />
                    Joined{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className='flex gap-2'>
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className='bg-white text-primary hover:bg-sand-light shadow-lg shadow-white/20 rounded-2xl'
                    >
                      <Save className='w-4 h-4 mr-1.5' />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant='outline'
                      className='border-white/30 text-white hover:bg-white/10 rounded-2xl'
                    >
                      <X className='w-4 h-4 mr-1.5' />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className='bg-white text-primary hover:bg-sand-light shadow-lg shadow-white/20 rounded-2xl'
                  >
                    <Edit className='w-4 h-4 mr-1.5' />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ===== STATS ===== */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className='bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-2xl font-bold text-text-primary'>
                      {stat.value}
                    </p>
                    <p className='text-xs text-text-tertiary mt-0.5'>
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ===== EDIT PROFILE FORM ===== */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'
            >
              <h3 className='text-sm font-semibold text-text-primary mb-4'>
                Edit Profile
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Full Name
                  </Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Phone
                  </Label>
                  <Input
                    id='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                  />
                </div>
                <div className='md:col-span-2 space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Bio
                  </Label>
                  <textarea
                    id='bio'
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className='w-full bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary/60'
                  />
                </div>
                <div className='md:col-span-2 space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Skills (comma separated)
                  </Label>
                  <Input
                    id='skills'
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder='e.g. first_aid, rescue, coordination'
                    className='bg-white/50 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== BADGES + RECENT ACTIVITY ===== */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {/* ===== BADGES ===== */}
            <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'>
              <h3 className='text-sm font-semibold text-text-primary mb-3'>
                Badges & Achievements
              </h3>
              <div className='space-y-2.5'>
                {badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl ${badge.color}`}
                  >
                    {badge.icon}
                    <span className='text-sm font-medium'>{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ===== RECENT ACTIVITY ===== */}
            <div className='lg:col-span-2 bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold text-text-primary'>
                  Recent Activity
                </h3>
                <button className='text-xs text-primary hover:text-primary-dark font-medium'>
                  View All →
                </button>
              </div>
              <div className='space-y-2'>
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className='flex items-center justify-between p-2.5 rounded-xl hover:bg-sand-light/30 transition-colors'
                  >
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-text-primary'>
                        {activity.title}
                      </p>
                      <p className='text-xs text-text-tertiary'>
                        {activity.time}
                      </p>
                    </div>
                    <Badge className='bg-success/10 text-success border-success/20 text-[10px]'>
                      {activity.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== DANGER ZONE ===== */}
          <div className='bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-error/10'>
            <h3 className='text-sm font-semibold text-error mb-2'>
              Danger Zone
            </h3>
            <p className='text-xs text-text-tertiary mb-3'>
              Once you delete your account, there is no going back.
            </p>
            <Button
              variant='outline'
              className='border-error/30 text-error hover:bg-error/10 hover:border-error rounded-2xl'
            >
              <LogOut className='w-4 h-4 mr-1.5' />
              Delete Account
            </Button>
          </div>

          {/* ===== FOOTER ===== */}
          <div className='text-center text-[10px] text-text-tertiary/40 py-3'>
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};
