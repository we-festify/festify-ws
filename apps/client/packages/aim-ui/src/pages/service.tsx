import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sharedui/primitives/accordion';
import GradientShadow from '@sharedui/components/gradient-shadow';
import AIMHeroSection from '../components/aim-hero-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aimPaths } from '@sharedui/constants/paths';
import { besStaticImages } from '@sharedui/constants/static';
import { useEffect } from 'react';
import Footer from '@sharedui/components/footer';

const AIMService = () => {
  useEffect(() => {
    // Scroll to top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AIMHeroSection />
      <div className="container max-w-[1200px] px-6 pb-20 space-y-24">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:gap-20">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold">
              What is Festify AIM?
            </h2>
            <p className="text-sm md:text-base">
              Festify AIM is a service that allows you to securely manage
              identities and access to Festify Web Services (FWS) services and
              resources. With Festify AIM, you can easily authenticate users,
              authorize access to resources, and manage user identities.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <GradientShadow
              initialOpacity={0}
              blur={3}
              durationInMs={500}
              gradient="linear-gradient(120deg, #9cffb1, #69f282 29.94%, #5ec8ac 66.98%, #459c87)"
            >
              <img
                src={besStaticImages.HOW_IT_WORKS}
                alt="Festify AIM service"
                className="w-full rounded-2xl"
              />
            </GradientShadow>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20">
          <h2 className="text-4xl md:text-5xl font-bold">Benefits</h2>
          <div className="flex flex-col items-center justify-center">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">Fine grained access</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM allows you to define fine grained access control
                    policies for your resources. You can control who can access
                    your resources and what actions they can perform.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">
                    Least privilege principle
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM follows the least privilege principle, which
                    means that users are granted only the permissions they need
                    to perform their tasks. This reduces the risk of
                    unauthorized access to your resources.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">
                    Centralized identity management
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM provides a centralized identity management
                    system that allows you to manage user identities across your
                    applications and services. You can authenticate users,
                    authorize access to resources, and manage user profiles from
                    a single location.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="4">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">Secure and scalable</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM is built with security and scalability in mind.
                    It uses industry standard security protocols to protect your
                    data and resources. Festify AIM is designed to scale with
                    your business, so you can focus on building great products
                    without worrying about identity and access management.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20">
          <h2 className="text-4xl md:text-5xl font-bold">Use Cases</h2>
          <div className="flex flex-col items-center justify-center">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">
                    Granular access control
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM can be used to implement granular access control
                    policies for your resources and actions. Every user and
                    service that interacts with your resources can be
                    authenticated and authorized based on their identity and
                    permissions.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">
                    Multi-tenant applications
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM can be used to build multi-tenant applications
                    that serve multiple customers or organizations. You can
                    manage user identities, access control policies, and
                    resources for each tenant separately, while sharing the same
                    infrastructure and codebase.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-700/70 dark:to-blue-700/70">
                  <h3 className="text-xl font-semibold">Access keys</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify AIM can be used to generate access keys for your
                    applications and services. Access keys are used to
                    authenticate and authorize requests to your resources. You
                    can create, rotate, and revoke access keys to secure your
                    applications and services.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <h2 className="text-4xl md:text-5xl font-bold">Get started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <GradientShadow
              className="w-full"
              gradient="linear-gradient(120deg, #9cffb1, #69f282 29.94%, #5ec8ac 66.98%, #459c87)"
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={aimPaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent className="aspect-video flex flex-col gap-4 justify-end bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-500/70 dark:to-blue-500/70">
                    <h3 className="text-2xl font-semibold">
                      Quick start guide
                    </h3>
                    <p className="flex items-center gap-4">
                      <span className="hidden group-hover:inline-block leading-none">
                        Learn more
                      </span>
                      <ArrowRight size={20} />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </GradientShadow>
            <GradientShadow
              className="w-full"
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={aimPaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent className="aspect-video flex flex-col gap-4 justify-end bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-500/70 dark:to-indigo-500/70">
                    <h3 className="text-2xl font-semibold">
                      Getting started with AIM
                    </h3>
                    <p className="flex items-center gap-4">
                      <span className="hidden group-hover:inline-block leading-none">
                        Start building
                      </span>
                      <ArrowRight size={20} />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </GradientShadow>
            <GradientShadow
              className="w-full"
              gradient="linear-gradient(120deg, #9cffb1, #69f282 29.94%, #5ec8ac 66.98%, #459c87)"
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={`${aimPaths.DOCS}/faqs`}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent className="aspect-video flex flex-col gap-4 justify-end bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-500/70 dark:to-blue-500/70">
                    <h3 className="text-2xl font-semibold">
                      Frequently asked questions
                    </h3>
                    <p className="flex items-center gap-4">
                      <span className="hidden group-hover:inline-block leading-none">
                        Learn more
                      </span>
                      <ArrowRight size={20} />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </GradientShadow>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AIMService;
