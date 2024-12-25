import { api } from '@rootui/api';
import { AnalogSchema } from '@sharedtypes/analog';

const canvasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listMetrics: builder.query<{ collections: AnalogSchema[] }, undefined>({
      query: () => ({
        url: `/v1/d/analog/execute/ListMetrics`,
        method: 'POST',
        body: {},
      }),
    }),
    readChartData: builder.query<
      {
        xAxis: { data: (string | number)[] };
        yAxis: { data: (string | number)[] };
      },
      {
        xAxis: { metric: string; collection: string };
        yAxis: { metric: string; collection: string };
        type: string;
      }
    >({
      query: ({ xAxis, yAxis, type }) => ({
        url: `/v1/d/analog/execute/ReadChartData`,
        method: 'POST',
        body: { xAxis, yAxis, type },
      }),
    }),
  }),
});

export const { useListMetricsQuery, useReadChartDataQuery } = canvasApi;
