import { Card, CardContent } from '@sharedui/primitives/card';
import Header from '@sharedui/components/Header';
import { services } from '@sharedui/constants/services';
import GradientShadow from '@sharedui/components/GradientShadow';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '@sharedui/components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="overflow-hidden bg-black relative">
        <div className="absolute inset-0 bg-gradient-hero-1" />
        <div className="relative z-10 h-[calc(100dvh-76px)] flex flex-col justify-end bg-transparent">
          <div className="space-y-10 text-white p-6 md:p-16 lg:p-20">
            <h2 className="text-2xl font-semibold">
              Start building on FWS today
            </h2>
            <p className="mt-4 max-w-[50%] text-lg">
              FWS is a platform that provides you with the services you need to
              build a modern web application. Get started with our services
              today.
            </p>
            <a
              href="#explore-our-products"
              className="flex gap-2 items-center w-max group"
            >
              <span>Get started for free</span>
              <ArrowRight
                size={20}
                className="group-hover:ml-3 transition-all"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="container max-w-[1200px] mx-auto px-6 py-20 space-y-10 md:space-y-16">
        <h1 className="text-5xl font-bold" id="explore-our-products">
          Explore our products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {services.map((service) => (
            <GradientShadow
              gradient="linear-gradient(120deg, #5100c4 0%, #b935fb 42%, #35cbfb 70%, #83f4ff 100%)"
              className="w-full"
              initialOpacity={0}
              spread={1}
              blur={2}
            >
              <Link to={service.homePath || ''} className="group">
                <Card key={service.name} className="rounded-2xl">
                  <CardContent className="aspect-[4/3] bg-muted flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{service.name}</h2>
                      <p className="mt-4">{service.description}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="hidden group-hover:inline">
                        View product
                      </span>
                      <ArrowRight size={20} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </GradientShadow>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
