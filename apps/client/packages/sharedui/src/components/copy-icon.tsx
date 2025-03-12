import { Copy } from 'lucide-react';
import { Button } from '../primitives/button';
import { cn } from '../utils/tw';
import { toast } from 'sonner';

interface CopyIconProps {
  value: string;
  className?: string;
  iconClassName?: string;
  icon?: React.ReactNode;
}

const CopyIcon = (props: CopyIconProps) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(props.value)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(props.className, 'size-6 p-1')}
      onClick={handleCopy}
    >
      {props.icon ? (
        props.icon
      ) : (
        <Copy
          className={cn('size-5', props.iconClassName)}
          aria-hidden="true"
        />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
};

export default CopyIcon;
