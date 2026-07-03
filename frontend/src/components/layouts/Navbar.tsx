import { Link } from 'react-router-dom';
import { Bell, Menu, Search, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';

interface NavbarProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onMenuClick?: () => void;
}

export const Navbar = ({
  title,
  subtitle,
  showSearch = true,
  onMenuClick,
}: NavbarProps) => {
  // Get user initials from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : 'JD';

  return (
    <div className='bg-white/50 backdrop-blur-xl rounded-2xl m-3 md:m-4 p-3 shadow-lg shadow-primary/5 border border-white/30 flex items-center justify-between gap-4 sticky top-3 z-30'>
      <div className='flex items-center gap-3'>
        <button
          onClick={onMenuClick}
          className='md:hidden p-1.5 rounded-xl hover:bg-sand-light/50'
        >
          <Menu className='w-5 h-5 text-text-secondary' />
        </button>
        <div>
          <h1 className='text-base font-semibold text-text-primary'>{title}</h1>
          {subtitle && <p className='text-xs text-text-tertiary'>{subtitle}</p>}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        {showSearch && (
          <div className='hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30 shadow-sm'>
            <Search className='w-3.5 h-3.5 text-text-tertiary' />
            <input
              type='text'
              placeholder='Search...'
              className='border-0 bg-transparent p-0 h-7 text-sm w-28 lg:w-40 focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60'
            />
          </div>
        )}

        <Link to='/notifications'>
          <button className='relative p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors'>
            <Bell className='w-5 h-5 text-text-secondary' />
            <span className='absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/30' />
          </button>
        </Link>

        <Link to='/profile'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-lg shadow-primary/20 hover:opacity-80 transition-opacity cursor-pointer'>
            {initials}
          </div>
        </Link>
      </div>
    </div>
  );
};
