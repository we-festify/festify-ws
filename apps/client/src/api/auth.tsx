import api from '.';

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'GET',
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/v1/auth/refresh',
        method: 'GET',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/v1/auth/forgot-password',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: '/v1/auth/reset-password',
        method: 'POST',
        body: {
          token,
          password,
        },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: '/v1/auth/verify-email',
        method: 'POST',
        body: {
          token,
        },
      }),
    }),
    sendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: '/v1/auth/send-verification-email',
        method: 'POST',
        body: {
          email,
        },
      }),
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
} = authApi;

export default authApi;
