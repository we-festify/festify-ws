import { Button } from '../../../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useDeleteInstance } from '../../dialogs/DeleteInstance/useDeleteInstance';
import { DialogTrigger } from '../../../../ui/dialog';
import { useNavigate } from 'react-router-dom';

const ActionsCell = ({ row }: { row: any }) => {
  const { Dialog, DialogContent } = useDeleteInstance(row.original.type);
  const instance = row.original;
  const navigate = useNavigate();

  const handleNavigateToInstance = () => {
    navigate(`instances/${instance._id}`);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleNavigateToInstance}
          >
            Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100">
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent />
    </Dialog>
  );
};

export default ActionsCell;
