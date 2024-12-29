import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sharedui/primitives/dropdown-menu';

import { Bolt, Filter, Settings2 } from 'lucide-react';
import { useTile } from '.';
import { useCanvas } from '../canvas/provider';
import { usePageLayout } from '@sharedui/components/page-layout';
import { cn } from '@sharedui/utils/tw';

const Actions = () => {
  const { openSecondaryNav } = usePageLayout();
  const { setActiveActionTab, setActiveTileId, activeActionTab } = useCanvas();
  const { tile, deleteTile } = useTile();

  return (
    <div className="flex gap-3">
      <Filter
        size={14}
        className={cn(
          'cursor-pointer text-muted-foreground',
          activeActionTab === 'filters' && 'text-secondary',
        )}
        onClick={() => {
          setActiveTileId(tile._id);
          setActiveActionTab('filters');
          openSecondaryNav();
        }}
      />
      <Settings2
        size={14}
        className={cn(
          'cursor-pointer text-muted-foreground',
          activeActionTab === 'config' && 'text-secondary',
        )}
        onClick={() => {
          setActiveTileId(tile._id);
          setActiveActionTab('config');
          openSecondaryNav();
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Bolt size={14} className="cursor-pointer text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
    </div>
  );
};

export default Actions;
