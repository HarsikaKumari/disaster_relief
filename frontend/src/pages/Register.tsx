/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OTPInput } from '../auth/OTPInput';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import api from '../lib/api';

const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox='0 0 200 200'
      className={className}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M100 10 L180 50 L180 100 C180 140 150 175 100 190 C50 175 20 140 20 100 L20 50 L100 10Z'
        fill='url(#shieldGrad)'
        stroke='#4F5844'
        strokeWidth='2'
      />
      <path
        d='M100 25 L160 55 L160 95 C160 125 135 155 100 168 C65 155 40 125 40 95 L40 55 L100 25Z'
        fill='#F5F2EC'
        opacity='0.9'
      />
      <path
        d='M70 100 L90 120 L130 70'
        stroke='#4F5844'
        strokeWidth='8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M75 110 L85 130 L95 110'
        stroke='#4F5844'
        strokeWidth='6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M120 80 L135 65 L145 80'
        stroke='#4F5844'
        strokeWidth='6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M95 145 C90 138 80 140 80 148 C80 156 95 165 95 165 C95 165 110 156 110 148 C110 140 100 138 95 145Z'
        fill='#7A2E2A'
        opacity='0.8'
      />
      <circle
        cx='60'
        cy='70'
        r='4'
        fill='#4F5844'
        opacity='0.4'
      />
      <circle
        cx='140'
        cy='70'
        r='4'
        fill='#4F5844'
        opacity='0.4'
      />
      <circle
        cx='100'
        cy='55'
        r='3'
        fill='#7A2E2A'
        opacity='0.3'
      />

      <defs>
        <linearGradient
          id='shieldGrad'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='100%'
        >
          <stop
            offset='0%'
            style={{ stopColor: '#5E6653' }}
          />
          <stop
            offset='50%'
            style={{ stopColor: '#4F5844' }}
          />
          <stop
            offset='100%'
            style={{ stopColor: '#3E4636' }}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ============================================
// 3D STONE COMPONENT
// ============================================

