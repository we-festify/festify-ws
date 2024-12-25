import EchartsChart from '@sharedui/components/echarts-chart';
import { useReadChartDataQuery } from '@analog-ui/api/canvas';
import { useTile } from '../tile';
import { generateOption } from '@analog-ui/utils/option';
import { useEffect, useState } from 'react';

const Chart = () => {
  const { chartMetadata: metadata } = useTile();
  const { data: { xAxis, yAxis } = {} } = useReadChartDataQuery(
    {
      xAxis: {
        metric: metadata.xAxis?.metric.key ?? '',
        collection: metadata.xAxis?.collection ?? '',
      },
      yAxis: {
        metric: metadata.yAxis?.metric.key ?? '',
        collection: metadata.yAxis?.collection ?? '',
      },
      type: metadata.type,
    },
    { skip: !metadata.xAxis || !metadata.yAxis || !metadata.type },
  );
  const [chartOption, setChartOption] = useState({});

  useEffect(() => {
    setChartOption(
      generateOption(metadata, { x: xAxis?.data ?? [], y: yAxis?.data ?? [] }),
    );
  }, [metadata, xAxis, yAxis]);

  return <EchartsChart option={chartOption} />;
};

export default Chart;
