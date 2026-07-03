import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Calendar,
  Phone,
  User,
  Bell,
  Menu,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageCircle,
  Send,
  Image,
  Download,
  Share2,
  MoreHorizontal,
  Flag,
  Eye,
  Edit,
  Trash2,
  Flame,
  Droplet,
  Wind,
  Zap,
  Truck,
  Heart,
  Shield,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sidebar } from '../components/layouts/sidebar';
import { Navbar } from '../components/layouts/Navbar';

// ============================================
// SAMPLE DATA
// ============================================

const emergencyData = {
  id: 'EM-2024-001',
  title: 'Major Fire in Industrial Area',
  type: 'FIRE',
  severity: 'HIGH',
  status: 'IN_PROGRESS',
  description:
    'A massive fire broke out in the industrial area of Sector 5. Multiple factories affected. Fire department and rescue teams are on site.',
  location: 'Sector 5, Industrial Area, Delhi',
  latitude: 28.6692,
  longitude: 77.4538,
  victimCount: 23,
  victimName: 'Rahul Sharma',
  victimPhone: '+91 98765 43210',
  images: [
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
  ],
  reportedBy: {
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91 98765 43211',
  },
  assignedTo: {
    name: 'Rescue Team Alpha',
    email: 'teamalpha@rescue.com',
    phone: '+91 98765 43212',
  },
  createdAt: '2026-07-03T10:30:00Z',
  updatedAt: '2026-07-03T11:45:00Z',
  timeline: [
    {
      time: '10:30 AM',
      action: 'Emergency Reported',
      by: 'Priya Singh',
      status: 'PENDING',
    },
    {
      time: '10:45 AM',
      action: 'Emergency Verified',
      by: 'Admin',
      status: 'VERIFIED',
    },
    {
      time: '11:00 AM',
      action: 'Rescue Team Assigned',
      by: 'Admin',
      status: 'ASSIGNED',
    },
    {
      time: '11:30 AM',
      action: 'Team Dispatched',
      by: 'Rescue Team Alpha',
      status: 'IN_PROGRESS',
    },
  ],
  updates: [
    {
      time: '11:30 AM',
      message: 'Rescue team reached the site',
      by: 'Rescue Team Alpha',
    },
    {
      time: '11:45 AM',
      message: 'Evacuation in progress',
      by: 'Rescue Team Alpha',
    },
  ],
};

// ============================================
// MAIN COMPONENT
// ============================================

