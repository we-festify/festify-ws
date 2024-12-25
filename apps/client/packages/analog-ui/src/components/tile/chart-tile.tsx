import Chart from '../charts/chart';
import { useTile } from '.';
import ChartLayout from '../charts/layout';
import ErrorBoundary from '@sharedui/components/error-boundary';
import { ChartDropAllowedTypes, ChartTypes } from '@analog-ui/constants/charts';

const ChartTile = () => {
  const { chartMetadata: metadata } = useTile();

  if (!Object.values(ChartTypes).includes(metadata.type)) {
    return <p className="text-red-500">Invalid chart type: {metadata.type}</p>;
  }

  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <ChartLayout
          xAllowedTypes={ChartDropAllowedTypes[metadata.type].x}
          yAllowedTypes={ChartDropAllowedTypes[metadata.type].y}
          xLabel={ChartDropAllowedTypes[metadata.type].xLabel}
          yLabel={ChartDropAllowedTypes[metadata.type].yLabel}
        >
          <Chart />
        </ChartLayout>
      </ErrorBoundary>
    </div>
  );
};

export default ChartTile;
