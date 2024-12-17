import { Theme, useTheme } from '@rootui/providers/theme-provider';
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

  const getBackgroundImage = (theme: Theme) => {
    if (theme === 'dark') {
      return `radial-gradient(100% 140% at 60% -10%,#02081700,#020817 75%)`;
    } else if (theme === 'light') {
      return `radial-gradient(100% 140% at 60% -10%,#fff0,#fff 75%)`;
    }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    if (systemTheme === 'dark') {
      return `radial-gradient(100% 140% at 60% -10%,#02081700,#020817 75%)`;
    }
    return `radial-gradient(100% 140% at 60% -10%,#fff0,#fff 75%)`;
  };

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
          backgroundImage: getBackgroundImage(theme),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ServiceGradientHero;
