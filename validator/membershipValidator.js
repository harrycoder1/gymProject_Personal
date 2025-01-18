import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Validation rules for creating and updating membership
export const membershipValidationRules = [
 
  
  body('type')
    .notEmpty().withMessage('Membership type is required')
    .isIn(['Basic', 'Premium', 'VIP']).withMessage('Membership type must be either Basic, Premium, or VIP'),
  
  body('duration')
    .isInt({ min: 1, max: 36 }).withMessage('Duration must be between 1 and 36 months')
    .notEmpty().withMessage('Duration is required'),
  
  body('fee')
    .isDecimal().withMessage('Fee must be a valid number')
    .notEmpty().withMessage('Fee is required'),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be either Active or Inactive'),
    
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({  success:false  ,msg:errors.msg ,   errors: errors.array() });
        }
        next();
      }
];

// Validate membership ID in the URL
export const membershipIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid membership ID')
    .custom(async (value) => {
      const membership = await mongoose.models.membership.findById(value);
      if (!membership) {
        throw new Error('Membership not found');
      }
    }),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({  success:false  ,msg:errors.msg ,   errors: errors.array() });
        }
        next();
      }
];
