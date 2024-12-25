import { Label } from '@sharedui/primitives/label';
import { Textarea } from '@sharedui/primitives/textarea';

interface TextInputProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
}

const TextInput = ({ value, onValueChange, label }: TextInputProps) => {
  return (
    <div className="space-y-1 w-full dark:text-muted-foreground">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="max-h-[100px]"
      />
    </div>
  );
};

export default TextInput;
