import  express from 'express'

import { logPath } from '../utils/index.js'
import { validateAdmin } from '../validator/adminValidator.js'
import { addAdmin, adminLogin, deleteAdmin, forgotPassword, getAlladmins, registerAdmin, resetPassword, updateAdmin, verifyAdminEmail } from '../controllers/adminController.js'
import adminAuthMiddleWare from '../middleware/adminAuth.js'

const adminRouter = express.Router()
// get all admins :
adminRouter.get('/get' , logPath , adminAuthMiddleWare , getAlladmins)
// adminRouter
adminRouter.post('/add' , logPath , adminAuthMiddleWare, validateAdmin.addAdmin , addAdmin )
adminRouter.put("/update/:adminId",adminAuthMiddleWare , validateAdmin.updateAdmin, updateAdmin);
adminRouter.delete("/delete/:adminId",adminAuthMiddleWare, validateAdmin.deleteAdmin, deleteAdmin);

adminRouter.post("/register",logPath  , adminAuthMiddleWare , registerAdmin);          // Admin Registration with email verification
adminRouter.get("/verify-email", logPath ,verifyAdminEmail);    // Email Verification
adminRouter.post("/forgot-password" , logPath, forgotPassword);  // Forgot Password
adminRouter.post("/reset-password",logPath ,resetPassword);  

// login route : 
adminRouter.post('/login' , logPath , validateAdmin.login , adminLogin)

export default adminRouter 