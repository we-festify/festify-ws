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
        metric: metadata.xAxis?.metric?.key ?? '',
        collection: metadata.xAxis?.collection ?? '',
      },
      yAxis: {
        metric: metadata.yAxis?.metric?.key ?? '',
        collection: metadata.yAxis?.collection ?? '',
      },
      type: metadata.type,
    },
    { skip: !metadata.xAxis || !metadata.yAxis || !metadata.type },
  );
  const [chartOption, setChartOption] = useState({});

  useEffect(() => {
    if (!metadata || !metadata.xAxis || !metadata.yAxis) return;
    if (!metadata.xAxis?.metric || !metadata.yAxis?.metric) return;
    if (!xAxis?.data || !yAxis?.data) return;
    console.log(metadata, xAxis, yAxis);
    setChartOption(generateOption(metadata, { x: xAxis.data, y: yAxis.data }));
  }, [metadata, xAxis, yAxis]);

  return <EchartsChart option={chartOption} dimensions={dimensions} />;
};

export default Chart;
