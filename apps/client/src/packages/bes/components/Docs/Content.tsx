import MarkdownContent from '../../../shared/components/ui/MarkdownContent';

const BESDocsContent = ({ data }: { data: string }) => {
  return <MarkdownContent source={data} />;
};

export default BESDocsContent;
