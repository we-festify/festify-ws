import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@client/components/ui/dialog';
import NewBESInstanceDialogContent from './bes';

interface NewInstanceProps {
  type: string;
  trigger: JSX.Element;
}

interface ComponentsMap {
  [key: string]: () => JSX.Element;
}

const componentsMap: ComponentsMap = {
  bes: NewBESInstanceDialogContent,
};

export function NewInstance({ type, trigger }: NewInstanceProps) {
  const Content = componentsMap[type];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Instance</DialogTitle>
          <DialogDescription>
            Create a new instance of the <strong>{type.toUpperCase()}</strong>{' '}
            service.
          </DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
