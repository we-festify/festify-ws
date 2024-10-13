import { celebrate, Joi, Segments } from 'celebrate';

export class AuthValidators {
  public validateRegisterData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      user: Joi.object().keys({
        alias: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required(),
        password: Joi.string()
          .required()
          .min(8)
          .pattern(
            new RegExp(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
            ),
          )
          .messages({
            'string.pattern.base':
              'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character(#@$!%*?&)',
          }),
        confirmPassword: Joi.string()
          .required()
          .valid(Joi.ref('password'))
          .messages({ 'any.only': 'Passwords do not match' }),
        imageUrl: Joi.string().optional().uri(),
      }),
    }),
  });

  public validateVerifyEmailData = celebrate({
    [Segments.QUERY]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  });

  public validateResendEmailVerificationData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      user: Joi.object().keys({
        email: Joi.string().email().required(),
      }),
    }),
  });

  public validateLoginWithEmailPasswordData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      user: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    }),
  });

  public validateResetPasswordData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      user: Joi.object().keys({
        email: Joi.string().email().required(),
        currentPasswordOrToken: Joi.string().required(),
        newPassword: Joi.string()
          .required()
          .min(8)
          .pattern(
            new RegExp(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            ),
          )
          .messages({
            'string.pattern.base':
              'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character(#@$!%*?&)',
          }),
        confirmPassword: Joi.string()
          .required()
          .valid(Joi.ref('newPassword'))
          .messages({ 'any.only': 'Passwords do not match' }),
      }),
      logoutAllDevices: Joi.boolean().optional(),
    }),
  });

  public validateRequestPasswordResetData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      logoutAllDevices: Joi.boolean().optional(),
    }),
  });

  public validate2FAEnableData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  public validate2FADisableData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  public validate2FALoginMethodsData = celebrate({
    [Segments.QUERY]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  });

  public validate2FAOTPLoginData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required(),
      otp: Joi.string().required(),
    }),
  });

  public validate2FAOTPSendData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  });

  public validate2FARecoveryOTPSendData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  });

  public validate2FAAuthenticatorSetupData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  public validate2FARegenerateData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  public validate2FATOTPLoginData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required(),
      otp: Joi.string().required(),
    }),
  });

  public validateUpdateRecoveryEmailData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      newRecoveryEmail: Joi.string().email().required(),
    }),
  });

  public validateVerifyRecoveryEmailData = celebrate({
    [Segments.QUERY]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  });

  public validateRegenerateRecoveryCodesData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  public validateLoginWithRecoveryCodeData = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required(),
      code: Joi.string().required(),
    }),
  });
}
