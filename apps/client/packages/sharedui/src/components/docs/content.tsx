import MarkdownContent from '../markdown-content';

const DocsContent = ({ data }: { data: string }) => {
  return data ? (
    <MarkdownContent source={data} />
  ) : (
    <p className="text-muted-foreground">
      Something went wrong while showing docs.
    </p>
  );
};

export default DocsContent;
