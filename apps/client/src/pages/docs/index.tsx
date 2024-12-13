import {
  PageContent,
  PageHeader,
  PageLayout,
} from '@sharedui/components/page-layout';
import DocsContent from '@/pages/docs/content';
import DocsNav from '@/pages/docs/nav';
import Header from '@sharedui/components/header';
import DocsSideNav from './side-nav';
import SummarySideNav from './summary-side-nav';

const DocsPage = () => {
  return (
    <>
      <Header />
      <PageLayout>
        <PageHeader>
          <DocsNav />
        </PageHeader>
        <DocsSideNav />
        <PageContent className="bg-background">
          <div className="px-20 pt-6 pb-12 bg-background">
            <DocsContent />
          </div>
        </PageContent>
        <SummarySideNav />
      </PageLayout>
    </>
  );
};

export default DocsPage;
