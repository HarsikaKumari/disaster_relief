import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Users,
  AlertTriangle,
  Truck,
  Bell,
  Home,
  MessageCircle,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

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

export const Sidebar = ({
  active,
  mobileOpen,
  setMobileOpen,
}: {
  active: string;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}) => {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: <Home className='w-5 h-5' />,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <AlertTriangle className='w-5 h-5' />,
      label: 'Emergencies',
      href: '/emergencies',
    },
    { icon: <MapPin className='w-5 h-5' />, label: 'Live Map', href: '/map' },
    {
      icon: <Truck className='w-5 h-5' />,
      label: 'Resources',
      href: '/Resources',
    },
    {
      icon: <Users className='w-5 h-5' />,
      label: 'Volunteers',
      href: '/volunteers',
    },
    {
      icon: <MessageCircle className='w-5 h-5' />,
      label: 'Chat',
      href: '/chat',
    },
    {
      icon: <Bell className='w-5 h-5' />,
      label: 'Notifications',
      href: '/notifications',
    },
    {
      icon: <Settings className='w-5 h-5' />,
      label: 'Profile Settings',
      href: '/Profile',
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className='flex items-center gap-3 px-4 py-5'>
        <div className='w-11 h-11 flex-shrink-0'>
          <Logo className='w-full h-full' />
        </div>
        <div>
          <span className='text-lg font-bold text-primary tracking-tight block leading-tight'>
            Disaster
          </span>
          <span className='text-[10px] font-medium text-text-tertiary tracking-widest uppercase'>
            Relief Platform
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-3 py-3 space-y-1'>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
              active === item.label
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <span
              className={
                active === item.label
                  ? 'text-white'
                  : 'text-text-secondary group-hover:text-primary transition-colors'
              }
            >
              {item.icon}
            </span>
            <span className='flex-1'>{item.label}</span>
            {active === item.label && (
              <motion.div
                layoutId='activeDot'
                className='w-1.5 h-1.5 rounded-full bg-white/80'
              />
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className='p-3'>
        <div className='flex items-center gap-3 p-2 rounded-2xl hover:bg-primary/5 transition-colors'>
          <div className='w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-[] font-semibold text-sm flex-shrink-0'>
            JD
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-text-primary truncate'>
              John Doe
            </p>
            <p className='text-xs text-text-tertiary truncate'>Administrator</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className='p-1.5 rounded-xl hover:bg-error/10 text-text-tertiary hover:text-error transition-colors'
          >
            <LogOut className='w-4 h-4' />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden md:flex md:w-64 lg:w-72 flex-col bg-primary backdrop-blur-xl rounded-r-3xl shadow-xl shadow-primary/5 h-screen sticky top-0 flex-shrink-0 border-r border-white/20'>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className='fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden'
          onClick={() => setMobileOpen(false)}
        >
          <div
            className='w-72 bg-white/95 backdrop-blur-xl h-full shadow-2xl rounded-r-3xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-end p-2'>
              <button
                onClick={() => setMobileOpen(false)}
                className='p-2 rounded-xl hover:bg-sand-light/50'
              >
                <X className='w-5 h-5 text-text-secondary' />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
