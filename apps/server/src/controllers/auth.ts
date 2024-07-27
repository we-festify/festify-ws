import { NextFunction, Request, Response } from 'express';
import { applicationDB } from '../config/db';

// models
import UserCreator from '@shared/models/User';
import AccountCreator from '@shared/models/Account';
const User = UserCreator(applicationDB);
const Account = AccountCreator(applicationDB);

// services
import Mailer from '../services/mailer';

// utils
import {
  hashPassword,
  comparePassword,
  generateRandomPassword,
} from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
} from '../utils/token';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors';

// packages
import validator from 'validator';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

class AuthController {
  /**
   * Register a new ROOT user to the FWS Console
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      let { alias, email } = req.body;

      // converting to strings for safe query
      alias = alias?.toString().trim();
      email = email?.toString().trim().toLowerCase();

      // validations
      const aliasRegex = /^[a-zA-Z0-9_-]+$/;
      if (!alias || alias.length < 3 || alias.length > 20) {
        throw new BadRequestError('Alias must be between 3 to 20 characters');
      }
      if (!alias.match(aliasRegex)) {
        throw new BadRequestError(
          'Alias can only contain letters, numbers, hyphens, and underscores'
        );
      }
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Invalid email');
      }

      // check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError(
          'User with this email already exists. Please login'
        );
      }
      // check if alias already exists
      const existingAccount = await Account.findOne({ alias });
      if (existingAccount) {
        throw new BadRequestError(
          'Account with this alias already exists. Please choose another alias'
        );
      }

      const password = generateRandomPassword(12);
      const passwordHash = await hashPassword(password);
      const account = new Account({
        alias,
        password: passwordHash,
        isPasswordResetRequired: true, // user must reset password after first login
      });

      const user = new User({ email, account: account._id });
      account.rootAccount = account._id;
      await user.save();
      await account.save();

      await Mailer.sendLoginCredentialsEmail({
        to: email,
        user: { username: alias },
        password,
      });

      res.status(201).json({
        message:
          'User registered successfully. Please check your email for login credentials',
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      let { type, email, password, accountId, alias } = req.body;

      // converting to strings for safe query
      type = type?.toString().trim().toLowerCase();
      email = email?.toString().trim().toLowerCase();
      password = password?.toString();
      accountId = accountId?.toString();
      alias = alias?.toString().trim();

      // validations
      if (type !== 'root' && type !== 'account') {
        throw new BadRequestError('Invalid login type');
      }
      if (type === 'root') {
        if (!email || !validator.isEmail(email)) {
          throw new BadRequestError('Invalid email');
        }
        if (!password || password.length < 8) {
          throw new BadRequestError('Password must be at least 8 characters');
        }
      } else {
        if (!accountId || accountId.length !== 24) {
          throw new BadRequestError('Invalid account ID');
        }
        if (!alias || alias.length < 3) {
          throw new BadRequestError('Invalid alias');
        }
      }

      let user;
      let account;

      if (type === 'root') {
        // ROOT account login
        user = await User.findOne({ email });
        if (!user) throw new NotFoundError('User not found');

        account = await Account.findOne({ _id: user.account });
        if (!account) throw new NotFoundError('Account not found');
      } else {
        // AIM account login
        account = await Account.findOne({ _id: accountId, alias });
        if (!account) throw new NotFoundError('Account not found');
      }

      const isPasswordCorrect = await comparePassword(
        password,
        account.password
      );
      if (!isPasswordCorrect) throw new UnauthorizedError('Invalid password');

      const payload = {
        accountId: account._id,
        accountAlias: account.alias,
        rootAccountId: account.rootAccount.toString(),
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      if (!account.isPasswordResetRequired) {
        return res
          .status(200)
          .cookie('festify-ws-refresh-token', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge:
              parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string) * 1000,
          })
          .json({
            accessToken: account.isPasswordResetRequired ? null : accessToken,
            message: 'Login successful',
          });
      }

      const resetPasswordPayload = { accountId: account._id };
      // format of token - resetPasswordToken:accountId
      const resetPasswordToken =
        generateResetPasswordToken(resetPasswordPayload, account.password) +
        ':' +
        account._id;

      account.passwordResetToken = resetPasswordToken;
      await account.save();

      return res.status(200).json({
        isPasswordResetRequired: true,
        resetPasswordToken,
        message: 'Password reset required',
      });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.cookies?.['festify-ws-refresh-token']?.toString();
      const payload = verifyRefreshToken(refreshToken);

      if (!payload) {
        throw new BadRequestError('Invalid refresh token');
      }

      const account = await Account.findOne({
        _id: payload.accountId,
        alias: payload.accountAlias,
      });

      if (!account) {
        throw new NotFoundError('Account not found');
      }

      if (account.isPasswordResetRequired) {
        // user must reset password after first login
        throw new BadRequestError('Password reset required');
      }

      const newPayload = {
        accountId: account._id,
        accountAlias: account.alias,
        rootAccountId: account.rootAccount.toString(),
      };
      const accessToken = generateAccessToken(newPayload);

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { email } = req.body;

      // converting to strings for safe query
      email = email?.toString();

      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Invalid email');
      }

      const user = await User.findOne({ email });
      if (!user) throw new NotFoundError('User not found');

      const account = await Account.findOne({ _id: user.account });
      if (!account) throw new NotFoundError('User account not found');

      const payload = { accountId: account._id };
      const resetPasswordToken =
        generateResetPasswordToken(payload, account.password) + ':' + account._id;

      account.passwordResetToken = resetPasswordToken;
      await account.save();

      await Mailer.sendForgotPasswordEmail({
        to: email,
        resetPasswordToken,
        user: { name: account.alias },
      });

      res.status(200).json({
        message: 'Reset password email sent successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { token, password } = req.body;

      // converting to strings for safe query
      token = token?.toString();
      password = password?.toString();

      if (!password || password.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
      }

      if (!token)
        throw new BadRequestError(
          'The reset password link is invalid. Please try to send forgot password email again.'
        );

      const account = await Account.findOne({
        passwordResetToken: token,
      });
      if (!account)
        throw new BadRequestError(
          'The token has been expired or already used.'
        );

      const payload = verifyResetPasswordToken(
        token.split(':')[0],
        account.password
      );
      if (!payload)
        throw new BadRequestError(
          'The token has been expired or already used.'
        );

      account.password = await hashPassword(password);
      account.passwordResetToken = undefined;
      account.isPasswordResetRequired = false;
      await account.save();

      const newPayload = {
        accountId: account._id,
        accountAlias: account.alias,
        rootAccountId: account.rootAccount.toString(),
      };
      const accessToken = generateAccessToken(newPayload);
      const refreshToken = generateRefreshToken(newPayload);

      return res
        .status(200)
        .cookie('festify-ws-refresh-token', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string) * 1000,
        })
        .json({
          accessToken,
          message: 'Password reset successful',
        });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const accountId = req.user?.accountId;
      const accountAlias = req.user?.accountAlias;

      const account = await Account.findOne({
        _id: accountId,
        alias: accountAlias,
      }).select('-password -passwordResetToken').populate('rootAccount', 'alias');
      if (!account) throw new NotFoundError('Account not found');
      
      res.status(200).json({ account });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .clearCookie('festify-ws-refresh-token')
        .json({ message: 'Logout successful' });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
