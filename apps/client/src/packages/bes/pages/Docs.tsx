import { useLocation, useSearchParams } from 'react-router-dom';
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageSecondaryNav,
  PageSideNav,
} from '../../shared/components/PageLayout';
import { useGetBESDocsNavQuery } from '../api/docs';
import BESDocsContent from '../components/Docs/Content';
import BESDocsNav from '../components/Docs/Nav';
import { paths } from '../constants/paths';
import { BESDocsNavItemType } from '@shared/types/bes/docs';
import { ItemProps } from '../../shared/components/PageLayout/SideNavItem';
import { useFetch } from '../../shared/hooks/useFetch';
import { Helmet } from 'react-helmet';
import { useState } from 'react';

const BESDocsPage = () => {
  const { data: { nav } = {} } = useGetBESDocsNavQuery<{
    data: { nav: BESDocsNavItemType[] };
  }>({});
  const location = useLocation();
  const [queryParams, setQueryParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState<ItemProps | undefined>(
    undefined
  );
  const section = location.pathname.split(paths.DOCS)[1] || '';

  const isSectionActive = (sectionPath: string | undefined) => {
    if (!sectionPath) return section === '';
    return section === sectionPath;
  };

  const activeSection = nav?.find((item) => isSectionActive(item.path));
  const docsPath =
    queryParams.get('path') || activeSection?.children?.[0]?.path || '';
  const { data: docsData } = useFetch<string>(
    `${import.meta.env.VITE_API_URL}/d/bes/v1/docs?path=${docsPath}`,
    { skip: !docsPath, responseFormatter: (res) => res.text() }
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
    <PageLayout>
      <PageHeader>
        <BESDocsNav />
      </PageHeader>
      <PageSideNav
        title="Festify Basic Email Service"
        subTitle={activeSection?.title}
        items={activeSection?.children as ItemProps[]}
        selectedItem={(path) => docsPath === path}
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
          <BESDocsContent data={docsData || ''} />
        </div>
      </PageContent>
      <PageSecondaryNav
        title="On this page"
        items={headingsWithPaths}
        onItemClick={scrollToElement}
      />
    </PageLayout>
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

export default BESDocsPage;
