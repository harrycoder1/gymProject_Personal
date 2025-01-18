import express from 'express';
import { body } from 'express-validator';
import {
  registerMember,
  updateMemberData,
  loginMember,
  verifyMemberOTP,
  forgotPassword,
  resetPassword,
} from '../controllers/memberController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  validateForgotPassword,
  validateLoginMember,
  memberUpdateValidation,
  validateRegisterMember,
  validateResetPassword,
  validateVerifyMemberOTP,
} from '../validator/memberValidation.js';
import { logPath } from '../utils/index.js';

const memberRouter = express.Router();

// Route to register a new member
memberRouter.post(
  '/register', 
  logPath,
  validateRegisterMember, // Validate the registration data
  registerMember // Controller for registering the member
);

// Route to update member data after login
memberRouter.put(
  '/updateprofile', 
  logPath, 
  authenticate, // Protect the route with JWT middleware
  memberUpdateValidation, // Validate the data for updating member profile
  updateMemberData // Controller to handle profile update
);

// Route to login a member
memberRouter.post(
  '/login',
  logPath,
  validateLoginMember, // Validate the login credentials
  loginMember // Controller to handle member login
);

// Route to verify OTP for member
memberRouter.post(
  '/verify-otp', 
  logPath, 
  validateVerifyMemberOTP, // Validate OTP input
  verifyMemberOTP // Controller to verify OTP
);

// Route to send forgot password email
memberRouter.post(
  '/forgot-password',
  logPath,
  validateForgotPassword, // Validate the email input for forgotten password
  forgotPassword // Controller to handle forgot password logic
);

// Route to reset the password
memberRouter.post(
  '/reset-password',
  logPath,
  validateResetPassword, // Validate the password reset token and new password
  resetPassword // Controller to handle password reset
);

export default memberRouter;
