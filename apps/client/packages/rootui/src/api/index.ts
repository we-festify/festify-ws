import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { clearCredentials, setAccessToken } from '@rootui/store/auth';
import { RootState } from '@rootui/store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshAnd2faRedirect = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions = {},
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    if ('requires2FA' in (result.error.data as Record<string, unknown>)) {
      const { token } = result.error.data as { token: string };
      const redirect_uri = window.location.href;
      window.location.href = `/auth/2fa?token=${token}&redirect_uri=${redirect_uri}`;
      return result;
    }

    const refreshResult = await baseQuery(
      '/v1/auth/refresh',
      api,
      extraOptions,
    );
    if (refreshResult?.data) {
      const { token } = refreshResult.data as { token: string };
      api.dispatch(setAccessToken(token));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithRefreshAnd2faRedirect,
  endpoints: () => ({}),
  tagTypes: [
    'Auth', // This is a tag for the auth related endpoints
    'Meta', // This is a tag for the metadata endpoints

    // BES
    'BESInstance',
    'EmailTemplate',

    // AIM
    'ManagedUser',
    'PermissionPolicy',
    'AimAccessKey',
  ],
});
