import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageSecondaryNav,
  PageSideNav,
} from '@sharedui/components/PageLayout';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import DocsContent from '@sharedui/components/Docs/Content';
import DocsNav from '@sharedui/components/Docs/Nav';
import { besPaths } from '@sharedui/constants/paths';
import { BESDocsNavItemType } from '@sharedtypes/bes/docs';
import { ItemProps } from '@sharedui/components/PageLayout/SideNavItem';
import { useFetch } from '@sharedui/hooks/useFetch';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import Header from '@sharedui/components/Header';

const DocsPage = () => {
  const { service } = useParams();
  const { data: { nav } = {} } = useGetDocsNavQuery<{
    data: { nav: BESDocsNavItemType[] };
  }>(service);
  const location = useLocation();
  const [queryParams, setQueryParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState<ItemProps | undefined>(
    undefined
  );
  const section = location.pathname.split(besPaths.DOCS)[1] || '';

  const isSectionActive = (sectionPath: string | undefined) => {
    if (!sectionPath) return section === '';
    return section === sectionPath;
  };

  const activeSection = nav?.find((item) => isSectionActive(item.path));
  const filePath =
    queryParams.get('path') || activeSection?.children?.[0]?.path || '';
  const docsPath = service
    ? `/${service}?path=${filePath}`
    : `?path=${filePath}`;

  const { data: docsData } = useFetch<string>(
    `${import.meta.env.VITE_API_URL}/v1/docs${docsPath}`,
    { skip: !filePath, responseFormatter: (res) => res.text() }
  );

  const headingsWithPaths = getSecondHeadings(docsData || '').map(
    (heading) => ({
      title: heading,
      path: `#${heading.toLowerCase().replace(/\s/g, '-')}`,
    })
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
          title="Festify Basic Email Service"
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
              {activeItem?.title || activeSection?.title
                ? `${
                    activeItem?.title || activeSection?.title
                  } - Festify BES Docs`
                : 'Festify Basic Email Service Docs'}
            </title>
          </Helmet>
          <div className="px-20 pt-6 pb-12 bg-background">
            <DocsContent data={docsData || ''} />
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
