import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sharedui/primitives/dropdown-menu';

import { Bolt } from 'lucide-react';
import { useTile } from '.';
import { useCanvas } from '../canvas/provider';
import { usePageLayout } from '@sharedui/components/page-layout';

const ConfigIconPopover = () => {
  const { openSecondaryNav } = usePageLayout();
  const { setActiveActionTab, setActiveTileId } = useCanvas();
  const { tile, deleteTile } = useTile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Bolt size={14} className="cursor-pointer text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setActiveTileId(tile._id);
            setActiveActionTab('config');
            openSecondaryNav();
          }}
        >
          Configure
        </DropdownMenuItem>
        <DropdownMenuGroup title="Danger Zone" className="text-destructive">
          <DropdownMenuItem
            onClick={deleteTile}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConfigIconPopover;
