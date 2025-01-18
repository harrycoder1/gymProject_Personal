import  express from 'express'

import { forgotPassword, getAllGyms, getGymProfile, loginGym , registerGym, resetPassword, updateGym, verifyEmail } from '../controllers/gymsControllers.js'
import { logPath } from '../utils/index.js'
import { validateGymLogin, validateGymRegistration } from '../validator/gymValidator.js'
import gymAuthMiddleWare from '../middleware/gymAuth.js'
import adminAuthMiddleWare from '../middleware/adminAuth.js'

const gymRouter = express.Router()

// Verify Email Route
gymRouter.get("/verify-email",logPath, verifyEmail);

// Forgot Password Route
gymRouter.post("/forgot-password",logPath, forgotPassword);

// Reset Password Route
gymRouter.post("/reset-password",logPath ,  resetPassword);

// get all gyms :
gymRouter.get('/getAllGyms' , logPath , adminAuthMiddleWare , getAllGyms)
// for all user
// gymRouter.get('/getAllGymsAll' , logPath , adminAuthMiddleWare , getAllGyms)
// get gyms  profile :
gymRouter.get('/getProfile' ,logPath , gymAuthMiddleWare , getGymProfile )

gymRouter.post('/login' ,logPath  , validateGymLogin ,  loginGym)

// for register the new gym
gymRouter.post('/register',logPath   ,validateGymRegistration, registerGym)

// for update the gym details : 
gymRouter.put('/update' , gymAuthMiddleWare  , logPath , updateGym )


export default gymRouter 
