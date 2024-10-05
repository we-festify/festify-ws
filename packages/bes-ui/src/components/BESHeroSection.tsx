import GradientShadow from '@sharedui/components/GradientShadow';
import ServiceGradientHero from '@sharedui/components/ServiceGradientHero';
import { buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';
import { ArrowRight } from 'lucide-react';
import { cn } from '@sharedui/utils/tw';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@rootui/slices/auth';

const BESHeroSection = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <ServiceGradientHero
      className="h-dvh"
      gradient="linear-gradient(120deg, #ff9cb1, #f26982 29.94%, #c85eac 66.98%, #87459c)"
    >
      <div className="container max-w-[1200px] flex flex-col gap-6 justify-center h-full flex-1">
        <GradientShadow
          gradient="linear-gradient(120deg, #ff9cb1, #f26982 29.94%, #c85eac 66.98%, #87459c)"
          initialOpacity={0}
          hoverOpacity={0.6}
          durationInMs={500}
          spread={1}
        >
          <div className="bg-white rounded-md">
            <Link
              to={besPaths.HOME}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                }),
                'dark:hover:bg-background'
              )}
            >
              <span>Start using Festify BES for free</span>
              <ArrowRight className="ml-3" size={18} />
            </Link>
          </div>
        </GradientShadow>
        <h1 className="text-4xl md:text-5xl font-bold">Festify BES</h1>
        <h2 className="text-xl md:text-2xl">
          Email service built for ease of use and scalability
        </h2>
        <div className="flex gap-6 mt-10">
          <Link
            to={isLoggedIn ? besPaths.HOME : '/a/login'}
            className={buttonVariants({})}
          >
            {isLoggedIn ? 'Go to console' : 'Sign in to console'}
          </Link>
          <Link
            to={besPaths.DOCS}
            className={buttonVariants({
              variant: 'outline',
            })}
          >
            Read the docs
          </Link>
        </div>
      </div>
    </ServiceGradientHero>
  );
};

export default BESHeroSection;
