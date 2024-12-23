import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sharedui/primitives/dropdown-menu';

import { Bolt } from 'lucide-react';
import { useTile } from '.';

const ConfigIconPopover = () => {
  const { deleteTile } = useTile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Bolt size={14} className="cursor-pointer text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={deleteTile}
          className="focus:bg-destructive focus:text-destructive-foreground"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConfigIconPopover;
