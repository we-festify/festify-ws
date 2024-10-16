import * as e from 'express';
import Account from '../../models/account';
import { IDeviceInfo } from '../../types/middlewares/user-agent';
import { AuthService } from '../../services/auth';
import { publisher } from '../../events';
import { env } from '../../config';
import { AppError, CommonErrors } from '../../utils/errors';
import { decryptCookieValue, encryptCookieValue } from '../../utils/cookie';
import { AccountChooser } from '../../types/services/auth';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService(Account, publisher);
  }

  private generateAuthCookieOptions(): e.CookieOptions {
    return {
      httpOnly: true,
      secure: env.nodeEnv !== 'development',
      sameSite: 'strict',
      path: '/api/v1/auth',
    };
  }

  private async getAccountChooserCookieValue(
    accountChooserCookie: string,
  ): Promise<AccountChooser> {
    try {
      const decryptedAccountChooserCookie =
        await decryptCookieValue(accountChooserCookie);
      const accountChooserCookieData = JSON.parse(
        decryptedAccountChooserCookie,
      ) as AccountChooser;
      return accountChooserCookieData;
    } catch (_err) {
      return {
        current: '',
        accounts: [],
      };
    }
  }

  private async getAllRefreshTokensMapping(
    req: e.Request,
  ): Promise<Record<string, string>> {
    const { [env.auth.accountChooserCookieName]: accountChooserCookie } =
      req.cookies;
    const accountChooser =
      await this.getAccountChooserCookieValue(accountChooserCookie);

    const refreshTokens = accountChooser.accounts.map((account: string) => {
      const { [account]: refreshToken } = req.cookies;
      if (refreshToken) {
        return [account, refreshToken];
      }
      return null;
    });

    const refreshTokensMapping = Object.fromEntries(
      refreshTokens.filter((refreshToken) => refreshToken !== null),
    );
    return refreshTokensMapping;
  }

  private async extractCurrentRefreshToken(
    req: e.Request,
  ): Promise<[string, string]> {
    const { [env.auth.accountChooserCookieName]: accountChooserCookie } =
      req.cookies;
    const accountChooser =
      await this.getAccountChooserCookieValue(accountChooserCookie);
    const refreshTokenCookieName = accountChooser.current;
    const { [refreshTokenCookieName]: refreshToken } = req.cookies;
    return [refreshTokenCookieName, refreshToken];
  }

  public async getMe(req: e.Request, res: e.Response, next: e.NextFunction) {
    try {
      const { accountId, type } = req.user;

      const account = await this.authService.getRootAccount(accountId);
      if (type === 'fws-root') {
        return res.status(200).json({
          user: {
            alias: account.alias,
            accountId: account._id,
            type: 'fws-root',
            rootAccountAlias: account.alias,
          },
        });
      } else {
        const { alias } = req.user;
        const user = await this.authService.getManagedUserDetails(
          alias,
          accountId,
        );

        return res.status(200).json({
          user: {
            alias: user.alias,
            accountId: user.rootAccount,
            type: 'fws-user',
            rootAccountAlias: account.alias,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  public async register(req: e.Request, res: e.Response, next: e.NextFunction) {
    try {
      const { user } = req.body;

      const { account } = await this.authService.register(user);

      return res.status(201).json({ account });
    } catch (err) {
      next(err);
    }
  }

  public async verifyEmail(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { token } = req.query;

      await this.authService.verifyEmail(token as string);

      return res.status(200).redirect(`${env.client.url}`);
    } catch (err) {
      next(err);
    }
  }

  public async resendEmailVerification(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { user } = req.body;

      await this.authService.resendEmailVerification(user.email);

      return res
        .status(200)
        .json({ message: 'Email verification link sent successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async loginWithEmailAndPassword(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { user: userData } = req.body;
      const { useragent } = req;
      const deviceInfo: IDeviceInfo = {
        browser: useragent?.browser ?? 'unknown',
        os: useragent?.os ?? 'unknown',
        platform: useragent?.platform ?? 'unknown',
        source: useragent?.source ?? 'unknown',
      };

      const response = await this.authService.loginRootWithEmailAndPassword(
        userData,
        { deviceInfo },
      );

      if ('requires2FA' in response) {
        const { requires2FA, token } = response;
        return res
          .status(CommonErrors.Unauthorized.statusCode)
          .json({ requires2FA, token });
      }

      const { account, accessToken, refreshToken } = response;
      const {
        [env.auth.accountChooserCookieName]: existingAccountChooserCookie,
      } = req.cookies;

      const existingAccountChooser = await this.getAccountChooserCookieValue(
        existingAccountChooserCookie,
      );
      const refreshTokensMapping = await this.getAllRefreshTokensMapping(req);

      const { refreshTokenCookieName, accountChooser } =
        await this.authService.generateAccountChooser(
          refreshToken,
          existingAccountChooser,
          refreshTokensMapping,
        );
      const accountChooserCookieValue = await encryptCookieValue(
        JSON.stringify(accountChooser),
      );

      return res
        .status(200)
        .cookie(
          env.auth.accountChooserCookieName,
          accountChooserCookieValue,
          this.generateAuthCookieOptions(),
        )
        .cookie(
          refreshTokenCookieName,
          refreshToken,
          this.generateAuthCookieOptions(),
        )
        .json({ account, token: accessToken });
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: e.Request, res: e.Response, next: e.NextFunction) {
    try {
      const [refreshTokenCookieName, refreshToken] =
        await this.extractCurrentRefreshToken(req);
      if (!refreshToken) {
        throw new AppError(
          CommonErrors.Unauthorized.name,
          CommonErrors.Unauthorized.statusCode,
          'Refresh token is missing',
        );
      }

      await this.authService.logout(refreshToken);
      const {
        [env.auth.accountChooserCookieName]: existingAccountChooserCookie,
      } = req.cookies;

      const existingAccountChooser = await this.getAccountChooserCookieValue(
        existingAccountChooserCookie,
      );
      const refreshTokensMapping = await this.getAllRefreshTokensMapping(req);
      const accountChooser =
        await this.authService.removeAccountFromAccountChooser(
          refreshToken,
          existingAccountChooser,
          refreshTokensMapping,
        );
      const accountChooserCookieValue = await encryptCookieValue(
        JSON.stringify(accountChooser),
      );

      return res
        .status(200)
        .cookie(
          env.auth.accountChooserCookieName,
          accountChooserCookieValue,
          this.generateAuthCookieOptions(),
        )
        .clearCookie(refreshTokenCookieName, this.generateAuthCookieOptions())
        .json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async refreshTokens(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { [env.auth.accountChooserCookieName]: accountChooserCookie } =
        req.cookies;
      const accountChooser =
        await this.getAccountChooserCookieValue(accountChooserCookie);
      const refreshTokenCookieName = accountChooser.current;

      const { [refreshTokenCookieName]: refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new AppError(
          CommonErrors.Unauthorized.name,
          CommonErrors.Unauthorized.statusCode,
          'Refresh token is missing',
        );
      }
      const { deviceInfo, ipInfo } = req;
      const {
        account,
        accessToken,
        refreshToken: newRefreshToken,
      } = await this.authService.refreshTokens(refreshToken, {
        deviceInfo,
        ipInfo,
      });

      return res
        .status(200)
        .cookie(
          refreshTokenCookieName,
          newRefreshToken,
          this.generateAuthCookieOptions(),
        )
        .json({ account, token: accessToken });
    } catch (err) {
      next(err);
    }
  }

  public async requestPasswordReset(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { email, logoutAllDevices } = req.body;

      await this.authService.requestPasswordReset({
        email: email,
        logoutAllDevices,
      });

      return res.status(200).json({ message: 'Password reset request sent' });
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { user, logoutAllDevices } = req.body;
      const { deviceInfo, ipInfo } = req;
      const defaultIpInfo = {
        ip: 'unknown',
        location: {
          country: 'unknown',
          state: 'unknown',
          city: 'unknown',
          zip: 'unknown',
          timezone: 'unknown',
        },
      };

      await this.authService.resetPassword(
        {
          user,
          logoutAllDevices,
        },
        {
          deviceInfo,
          ipInfo: ipInfo ?? defaultIpInfo,
        },
      );

      return res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async enable2FA(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const data = req.body;
      const { deviceInfo, ipInfo } = req;

      const { recoveryCodes } = await this.authService.enable2FAForRoot(data, {
        deviceInfo,
        ipInfo,
      });

      return res.status(200).json({ recoveryCodes });
    } catch (err) {
      next(err);
    }
  }

  public async disable2FA(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const data = req.body;
      const { deviceInfo, ipInfo } = req;

      await this.authService.disable2FAForRoot(data, {
        deviceInfo,
        ipInfo,
      });

      return res.status(200).json({ message: '2FA disabled successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async get2FALoginMethods(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { token } = req.query;

      const loginMethods = await this.authService.getRoot2faLoginMethods(
        (token ?? '') as string,
      );

      return res.status(200).json({ methods: loginMethods });
    } catch (err) {
      next(err);
    }
  }

  public async loginRootWith2FAOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { otp, token } = req.body;
      const { useragent } = req;
      const deviceInfo: IDeviceInfo = {
        browser: useragent?.browser ?? 'unknown',
        os: useragent?.os ?? 'unknown',
        platform: useragent?.platform ?? 'unknown',
        source: useragent?.source ?? 'unknown',
      };

      const { account, accessToken, refreshToken } =
        await this.authService.loginRootWith2FAOTP(
          { otp, token },
          { deviceInfo },
        );

      // Account Chooser
      const { [env.auth.accountChooserCookieName]: accountChooserCookie } =
        req.cookies;
      const accountChooser =
        await this.getAccountChooserCookieValue(accountChooserCookie);

      const refreshTokensMapping = await this.getAllRefreshTokensMapping(req);

      const { refreshTokenCookieName, accountChooser: newAccountChooser } =
        await this.authService.generateAccountChooser(
          refreshToken,
          accountChooser,
          refreshTokensMapping,
        );
      const accountChooserCookieValue = await encryptCookieValue(
        JSON.stringify(newAccountChooser),
      );

      return res
        .status(200)
        .cookie(
          env.auth.accountChooserCookieName,
          accountChooserCookieValue,
          this.generateAuthCookieOptions(),
        )
        .cookie(
          refreshTokenCookieName,
          refreshToken,
          this.generateAuthCookieOptions(),
        )
        .json({ account, token: accessToken });
    } catch (err) {
      next(err);
    }
  }

  public async send2FAOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { token } = req.body;

      const { expires } = await this.authService.send2FALoginOTPtoRoot(token);

      return res
        .status(200)
        .json({ message: 'OTP sent successfully', expires });
    } catch (err) {
      next(err);
    }
  }

  public async send2FARecoveryOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { token } = req.body;

      const { expires } =
        await this.authService.send2FALoginOTPToRootRecoveryEmail(token);

      return res
        .status(200)
        .json({ message: 'Recovery OTP sent successfully', expires });
    } catch (err) {
      next(err);
    }
  }

  public async setup2FATOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const user = req.body;

      const { otpAuthUrl } = await this.authService.setup2FATOTPForRoot(user);

      return res.status(200).json({ otpAuthUrl });
    } catch (err) {
      next(err);
    }
  }

  public async regenerate2FATOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const user = req.body;

      const { otpAuthUrl } =
        await this.authService.regenerate2FATOTPForRoot(user);

      return res.status(200).json({ otpAuthUrl });
    } catch (err) {
      next(err);
    }
  }

  public async disable2FATOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const user = req.body;
      const { deviceInfo, ipInfo } = req;

      await this.authService.disable2FATOTPForRoot(user, {
        deviceInfo,
        ipInfo,
      });

      return res
        .status(200)
        .json({ message: '2FA Authenticator disabled successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async loginWith2FATOTP(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { otp, token } = req.body;
      const { deviceInfo } = req;

      const { account, accessToken, refreshToken } =
        await this.authService.loginRootWith2FATOTP(
          { otp, token },
          { deviceInfo },
        );

      // Account Chooser
      const { [env.auth.accountChooserCookieName]: accountChooserCookie } =
        req.cookies;
      const accountChooser =
        await this.getAccountChooserCookieValue(accountChooserCookie);

      const refreshTokensMapping = await this.getAllRefreshTokensMapping(req);

      const { refreshTokenCookieName, accountChooser: newAccountChooser } =
        await this.authService.generateAccountChooser(
          refreshToken,
          accountChooser,
          refreshTokensMapping,
        );
      const accountChooserCookieValue = await encryptCookieValue(
        JSON.stringify(newAccountChooser),
      );

      return res
        .status(200)
        .cookie(
          env.auth.accountChooserCookieName,
          accountChooserCookieValue,
          this.generateAuthCookieOptions(),
        )
        .cookie(
          refreshTokenCookieName,
          refreshToken,
          this.generateAuthCookieOptions(),
        )
        .json({ account, token: accessToken });
    } catch (err) {
      next(err);
    }
  }

  public async requestUpdateRecoveryEmail(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const data = req.body;

      await this.authService.requestUpdateRootRecoveryEmail(data);

      return res
        .status(200)
        .json({ message: 'Recovery email update request sent' });
    } catch (err) {
      next(err);
    }
  }

  public async verifyRecoveryEmail(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { token } = req.query;

      await this.authService.verifyAndUpdateRootRecoveryEmail(token as string);

      return res.status(200).redirect(`${env.client.url}`);
    } catch (err) {
      next(err);
    }
  }

  public async regenerateRecoveryCodes(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const user = req.body;

      const { recoveryCodes } =
        await this.authService.regenerateRootRecoveryCodes(user);

      return res.status(200).json({ recoveryCodes });
    } catch (err) {
      next(err);
    }
  }

  public async loginWithRecoveryCode(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { code: recoveryCode, token } = req.body;
      const { deviceInfo } = req;

      const { account, accessToken, refreshToken } =
        await this.authService.loginRootWithRecoveryCode(
          { code: recoveryCode, token },
          { deviceInfo },
        );

      // Account Chooser
      const { [env.auth.accountChooserCookieName]: accountChooserCookie } =
        req.cookies;
      const accountChooser =
        await this.getAccountChooserCookieValue(accountChooserCookie);

      const refreshTokensMapping = await this.getAllRefreshTokensMapping(req);

      const { refreshTokenCookieName, accountChooser: newAccountChooser } =
        await this.authService.generateAccountChooser(
          refreshToken,
          accountChooser,
          refreshTokensMapping,
        );
      const accountChooserCookieValue = await encryptCookieValue(
        JSON.stringify(newAccountChooser),
      );

      return res
        .status(200)
        .cookie(
          env.auth.accountChooserCookieName,
          accountChooserCookieValue,
          this.generateAuthCookieOptions(),
        )
        .cookie(
          refreshTokenCookieName,
          refreshToken,
          this.generateAuthCookieOptions(),
        )
        .json({ account, token: accessToken });
    } catch (err) {
      next(err);
    }
  }
}
