import { Card, CardContent } from '@sharedui/primitives/card';
import Header from '@sharedui/components/header';
import GradientShadow from '@sharedui/components/gradient-shadow';
import { Link } from 'react-router-dom';
import { ArrowRight, TriangleAlert } from 'lucide-react';
import Footer from '@sharedui/components/footer';
import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import { Skeleton } from '@sharedui/primitives/skeleton';
import { getErrorMessage } from '@sharedui/utils/error';

const HomePage = () => {
  const {
    data: { services } = {},
    isFetching,
    isError,
    error,
    refetch,
  } = useGetServicesMetadataQuery();

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
          {isFetching &&
            Array.from({ length: 3 }).map(() => (
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            ))}
          {services?.map((service) => (
            <GradientShadow
              key={service.name}
              gradient="linear-gradient(120deg, #5100c4 0%, #b935fb 42%, #35cbfb 70%, #83f4ff 100%)"
              className="w-full"
              initialOpacity={0}
              spread={1}
              blur={2}
            >
              <Link to={service.alias} className="group">
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
          {isError && (
            <div className="text-destructive flex items-center gap-2 my-1">
              <TriangleAlert className="size-5" />
              <span className="text-sm">
                {getErrorMessage(error)} -{' '}
                <span
                  className="hover:underline cursor-pointer"
                  onClick={refetch}
                >
                  Reload
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
