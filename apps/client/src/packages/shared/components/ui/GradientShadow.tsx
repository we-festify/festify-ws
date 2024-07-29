import { cn } from '../../../../lib/utils';
import { useRef } from 'react';

interface GradientShadowProps {
  gradient?: string;
  initialOpacity?: number;
  hoverOpacity?: number;
  durationInMs?: number;
  spread?: 0 | 1 | 2;
  blur?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
  className?: string;
}

const GradientShadow = ({
  gradient = 'linear-gradient(123deg,#008559,#007e94,#0073e5)',
  initialOpacity = 0.5,
  hoverOpacity = 0.75,
  children,
  durationInMs,
  spread = 0,
  blur = 1,
  className,
}: Readonly<GradientShadowProps>) => {
  const gradientRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (gradientRef.current) {
      gradientRef.current.style.opacity = hoverOpacity.toString();
    }
  };

  const handleMouseLeave = () => {
    if (gradientRef.current) {
      gradientRef.current.style.opacity = initialOpacity.toString();
    }
  };

  return (
    <div
      className={cn('relative w-max h-max', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={gradientRef}
        className={cn(
          'absolute blur transition-opacity',
          '-inset-0', // registering the class
          '-inset-1', // registering the class
          '-inset-2', // registering the class
          `-inset-${spread}`,
          blur === 2 && 'blur-md',
          blur === 3 && 'blur-lg',
          blur === 4 && 'blur-xl'
        )}
        style={{
          backgroundImage: gradient,
          opacity: initialOpacity,
          transitionDuration: durationInMs ? `${durationInMs}ms` : '300ms',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

export default GradientShadow;
