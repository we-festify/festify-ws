import {
  removeTile,
  selectTileById,
  updateTile,
} from '@analog-ui/store/canvas';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { GripVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ChartTile from './chart-tile';
import { createContext, useContext } from 'react';
import { ITile } from '@analog-ui/types/canvas';
import ConfigIconPopover from './config-icon-popover';
import { IChartMetadata } from '@analog-ui/types/charts';
import { useCanvas } from '../canvas/provider';
import { cn } from '@sharedui/utils/tw';

interface ITileContext {
  tile: ITile;
  deleteTile: () => void;

  chartMetadata: IChartMetadata;
  updateChartMetadata: (metadata: IChartMetadata) => void;
}

const TileContext = createContext<ITileContext | null>(null);

interface TileProps {
  tileId: string;
}

const Tile = ({ tileId }: TileProps) => {
  const { activeTileId } = useCanvas();
  const tile = useSelector(selectTileById(tileId));
  const dispatch = useDispatch();

  if (!tile) return null;

  const contextValue = {
    tile,
    deleteTile: () => {
      dispatch(removeTile(tile._id));
    },

    chartMetadata: tile.metadata as IChartMetadata,
    updateChartMetadata: (metadata: IChartMetadata) => {
      dispatch(
        updateTile({
          ...tile,
          metadata: {
            ...tile.metadata,
            ...metadata,
          },
        }),
      );
    },
  };

  return (
    <TileContext.Provider value={contextValue}>
      <Card
        className={cn(
          'react-grid-item select-none w-full h-full flex flex-col',
          activeTileId === tile._id &&
            'outline outline-offset-2 outline-2 outline-secondary',
        )}
      >
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
        <CardContent className="p-0 flex h-full">
          {tile.type === 'chart' && <ChartTile />}
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
