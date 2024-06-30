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
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  verifyRefreshToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
} from '../utils/token';
import { BadRequestError } from '../utils/errors';

// packages
import validator from 'validator';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      let { name, email, password } = req.body;

      // converting to strings for safe query
      name = name?.toString();
      email = email?.toString();
      password = password?.toString();

      // validations
      if (!name || name.length < 3 || name.length > 20) {
        throw new BadRequestError('Name must be between 3 to 20 characters');
      }
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Invalid email');
      }
      if (!password || password.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
      }

      // check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError(
          'User with this email already exists. Please login'
        );
      }

      const passwordHash = await hashPassword(password);
      const account = new Account({ password: passwordHash });

      const user = new User({ name, email, account: account._id });
      account.user = user._id;
      await user.save();
      await account.save();

      res.status(201).json({
        message:
          'User registered successfully. Please verify your email to login',
      });
    } catch (err) {
      next(err);
    }
  }

  static async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { email } = req.body;

      // converting to strings for safe query
      email = email?.toString();

      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError(
          'The email you provided is invalid or empty. Please provide a valid email'
        );
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new BadRequestError(
          'The email you provided is not registered with us. Please register first'
        );
      }

      if (user.isEmailVerified) {
        throw new BadRequestError(
          'Email you provided is already verified. Please login',
          'USER_EMAIL_ALREADY_VERIFIED'
        );
      }

      const payload = { userId: user._id };
      const emailVerificationToken = generateEmailVerificationToken(payload);

      await Mailer.sendEmailVerificationEmail({
        email,
        verificationToken: emailVerificationToken,
      });

      res.status(200).json({
        message:
          'Verification email sent successfully. Please check your inbox',
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      let { token } = req.body;

      // converting to strings for safe query
      token = token?.toString();

      const payload = verifyEmailVerificationToken(token) as { userId: string };

      if (!payload) {
        throw new BadRequestError(
          'The token you provided is invalid or expired'
        );
      }

      const user = await User.findById(payload.userId);
      if (!user) {
        throw new Error(
          'The token you provided is invalid or expired. Please request a new verification email.'
        );
      }

      if (user.isEmailVerified) {
        return res.status(200).json({
          message:
            'Your email has already been verified. You can now login to your account.',
        });
      }

      user.isEmailVerified = true;
      await user.save();

      res.status(200).json({
        message:
          'Your email has been successfully verified. You can now login to your account.',
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, password } = req.body;

      // converting to strings for safe query
      email = email?.toString();
      password = password?.toString();

      // validations
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Invalid email');
      }
      if (!password || password.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
      }

      const user = await User.findOne({ email });
      if (!user) throw new BadRequestError('Invalid email');

      const account = await Account.findOne({ user: user._id });
      if (!account) throw new BadRequestError('User Account not found');

      if (!account.password) throw new BadRequestError('Invalid password');

      const isPasswordValid = await comparePassword(password, account.password);
      if (!isPasswordValid) throw new BadRequestError('Invalid password');

      if (!user.isEmailVerified) {
        throw new BadRequestError(
          'Please verify your email to login',
          'USER_EMAIL_NOT_VERIFIED'
        );
      }

      const payload = { userId: user._id };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res
        .status(200)
        .cookie('festify-ws-refresh-token', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string) * 1000,
        })
        .json({ accessToken, user, message: 'Login successful' });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.cookies?.['festify-ws-refresh-token']?.toString();
      const payload = verifyRefreshToken(refreshToken) as { userId: string };

      if (!payload) {
        throw new BadRequestError('Invalid refresh token');
      }

      const user = await User.findById(payload.userId);

      if (!user) {
        throw new BadRequestError('Invalid user');
      }

      const newPayload = { userId: user._id };
      const accessToken = generateAccessToken(newPayload);

      res.status(200).json({ accessToken, user });
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
      if (!user) throw new BadRequestError('User not found');

      const account = await Account.findOne({ user: user._id });
      if (!account) throw new BadRequestError('User Account not found');

      const payload = { userId: user._id };
      const resetPasswordToken =
        generateResetPasswordToken(payload, account.password) + ':' + user._id;

      await Mailer.sendForgotPasswordEmail({
        to: email,
        resetPasswordToken,
        user: { name: user.name },
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

      const [resetPasswordToken, userId] = token.split(':');

      const account = await Account.findOne({ user: userId });
      if (!account) throw new BadRequestError('User account not found');

      const payload = verifyResetPasswordToken(
        resetPasswordToken,
        account.password
      );
      if (!payload)
        throw new BadRequestError('The link has been expired or already used.');

      account.password = await hashPassword(password);
      await account.save();

      res.status(200).json({
        message: 'Password reset successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      if (!userId) throw new BadRequestError('Invalid user');

      const user = await User.findById(req.user.userId);
      if (!user) throw new BadRequestError('User not found');

      res.status(200).json({ user });
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
