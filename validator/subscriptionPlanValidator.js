import { body, param, validationResult } from 'express-validator';

// Validation rules for subscription plan creation and update
export const subscriptionPlanValidationRules = [
//   body('name').trim().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('duration')
    .isInt({ min: 1, max: 36 })
    .withMessage('Duration must be between 1 and 36 months'),
  body('features')
    .isArray()
    .withMessage('Features must be an array')
    .custom((value) => {
      if (value.length === 0) {
        throw new Error('Features array cannot be empty');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('trial_period')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Trial period must be a non-negative number'),
  body('category')
    .optional()
    .isIn(['Basic', 'Premium'])
    .withMessage('Category must be one of Basic or Premium'),

  body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  body('max_users')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max users must be at least 1'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
];

// Validation for ID in params
export const subscriptionPlanIdValidation = [
  param('id').isMongoId().withMessage('Invalid subscription plan ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
