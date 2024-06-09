import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface EyeButtonProps extends ButtonProps {
  iconClassName?: string;
  name?: string;
}

const useShowHide = () => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow((prev) => !prev);
  };

  const ToggleEye = (props: EyeButtonProps) => {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("hover:bg-transparent", props.className)}
        onClick={toggle}
      >
        {show ? (
          <EyeIcon
            className={cn("h-4 w-4", props.iconClassName)}
            aria-hidden="true"
          />
        ) : (
          <EyeOffIcon
            className={cn("h-4 w-4", props.iconClassName)}
            aria-hidden="true"
          />
        )}
        <span className="sr-only">
          {(show ? "Hide " : "Show ") + props.name}
        </span>
      </Button>
    );
  };

  return { isVisible: show, toggle, ToggleEye } as const;
};

export default useShowHide;
