import { IFilter } from '@analog-ui/types/charts';
import { Button } from '@sharedui/primitives/button';
import { useFilter } from './provider';

interface ApplyButtonProps {
  onApply: (filter: IFilter) => void;
}

const ApplyButton = ({ onApply }: ApplyButtonProps) => {
  const { filter, canApply } = useFilter();

  return (
    <Button
      disabled={!canApply}
      variant="secondary"
      size="sm"
      onClick={() => onApply(filter as IFilter)}
    >
      Apply
    </Button>
  );
};

export default ApplyButton;
