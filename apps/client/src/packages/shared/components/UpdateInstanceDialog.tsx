import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import UpdateBESInstanceDialogContent from '../../bes/components/UpdateInstanceDialogContent';

interface UpdateInstanceProps {
  type: string;
  trigger: JSX.Element;
  instanceId: string;
  defaultValue: any;
}

interface ComponentsMap {
  [key: string]: (props: {
    instanceId: string;
    defaultValue: any;
  }) => JSX.Element;
}

const componentsMap: ComponentsMap = {
  bes: UpdateBESInstanceDialogContent,
};

export function UpdateInstanceDialog({
  type,
  trigger,
  instanceId,
  defaultValue,
}: UpdateInstanceProps) {
  const Content = componentsMap[type];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Instance</DialogTitle>
          <DialogDescription>
            Update instance of the <strong>{type.toUpperCase()}</strong>{' '}
            service.
          </DialogDescription>
        </DialogHeader>
        <Content instanceId={instanceId} defaultValue={defaultValue} />
      </DialogContent>
    </Dialog>
  );
}
