
import express from "express";
// import {
//   createPayment,
//   getAllPayments,
//   updatePaymentVerification,
// } from "../controllers/paymentController.js";
// import { validatePaymentCreation } from "../validator/paymentValidation.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logPath } from "../utils/index.js";
import { validatePaymentCreation, validatePaymentCreationOffline, validatePaymentUpdation } from "../validator/paymentValidater.js";
import { getAllPayments  ,createPayment,updatePaymentVerification, createPaymentOffline ,getAllByGym,getAllByPaymentByMember} from "../controllers/memberPaymentController.js";
import gymAuthMiddleWare from "../middleware/gymAuth.js";
import { body } from "express-validator";
import adminAuthMiddleWare from "../middleware/adminAuth.js";

const paymentRouter = express.Router();

// Create Payment Route
paymentRouter.post("/create", logPath, authenticate, validatePaymentCreation, createPayment);

// Get All Payments Route
paymentRouter.get("/get-all", logPath, adminAuthMiddleWare, getAllPayments);

paymentRouter.post("/create-offline", logPath, gymAuthMiddleWare, 
     validatePaymentCreationOffline , createPaymentOffline);

paymentRouter.get('/gym/get-all' , logPath , gymAuthMiddleWare ,getAllByGym ) //gym auth required 

paymentRouter.get('/member/get-all' , logPath , authenticate ,getAllByPaymentByMember )
// Update Payment Verification Status Route
paymentRouter.put(
  "/update-verification/:id",
  logPath,
  adminAuthMiddleWare,
  validatePaymentUpdation , 
  

  updatePaymentVerification
);

export default paymentRouter;
