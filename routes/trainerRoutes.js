import express from 'express';
import {
  createTrainer,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  listAllTrainers,
  verifyTrainer,
  handleEmailVerification,
  forgotPassword,
  resetPassword,
  loginTrainer,
  senRequestToJoinGym,
} from '../controllers/trainerController.js';
// import { validateTrainer, validateTrainerUpdate } from '../validators/trainerValidator.js';
// import { authenticate } from '../middleware/authMiddleware.js';
import gymAuthMiddleWare from '../middleware/gymAuth.js';
import adminAuthMiddleWare from  '../middleware/adminAuth.js'

import { logPath } from '../utils/index.js';
import { validateLoginTrainer, validateTrainer , validateTrainerForgotPassword, validateTrainerResetPassword, validateTrainerToJoinGym, validateTrainerUpdate, validateVerifyEmail } from '../validator/trainerValidator.js';
import trainerAuthMiddleWare from '../middleware/trainerAuth.js';
import { body, validationResult } from 'express-validator';

const trainerRouter = express.Router();
// gymAuth
// Route to create a trainer
trainerRouter.post(
  '/create',
  logPath,
  // gymAuthMiddleWare , 
  validateTrainer, // Validation middleware
  createTrainer
);

//get All Trainer :
// trainerRouter.get('/admin/get-all' , logPath ,adminAuthMiddleWare , ) 

// Route to fetch trainer by gymId
trainerRouter.get('/gym/get', logPath,  gymAuthMiddleWare, getTrainerById);

// Route to update a trainer
trainerRouter.put(
  '/update',
  logPath,
 trainerAuthMiddleWare , 
  validateTrainerUpdate, // Validation for updates
  updateTrainer
);



// Route to delete a trainer
trainerRouter.delete('/:id', logPath, gymAuthMiddleWare, deleteTrainer);

// Add login :
// trainerRouter.post('')

// update the trainer profile
// trainerRouter.put('/update')

// Route to fetch all trainers
trainerRouter.get('/', logPath, listAllTrainers);

trainerRouter.post('/t1/login' , logPath ,validateLoginTrainer, loginTrainer)

// Route to verify a trainer
trainerRouter.patch('/:id/verify', logPath, gymAuthMiddleWare, verifyTrainer);

// 
// Email verification
trainerRouter.get("/verify-email" ,logPath ,validateVerifyEmail ,  handleEmailVerification);

// Forgot and reset password
trainerRouter.post("/forgot-password" , logPath, validateTrainerForgotPassword,  forgotPassword);
trainerRouter.post("/reset-password",logPath ,validateTrainerResetPassword , resetPassword);

trainerRouter.patch('/send-trainer-to-join' , logPath  ,trainerAuthMiddleWare  ,
  validateTrainerToJoinGym ,senRequestToJoinGym )

export default trainerRouter;
