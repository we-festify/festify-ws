import api from '.';

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'GET',
      }),
      invalidatesTags: ['Auth'],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/v1/auth/refresh',
        method: 'GET',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email: string) => ({
        url: '/v1/auth/forgot-password',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }: { token: string; password: string }) => ({
        url: '/v1/auth/reset-password',
        method: 'POST',
        body: {
          token,
          password,
        },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token: string) => ({
        url: '/v1/auth/verify-email',
        method: 'POST',
        body: {
          token,
        },
      }),
    }),
    sendVerificationEmail: builder.mutation({
      query: (email: string) => ({
        url: '/v1/auth/send-verification-email',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: '/v1/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useSendVerificationEmailMutation,
  useGetMeQuery,
} = authApi;

export default authApi;
