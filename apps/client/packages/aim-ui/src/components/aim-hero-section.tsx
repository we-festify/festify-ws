import GradientShadow from '@sharedui/components/gradient-shadow';
import ServiceGradientHero from '@sharedui/components/service-gradient';
import { buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { aimPaths } from '@sharedui/constants/paths';
import { ArrowRight } from 'lucide-react';
import { cn } from '@sharedui/utils/tw';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@rootui/store/auth';

const AIMHeroSection = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <ServiceGradientHero
      className="h-dvh"
      gradient="linear-gradient(96deg, #d1ffd1 0%, #75ffc4 20%, #4fd5a7 50%, #5ea0ff 80%, #3b8c9c 100%)"
    >
      <div className="container max-w-[1200px] flex flex-col gap-6 justify-center h-full flex-1">
        <GradientShadow
          gradient="linear-gradient(120deg, #9cffb1, #69f282 29.94%, #5ec8ac 66.98%, #459c87)"
          initialOpacity={0}
          hoverOpacity={0.6}
          durationInMs={500}
          spread={1}
        >
          <div className="bg-white rounded-md">
            <Link
              to={aimPaths.HOME}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                }),
                'dark:hover:bg-background',
              )}
            >
              <span>Start using Festify AIM for free</span>
              <ArrowRight className="ml-3" size={18} />
            </Link>
          </div>
        </GradientShadow>
        <h1 className="text-4xl md:text-5xl md:leading-tight font-bold max-w-[60%]">
          FWS Access and Identity Management
        </h1>
        <h2 className="text-xl md:text-2xl">
          Securely manage identities and access to FWS services and resources
        </h2>
        <div className="flex gap-6 mt-10">
          <Link
            to={isLoggedIn ? aimPaths.HOME : '/a/login'}
            className={buttonVariants({})}
          >
            {isLoggedIn ? 'Go to console' : 'Sign in to console'}
          </Link>
          <Link
            to={aimPaths.DOCS}
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

export default AIMHeroSection;
