const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth");
const { requireAuth } = require("../middlewares/auth");

router.post("/register", AuthController.register);
router.post("/send-verification-email", AuthController.resendVerificationEmail);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/me", requireAuth, AuthController.me);
router.post("/logout", requireAuth, AuthController.logout);

module.exports = router;
