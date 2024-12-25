import { Label } from '@sharedui/primitives/label';
import { Switch } from '@sharedui/primitives/switch';

interface BooleanInputProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

const BooleanInput = ({ value, onValueChange, label }: BooleanInputProps) => {
  return (
    <div className="flex items-center justify-between w-full dark:text-muted-foreground">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <Switch checked={value} onCheckedChange={onValueChange} />
    </div>
  );
};

export default BooleanInput;
