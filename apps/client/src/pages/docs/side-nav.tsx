import { getNearestPath } from '@/utils/docs';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { PageSideNav } from '@sharedui/components/page-layout';
import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import paths from '@sharedui/constants/paths';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

const DocsSideNav = () => {
  const { topic } = useParams<{ topic: string }>();
  const { data: { nav, meta } = {} } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
  const filePath = location.pathname.split(`/docs/${topic}/`)[1];
  const currentSection = filePath.split('/')[0];
  const activeSection = nav?.find((section) =>
    getNearestPath(section).startsWith(currentSection),
  );
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{`${activeSection?.title} - ${meta?.title}`}</title>
      </Helmet>
      <PageSideNav
        title={meta?.title}
        subTitle={activeSection?.title}
        items={activeSection?.children as ItemProps[]}
        selectedItem={(path) => filePath === path}
        onItemClick={(path) => navigate(`${paths.root.DOCS}/${topic}/${path}`)}
      />
    </>
  );
};

export default DocsSideNav;
