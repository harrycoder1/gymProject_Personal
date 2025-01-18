import express from 'express'

const copounRouter = express.Router()
import { logPath } from '../utils/index.js'
import adminAuthMiddleWare from '../middleware/adminAuth.js'
import { addAdminCoupon, getAllCoupons, getByCouponCode, removeAdminCoupon, updateAdminCoupon } from '../controllers/adminCouponController.js'
import { validateAddCoupon , validateUpdateCoupon} from '../validator/adminCouponValidater.js'
import gymAuthMiddleWare from '../middleware/gymAuth.js'




copounRouter.get('/get' ,logPath , adminAuthMiddleWare , getAllCoupons )
copounRouter.get('/get/:code'  ,logPath , gymAuthMiddleWare ,  getByCouponCode )
copounRouter.post('/add' ,logPath ,   adminAuthMiddleWare ,validateAddCoupon ,  addAdminCoupon )
copounRouter.put('/update/:couponId' ,logPath , adminAuthMiddleWare , validateUpdateCoupon,  updateAdminCoupon )
copounRouter.delete('/remove/:couponId' ,logPath , adminAuthMiddleWare , removeAdminCoupon )



export default copounRouter 
