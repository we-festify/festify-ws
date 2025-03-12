import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sharedui/primitives/accordion';
import GradientShadow from '@sharedui/components/gradient-shadow';
import BridgeHeroSection from '../components/bridge-hero-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bridgePaths } from '@sharedui/constants/paths';
import { useEffect } from 'react';
import Footer from '@sharedui/components/footer';
import { cn } from '@sharedui/utils/tw';
import { SERVICE_GRADIENTS } from '../constants/colors';

const BridgeService = () => {
  useEffect(() => {
    // Scroll to top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BridgeHeroSection />
      <div className="container max-w-[1200px] px-6 pb-20 space-y-24">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold">
              What is Festify Bridge?
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-10">
            <p className="text-sm md:text-base">
              Festify Bridge is a fully managed service that makes it easy for
              developers to create, publish, maintain, monitor, and secure APIs
              at any scale. APIs act as the "front door" for applications to
              access data, business logic, or functionality from your backend
              services. Using Festify Bridge, you can create RESTful APIs.
            </p>
            <p className="text-sm md:text-base">
              Festify Bridge supports serverless workloads, as well as web
              applications. Festify Bridge handles all the tasks involved in
              accepting and processing up to hundreds of thousands of concurrent
              API calls, including traffic management, CORS support,
              authorization and access control, throttling, monitoring, and API
              version management.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20">
          <h2 className="text-4xl md:text-5xl font-bold">Benefits</h2>
          <div className="flex flex-col items-center justify-center">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Scalable and flexible
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify Bridge is designed to scale automatically to meet
                    the demands of your applications. You don't have to worry
                    about provisioning servers or managing infrastructure.
                    Festify Bridge takes care of everything for you.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Highly available and reliable
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify Bridge is built on top of the highly available and
                    reliable infrastructure of Festify Cloud. This ensures that
                    your APIs are always available and responsive to your
                    applications.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Easy to use and integrate
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify Bridge provides a simple and intuitive interface for
                    creating and managing your APIs. You can easily integrate
                    your APIs with other Festify services and third-party
                    services.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="4">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Secure and compliant
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify Bridge provides built-in security features to help
                    protect your APIs from unauthorized access and attacks. You
                    can also use Festify Bridge to enforce compliance with
                    industry standards and regulations.
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
              gradient={SERVICE_GRADIENTS.CARD_SHADOW_1}
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={bridgePaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent
                    className={cn(
                      'aspect-video flex flex-col gap-4 justify-end',
                      SERVICE_GRADIENTS.CARD_BG_1,
                    )}
                  >
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
              gradient={SERVICE_GRADIENTS.CARD_SHADOW_2}
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={bridgePaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent
                    className={cn(
                      'aspect-video flex flex-col gap-4 justify-end',
                      SERVICE_GRADIENTS.CARD_BG_2,
                    )}
                  >
                    <h3 className="text-2xl font-semibold">
                      Getting started with Bridge
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
              gradient={SERVICE_GRADIENTS.CARD_SHADOW_1}
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={`${bridgePaths.DOCS}/faqs`}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent
                    className={cn(
                      'aspect-video flex flex-col gap-4 justify-end',
                      SERVICE_GRADIENTS.CARD_BG_1,
                    )}
                  >
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

export default BridgeService;
