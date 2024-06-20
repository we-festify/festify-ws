import { Button } from '@client/components/ui/button';
import { toast } from 'sonner';

const DeleteBESInstanceDialogContent = ({ close }: { close: () => void }) => {
  return (
    <div className="grid gap-6">
      <p className="text-sm text-gray-500">
        Are you sure you want to delete this instance?
      </p>
      <div className="flex justify-end gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            close();
            toast.error('Deletion cancelled');
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            // Delete the instance
            close();
            toast.success('Instance deleted successfully');
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteBESInstanceDialogContent;
