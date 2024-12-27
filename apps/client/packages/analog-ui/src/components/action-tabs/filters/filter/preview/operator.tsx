import { OperatorType } from '@analog-ui/types/operators';

interface OperatorPreviewProps {
  operator: OperatorType;
}

const OperatorPreview = ({ operator }: OperatorPreviewProps) => {
  return (
    <span className="bg-muted outline outline-1 outline-muted-foreground/20 py-1 px-2 rounded-sm cursor-pointer font-mono text-secondary">
      {operator || 'null'}
    </span>
  );
};

export default OperatorPreview;