export const EmergencyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'timeline' | 'updates'
  >('details');
  const [emergency] = useState(emergencyData);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-error text-white border-error';
      case 'HIGH':
        return 'bg-error/80 text-white border-error/80';
      case 'MEDIUM':
        return 'bg-warning text-white border-warning';
      case 'LOW':
        return 'bg-success text-white border-success';
      default:
        return 'bg-primary text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'VERIFIED':
        return 'bg-info/20 text-info border-info/30';
      case 'ASSIGNED':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'IN_PROGRESS':
        return 'bg-success/20 text-success border-success/30';
      case 'RESOLVED':
        return 'bg-success/20 text-success border-success/30';
      case 'CANCELLED':
        return 'bg-muted/20 text-text-secondary border-muted/30';
      default:
        return 'bg-muted/20 text-text-secondary border-muted/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'VERIFIED':
        return 'Verified';
      case 'ASSIGNED':
        return 'Assigned';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'RESOLVED':
        return 'Resolved';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FLOOD':
        return <Droplet className='w-5 h-5' />;
      case 'EARTHQUAKE':
        return <Zap className='w-5 h-5' />;
      case 'FIRE':
        return <Flame className='w-5 h-5' />;
      case 'CYCLONE':
        return <Wind className='w-5 h-5' />;
      default:
        return <AlertTriangle className='w-5 h-5' />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'FLOOD':
        return 'Flood';
      case 'EARTHQUAKE':
        return 'Earthquake';
      case 'FIRE':
        return 'Fire';
      case 'CYCLONE':
        return 'Cyclone';
      case 'LANDSLIDE':
        return 'Landslide';
      case 'PANDEMIC':
        return 'Pandemic';
      case 'ACCIDENT':
        return 'Accident';
      default:
        return 'Other';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return '🔴 Critical';
      case 'HIGH':
        return '🟠 High';
      case 'MEDIUM':
        return '🟡 Medium';
      case 'LOW':
        return '🟢 Low';
      default:
        return severity;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex'>
      <Sidebar
        active='Emergencies'
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className='flex-1 min-w-0 overflow-y-auto h-screen'>
        {/* Navbar */}
         <Navbar 
          title="Emergency Details" 
          subtitle={`Manage and view details of the emergency`}
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
                <div
                  className={`w-14 h-14 rounded-2xl ${getSeverityColor(emergency.severity)} flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10`}
                >
                  {getTypeIcon(emergency.type)}
                </div>
                <div>
                  <h2 className='text-xl font-bold text-text-primary'>
                    {emergency.title}
                  </h2>
                  <div className='flex flex-wrap items-center gap-2 mt-1.5'>
                    <Badge
                      className={`text-[11px] border ${getStatusColor(emergency.status)}`}
                    >
                      {getStatusLabel(emergency.status)}
                    </Badge>
                    <Badge
                      className={`text-[11px] border ${getSeverityColor(emergency.severity)}`}
                    >
                      {getSeverityLabel(emergency.severity)}
                    </Badge>
                    <Badge className='bg-primary/10 text-primary border-primary/20 text-[11px]'>
                      {getTypeLabel(emergency.type)}
                    </Badge>
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

          {/* Tabs */}
          <div className='bg-white/50 backdrop-blur-md rounded-2xl shadow-lg shadow-primary/5 border border-white/30 overflow-hidden'>
            <div className='flex border-b border-white/20'>
              {['details', 'timeline', 'updates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-sand-light/30'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className='p-5'>
              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='space-y-4'
                >
                  {/* Description */}
                  <div>
                    <h4 className='text-sm font-semibold text-text-primary mb-1.5'>
                      Description
                    </h4>
                    <p className='text-sm text-text-secondary leading-relaxed'>
                      {emergency.description}
                    </p>
                  </div>

                  {/* Grid Info */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/20'>
                    <div>
                      <p className='text-xs text-text-tertiary uppercase tracking-wider'>
                        Location
                      </p>
                      <p className='text-sm text-text-primary mt-0.5 flex items-center gap-1.5'>
                        <MapPin className='w-4 h-4 text-text-tertiary' />
                        {emergency.location}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-text-tertiary uppercase tracking-wider'>
                        Victims
                      </p>
                      <p className='text-sm text-text-primary mt-0.5 flex items-center gap-1.5'>
                        <Users className='w-4 h-4 text-text-tertiary' />
                        {emergency.victimCount} people affected
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-text-tertiary uppercase tracking-wider'>
                        Reported By
                      </p>
                      <p className='text-sm text-text-primary mt-0.5 flex items-center gap-1.5'>
                        <User className='w-4 h-4 text-text-tertiary' />
                        {emergency.reportedBy.name}
                      </p>
                      <p className='text-xs text-text-tertiary mt-0.5 flex items-center gap-1.5'>
                        <Phone className='w-3 h-3 text-text-tertiary' />
                        {emergency.reportedBy.phone}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-text-tertiary uppercase tracking-wider'>
                        Assigned To
                      </p>
                      <p className='text-sm text-text-primary mt-0.5 flex items-center gap-1.5'>
                        <Shield className='w-4 h-4 text-text-tertiary' />
                        {emergency.assignedTo?.name || 'Not Assigned'}
                      </p>
                    </div>
                  </div>

                  {/* Victim Details */}
                  {emergency.victimName && (
                    <div className='bg-sand-light/30 rounded-xl p-4 border border-white/20'>
                      <p className='text-xs text-text-tertiary uppercase tracking-wider'>
                        Victim Contact
                      </p>
                      <p className='text-sm text-text-primary mt-0.5'>
                        {emergency.victimName}
                      </p>
                      <p className='text-sm text-text-secondary flex items-center gap-1.5'>
                        <Phone className='w-3.5 h-3.5 text-text-tertiary' />
                        {emergency.victimPhone}
                      </p>
                    </div>
                  )}

                  {/* Images */}
                  {emergency.images && emergency.images.length > 0 && (
                    <div>
                      <p className='text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5'>
                        <Image className='w-4 h-4 text-text-tertiary' />
                        Images
                      </p>
                      <div className='grid grid-cols-3 gap-2'>
                        {emergency.images.map((img, i) => (
                          <div
                            key={i}
                            className='aspect-square rounded-xl overflow-hidden bg-sand-light/50 border border-white/20'
                          >
                            <img
                              src={img}
                              alt={`Emergency ${i + 1}`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='space-y-4'
                >
                  <div className='relative'>
                    {emergency.timeline.map((item, index) => (
                      <div
                        key={index}
                        className='flex gap-4 pb-6 last:pb-0 relative'
                      >
                        <div className='flex flex-col items-center'>
                          <div
                            className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-error' : index === emergency.timeline.length - 1 ? 'bg-success' : 'bg-primary'}`}
                          />
                          {index < emergency.timeline.length - 1 && (
                            <div className='w-0.5 flex-1 bg-white/30 mt-1' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='text-sm font-semibold text-text-primary'>
                              {item.action}
                            </span>
                            <Badge
                              className={`text-[10px] border ${getStatusColor(item.status)}`}
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                          </div>
                          <p className='text-xs text-text-tertiary mt-0.5 flex items-center gap-2'>
                            <Clock className='w-3 h-3' />
                            {item.time} • by {item.by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='space-y-4'
                >
                  {emergency.updates.length === 0 ? (
                    <p className='text-sm text-text-tertiary text-center py-4'>
                      No updates yet
                    </p>
                  ) : (
                    emergency.updates.map((update, index) => (
                      <div
                        key={index}
                        className='flex gap-3 p-3 rounded-xl bg-sand-light/30 border border-white/20'
                      >
                        <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                          <MessageCircle className='w-4 h-4 text-primary' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm text-text-primary'>
                            {update.message}
                          </p>
                          <p className='text-xs text-text-tertiary mt-0.5 flex items-center gap-2'>
                            <Clock className='w-3 h-3' />
                            {update.time} • by {update.by}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Update */}
                  <div className='flex gap-2 mt-3 pt-3 border-t border-white/20'>
                    <input
                      type='text'
                      placeholder='Add an update...'
                      className='flex-1 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2 text-sm placeholder:text-text-tertiary/50'
                    />
                    <Button className='bg-primary hover:bg-primary-dark text-white rounded-xl px-4'>
                      <Send className='w-4 h-4' />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Chat Button */}
          <Link to={`/chat/${emergency.id}`}>
            <Button className='w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20 h-11'>
              <MessageCircle className='w-4 h-4 mr-2' />
              Open Chat for this Emergency
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
