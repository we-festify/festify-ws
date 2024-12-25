import { useListMetricsQuery } from '@analog-ui/api/canvas';
import { AnalogMetricType } from '@sharedtypes/analog';
import Draggable from '@sharedui/components/dnd/draggable';
import { Box, Calendar, Link, Type } from 'lucide-react';

const metricTypeIcons: Record<AnalogMetricType, typeof Box> = {
  number: Box,
  datetime: Calendar,
  string: Type,
  ref: Link,
} as const;

const Metrics = () => {
  const { data: { collections } = {} } = useListMetricsQuery(undefined);

  return (
    <div>
      {collections?.map((collection) => (
        <div key={collection.name} className="flex flex-col px-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            {collection.name}
          </h3>
          <div className="pl-4">
            {collection.metrics.map((metric) => (
              <Draggable
                key={metric.key + metric.type}
                type={`metric-${metric.type}`}
                data={{
                  type: 'metric',
                  metric,
                  collection: collection.name,
                }}
                render={() => {
                  const MetricIcon = metricTypeIcons[metric.type] ?? Box;
                  return (
                    <div className="text-sm hover:bg-muted dark:hover:bg-background p-2 flex items-center gap-3 rounded-md cursor-grab">
                      <MetricIcon size={14} />
                      <span>{metric.key}</span>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metrics;
