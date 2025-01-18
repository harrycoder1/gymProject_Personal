import { body, param, query, validationResult } from 'express-validator';

// Validation for creating a trainer
export const validateTrainer = [
  body('first_name')
    .notEmpty().withMessage('First name is required.')
    .isString().withMessage('First name must be a string.'),
  body('last_name')
    .notEmpty().withMessage('Last name is required.')
    .isString().withMessage('Last name must be a string.'),
  body('specialization')
    .notEmpty().withMessage('Specialization is required.')
    .isString().withMessage('Specialization must be a string.'),
  body('contact_number')
    .notEmpty().withMessage('Contact number is required.')
    .matches(/^\d{10}$/).withMessage('Contact number must be a valid 10-digit number.'),
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.'),
  body('experience')
    .optional()
    .isInt({ min: 0 }).withMessage('Experience must be a non-negative integer.'),
  body('hourly_rate')
    .optional()
    .isDecimal().withMessage('Hourly rate must be a valid decimal value.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

export const validateLoginTrainer = [
  body('email')
  .notEmpty().withMessage('Email is required.')
  .isEmail().withMessage('Invalid email format.'),
  body('password')
  .notEmpty().withMessage('Password should not be  empty.')
  ,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
]

// Validation for updating a trainer
export const validateTrainerUpdate = [

    // body('first_name').trim().notEmpty().withMessage('First name is required').isString(),
    // body('last_name').trim().notEmpty().withMessage('Last name is required').isString(),
    
    // Validate specialization
    body('specialization').trim().notEmpty().withMessage('Specialization is required').isString(),
    
    // Validate contact_number
    body('contact_number')
      .trim()
      .notEmpty()
      .withMessage('Contact number is required')
      .matches(/^\d{10}$/)
      .withMessage('Invalid contact number format'),
  
    
    // Validate certifications (array of objects)
    body('certifications')
      .isArray().withMessage('Certifications should be an array')
      .custom((certifications) => {
        if (certifications.length > 0) {
          certifications.forEach((cert) => {
            if (!cert.title || !cert.imgUrl) {
              throw new Error('Certification must have title and imgUrl');
            }
          });
        }
        return true;
      }),
  
    // Validate profile_picture (optional, but should be a valid URL if provided)
    body('profile_picture').isURL()
      .withMessage('Invalid profile picture URL'),
  
    // Validate hourly_rate
    body('hourly_rate')
      .notEmpty()
      .withMessage('Hourly rate is required')
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Invalid hourly rate format'),
  
    // Validate social_media_links (optional object with URLs)
    body('social_media_links')
      .optional()
      .isObject()
      .withMessage('Social media links must be an object')
      .custom((socialMediaLinks) => {
        if (socialMediaLinks) {
          Object.values(socialMediaLinks).forEach((link) => {
            if (!/^https?:\/\/[^\s]+$/.test(link)) {
              throw new Error('Social media link should be a valid URL');
            }
          });
        }
        return true;
      }),
  
    // Check validation results
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ];
  



export const validateVerifyEmail =[
  query('token')
    .notEmpty()
    .withMessage('Token is required  Verification of Email.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]
// Forgot Password Validation
export const validateTrainerForgotPassword = [
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
]

// Reset Password Validation
export const validateTrainerResetPassword = [
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

export const validateTrainerToJoinGym =   [body("gymId").notEmpty().withMessage("gymId not be Empty").isMongoId().withMessage("Enter the Valid gymId") , (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({  success:false  ,msg:errors.msg ,   errors: errors.array() });
  }
  next();
}

]