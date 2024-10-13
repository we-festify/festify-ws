import { Button } from '../../../primitives/button';
import { Card, CardContent } from '../../../primitives/card';
import { DataTable } from '../../../primitives/data-table';
import { PageLayout, PageContent, PageSideNav } from '../../page-layout';
import { columns } from './columns';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../primitives/breadcrumb';
import PageSection from '../../page-section';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  // ...
];

const DataTableDemo = () => {
  return (
    <PageLayout>
      {/* <PageHeader>Header</PageHeader> */}
      <PageSideNav
        title="Basic Email service"
        subTitle="User Guide"
        items={[
          {
            title: 'What is BES?',
            path: 'userguide/welcome',
          },
          {
            title: 'Getting Started',
            path: 'userguide/getting-started/index',
            children: [
              {
                title: 'Installation',
                path: 'userguide/getting-started/installation',
              },
              {
                title: 'Configuration',
                path: 'userguide/getting-started/configuration',
                children: [
                  {
                    title: 'Basic Configuration',
                    path: 'userguide/getting-started/configuration/basic',
                  },
                  {
                    title: 'Advanced Configuration Of BES',
                    path: 'userguide/getting-started/configuration/advanced',
                  },
                ],
              },
            ],
          },
        ]}
      />
      <PageContent>
        <div className="px-10 py-4 flex flex-col gap-6 text-sm">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/bes">BES</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>SMTP settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageSection
            title="Simple Mail Transfer Protocol (SMTP) settings"
            description="You can use an SMTP-enabled programming language, email server, or
        application to connect to the Amazon SES SMTP interface. You'll need the
        following information and a set of SMTP credentials to configure this
        email sending method in US East (N. Virginia)."
          >
            <Card>
              <CardContent>
                <DataTable
                  title="Payments"
                  description="An IAM user is an identity with long-term credentials that is used to interact with AWS in an account."
                  columns={columns}
                  data={payments}
                  header={DataTableDemoHeader}
                />
              </CardContent>
            </Card>
          </PageSection>
        </div>
      </PageContent>
    </PageLayout>
  );
};

const DataTableDemoHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <Button size="sm" variant="secondary">
        Create Payment
      </Button>
    </div>
  );
};

export default DataTableDemo;
