import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sharedui/primitives/accordion';
import GradientShadow from '@sharedui/components/gradient-shadow';
import MethodsHeroSection from '../components/methods-hero-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { methodsPaths } from '@sharedui/constants/paths';
import { useEffect } from 'react';
import Footer from '@sharedui/components/footer';
import { cn } from '@sharedui/utils/tw';
import { SERVICE_GRADIENTS } from '../constants/colors';

const MethodsService = () => {
  useEffect(() => {
    // Scroll to top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MethodsHeroSection />
      <div className="container max-w-[1200px] px-6 pb-20 space-y-24">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold">
              What is Festify Methods?
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-10">
            <p className="text-sm md:text-base">
              ✔ Run code without provisioning or managing servers, creating
              workload-aware cluster scaling logic, maintaining event
              integrations, or managing runtimes.
            </p>
            <p className="text-sm md:text-base">
              ✔ Methods is a fully managed service that allows you to run code
              without provisioning or managing servers. You can use Methods to
              create API endpoints, process events, and run scheduled tasks
              without worrying about infrastructure.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20">
          <h2 className="text-4xl md:text-5xl font-bold">Use Cases</h2>
          <div className="flex flex-col items-center justify-center">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Create API endpoints
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    With Festify Methods, you can create API endpoints to expose
                    your code as a service. You can define the HTTP methods,
                    request and response formats, and authentication methods for
                    your APIs.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Process events and messages
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify Methods allows you to process events and messages
                    from other services. You can define event triggers, message
                    formats, and processing logic to handle incoming events and
                    messages.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">Run scheduled tasks</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify Methods allows you to run code on a schedule. You
                    can define the schedule, code to run, and any input
                    parameters for your scheduled tasks. Festify Methods will
                    automatically run your tasks at the specified times.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="4">
                <AccordionTrigger
                  className={cn('rounded-md px-4', SERVICE_GRADIENTS.ACCORDIAN)}
                >
                  <h3 className="text-xl font-semibold">
                    Heavy lifting with Festify Methods
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Heavy methods like image processing, video transcoding, and
                    machine learning can be offloaded to Festify Methods. This
                    allows you to focus on building your application without
                    worrying about infrastructure.
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
              <Link to={methodsPaths.DOCS}>
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
              <Link to={methodsPaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent
                    className={cn(
                      'aspect-video flex flex-col gap-4 justify-end',
                      SERVICE_GRADIENTS.CARD_BG_2,
                    )}
                  >
                    <h3 className="text-2xl font-semibold">
                      Getting started with Festify Methods
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
              <Link to={`${methodsPaths.DOCS}/faqs`}>
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

export default MethodsService;
