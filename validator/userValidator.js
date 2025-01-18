import { body, validationResult } from "express-validator";

const validateUserRegistration = [
  // Validate name
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  // Validate email
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  // Validate password
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  // Validate phone
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateOTPVerification = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isInt()
    .withMessage("OTP must be a number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];


const validateForgotPassword = [
  body("email").notEmpty().withMessage("Email is required").isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
];

const validateUserLogin = [
  body("email").notEmpty().withMessage("email is required").isEmail().withMessage("Kindly Insert the Proper Email"),
  body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
];
export { validateUserRegistration, validateOTPVerification , validateResetPassword , validateForgotPassword  , validateUserLogin};
