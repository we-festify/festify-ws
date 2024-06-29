import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import UpdateBESCredsDialogContent from '../../bes/components/UpdateCredsDialogContent';

interface UpdateCredsProps {
  type: string;
  trigger: JSX.Element;
  instanceId: string;
  defaultValue: any;
}

interface ComponentsMap {
  [key: string]: ({
    instanceId,
    defaultValue,
  }: {
    instanceId: string;
    defaultValue: any;
  }) => JSX.Element;
}

const componentsMap: ComponentsMap = {
  bes: UpdateBESCredsDialogContent,
};

export function UpdateCredsDialog({
  type,
  instanceId,
  defaultValue,
  trigger,
}: UpdateCredsProps) {
  const Content = componentsMap[type];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Creds</DialogTitle>
          <DialogDescription>
            Update creds of the <strong>{type.toUpperCase()}</strong> service.
          </DialogDescription>
        </DialogHeader>
        <Content instanceId={instanceId} defaultValue={defaultValue} />
      </DialogContent>
    </Dialog>
  );
}
