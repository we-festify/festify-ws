import { Link } from 'react-router-dom';
import { buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent } from '@sharedui/primitives/card';
import { cn } from '@sharedui/utils/tw';
import { besPaths } from '@sharedui/constants/paths';
import { ArrowRight } from 'lucide-react';
import { besStaticImages } from '@sharedui/constants/static';

const HomePage = () => {
  return (
    <div className="bg-background pb-20">
      <div className="container max-w-[1024px] flex flex-col gap-10 p-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">Festify BES</h1>
          <p>
            Festify Basic Email Service (BES) is a cloud based email service
            that provides scalable, flexible and cost-effective email solutions
            for businesses. It is designed to make it easy for you to send
            emails to your users without having to worry about the underlying
            infrastructure.
          </p>
        </div>
        <h2 className="text-2xl font-semibold">How it works?</h2>

        <img
          src={besStaticImages.HOW_IT_WORKS}
          alt="How it works"
          className="w-full rounded-xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold">
                Start using Festify Basic Email Service
              </h2>
              <p className="text-muted-foreground">
                Get started with BES by verifying an email address so that you
                can start sending email through BES.
              </p>
              <Link
                to={besPaths.CREATE_NEW_INSTANCE}
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'w-max mt-6 group'
                )}
              >
                <span>Create an instance</span>
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:ml-4 transition-all"
                />
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold">Getting started</h2>
              <p className="text-muted-foreground">
                Learn how to integrate BES with your application to start
                sending emails to your users.
              </p>
              <Link
                to={besPaths.DOCS}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'w-max mt-6 group'
                )}
              >
                <span>Getting started guide</span>
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:ml-4 transition-all"
                />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
