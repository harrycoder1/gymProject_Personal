import { body, param, validationResult } from "express-validator";

export const validateAdmin = {
  // Validation for adding a new admin
  addAdmin: [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["admin", "temp-admin"])
      .withMessage("Role must be 'admin' or 'temp-admin'"),
    body("access")
      .isArray({ min: 1 })
      .withMessage("Access must be an array with at least one value")
      .custom((value) => {
        const validAccess = ["add", "update", "view", "delete"];
        return value.every((action) => validAccess.includes(action));
      })
      .withMessage("Invalid access action specified"),
    body("password")
      .optional()
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("accessTill")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format for accessTill")
      .custom((value, { req }) => {
        if (req.body.role === "temp-admin" && !value) {
          throw new Error("accessTill is required for temp-admin");
        }
        if (new Date(value) <= Date.now()) {
          throw new Error("accessTill must be a future date");
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },


  ],

  // Validation for updating an admin
  updateAdmin: [
    param("adminId")
      .notEmpty()
      .withMessage("Admin ID is required")
      .isMongoId()
      .withMessage("Invalid Admin ID"),
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .trim(),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("role")
      .optional()
      .isIn(["admin", "temp-admin"])
      .withMessage("Role must be 'admin' or 'temp-admin'"),
    body("access")
      .optional()
      .isArray()
      .withMessage("Access must be an array")
      .custom((value) => {
        const validAccess = ["add", "update", "view", "delete"];
        return value.every((action) => validAccess.includes(action));
      })
      .withMessage("Invalid access action specified"),
    body("accessTill")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format for accessTill")
      .custom((value, { req }) => {
        if (req.body.role === "temp-admin" && !value) {
          throw new Error("accessTill is required for temp-admin");
        }
        if (new Date(value) <= Date.now()) {
          throw new Error("accessTill must be a future date");
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

  // Validation for deleting an admin
  deleteAdmin: [
    param("adminId")
      .notEmpty()
      .withMessage("Admin ID is required")
      .isMongoId()
      .withMessage("Invalid Admin ID"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

  login: [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

// Forgot Password Validation
 validateForgotPassword :[
  body('email')
    .isEmail()
    .withMessage('Invalid email address.')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
],

// Reset Password Validation
validateResetPassword : [
  body('token')
    .notEmpty()
    .withMessage('Token is required for password reset.'),

  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
    
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
]

};

