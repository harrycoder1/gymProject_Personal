import { body, validationResult } from 'express-validator';
const validateGymLogin=[
    // Validate ownerEmail
    body('ownerEmail')
    .notEmpty().withMessage('Owner email is required')
    .isEmail().withMessage('Invalid email format'),
    //   Validate password (at least 8 characters)
  body('password')
  .notEmpty().withMessage('Password is required')
  .isString().withMessage('Password must be a string') , 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({  success:false  ,msg:errors.msg ,   errors: errors.array() });
    }
    next();
  }
]
 const validateGymRegistration = [
  // Validate gymName
  body('gymName')
    .notEmpty().withMessage('Gym name is required')
    .isString().withMessage('Gym name must be a string'),

  // Validate gLocation
  body('gLocation')
    .notEmpty().withMessage('Location is required')
    .isString().withMessage('Location must be a string'),

  // Validate ownerName
  body('ownerName')
    .notEmpty().withMessage('Owner name is required')
    .isString().withMessage('Owner name must be a string'),

  // Validate ownerEmail
  body('ownerEmail')
    .notEmpty().withMessage('Owner email is required')
    .isEmail().withMessage('Invalid email format'),

//   // Validate ownerPanVerification
//   body('ownerPanVerification')
//     .isBoolean().withMessage('Owner PAN verification must be a boolean value'),

  // Validate address
  body('address')
    .notEmpty().withMessage('Address is required')
    .isString().withMessage('Address must be a string'),

  // Validate shopLicenseID
  body('shopLicenseID')
    .notEmpty().withMessage('Shop License ID is required')
    .isString().withMessage('Shop License ID must be a string'),

    // For validate the Pan Card :
    body('panCard')
    .notEmpty().withMessage('Owner Pan ID is required')
    .isString().withMessage('Owner Pan  ID must be a string'),
  // Validate contact_number (ensure it's an array of objects)
  body('contact_number')
    .optional()
    .isArray().withMessage('Contact number must be an array')
    .custom((value) => {
      return value.every(
        (contact) => contact.name && contact.position && contact.no
      );
    }).withMessage('Each contact object must contain name, position, and no'),

//   Validate socialContacts (ensure it's an array of objects)
  body('socialContacts')
    .optional()
    .isArray().withMessage('Social contacts must be an array')
    .custom((value) => {
      return value.every(
        (contact) => contact.type && contact.link
      );
    }).withMessage('Each social contact object must contain type and link'),

//   Validate password (at least 8 characters)
  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

  // Validate subscription_plan (should be an ObjectId reference)
//   body('subscription_plan')
//     .notEmpty().withMessage('Subscription plan is required')
//     .isMongoId().withMessage('Subscription plan must be a valid MongoDB ObjectId'),
  
  // To handle errors and send a response if validation fails
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({  success:false  ,   errors: errors.array() });
    }
    next();
  }
];

export { validateGymRegistration  , validateGymLogin};
