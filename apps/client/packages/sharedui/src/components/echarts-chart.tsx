import * as echarts from 'echarts/core';
import { useEffect, useRef } from 'react';

// Import bar charts, all suffixed with Chart
import { BarChart, LineChart, PieChart } from 'echarts/charts';

// Import the title, tooltip, rectangular coordinate system, dataset and transform components
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from 'echarts/components';

// Features like Universal Transition and Label Layout
import { LabelLayout, UniversalTransition } from 'echarts/features';

// Note that including the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts/types/dist/shared';
import { useTheme } from '@rootui/providers/theme-provider';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export interface EchartsChartProps {
  option: EChartsOption;
  dimensions: { width: number; height: number };
}

const EchartsChart = ({ dimensions, option }: EchartsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts>();
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chart.current) {
      chart.current = echarts.init(chartRef.current);
    }
    console.count('render');
    chart.current.setOption(option, false, true);
  }, [option]);

  useEffect(() => {
    if (!chart.current) return;
    chart.current.resize(dimensions);
  }, [dimensions]);

  useEffect(() => {
    if (!chart.current) return;
    let currentTheme = theme;
    if (currentTheme === 'system') {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    chart.current.setOption({ darkMode: currentTheme === 'dark' }, false, true);
  }, [theme]);

  return <div ref={chartRef} className="min-h-1 min-w-1 flex-1" />;
};

export default EchartsChart;
