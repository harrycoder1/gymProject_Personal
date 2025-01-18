import express from "express";
import {
  forgotPassword,
  getAllUsers,
  getUserProfile,
  registerUser,
  resetPassword,
  userLogin,
  verifyOTP,
} from "../controllers/userController.js";
import { validateForgotPassword, validateOTPVerification, validateResetPassword, validateUserRegistration } from "../validator/userValidator.js";
import { logPath } from "../utils/index.js";
import adminAuthMiddleWare from "../middleware/adminAuth.js";
import userAuthMiddleWare from "../middleware/userAuth.js";
// import { loadavg } from "os";
// import {
//   validateUserRegistration,
//   validateOTPVerification,
// } from "../middlewares/userValidator.js";

const userRouter = express.Router();
// get all user for the admins :
userRouter.get('/getAll' ,logPath , adminAuthMiddleWare , getAllUsers )

userRouter.get('/getProfile' , userAuthMiddleWare, logPath ,getUserProfile   )

userRouter.post("/register", logPath ,validateUserRegistration, registerUser);
userRouter.post("/verify-otp",logPath, validateOTPVerification, verifyOTP);
userRouter.post("/forgot-password",logPath,  validateForgotPassword, forgotPassword);
userRouter.post("/reset-password",logPath, validateResetPassword, resetPassword);
userRouter.post('/login' , logPath , userLogin)


export default userRouter;
