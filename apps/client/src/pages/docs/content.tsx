import { useFetch } from '@sharedui/hooks/useFetch';
import MarkdownContent from '@sharedui/components/markdown-content';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { useLocation } from 'react-router-dom';
import paths from '@sharedui/constants/paths';

const DocsContent = () => {
  const location = useLocation();
  const filePath = location.pathname
    .split(paths.root.DOCS)[1]
    .replace(/^\//, '');
  const topic = filePath.split('/')[0];
  const { data: { base_uri } = {} } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
  const { data: docsData, isFetching } = useFetch<string>(
    `${base_uri}/${filePath}.md`,
    {
      skip: !filePath,
      responseFormatter: (res) => res.text(),
    },
  );

  if (isFetching) {
    return <p>Loading...</p>;
  }

  return docsData ? (
    <MarkdownContent source={docsData} />
  ) : (
    <p className="text-muted-foreground">
      Something went wrong while showing docs.
    </p>
  );
};

export default DocsContent;
