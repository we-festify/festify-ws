import EchartsChart from '@sharedui/components/echarts-chart';
import { useReadChartDataQuery } from '@analog-ui/api/canvas';
import { useTile } from '../tile';
import { generateOption } from '@analog-ui/utils/option';
import { useEffect, useState } from 'react';

const Chart = () => {
  const { chartMetadata: metadata, dimensions } = useTile();
  const { data: { xAxis, yAxis } = {} } = useReadChartDataQuery(
    {
      xAxis: {
        field: metadata.xAxis?.field?.key ?? '',
        collection: metadata.xAxis?.collection ?? '',
      },
      yAxis: {
        field: metadata.yAxis?.field?.key ?? '',
        collection: metadata.yAxis?.collection ?? '',
      },
      type: metadata.type,
    },
    { skip: !metadata.xAxis || !metadata.yAxis || !metadata.type },
  );
  const [chartOption, setChartOption] = useState({});

  useEffect(() => {
    if (!metadata || !metadata.xAxis || !metadata.yAxis) return;
    if (!metadata.xAxis?.field || !metadata.yAxis?.field) return;
    if (!xAxis?.data || !yAxis?.data) return;
    setChartOption(generateOption(metadata, { x: xAxis.data, y: yAxis.data }));
  }, [metadata, xAxis, yAxis]);

  return <EchartsChart option={chartOption} dimensions={dimensions} />;
};

export default Chart;
