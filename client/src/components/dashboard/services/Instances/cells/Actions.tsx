import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useDeleteInstance } from "../../dialogs/DeleteInstance/useDeleteInstance";
import { DialogTrigger } from "@/components/ui/dialog";

const ActionsCell = ({ row }: { row: any }) => {
  const { Dialog, DialogContent } = useDeleteInstance(row.original.type);
  const apiKey = row.original.apiKey;

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
            onClick={() =>
              navigator.clipboard
                .writeText(apiKey)
                .then(() => toast.success("Copied to clipboard"))
                .catch(() => toast.error("Failed to copy to clipboard"))
            }
            className="cursor-pointer"
          >
            Copy API Key
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer">
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
