import { api } from '@rootui/api';
import { AnalogSchema, IFilterGroup } from '@sharedtypes/analog';

const canvasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listFields: builder.query<{ collections: AnalogSchema[] }, undefined>({
      query: () => ({
        url: `/v1/d/analog/execute/ListFields`,
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
        xAxis: { field: string; collection: string };
        yAxis: { field: string; collection: string };
        filterGroups?: IFilterGroup[];
        type: string;
      }
    >({
      query: (data) => ({
        url: `/v1/d/analog/execute/ReadChartData`,
        method: 'POST',
        body: { data },
      }),
    }),
  }),
});

export const { useListFieldsQuery, useReadChartDataQuery } = canvasApi;
