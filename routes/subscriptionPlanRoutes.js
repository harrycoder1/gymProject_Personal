import express from 'express';
import {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from '../controllers/subscriptionPlanController.js';

import  adminAuthMiddleWare from '../middleware/adminAuth.js'
import { subscriptionPlanIdValidation, subscriptionPlanValidationRules } from '../validator/subscriptionPlanValidator.js';
import { logPath } from '../utils/index.js';
import gymAuthMiddleWare from '../middleware/gymAuth.js';

const subscriptionPlanRouter = express.Router();

// Create a subscription plan : admin Auth Required
subscriptionPlanRouter.post('/add',logPath  ,  adminAuthMiddleWare ,subscriptionPlanValidationRules, createSubscriptionPlan);

// Get all subscription plans : gym auth required 
subscriptionPlanRouter.get('/get', logPath    ,adminAuthMiddleWare , getAllSubscriptionPlans);

// make routes for show active plans

// Get a subscription plan by ID
subscriptionPlanRouter.get(
  '/:id',logPath , gymAuthMiddleWare, subscriptionPlanIdValidation,

  getSubscriptionPlanById
);

// Update a subscription plan
subscriptionPlanRouter.put(
  '/update/:id', logPath , adminAuthMiddleWare  , subscriptionPlanIdValidation,subscriptionPlanValidationRules,
updateSubscriptionPlan
);

// Delete a subscription plan
subscriptionPlanRouter.delete(
  '/:id',
  subscriptionPlanIdValidation,
  adminAuthMiddleWare , 

  deleteSubscriptionPlan
);

export default subscriptionPlanRouter;
