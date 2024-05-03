const { applicationDB } = require("../config/db");

// models
const User = require("../models/User")(applicationDB);
const Account = require("../models/Account")(applicationDB);

// services
const Mailer = require("../services/mailer");
const { BadRequestError } = require("../utils/errors");

// utils
const { hashPassword, comparePassword } = require("../utils/password");
const {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  verifyRefreshToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
} = require("../utils/token");

// packages
const validator = require("validator");

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // validations
      if (!name || name.length < 3 || name.length > 20) {
        throw new BadRequestError("Name must be between 3 to 20 characters");
      }
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError("Invalid email");
      }
      if (!password || password.length < 8) {
        throw new BadRequestError("Password must be at least 8 characters");
      }

      // check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError(
          "User with this email already exists. Please login"
        );
      }

      const passwordHash = await hashPassword(password);
      const account = new Account({ password: passwordHash });

      const user = new User({ name, email, account: account._id });
      account.user = user._id;
      await user.save();
      await account.save();

      const payload = { userId: user._id };

      const emailVerificationToken = generateEmailVerificationToken(payload);
      await Mailer.sendEmailVerificationEmail({
        email,
        verificationToken: emailVerificationToken,
      });

      res.status(201).json({
        message:
          "User registered successfully. Please verify your email to login",
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      const payload = verifyEmailVerificationToken(token);

      const user = await User.findById(payload.userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.isEmailVerified = true;
      await user.save();

      res
        .status(200)
        .json({ message: "Email verified successfully. You can now login" });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // validations
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError("Invalid email");
      }
      if (!password || password.length < 8) {
        throw new BadRequestError("Password must be at least 8 characters");
      }

      const user = await User.findOne({ email });
      if (!user) throw new BadRequestError("Invalid email");

      const account = await Account.findOne({ user: user._id });
      if (!account) throw new BadRequestError("User Account not found");

      if (!account.password) throw new BadRequestError("Invalid password");

      const isPasswordValid = await comparePassword(password, account.password);
      if (!isPasswordValid) throw new BadRequestError("Invalid password");

      if (!user.isEmailVerified) {
        throw new BadRequestError("Please verify your email to login");
      }

      const payload = { userId: user._id };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const payload = verifyRefreshToken(refreshToken);

      const accessToken = generateAccessToken(payload);

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError("Invalid email");
      }

      const user = await User.findOne({ email });
      if (!user) throw new BadRequestError("User not found");

      const account = await Account.findOne({ user: user._id });
      if (!account) throw new BadRequestError("User Account not found");

      const payload = { userId: user._id };
      const resetPasswordToken = generateResetPasswordToken(
        payload,
        account.password
      );

      await Mailer.sendForgotPasswordEmail({
        to: email,
        resetPasswordToken,
        user: { name: user.name },
      });

      res.status(200).json({
        message: "Reset password email sent successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      if (!password || password.length < 8) {
        throw new BadRequestError("Password must be at least 8 characters");
      }

      const payload = verifyResetPasswordToken(token);
      if (!payload) throw new BadRequestError("Invalid token");

      const user = await User.findById(payload.userId);
      if (!user) throw new BadRequestError("User not found");

      const account = await Account.findOne({ user: user._id });
      if (!account) throw new BadRequestError("User Account not found");

      account.password = await hashPassword(password);
      await account.save();

      res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) throw new BadRequestError("User not found");

      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
