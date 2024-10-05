import MarkdownContent from '../../components/MarkdownContent';

const DocsContent = ({ data }: { data: string }) => {
  return <MarkdownContent source={data} />;
};

export default DocsContent;
