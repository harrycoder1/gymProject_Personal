import { body, param, validationResult } from 'express-validator';
import { responseSender } from '../utils/index.js';

export const couponValidationRules = [
  body('code')
    .isString()
    .notEmpty()
    .withMessage('Code is required'),
  body('discount_percentage')
    .isInt({ min: 1, max: 100 })
    .withMessage('Discount percentage must be between 1 and 100'),
  
  body('valid_from')
    .isISO8601()
    .withMessage('Valid from date is required'),
  body('valid_until')
    .isISO8601()
    .withMessage('Valid until date is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.valid_from)) {
        throw new Error('valid_until must be greater than valid_from');
      }
      return true;
    }),
        (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return  responseSender( "Validation Faild !" ,false, {  errors: errors.array() });
          }
          next();
        },



];

export const couponIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Valid Coupon ID is required'),
        (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return  responseSender( "Validation Faild!" ,false, {  errors: errors.array() });
          }
          next();
        },
];
