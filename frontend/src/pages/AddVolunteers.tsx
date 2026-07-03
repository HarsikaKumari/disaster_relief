import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  Plus,
  X,
  Loader2,
  Calendar,
  Clock,
  Briefcase,
  Heart,
  FileText,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Sidebar } from '../components/layouts/sidebar';
import { Navbar } from '../components/layouts/Navbar';
// ============================================
// TYPES
// ============================================

interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  status: 'Active' | 'Inactive' | 'Pending';
  bio: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// ============================================
// SKILLS OPTIONS
// ============================================

const SKILL_OPTIONS = [
  'First Aid',
  'Rescue',
  'Driving',
  'Medical',
  'Counseling',
  'Communication',
  'Logistics',
  'Swimming',
  'Fire Fighting',
  'Search & Rescue',
  'Disaster Management',
  'Community Outreach',
  'Food Distribution',
  'Shelter Management',
  'Water Purification',
  'Sanitation',
  'Electricity',
  'Translation',
  'Administration',
  'Leadership',
];

// ============================================
// ADD VOLUNTEER PAGE
// ============================================

export const AddVolunteer = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    availability: 'AVAILABLE',
    status: 'Pending',
    bio: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills.includes(skill)
        ? selectedSkills.filter((s) => s !== skill)
        : [...selectedSkills, skill],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Volunteer added successfully!');
      navigate('/volunteers');
    }, 1500);
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
          title='Dashboard'
          subtitle={`Add Volunteer`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className='p-3 md:p-4 pb-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-2xl mx-auto'
          >
            <div className='bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-white/40'>
              {/* Header */}
              <div className='flex items-center gap-3 mb-6 pb-4 border-t border-white/20'>
                <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
                  <Users className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <h2 className='text-lg font-bold text-text-primary'>
                    Volunteer Details
                  </h2>
                  <p className='text-xs text-text-tertiary'>
                    Fill in the volunteer information
                  </p>
                </div>
                <Badge className='ml-auto bg-primary/10 text-primary border-primary/20 text-[10px]'>
                  <Clock className='w-2.5 h-2.5 mr-1' />
                  New
                </Badge>
              </div>

              <form
                onSubmit={handleSubmit}
                className='space-y-5'
              >
                {/* Personal Information */}
                <div className='bg-sand-light/30 rounded-xl p-4 border border-white/20'>
                  <p className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
                    <User className='w-4 h-4 text-text-tertiary' />
                    Personal Information
                    <span className='text-xs text-text-tertiary font-normal'>
                      (Required)
                    </span>
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs text-text-secondary'>
                        Full Name *
                      </Label>
                      <div className='relative'>
                        <User className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50' />
                        <Input
                          id='name'
                          value={formData.name}
                          onChange={handleChange}
                          placeholder='Enter full name'
                          className='pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm'
                          required
                        />
                      </div>
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs text-text-secondary'>
                        Email *
                      </Label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50' />
                        <Input
                          id='email'
                          type='email'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder='Enter email address'
                          className='pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm'
                          required
                        />
                      </div>
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs text-text-secondary'>
                        Phone *
                      </Label>
                      <div className='relative'>
                        <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50' />
                        <Input
                          id='phone'
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder='Enter phone number'
                          className='pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm'
                          required
                        />
                      </div>
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs text-text-secondary'>
                        Location *
                      </Label>
                      <div className='relative'>
                        <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50' />
                        <Input
                          id='location'
                          value={formData.location}
                          onChange={handleChange}
                          placeholder='Enter location'
                          className='pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm'
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className='bg-sand-light/30 rounded-xl p-4 border border-white/20'>
                  <p className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
                    <Briefcase className='w-4 h-4 text-text-tertiary' />
                    Skills & Expertise
                    <span className='text-xs text-text-tertiary font-normal'>
                      (Select all that apply)
                    </span>
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {SKILL_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        type='button'
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          selectedSkills.includes(skill)
                            ? 'bg-primary text-white shadow-primary'
                            : 'bg-white/50 text-text-secondary hover:bg-white/70 border border-white/30'
                        }`}
                      >
                        {selectedSkills.includes(skill) ? '✓' : ''} {skill}
                      </button>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-1.5'>
                      {selectedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          className='bg-primary/10 text-primary border-primary/20 text-[10px]'
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability & Status */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-sm font-medium text-text-primary flex items-center gap-2'>
                      <Clock className='w-4 h-4 text-text-tertiary' />
                      Availability *
                    </Label>
                    <select
                      id='availability'
                      value={formData.availability}
                      onChange={handleChange}
                      className='w-full h-11 px-4 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/80 transition-colors'
                      required
                    >
                      <option value='AVAILABLE'>✅ Available</option>
                      <option value='BUSY'>🟡 Busy</option>
                      <option value='OFF_DUTY'>⚪ Off Duty</option>
                    </select>
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-sm font-medium text-text-primary flex items-center gap-2'>
                      <Shield className='w-4 h-4 text-text-tertiary' />
                      Status *
                    </Label>
                    <select
                      id='status'
                      value={formData.status}
                      onChange={handleChange}
                      className='w-full h-11 px-4 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/80 transition-colors'
                      required
                    >
                      <option value='Active'>✅ Active</option>
                      <option value='Inactive'>❌ Inactive</option>
                      <option value='Pending'>⏳ Pending</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary flex items-center gap-2'>
                    <FileText className='w-4 h-4 text-text-tertiary' />
                    Bio / About
                    <span className='text-xs text-text-tertiary font-normal'>
                      (Optional)
                    </span>
                  </Label>
                  <textarea
                    id='bio'
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder='Brief description about the volunteer...'
                    rows={3}
                    className='w-full bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-tertiary/50 resize-none'
                  />
                </div>

                {/* Emergency Contact */}
                <div className='bg-sand-light/30 rounded-xl p-4 border border-white/20'>
                  <p className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
                    <Heart className='w-4 h-4 text-text-tertiary' />
                    Emergency Contact
                    <span className='text-xs text-text-tertiary font-normal'>
                      (Optional)
                    </span>
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs text-text-secondary'>
                        Contact Name
                      </Label>
                      <Input
                        id='emergencyContact'
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder='Emergency contact name'
                        className='bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm'
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs text-text-secondary'>
                        Contact Phone
                      </Label>
                      <Input
                        id='emergencyPhone'
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        placeholder='Emergency contact phone'
                        className='bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm'
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className='flex gap-3 pt-4 border-t border-white/20'>
                  <Link
                    to='/volunteers'
                    className='flex-1'
                  >
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full border-white/30 text-text-secondary hover:bg-white/50 rounded-xl h-11'
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20 h-11'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-1.5 animate-spin' />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className='w-4 h-4 mr-1.5' />
                        Add Volunteer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
