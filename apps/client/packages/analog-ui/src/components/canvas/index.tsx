import ReactGridLayout, { Layout } from 'react-grid-layout';
import './react-grid-layout.css';
import { useRef } from 'react';
import useContainerDimensions from '@sharedui/hooks/useContainerDimensions';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTile,
  selectLayout,
  selectTiles,
  setLayout,
} from '@analog-ui/store/canvas';
import Tile from '../tile';
import ErrorBoundary from '@sharedui/components/error-boundary';
import { useDragDropManager } from 'react-dnd';
import { ChartTileData } from '../action-tabs/charts';
import { useCanvas } from './provider';

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useContainerDimensions(containerRef);
  const gridItems = useSelector(selectTiles);
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();
  const dndManager = useDragDropManager();
  const { activeActionTab } = useCanvas();

  const handleDrop = (layout: Layout[], item: Layout, _e: Event) => {
    try {
      if (!item) return;

      const { data } = dndManager.getMonitor().getItem();
      if (!data) return;

      const { type, metadata } = data as ChartTileData;
      const position = { x: item.x, y: item.y, w: item.w, h: item.h };

      if (type === 'chart') {
        dispatch(
          setLayout([...layout, { i: `${gridItems.length + 1}`, ...position }]),
        );
        // this will actually be a API call to save the tile
        dispatch(
          addTile({
            _id: `${gridItems.length + 1}`,
            type,
            position,
            metadata,
          }),
        );
      }
    } catch (error) {
      console.error('Error while dropping', error);
    }
  };

  const handleLayoutChange = (layout: Layout[]) => {
    dispatch(setLayout(layout));
    // also an API call to save the layout
  };

  const handleDropDragOver = () => {
    try {
      const type = dndManager.getMonitor().getItemType();
      if (type !== 'chart') return false;
      return undefined;
    } catch (_) {
      return false;
    }
  };

  return (
    <div ref={containerRef}>
      <ErrorBoundary>
        <ReactGridLayout
          layout={layout}
          isDraggable={true}
          isResizable={true}
          isDroppable={activeActionTab === 'charts'}
          width={width}
          rowHeight={100}
          compactType="vertical"
          margin={[16, 16]}
          droppingItem={{ i: '0', w: 4, h: 1 }} // This is the item that will be dropped
          onDrop={handleDrop}
          onDropDragOver={handleDropDragOver}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".tile-drag-handle-classname"
          className="min-h-[500px]"
        >
          {gridItems.map((item) => {
            return (
              <div key={item._id}>
                <Tile tileId={item._id} />
              </div>
            );
          })}
        </ReactGridLayout>
      </ErrorBoundary>
    </div>
  );
};

export default Canvas;
