import { useTheme } from '@rootui/providers/ThemeProvider';
import { cn } from '../utils/tw';

interface ServiceGradientHeroProps {
  children?: React.ReactNode;
  className?: string;
  gradient?: string;
}

const ServiceGradientHero = ({
  children,
  className,
  gradient = 'linear-gradient(120deg,#fefd82,#aeffa8 29.94%,#8fffce 66.98%,#99f7ff)',
}: Readonly<ServiceGradientHeroProps>) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: `400% 400%`,
        animation: `ServiceBackgroundGradientHero 15s ease infinite`,
      }}
    >
      <div
        className={cn(className)}
        style={{
          backgroundImage:
            theme === 'dark'
              ? `radial-gradient(100% 140% at 60% -10%,#02081700,#020817 75%)`
              : `radial-gradient(100% 140% at 60% -10%,#fff0,#fff 75%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ServiceGradientHero;
