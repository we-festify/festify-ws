import { useFetch } from '@sharedui/hooks/useFetch';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { useLocation } from 'react-router-dom';
import paths from '@sharedui/constants/paths';
import { PageSecondaryNav } from '@sharedui/components/page-layout';
import { getSecondHeadingsFromMD } from '@/utils/docs';
import { useDomDocument } from '@sharedui/hooks/useDomDocument';

const SummarySideNav = () => {
  const document = useDomDocument();
  const location = useLocation();
  const filePath = location.pathname
    .split(paths.root.DOCS)[1]
    .replace(/^\//, '');
  const topic = filePath.split('/')[0];
  const { data: { base_uri } = {} } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
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
    if (!document) return;
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
