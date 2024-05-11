import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeFromNow } from "@/utils/time";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Instance {
  _id: string;
  status: string;
  apiKey: string;
  createdAt: string;
}

const commonColumns: ColumnDef<Instance>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return row.getValue("status") === "active" ? (
        <span className="text-blue-600">Active</span>
      ) : (
        <span className="text-orange-400">{row.getValue("status")}</span>
      );
    },
  },
  {
    accessorKey: "apiKey",
    header: "API Key",
    cell: () => {
      return <span className="text-muted-foreground">*******************</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return formatTimeFromNow(row.getValue("createdAt"));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const apiKey = row.original.apiKey;

      return (
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
            <DropdownMenuItem
              onClick={() => {
                console.log("Delete");
              }}
              className="cursor-pointer"
            >
              Delete Instance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const besColumns: ColumnDef<Instance>[] = [...commonColumns];

const columns = (type: string): ColumnDef<Instance>[] => {
  switch (type) {
    case "bes":
      return besColumns;
    default:
      return commonColumns;
  }
};

export default columns;
