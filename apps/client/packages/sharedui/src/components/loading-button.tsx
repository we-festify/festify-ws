import { Slot } from '@radix-ui/react-slot';
import { ButtonProps, buttonVariants } from '@sharedui/primitives/button';
import { cn } from '@sharedui/utils/tw';
import { Loader } from 'lucide-react';
import React from 'react';

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    loading: boolean;
  }
>(
  (
    { className, variant, size, asChild = false, loading, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={props.disabled || loading}
      >
        {loading && <Loader className="animate-spin mr-2" size={18} />}
        {children}
      </Comp>
    );
  },
);
LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
