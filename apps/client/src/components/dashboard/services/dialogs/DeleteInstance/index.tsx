import { useDeleteInstance } from './useDeleteInstance';
import { DialogTrigger } from '../../../../ui/dialog';

interface DeleteInstanceProps {
  type: string;
  trigger: JSX.Element;
}

export function DeleteInstance({ type, trigger }: DeleteInstanceProps) {
  const { Dialog, DialogContent } = useDeleteInstance(type);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent />
    </Dialog>
  );
}
