import { toast } from "sonner";

const CodeBlock = ({ code }: { code: string }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div
      className="flex justify-between items-center bg-muted/60 p-4 rounded-md hover:bg-muted cursor-pointer group"
      onClick={handleCopy}
    >
      <code className="text-sm">{code}</code>
      <span className="text-xs text-muted-foreground hidden group-hover:inline">
        Copy
      </span>
    </div>
  );
};

export default CodeBlock;
