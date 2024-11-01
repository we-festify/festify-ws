import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sharedui/primitives/accordion';
import GradientShadow from '@sharedui/components/gradient-shadow';
import BESHeroSection from '../components/bes-hero-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';
import { besStaticImages } from '@sharedui/constants/static';
import { useEffect } from 'react';
import Footer from '@sharedui/components/footer';

const BESService = () => {
  useEffect(() => {
    // Scroll to top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BESHeroSection />
      <div className="container max-w-[1200px] px-6 pb-20 space-y-24">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:gap-20">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold">
              What is Festify BES?
            </h2>
            <p className="text-sm md:text-base">
              Festify Basic Email Service (Festify BES) is a service that
              provides a simple and scalable way to send emails. It is built
              using the best practices to ensure high deliverability rates and
              security. Festify BES is designed to be easy to use and integrate
              with your existing applications and services, with the developer
              friendly Application Programming Interface (API) and SDKs.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <GradientShadow
              initialOpacity={0}
              blur={3}
              durationInMs={500}
              gradient="linear-gradient(120deg, #ff9cb1, #f26982 29.94%, #c85eac 66.98%, #87459c)"
            >
              <img
                src={besStaticImages.HOW_IT_WORKS}
                alt="Festify BES service"
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
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-700/70 dark:to-purple-700/70">
                  <h3 className="text-xl font-semibold">Scalability</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify BES is designed to scale with your business needs.
                    Whether you are sending hundreds or millions of emails,
                    Festify BES can handle it.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-700/70 dark:to-purple-700/70">
                  <h3 className="text-xl font-semibold">
                    Highly available and reliable
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify BES is built on top of the highly available and
                    reliable infrastructure of Festify Cloud. This ensures that
                    your emails are delivered on time, every time.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-700/70 dark:to-purple-700/70">
                  <h3 className="text-xl font-semibold">
                    Easy to use and integrate
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify BES is designed to be easy to use and integrate with
                    your existing applications and services. With the developer
                    friendly API and SDKs, you can start sending emails in
                    minutes.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="4">
                <AccordionTrigger className="rounded-md px-4 hover:bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-700/70 dark:to-purple-700/70">
                  <h3 className="text-xl font-semibold">
                    No limits on sending volume
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm md:text-base p-4">
                    Festify BES does not impose any limits on the volume of
                    emails you can send. Your limits are only defined by your
                    email provider and your sender reputation.
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
              gradient="linear-gradient(120deg, #ff9cb1, #f26982 29.94%, #c85eac 66.98%, #87459c)"
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={besPaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent className="aspect-video flex flex-col gap-4 justify-end bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-500/70 dark:to-purple-500/70">
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
              <Link to={besPaths.DOCS}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent className="aspect-video flex flex-col gap-4 justify-end bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-500/70 dark:to-indigo-500/70">
                    <h3 className="text-2xl font-semibold">
                      Getting started with BES
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
              gradient="linear-gradient(120deg, #ff9cb1, #f26982 29.94%, #c85eac 66.98%, #87459c)"
              initialOpacity={0}
              hoverOpacity={0.9}
            >
              <Link to={`${besPaths.DOCS}/faqs`}>
                <Card className="w-full group border-none rounded-2xl">
                  <CardContent className="aspect-video flex flex-col gap-4 justify-end bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-500/70 dark:to-purple-500/70">
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

export default BESService;
