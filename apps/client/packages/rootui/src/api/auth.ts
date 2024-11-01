import { api } from '.';
import {
  RegisterDTO,
  RegisterResponse,
  LoginDTO,
  LoginResponse,
  ResetPasswordDTO,
  ResetPasswordResponse,
  RequestResetPasswordDTO,
  RequestResetPasswordResponse,
  VerifyEmailDTO,
  VerifyEmailResponse,
  ResendEmailVerificationDTO,
  ResendEmailVerificationResponse,
  Enable2FADTO,
  Enable2FAResponse,
  Disable2FADTO,
  Disable2FAResponse,
  Send2faOtpDTO,
  Send2faOtpResponse,
  Verify2faOtpDTO,
  Verify2faOtpResponse,
  Enable2faTotpDTO,
  Enable2faTotpResponse,
  Disable2faTotpDTO,
  Disable2faTotpResponse,
  Regenerate2faTotpDTO,
  Regenerate2faTotpResponse,
  Verify2faTotpDTO,
  Verify2faTotpResponse,
  LogoutResponse,
  GetMeResponse,
  Get2FALoginMethodsResponse,
  UpdateMeResponse,
  UpdateMeDTO,
  RequestRecoveryEmailUpdateResponse,
  RequestRecoveryEmailUpdateDTO,
  RegenerateRecoveryCodesResponse,
  RegenerateRecoveryCodesDTO,
  LoginWithRecoveryCodeResponse,
  LoginWithRecoveryCodeDTO,
} from '../types/api/auth';

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<GetMeResponse, void>({
      query: () => '/v1/auth/me',
      providesTags: ['Auth'],
    }),
    updateMe: builder.mutation<UpdateMeResponse, UpdateMeDTO>({
      query: ({ user }) => ({
        url: '/v1/users/me',
        method: 'PATCH',
        body: user,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<RegisterResponse, RegisterDTO>({
      query: (data) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<LoginResponse, LoginDTO>({
      query: (data) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordDTO>({
      query: (data) => ({
        url: '/v1/auth/reset-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    requestResetPassword: builder.mutation<
      RequestResetPasswordResponse,
      RequestResetPasswordDTO
    >({
      query: (data) => ({
        url: '/v1/auth/request-password-reset',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailDTO>({
      query: (data) => ({
        url: '/v1/auth/verify-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    resendEmailVerification: builder.mutation<
      ResendEmailVerificationResponse,
      ResendEmailVerificationDTO
    >({
      query: (data) => ({
        url: '/v1/auth/resend-verification-email',
        method: 'POST',
        body: data,
      }),
    }),
    enable2FA: builder.mutation<Enable2FAResponse, Enable2FADTO>({
      query: (data) => ({
        url: '/v1/auth/2fa',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    disable2FA: builder.mutation<Disable2FAResponse, Disable2FADTO>({
      query: (data) => ({
        url: '/v1/auth/2fa',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    get2FALoginMethods: builder.query<Get2FALoginMethodsResponse, string>({
      query: (token) => ({
        url: `/v1/auth/2fa/methods?token=${token}`,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    send2faOtp: builder.mutation<Send2faOtpResponse, Send2faOtpDTO>({
      query: (data) => ({
        url: '/v1/auth/2fa/otp',
        method: 'POST',
        body: data,
      }),
    }),
    send2faOtpToRecoveryEmail: builder.mutation<
      Send2faOtpResponse,
      Send2faOtpDTO
    >({
      query: (data) => ({
        url: '/v1/auth/2fa/otp/recovery',
        method: 'POST',
        body: data,
      }),
    }),
    verify2faOtp: builder.mutation<Verify2faOtpResponse, Verify2faOtpDTO>({
      query: (data) => ({
        url: '/v1/auth/2fa/otp/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    enable2faTotp: builder.mutation<Enable2faTotpResponse, Enable2faTotpDTO>({
      query: (data) => ({
        url: '/v1/auth/2fa/totp/enable',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    disable2faTotp: builder.mutation<Disable2faTotpResponse, Disable2faTotpDTO>(
      {
        query: (data) => ({
          url: '/v1/auth/2fa/totp/disable',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Auth'],
      },
    ),
    regenerate2faTotp: builder.mutation<
      Regenerate2faTotpResponse,
      Regenerate2faTotpDTO
    >({
      query: (data) => ({
        url: '/v1/auth/2fa/totp/regenerate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    verify2faTotp: builder.mutation<Verify2faTotpResponse, Verify2faTotpDTO>({
      query: (data) => ({
        url: '/v1/auth/2fa/totp/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    requestUpdateRecoveryEmail: builder.mutation<
      RequestRecoveryEmailUpdateResponse,
      RequestRecoveryEmailUpdateDTO
    >({
      query: (data) => ({
        url: '/v1/auth/recovery/email',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    regenerateRecoveryCodes: builder.mutation<
      RegenerateRecoveryCodesResponse,
      RegenerateRecoveryCodesDTO
    >({
      query: (data) => ({
        url: '/v1/auth/recovery/codes',
        method: 'POST',
        body: data,
      }),
    }),
    loginWithRecoveryCode: builder.mutation<
      LoginWithRecoveryCodeResponse,
      LoginWithRecoveryCodeDTO
    >({
      query: (data) => ({
        url: '/v1/auth/recovery/codes/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,

  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useRequestResetPasswordMutation,
  useVerifyEmailMutation,
  useResendEmailVerificationMutation,

  useEnable2FAMutation,
  useDisable2FAMutation,
  useGet2FALoginMethodsQuery,
  useSend2faOtpMutation,
  useSend2faOtpToRecoveryEmailMutation,
  useVerify2faOtpMutation,
  useEnable2faTotpMutation,
  useDisable2faTotpMutation,
  useRegenerate2faTotpMutation,
  useVerify2faTotpMutation,

  useRequestUpdateRecoveryEmailMutation,
  useRegenerateRecoveryCodesMutation,
  useLoginWithRecoveryCodeMutation,
} = authApi;
