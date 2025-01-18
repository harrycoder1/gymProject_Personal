import { body, param, validationResult } from "express-validator";

// Validate Payment Creation
export const validatePaymentCreation = [
  body("receiver")
    .notEmpty()
    .withMessage("Receiver ID is required")
    .isMongoId()
    .withMessage("Invalid Reciever ID"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("transaction_id")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isString()
    .withMessage("Transaction ID must be a string"),
  body("payment_method")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["Card", "Cash", "Online", "UPI"])
    .withMessage("Payment method must be one of Card, Cash, Online, or UPI"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

export const validatePaymentCreationOffline = [  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"), 
    body("member_id")
        .notEmpty()
        .withMessage("Member ID is required")
        .isMongoId()
        .withMessage("Invalid Member ID") , 

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
      },]


     export  const validatePaymentUpdation =[
        param("id")
        .notEmpty()
        .withMessage("Member ID is required")
        .isMongoId()
        .withMessage("Invalid Member ID") ,  

        body("verificationStatus")
        .notEmpty()
        .withMessage("VarificationStatus is required")
        .isBoolean()
        .withMessage("Invalid VerificationStatus") ,  
        // body("verifyBy" ) , 
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
          },
      ]