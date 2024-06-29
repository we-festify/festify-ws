import { cn } from '../../../../lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-semibold select-none',
        className
      )}
    >
      Festify
      <span className="text-primary font-light">WS</span>
    </div>
  );
};

export default Logo;
