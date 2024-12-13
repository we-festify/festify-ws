import { Slot } from '@radix-ui/react-slot';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@sharedui/primitives/alert-dialog';
import { ButtonProps, buttonVariants } from '@sharedui/primitives/button';
import { cn } from '@sharedui/utils/tw';
import React from 'react';

type DeleteButtonProps = {
  description: React.ReactNode;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & ButtonProps;
/**
 * A button that triggers an alert dialog to confirm deletion.
 * @note The button will be disabled while the dialog is open.
 * @param description - The description to be shown in the alert dialog.
 * @param onCancel - The callback to be called when the user cancels the action.
 */
const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
  (
    {
      description,
      variant,
      size,
      asChild = false,
      onCancel,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {description ||
                'This action cannot be undone. This will permanently delete the item.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClick}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);
DeleteButton.displayName = 'DeleteButton';

export default DeleteButton;
