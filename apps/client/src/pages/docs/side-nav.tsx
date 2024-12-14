import { getNearestPath } from '@/utils/docs';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { PageSideNav } from '@sharedui/components/page-layout';
import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import paths from '@sharedui/constants/paths';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

const DocsSideNav = () => {
  const location = useLocation();
  const filePath = location.pathname
    .split(paths.root.DOCS)[1]
    .replace(/^\//, '');
  const [topic, section] = filePath.split('/');
  const { data: { nav, meta } = {} } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
  const activeSection = nav?.find((sec) =>
    getNearestPath(sec).startsWith(`${topic}/${section}`),
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
        onItemClick={(path) => navigate(`${paths.root.DOCS}/${path}`)}
      />
    </>
  );
};

export default DocsSideNav;
