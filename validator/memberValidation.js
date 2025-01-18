import { body, validationResult } from 'express-validator';

export const validateRegisterMember = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('contact_number')
    .notEmpty().withMessage('Contact number is required')
    .isMobilePhone().withMessage('Invalid contact number'),

  body('address')
    .notEmpty().withMessage('Address is required')
    .isString().withMessage('Address must be a string'),

  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Invalid date format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: 'Validation errors', errors: errors.array() });
    }
    next();
  }
];

export const validateVerifyMemberOTP = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isNumeric().withMessage('OTP must be a number')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: 'Validation errors', errors: errors.array() });
    }
    next();
  }
];

export const validateForgotPassword = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: 'Validation errors', errors: errors.array() });
    }
    next();
  }
];

export const validateResetPassword = [
  body('token')
    .notEmpty().withMessage('Token is required')
    .isString().withMessage('Token must be a string'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isString().withMessage('New password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: 'Validation errors', errors: errors.array() });
    }
    next();
  }
];

export const validateLoginMember = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: 'Validation errors', errors: errors.array() });
    }
    next();
  }
];

//   export {
//     memberRegisterValidation , memberUpdateValidation
//   }

 export const  memberUpdateValidation =   [
    // body('name').notEmpty().withMessage('Name is required'),
    body('gender').isIn(['M', 'F']).withMessage('Gender must be M or F'),
    // body('email').isEmail().withMessage('Valid email is required'),
    body('contact_number')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid contact number'),

      body('address').notEmpty().withMessage('address is required'),
    // body('password').notEmpty().withMessage('Name is required').isStrongPassword().withMessage("Password Should be Strong"),
      
    body('date_of_birth').notEmpty().withMessage('Name is required').isDate().withMessage("Date Should be in Proeper Format"),

       (req, res, next) => {
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
             return res.status(400).json({ success: false, errors: errors.array() });
           }
           next();
         },
      
  ]