const FloatingStone = ({
  size = 'md',
  delay = 0,
  x = 0,
  y = 0,
  rotation = 0,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
  x?: number;
  y?: number;
  rotation?: number;
  className?: string;
}) => {
  const [duration] = useState(() => 6 + Math.random() * 4);
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-24 h-20',
    xl: 'w-32 h-28',
  };

  return (
    <motion.div
      initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{
        x: [0, x, -x * 0.5, x * 0.3, 0],
        y: [0, y, -y * 0.3, y * 0.5, 0],
        rotate: [0, rotation, -rotation * 0.5, rotation * 0.3, 0],
        scale: [1, 1.02, 0.98, 1.01, 1],
        transition: {
          duration,
          delay: delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={`${sizes[size]} ${className} relative`}
    >
      <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-black/20 rounded-full blur-md' />
      <div className='relative w-full h-full'>
        <svg
          viewBox='0 0 100 100'
          className='w-full h-full drop-shadow-lg'
        >
          <defs>
            <linearGradient
              id={`stoneGrad-${delay}`}
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop
                offset='0%'
                style={{ stopColor: '#8C9577', stopOpacity: 1 }}
              />
              <stop
                offset='40%'
                style={{ stopColor: '#5E6653', stopOpacity: 1 }}
              />
              <stop
                offset='100%'
                style={{ stopColor: '#3E4636', stopOpacity: 1 }}
              />
            </linearGradient>
            <radialGradient
              id={`stoneHighlight-${delay}`}
              cx='35%'
              cy='30%'
              r='50%'
            >
              <stop
                offset='0%'
                style={{ stopColor: '#B8C99F', stopOpacity: 0.6 }}
              />
              <stop
                offset='100%'
                style={{ stopColor: '#4F5844', stopOpacity: 0 }}
              />
            </radialGradient>
            <filter id={`stoneShadow-${delay}`}>
              <feDropShadow
                dx='2'
                dy='4'
                stdDeviation='3'
                floodColor='#2E3428'
                floodOpacity='0.3'
              />
            </filter>
          </defs>
          <path
            d='M50 10 C65 8, 80 15, 88 30 C92 45, 90 60, 82 75 C74 88, 58 95, 45 92 C30 88, 18 78, 12 62 C6 46, 10 28, 25 16 C35 8, 42 10, 50 10Z'
            fill={`url(#stoneGrad-${delay})`}
            filter={`url(#stoneShadow-${delay})`}
          />
          <path
            d='M50 10 C65 8, 80 15, 88 30 C92 45, 90 60, 82 75 C74 88, 58 95, 45 92 C30 88, 18 78, 12 62 C6 46, 10 28, 25 16 C35 8, 42 10, 50 10Z'
            fill={`url(#stoneHighlight-${delay})`}
          />
          <path
            d='M30 40 Q45 35, 55 42'
            stroke='#3E4636'
            strokeWidth='1.5'
            fill='none'
            opacity='0.3'
          />
          <path
            d='M40 55 Q55 50, 70 58'
            stroke='#3E4636'
            strokeWidth='1.5'
            fill='none'
            opacity='0.3'
          />
        </svg>
      </div>
    </motion.div>
  );
};

// ============================================
// SEISMIC WAVE EFFECT
// ============================================

const SeismicWave = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.4 }}
      animate={{
        scale: [0.8, 1.4, 2.2],
        opacity: [0.4, 0.1, 0],
      }}
      transition={{
        duration: 4.5,
        delay: delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      className='absolute rounded-full border-2 border-white/8'
      style={{
        width: '120px',
        height: '120px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

// ============================================
// MAIN REGISTER COMPONENT
// ============================================

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
  });
  const [otpValue, setOTPValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const stats = [
    {
      icon: <Shield className='w-4 h-4 text-sand-light' />,
      value: '500+',
      label: 'Emergencies',
    },
    {
      icon: <Users className='w-4 h-4 text-sand-light' />,
      value: '2,000+',
      label: 'Volunteers',
    },
    {
      icon: <Clock className='w-4 h-4 text-sand-light' />,
      value: '24/7',
      label: 'Support',
    },
  ];

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ========== API: REGISTER ==========
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role.toUpperCase(),
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setStep('otp');
        startTimer();
      } else {
        setError(response.data.message || 'Registration failed');
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to register. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ========== API: RESEND OTP ==========
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/resend-otp', {
        email: formData.email,
      });
      if (response.data.success) {
        startTimer();
        toast.success('OTP resent successfully!');
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // ========== API: VERIFY OTP ==========
  const handleVerifyOTP = async () => {
    setError('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp: otpValue,
      });

      if (response.data.success) {
        toast.success('Registration successful! Welcome aboard!');
        // Store token and user data
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Invalid OTP');
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'OTP verification failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-light via-[#F5EDE4] to-secondary/40 p-4'>
      <div className='w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10'>
        {/* ============================================
        LEFT SIDE - REGISTER FORM
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='bg-white/95 backdrop-blur-xl p-8 md:p-10'
        >
          {/* Logo + Brand */}
          <div className='flex items-center gap-4 mb-6'>
            <div className='w-14 h-14 flex-shrink-0'>
              <Logo className='w-full h-full' />
            </div>
            <div>
              <span className='text-xl font-bold text-primary tracking-tight block'>
                Disaster Relief
              </span>
              <span className='text-xs text-text-tertiary font-medium tracking-wider uppercase'>
                Coordination Platform
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-6'>
            <h1 className='text-3xl font-bold text-primary tracking-tight'>
              Create Account
            </h1>
            <p className='text-text-secondary mt-1.5 text-sm'>
              {step === 'register'
                ? 'Join the relief effort and start making a difference'
                : 'Enter the verification code sent to your email'}
            </p>
          </div>

          <AnimatePresence mode='wait'>
            {step === 'register' ? (
              <motion.form
                key='register'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className='space-y-4'
              >
                {error && (
                  <Alert className='border-error/20 bg-error/5 text-error'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Full Name */}
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Full Name
                  </Label>
                  <div className='relative group'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300'>
                      <User className='h-4 w-4' />
                    </div>
                    <Input
                      id='fullName'
                      type='text'
                      placeholder='Enter your full name'
                      value={formData.fullName}
                      onChange={handleChange}
                      className='pl-9 bg-sand-light/40 border-sand-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 rounded-lg transition-all duration-300 text-sm text-text-primary placeholder:text-text-tertiary/50 hover:bg-sand-light/70 group-focus-within:bg-white'
                    />
                    <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within:w-full' />
                  </div>
                </div>

                {/* Email */}
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Email Address
                  </Label>
                  <div className='relative group'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300'>
                      <Mail className='h-4 w-4' />
                    </div>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email address'
                      value={formData.email}
                      onChange={handleChange}
                      className='pl-9 bg-sand-light/40 border-sand-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 rounded-lg transition-all duration-300 text-sm text-text-primary placeholder:text-text-tertiary/50 hover:bg-sand-light/70 group-focus-within:bg-white'
                    />
                    <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within:w-full' />
                  </div>
                </div>

                {/* Phone */}
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Phone Number
                  </Label>
                  <div className='relative group'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300'>
                      <Phone className='h-4 w-4' />
                    </div>
                    <Input
                      id='phone'
                      type='tel'
                      placeholder='Enter your phone number'
                      value={formData.phone}
                      onChange={handleChange}
                      className='pl-9 bg-sand-light/40 border-sand-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 rounded-lg transition-all duration-300 text-sm text-text-primary placeholder:text-text-tertiary/50 hover:bg-sand-light/70 group-focus-within:bg-white'
                    />
                    <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within:w-full' />
                  </div>
                </div>

                {/* Password */}
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Password
                  </Label>
                  <div className='relative group'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300'>
                      <Lock className='h-4 w-4' />
                    </div>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Create a password (min 6 characters)'
                      value={formData.password}
                      onChange={handleChange}
                      className='pl-9 bg-sand-light/40 border-sand-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 rounded-lg transition-all duration-300 text-sm text-text-primary placeholder:text-text-tertiary/50 hover:bg-sand-light/70 group-focus-within:bg-white'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-300 p-0.5 rounded-lg hover:bg-sand-light/50'
                    >
                      {showPassword ? (
                        <EyeOff className='h-3.5 w-3.5' />
                      ) : (
                        <Eye className='h-3.5 w-3.5' />
                      )}
                    </button>
                    <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within:w-full' />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className='space-y-1.5'>
                  <Label className='text-sm font-medium text-text-primary'>
                    Confirm Password
                  </Label>
                  <div className='relative group'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300'>
                      <Lock className='h-4 w-4' />
                    </div>
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm your password'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='pl-9 bg-sand-light/40 border-sand-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 rounded-lg transition-all duration-300 text-sm text-text-primary placeholder:text-text-tertiary/50 hover:bg-sand-light/70 group-focus-within:bg-white'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-300 p-0.5 rounded-lg hover:bg-sand-light/50'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-3.5 w-3.5' />
                      ) : (
                        <Eye className='h-3.5 w-3.5' />
                      )}
                    </button>
                    <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within:w-full' />
                  </div>
                </div>

                {/* ===== ROLE SELECTION - COMPACT ===== */}
                <div className='flex items-center gap-3'>
                  <Label className='text-sm font-medium text-text-primary whitespace-nowrap'>
                    I am a
                  </Label>
                  <div className='relative group flex-1'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors duration-300 z-10'>
                      <Building2 className='h-4 w-4' />
                    </div>
                    <select
                      id='role'
                      value={formData.role}
                      onChange={handleChange}
                      className='w-full h-9 pl-8 pr-8 bg-sand-light/40 border-sand-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-300 text-sm text-text-primary appearance-none cursor-pointer hover:bg-sand-light/70 focus:bg-white'
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%234F5844' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '10px',
                      }}
                    >
                      <option value='citizen'>👤 Citizen</option>
                      <option value='volunteer'>🤝 Volunteer</option>
                      <option value='ngo'>🏢 NGO</option>
                      <option value='admin'>🛡️ Admin</option>
                    </select>
                    <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-focus-within:w-full' />
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full h-10 bg-[#4F5844] hover:bg-[#4f5844]/90 text-white rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-sm font-medium hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1'
                >
                  {loading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className='h-4 w-4' />
                      Create Account
                    </>
                  )}
                </button>

                <div className='relative my-2'>
                  <Separator className='bg-sand-dark/20' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-3 text-xs text-text-tertiary'>
                    OR
                  </span>
                </div>

                <p className='text-center text-sm text-text-secondary'>
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className='text-primary hover:text-primary-dark font-semibold transition-colors'
                  >
                    Sign In
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key='otp'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'
              >
                <div className='text-center space-y-2'>
                  <div className='flex items-center justify-center gap-2 text-success'>
                    <CheckCircle className='w-5 h-5' />
                    <span className='text-sm font-medium'>
                      Verification Code Sent
                    </span>
                  </div>
                  <p className='text-sm text-text-secondary'>
                    We emailed a 6-digit code to
                  </p>
                  <p className='font-semibold text-primary'>{formData.email}</p>
                </div>

                {error && (
                  <Alert className='border-error/20 bg-error/5 text-error'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <OTPInput
                  length={6}
                  value={otpValue}
                  onChange={setOTPValue}
                  disabled={loading}
                />

                <div className='flex flex-col items-center gap-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <span className='text-text-secondary'>
                      {canResend
                        ? "Didn't receive the code?"
                        : `Resend in ${timer}s`}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={handleResendOTP}
                    disabled={!canResend || resendLoading}
                    className={`text-sm font-medium transition-colors ${
                      canResend && !resendLoading
                        ? 'text-primary hover:text-primary-dark cursor-pointer'
                        : 'text-text-tertiary cursor-not-allowed'
                    }`}
                  >
                    {resendLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin inline' />
                    ) : (
                      'Resend OTP'
                    )}
                  </button>
                </div>

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => {
                      setStep('register');
                      setError('');
                      setOTPValue('');
                    }}
                    className='flex-1 h-10 border-2 border-sand-dark/40 hover:bg-secondary/50 rounded-lg text-text-primary font-medium transition-colors text-sm'
                  >
                    <ArrowLeft className='inline mr-1.5 h-4 w-4' />
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otpValue.length !== 6}
                    className='flex-1 h-10 bg-[#4F5844] cursor-pointer  hover:bg-[#4f5844]/90 text-white rounded-lg shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 font-medium transition-all text-sm'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Register →'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ============================================
        RIGHT SIDE - BRANDING WITH 3D STONES
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='hidden md:flex flex-col items-center justify-center p-10 bg-gradient-olive text-white relative overflow-hidden min-h-[600px]'
        >
          <div className='absolute inset-0 overflow-hidden'>
            <SeismicWave delay={0} />
            <SeismicWave delay={1.5} />
            <SeismicWave delay={3} />
          </div>

          <div className='absolute inset-0 overflow-hidden pointer-events-none'>
            <FloatingStone
              size='lg'
              delay={0}
              x={15}
              y={-10}
              rotation={8}
              className='absolute top-6 left-2 opacity-50'
            />
            <FloatingStone
              size='md'
              delay={1.2}
              x={-12}
              y={8}
              rotation={-5}
              className='absolute top-10 right-4 opacity-40'
            />
            <FloatingStone
              size='xl'
              delay={0.6}
              x={12}
              y={5}
              rotation={-8}
              className='absolute left-[-10px] top-1/2 -translate-y-1/2 opacity-30'
            />
            <FloatingStone
              size='xl'
              delay={0.9}
              x={-10}
              y={-5}
              rotation={10}
              className='absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-30'
            />
            <FloatingStone
              size='sm'
              delay={1.8}
              x={10}
              y={-8}
              rotation={-6}
              className='absolute bottom-16 left-6 opacity-40'
            />
            <FloatingStone
              size='md'
              delay={2.1}
              x={-15}
              y={-5}
              rotation={12}
              className='absolute bottom-12 right-2 opacity-35'
            />
          </div>

          <div className='relative z-10 text-center max-w-sm'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              <div className='w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10'>
                <Shield className='w-7 h-7 text-sand-light' />
              </div>
            </div>

            <h2 className='text-4xl font-bold leading-tight mb-4 text-white'>
              Join the Mission
              <br />
              <span className='text-sand-light'>Make a Difference</span>
            </h2>

            <p className='text-white/60 text-sm max-w-xs mx-auto leading-relaxed'>
              Register now and become part of a community dedicated to saving
              lives during disasters.
            </p>

            <div className='flex justify-center gap-8 mt-8'>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className='text-center'
                >
                  <div className='flex items-center justify-center gap-1.5 text-white'>
                    {stat.icon}
                    <span className='text-xl font-bold text-white'>
                      {stat.value}
                    </span>
                  </div>
                  <p className='text-white/40 text-xs mt-0.5'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='absolute bottom-6 left-0 right-0 text-center z-10'>
            <div className='flex items-center justify-center gap-2 text-white/30 text-xs'>
              <Sparkles className='w-3 h-3' />
              <span>Secure • Encrypted • 24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
