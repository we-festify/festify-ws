import { Link } from 'react-router-dom';
import { cn } from '../utils/tw';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'dark', size = 'md' }: LogoProps) => {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center justify-center select-none',
        variant === 'light' ? 'text-white/90' : 'text-primary',
        size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl',
      )}
    >
      Festify
      <span
        className={cn(
          'font-thin',
          variant === 'light' ? 'text-white/90' : 'text-primary',
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl',
        )}
      >
        WS
      </span>
    </Link>
  );
};

export default Logo;
