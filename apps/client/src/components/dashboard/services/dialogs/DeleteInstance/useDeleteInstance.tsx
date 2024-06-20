import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@client/components/ui/dialog';
import DeleteBESInstanceDialogContent from './bes';
import { useState } from 'react';

interface ComponentsMap {
  [key: string]: ({ close }: { close: () => void }) => JSX.Element;
}

const componentsMap: ComponentsMap = {
  bes: DeleteBESInstanceDialogContent,
};

export function useDeleteInstance(type: string) {
  const Content = componentsMap[type];
  const [isOpen, setIsOpen] = useState(false);

  const dialogContent = () => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Instance</DialogTitle>
        <DialogDescription>
          Delete an instance of the <strong>{type.toUpperCase()}</strong>{' '}
          service.
        </DialogDescription>
      </DialogHeader>
      <Content close={() => setIsOpen(false)} />
    </DialogContent>
  );

  const dialog = ({ children }: { children: JSX.Element[] }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Dialog>
  );

  return {
    Dialog: dialog,
    DialogContent: dialogContent,
    close: () => setIsOpen(false),
  };
}
