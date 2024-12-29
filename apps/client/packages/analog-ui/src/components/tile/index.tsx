import {
  removeTile,
  selectTileById,
  updateTile,
} from '@analog-ui/store/canvas';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { GripVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ChartTile from './chart-tile';
import { createContext, useContext, useRef } from 'react';
import { ITile } from '@analog-ui/types/canvas';
import Actions from './actions';
import { IChartMetadata } from '@sharedtypes/analog/charts';
import { useCanvas } from '../canvas/provider';
import { cn } from '@sharedui/utils/tw';
import useContainerDimensions from '@sharedui/hooks/useContainerDimensions';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface ITileContext {
  tile: ITile;
  updateTile: (tile: DeepPartial<ITile>) => void;
  deleteTile: () => void;

  chartMetadata: IChartMetadata;
  dimensions: { height: number; width: number };
}

const TileContext = createContext<ITileContext | null>(null);

interface TileProps {
  tileId: string;
}

const Tile = ({ tileId }: TileProps) => {
  const { activeTileId } = useCanvas();
  const tile = useSelector(selectTileById(tileId));
  const dispatch = useDispatch();
  const tileRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerDimensions(tileRef);

  if (!tile) return null;

  const contextValue = {
    tile,
    deleteTile: () => {
      dispatch(removeTile(tile._id));
    },
    dimensions: {
      height: height ? height - 30 : 4, // 30 is header height
      width: width ?? 4,
    },

    chartMetadata: tile.metadata as IChartMetadata,
    updateTile: (tile: DeepPartial<ITile>) => {
      dispatch(
        updateTile({
          ...tile,
          _id: tileId,
        }),
      );
    },
  };

  return (
    <TileContext.Provider value={contextValue}>
      <Card
        ref={tileRef}
        className={cn(
          'react-grid-item select-none w-full h-full flex flex-col',
          activeTileId === tile._id &&
            'outline outline-offset-2 outline-2 outline-secondary',
        )}
      >
        <CardHeader variant="muted" className="py-2 px-2 overflow-hidden">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <GripVertical
                size={14}
                className="tile-drag-handle-classname cursor-grab text-muted-foreground"
              />
              {tile.type === 'chart' && (
                <span className="text-xs text-muted-foreground">
                  {tile.metadata.xAxis?.field?.key ?? 'x'}
                  {` - ${tile.metadata.yAxis?.field?.key ?? 'y'}`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Actions />
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
