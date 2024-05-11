import CopyIcon from "./CopyIcon";

const CodeBlock = ({ code }: { code: string }) => {
  return (
    <div className="relative flex justify-between items-center bg-muted/60 p-4 rounded-md hover:bg-muted cursor-pointer group">
      <code className="text-sm">{code}</code>
      <CopyIcon value={code} className="absolute top-1/2 right-0 transform -translate-y-1/2 text-muted-foreground invisible group-hover:visible" />
    </div>
  );
};

export default CodeBlock;
