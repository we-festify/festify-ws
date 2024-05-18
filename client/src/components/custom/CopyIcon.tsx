import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CopyIconProps {
  value: string;
  className?: string;
  iconClassName?: string;
}

const CopyIcon = (props: CopyIconProps) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(props.value)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={props.className}
      onClick={handleCopy}
    >
      <Copy className={cn("h-4 w-4", props.iconClassName)} aria-hidden="true" />
      <span className="sr-only">Copy</span>
    </Button>
  );
};

export default CopyIcon;
