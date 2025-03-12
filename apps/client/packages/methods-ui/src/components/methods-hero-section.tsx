import GradientShadow from '@sharedui/components/gradient-shadow';
import ServiceGradientHero from '@sharedui/components/service-gradient';
import { buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { methodsPaths } from '@sharedui/constants/paths';
import { ArrowRight } from 'lucide-react';
import { cn } from '@sharedui/utils/tw';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@rootui/store/auth';
import { SERVICE_GRADIENTS } from '@methods-ui/constants/colors';

const MethodsHeroSection = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <ServiceGradientHero
      className="h-dvh"
      gradient={SERVICE_GRADIENTS.BG_SHADOW}
    >
      <div className="container max-w-[1200px] flex flex-col gap-6 justify-center h-full flex-1">
        <GradientShadow
          gradient={SERVICE_GRADIENTS.BG_SHADOW}
          initialOpacity={0}
          hoverOpacity={0.6}
          durationInMs={500}
          spread={1}
        >
          <div className="bg-white rounded-md">
            <Link
              to={methodsPaths.HOME}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                }),
                'dark:hover:bg-background',
              )}
            >
              <span>Start using Festify Methods for free</span>
              <ArrowRight className="ml-3" size={18} />
            </Link>
          </div>
        </GradientShadow>
        <h1 className="text-4xl md:text-5xl font-bold">Festify Methods</h1>
        <h2 className="text-xl md:text-2xl">
          Build and deploy serverless functions with ease
        </h2>
        <div className="flex gap-6 mt-10">
          <Link
            to={isLoggedIn ? methodsPaths.HOME : '/a/login'}
            className={buttonVariants({})}
          >
            {isLoggedIn ? 'Go to console' : 'Sign in to console'}
          </Link>
          <Link
            to={methodsPaths.DOCS}
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

export default MethodsHeroSection;
