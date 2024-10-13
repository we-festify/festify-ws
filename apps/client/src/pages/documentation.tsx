import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageSecondaryNav,
  PageSideNav,
} from '@sharedui/components/page-layout';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import DocsContent from '@sharedui/components/docs/content';
import DocsNav from '@sharedui/components/docs/nav';
import paths from '@sharedui/constants/paths';
import { IDocsNav } from '@sharedtypes/docs';
import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import { useFetch } from '@sharedui/hooks/useFetch';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import Header from '@sharedui/components/header';
import { services } from '@sharedui/constants/services';

const DocsPage = () => {
  const { service: serviceShort } = useParams();
  const { data: { nav, base_uri } = {} } = useGetDocsNavQuery<{
    data: { nav: IDocsNav; base_uri: string };
  }>(serviceShort);
  const service = services.find(
    (s) => s.shortName.toLowerCase() === serviceShort?.toLowerCase(),
  );
  const rootPath = service
    ? paths.root.DOCS + '/' + serviceShort
    : paths.root.DOCS;
  const location = useLocation();
  const currentSectionPath =
    location.pathname.split(rootPath)[1]?.split('/')[1] ?? '';
  const [queryParams, setQueryParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState<ItemProps | undefined>(
    undefined,
  );

  const isSectionActive = (sectionPath: string | undefined) => {
    if (!sectionPath) return currentSectionPath === '';
    return currentSectionPath === sectionPath;
  };

  const activeSection = nav?.find((item) => isSectionActive(item.path));
  const filePath =
    queryParams.get('path') ?? activeSection?.children?.[0]?.path ?? '';

  const { data: docsData } = useFetch<string>(`${base_uri}/${filePath}.md`, {
    skip: !filePath,
    responseFormatter: (res) => res.text(),
  });

  const headingsWithPaths = getSecondHeadings(docsData ?? '').map(
    (heading) => ({
      title: heading,
      path: `#${heading.toLowerCase().replace(/\s/g, '-')}`,
    }),
  );

  const scrollToElement = (path: string) => {
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <PageLayout>
        <PageHeader>
          <DocsNav />
        </PageHeader>
        <PageSideNav
          title={service?.name}
          subTitle={activeSection?.title}
          items={activeSection?.children as ItemProps[]}
          selectedItem={(path) => filePath === path}
          onItemClick={(path, item) => {
            setActiveItem(item);
            setQueryParams({ path });
          }}
        />
        <PageContent className="bg-background">
          <Helmet>
            <title>
              {(activeItem?.title ?? activeSection?.title)
                ? `${
                    activeItem?.title ?? activeSection?.title
                  } - Festify ${service?.shortName.toUpperCase()} Docs`
                : `Festify ${service?.name} Docs`}
            </title>
          </Helmet>
          <div className="px-20 pt-6 pb-12 bg-background">
            <DocsContent data={docsData ?? ''} />
          </div>
        </PageContent>
        <PageSecondaryNav
          title="On this page"
          items={headingsWithPaths}
          onItemClick={scrollToElement}
        />
      </PageLayout>
    </>
  );
};

const getSecondHeadings = (source: string) => {
  const regex = /^## (.*)/gm;
  const matches = [];
  let match;

  while ((match = regex.exec(source))) {
    matches.push(match[1]);
  }

  return matches;
};

export default DocsPage;
