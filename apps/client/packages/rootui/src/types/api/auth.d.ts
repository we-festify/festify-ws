import { IUser } from '@/types/models/user';

export interface GetMeResponse {
  user: {
    alias: string;
    accountId: string;
    type: string;
    rootAccountAlias: string;
  };
}

export interface UpdateMeDTO {
  user: Partial<IUser>;
}

export type UpdateMeResponse = {
  user: IUser;
};

export interface RegisterDTO {
  user: {
    alias: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export type RegisterResponse = {
  token: string;
  user: IUser;
};

export interface LoginDTO {
  user: {
    email: string;
    password: string;
  };
}

export type LoginResponse =
  | {
      user: IUser;
      token: string;
    }
  | {
      requires2FA: boolean;
      token: string;
    };

export type LogoutResponse = {
  message: string;
};

export interface ResetPasswordDTO {
  user: {
    email: string;
    currentPasswordOrToken: string;
    newPassword: string;
    confirmPassword: string;
  };
}

export type ResetPasswordResponse = {
  message: string;
};

export interface RequestResetPasswordDTO {
  email: string;
  logoutAllDevices?: boolean;
}

export type RequestResetPasswordResponse = {
  message: string;
};

export interface VerifyEmailDTO {
  token: string;
}

export type VerifyEmailResponse = {
  message: string;
};

export interface ResendEmailVerificationDTO {
  user: {
    email: string;
  };
}

export type ResendEmailVerificationResponse = {
  message: string;
};

// 2FA
export interface Enable2FADTO {
  email: string;
  password: string;
}

export type Enable2FAResponse = {
  recoveryCodes: string[];
};

export interface Disable2FADTO {
  email: string;
  password: string;
}

export type Disable2FAResponse = {
  message: string;
};

export type Get2FALoginMethodsResponse = {
  methods: string[];
};

export interface Send2faOtpDTO {
  token: string;
}

export type Send2faOtpResponse = {
  message: string;
  expires: Date;
};

export interface Verify2faOtpDTO {
  token: string;
  otp: string;
}

export type Verify2faOtpResponse = {
  user: IUser;
  token: string;
};

export interface Enable2faTotpDTO {
  email: string;
  password: string;
}

export type Enable2faTotpResponse = {
  otpAuthUrl: string;
};

export interface Disable2faTotpDTO {
  email: string;
  password: string;
}

export type Disable2faTotpResponse = {
  message: string;
};

export interface Regenerate2faTotpDTO {
  email: string;
  password: string;
}

export type Regenerate2faTotpResponse = {
  otpAuthUrl: string;
};

export interface Verify2faTotpDTO {
  token: string;
  otp: string;
}

export type Verify2faTotpResponse = {
  user: IUser;
  token: string;
};

export interface RequestRecoveryEmailUpdateDTO {
  email: string;
  password: string;
  newRecoveryEmail: string;
}

export type RequestRecoveryEmailUpdateResponse = {
  message: string;
};

export interface RegenerateRecoveryCodesDTO {
  email: string;
  password: string;
}

export type RegenerateRecoveryCodesResponse = {
  recoveryCodes: string[];
};

export interface LoginWithRecoveryCodeDTO {
  token: string;
  code: string;
}

export type LoginWithRecoveryCodeResponse = {
  user: IUser;
  token: string;
};
