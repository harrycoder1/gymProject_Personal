import { body, validationResult } from 'express-validator';

// Validation for adding a new coupon
const validateAddCoupon = [
  // Validate coupon code
  body('code')
    .notEmpty().withMessage('Coupon code is required')
    .isString().withMessage('Coupon code must be a string')
    .trim(),
  
  // Validate discount percentage
  body('discount_percentage')
    .notEmpty().withMessage('Discount percentage is required')
    .isInt({ min: 1, max: 100 }).withMessage('Discount percentage must be between 1 and 100'),
  
  // Validate description
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .trim(),

  // Validate valid_from date
  body('valid_from')
    .notEmpty().withMessage('Valid from date is required')
    .isISO8601().withMessage('Valid from must be a valid date'),

  // Validate valid_until date
  body('valid_until')
    .notEmpty().withMessage('Valid until date is required')
    .isISO8601().withMessage('Valid until must be a valid date')
    .custom((value, { req }) => {
      if (new Date(req.body.valid_from) >= new Date(value)) {
        throw new Error('Valid until must be after valid from');
      }
      return true;
    }),

  // Validate eligible_gym_ids (optional array of ObjectIds)
  body('eligible_gym_ids')
    .optional()
    .isArray().withMessage('Eligible gym IDs must be an array')
    .custom((ids) => ids.every(id => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage('Each gym ID must be a valid MongoDB ObjectId'),

  // Validate eligible_plan_ids (optional array of ObjectIds)
  body('eligible_plan_ids')
    .optional()
    .isArray().withMessage('Eligible plan IDs must be an array')
    .custom((ids) => ids.every(id => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage('Each plan ID must be a valid MongoDB ObjectId'),

  // Validate max_usage (optional integer)
  body('max_usage')
    .optional()
    .isInt({ min: 1 }).withMessage('Max usage must be a positive integer'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation for updating an existing coupon
const validateUpdateCoupon = [
  // Validate discount percentage (optional)
  body('discount_percentage')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Discount percentage must be between 1 and 100'),

  // Validate description (optional)
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim(),

  // Validate valid_from date (optional)
  body('valid_from')
    .optional()
    .isISO8601().withMessage('Valid from must be a valid date'),

  // Validate valid_until date (optional)
  body('valid_until')
    .optional()
    .isISO8601().withMessage('Valid until must be a valid date')
    .custom((value, { req }) => {
      if (req.body.valid_from && new Date(req.body.valid_from) >= new Date(value)) {
        throw new Error('Valid until must be after valid from');
      }
      return true;
    }),

  // Validate eligible_gym_ids (optional array of ObjectIds)
  body('eligible_gym_ids')
    .optional()
    .isArray().withMessage('Eligible gym IDs must be an array')
    .custom((ids) => ids.every(id => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage('Each gym ID must be a valid MongoDB ObjectId'),

  // Validate eligible_plan_ids (optional array of ObjectIds)
  body('eligible_plan_ids')
    .optional()
    .isArray().withMessage('Eligible plan IDs must be an array')
    .custom((ids) => ids.every(id => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage('Each plan ID must be a valid MongoDB ObjectId'),

  // Validate max_usage (optional integer)
  body('max_usage')
    .optional()
    .isInt({ min: 1 }).withMessage('Max usage must be a positive integer'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export { validateAddCoupon, validateUpdateCoupon };
