import { useFetch } from '@sharedui/hooks/useFetch';
import MarkdownContent from '@sharedui/components/markdown-content';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { useLocation, useParams } from 'react-router-dom';
import paths from '@sharedui/constants/paths';

const DocsContent = () => {
  const location = useLocation();
  const { topic } = useParams<{ topic: string }>();
  const { data: { base_uri } = {} } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
  const filePath = location.pathname.replace(paths.root.DOCS, '') || 'index';
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
