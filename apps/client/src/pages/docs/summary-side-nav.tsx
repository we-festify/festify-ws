import { useFetch } from '@sharedui/hooks/useFetch';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { useLocation, useParams } from 'react-router-dom';
import paths from '@sharedui/constants/paths';
import { PageSecondaryNav } from '@sharedui/components/page-layout';
import { getSecondHeadingsFromMD } from '@/utils/docs';

const SummarySideNav = () => {
  const location = useLocation();
  const { topic } = useParams<{ topic: string }>();
  const { data: { base_uri } = {} } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
  const filePath = location.pathname.replace(paths.root.DOCS, '') || 'index';
  const { data: docsData } = useFetch<string>(`${base_uri}/${filePath}.md`, {
    skip: !filePath,
    responseFormatter: (res) => res.text(),
  });

  const headingsWithPaths = getSecondHeadingsFromMD(docsData ?? '').map(
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
    <PageSecondaryNav
      title="On this page"
      items={headingsWithPaths}
      onItemClick={scrollToElement}
    />
  );
};

export default SummarySideNav;
