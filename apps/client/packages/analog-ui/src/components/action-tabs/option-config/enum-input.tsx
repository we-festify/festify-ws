import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';
import { Label } from '@sharedui/primitives/label';
import { Button } from '@sharedui/primitives/button';
import { cn } from '@sharedui/utils/tw';

interface EnumInputProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  options: readonly unknown[];
}

const EnumInput = ({
  value,
  onValueChange,
  label,
  options,
}: EnumInputProps) => {
  if (options.length === 0) {
    return null;
  }

  if (options.length <= 3) {
    return (
      <div className="space-y-1 w-full dark:text-muted-foreground">
        <Label className="text-muted-foreground text-sm">{label}</Label>
        <div className="flex">
          {options.map((option, index) => (
            <Button
              key={`${option}`}
              onClick={() => {
                if (value !== `${option}`) {
                  onValueChange(`${option}`);
                }
              }}
              variant="outline"
              size="sm"
              className={cn(
                'flex-1 rounded-none',
                index === 0 && 'rounded-l-md',
                index === options.length - 1 && 'rounded-r-md',
                value === `${option}` && 'bg-muted',
              )}
            >
              {`${option}`}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 w-full dark:text-muted-foreground">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={`${option}`} value={`${option}`}>
              {`${option}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnumInput;
