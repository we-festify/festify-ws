import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { clearCredentials, setCredentials } from '../store/slices/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('festify-ws-access-token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefresh = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions = {}
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResult?.data) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

const api = createApi({
  baseQuery: baseQueryWithRefresh,
  endpoints: () => ({
    // ...endpoints
  }),
  tagTypes: [
    // ...tagTypes
    'Service',
    'Instance',

    // d-services
    // BES
    'EmailTemplate',
  ],
});

export default api;
