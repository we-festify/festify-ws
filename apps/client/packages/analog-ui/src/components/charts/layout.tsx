import { AnalogField } from '@sharedtypes/analog';
import DropArea from '@sharedui/components/dnd/drop-area';
import { cn } from '@sharedui/utils/tw';
import { PropsWithChildren } from 'react';
import { useTile } from '../tile';

interface ChartLayoutProps {
  xAllowedTypes: string[];
  yAllowedTypes: string[];
  xLabel?: string;
  yLabel?: string;
}

const ChartLayout = ({
  children,

  xAllowedTypes,
  yAllowedTypes,
  xLabel = 'x axis',
  yLabel = 'y axis',
}: PropsWithChildren<ChartLayoutProps>) => {
  const { chartMetadata: metadata, updateTile } = useTile();
  const handleXAxisDrop = (field: AnalogField, collection: string) => {
    updateTile({
      metadata: {
        xAxis: {
          field,
          collection,
        },
      },
    });
  };

  const handleYAxisDrop = (field: AnalogField, collection: string) => {
    updateTile({
      metadata: {
        yAxis: {
          field,
          collection,
        },
      },
    });
  };

  return (
    <div className="size-full flex flex-col relative">
      {children}

      {/* Empty data components */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center opacity-50',
          metadata.xAxis?.field && metadata.yAxis?.field ? 'hidden' : 'flex',
        )}
      >
        <div className="text-center">
          <p className="text-base font-semibold">No chart to show</p>
          <p className="text-sm">set x and y axis</p>
        </div>
      </div>

      {/* Drop areas */}
      <DropArea
        type={xAllowedTypes}
        className="z-10 absolute left-0 right-0 bottom-0 w-full h-8 flex flex-col-reverse"
        render={({ draggingItemType }) => (
          <div className={cn('w-full h-8 group pl-9 pr-3')}>
            <div
              className={cn(
                'size-full opacity-0 rounded-md bg-secondary/50 text-secondary-foreground text-sm flex items-center justify-center',
                xAllowedTypes.includes(draggingItemType ?? '') && 'opacity-100',
              )}
            >
              {xLabel}
            </div>
          </div>
        )}
        onDragDrop={(_item, monitor) => {
          const { data } = monitor.getItem<{
            data: { field: AnalogField; type: string; collection: string };
          }>();
          if (data?.type === 'field') {
            handleXAxisDrop(data.field, data.collection);
          }
        }}
      />
      <DropArea
        type={yAllowedTypes}
        className="z-10 absolute left-0 right-0 top-0 w-8 h-full flex"
        render={({ draggingItemType }) => (
          <div className={cn('w-8 h-full group pb-8')}>
            <div
              className={cn(
                'size-full opacity-0 rounded-md bg-secondary/50 text-secondary-foreground text-sm [writing-mode:vertical-lr] rotate-180 flex items-center justify-center',
                yAllowedTypes.includes(draggingItemType ?? '') && 'opacity-100',
              )}
            >
              {yLabel}
            </div>
          </div>
        )}
        onDragDrop={(_item, monitor) => {
          const { data } = monitor.getItem<{
            data: { field: AnalogField; type: string; collection: string };
          }>();
          if (data?.type === 'field') {
            handleYAxisDrop(data.field, data.collection);
          }
        }}
      />
    </div>
  );
};

export default ChartLayout;
