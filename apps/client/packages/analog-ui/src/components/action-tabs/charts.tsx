import {
  BarChart,
  LifeBuoy,
  LineChart,
  PieChart,
  Radar,
  ScatterChart,
} from 'lucide-react';
import Draggable from '@sharedui/components/dnd/draggable';

const chartTypes: {
  name: string;
  icon: typeof BarChart;
}[] = [
  { name: 'bar', icon: BarChart },
  { name: 'line', icon: LineChart },
  { name: 'pie', icon: PieChart },
  { name: 'doughnut', icon: LifeBuoy },
  { name: 'radar', icon: Radar },
  { name: 'Scatter', icon: ScatterChart },
];

export type ChartTileData = {
  type: string;
  metadata: {
    type: string;
  };
};

const Charts = () => {
  return (
    <div className="flex flex-col gap-2 px-2">
      {chartTypes.map((chartType) => (
        <Draggable
          key={chartType.name}
          type="chart"
          data={
            {
              type: 'chart',
              metadata: {
                type: chartType.name,
                option: {}, // no user customisations for a new chart
                xAxis: {
                  metric: { key: 'xAxis', type: 'number' },
                  collection: 'xAxisCollection',
                },
                yAxis: {
                  metric: { key: 'yAxis', type: 'number' },
                  collection: 'yAxisCollection',
                },
              },
            } as ChartTileData
          }
          render={() => (
            <div className="hover:bg-muted dark:hover:bg-background p-2 flex items-center gap-2 rounded-md cursor-grab">
              <chartType.icon size={16} />
              {chartType.name}
            </div>
          )}
        />
      ))}
    </div>
  );
};

export default Charts;
