import { removeTile, selectTileById } from '@analog-ui/store/canvas';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { GripVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ChartTile from './chart-tile';
import { createContext, useContext } from 'react';
import { ITile } from '@sharedtypes/analog';
import ConfigIconPopover from './config-icon-popover';

interface ITileContext {
  tile: ITile;
  deleteTile: () => void;
}

const TileContext = createContext<ITileContext | null>(null);

interface TileProps {
  tileId: string;
}

const Tile = ({ tileId }: TileProps) => {
  const tile = useSelector(selectTileById(tileId));
  const dispatch = useDispatch();

  if (!tile) return null;

  const contextValue = {
    tile,
    deleteTile: () => {
      dispatch(removeTile(tile._id));
    },
  };

  return (
    <TileContext.Provider value={contextValue}>
      <Card className="react-grid-item select-none w-full h-full">
        <CardHeader variant="muted" className="py-2 px-2">
          <div className="flex justify-between">
            <GripVertical
              size={14}
              className="tile-drag-handle-classname cursor-grab text-muted-foreground"
            />
            <div className="flex items-center gap-2">
              <ConfigIconPopover />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {tile.type === 'chart' && <ChartTile tile={tile} />}
        </CardContent>
      </Card>
    </TileContext.Provider>
  );
};

export default Tile;

// eslint-disable-next-line react-refresh/only-export-components
export const useTile = () => {
  const context = useContext(TileContext);

  if (!context) {
    throw new Error('useTile must be used within a TileProvider');
  }

  return context;
};
