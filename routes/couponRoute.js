import express from 'express';
import { body, param } from 'express-validator';
import { 
  createCoupon, 
  getCouponById, 
  updateCoupon, 
  deleteCoupon, 
  getAllCoupons, 
  getCouponsBygymId,
  getCouponsByCode
} from '../controllers/couponController.js';
import { couponIdValidation, couponValidationRules } from '../validator/couponValidator.js';
// import gymAuthMiddleWare from '../middleware/gymauth.js';
import  gymAuthMiddleWare from '../middleware/gymAuth.js'
import { logPath } from '../utils/index.js';
import adminAuthMiddleWare from '../middleware/adminAuth.js';
const gymcouponRouter = express.Router();

// Validation rules


// Routes
gymcouponRouter.post('/add',logPath , gymAuthMiddleWare,   couponValidationRules, createCoupon);
gymcouponRouter.get('/get/:id' ,logPath ,couponIdValidation, getCouponById);
gymcouponRouter.put('/update/:id' ,logPath ,gymAuthMiddleWare , couponIdValidation , couponValidationRules, updateCoupon);
gymcouponRouter.delete('/:id' ,logPath , gymAuthMiddleWare,couponIdValidation, deleteCoupon);
gymcouponRouter.get('/getbygymid' ,logPath , gymAuthMiddleWare , getCouponsBygymId )

gymcouponRouter.get('/getbycode/:code' ,logPath  , getCouponsByCode)

gymcouponRouter.get('/coupons',logPath  , adminAuthMiddleWare, getAllCoupons);

export default gymcouponRouter;
