import { Button } from '@sharedui/primitives/button';
import { Label } from '@sharedui/primitives/label';
import { cn } from '@sharedui/utils/tw';
import { useMemo } from 'react';

interface DirectionInputProps {
  value: [string, string];
  onValueChange: (value: [string, string]) => void;
  label: string;
  options: [[string, string, string], [string, string, string]];
}

const arrayProduct = (arr1: string[], arr2: string[]) => {
  return arr1.reduce(
    (acc, curr) => {
      return acc.concat(arr2.map((el) => [curr, el]));
    },
    [] as [string, string][],
  );
};

const DirectionInput = ({
  value,
  onValueChange,
  label,
  options,
}: DirectionInputProps) => {
  const directions = useMemo(() => {
    return arrayProduct(options[1], options[0]);
  }, [options]);

  return (
    <div className="flex items-center justify-between w-full dark:text-muted-foreground">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <div className="grid grid-cols-3 grid-rows-3">
        {directions.map(([vertical, horizontal], index) => (
          <Button
            key={`${horizontal}-${vertical}`}
            className={cn(
              'size-6 px-0 py-0 rounded-none',
              value[0] === horizontal && value[1] === vertical && 'bg-muted',
              index === 0 && 'rounded-tl',
              index === 2 && 'rounded-tr',
              index === 6 && 'rounded-bl',
              index === 8 && 'rounded-br',
            )}
            onClick={() => {
              onValueChange([horizontal, vertical]);
            }}
            variant="outline"
          >
            {value[0] === horizontal && value[1] === vertical && '✓'}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DirectionInput;
