import express from 'express';
import { body, param } from 'express-validator';
import { 
  createMembership, 
  getMembershipById, 
  updateMembership, 
  deleteMembership, 
  getAllMemberships, 
  getMembershipsByGymId,
  getMembershipsByType 
} from '../controllers/membershipController.js';
import { membershipIdValidation, membershipValidationRules } from '../validator/membershipValidator.js';
import { logPath } from '../utils/index.js';
import gymAuthMiddleWare from '../middleware/gymAuth.js';

const membershipRouter = express.Router();

// Create a new membership : gym auth required
membershipRouter.post(
  '/add',logPath, gymAuthMiddleWare,
  membershipValidationRules, // Express validation
  createMembership
);

// Get membership by ID
membershipRouter.get(
  '/:id',
  membershipIdValidation, // Validate membership ID
  getMembershipById
);

// Update a membership by ID
membershipRouter.put(
  '/update/:id',
  membershipIdValidation, // Validate membership ID
  membershipValidationRules, // Express validation
  updateMembership
);

// Delete a membership by ID
membershipRouter.delete(
  '/delete/:id',
  gymAuthMiddleWare , 
  membershipIdValidation, // Validate membership ID
  deleteMembership
);

// Get all memberships
membershipRouter.get('/get/all',
  getAllMemberships
);

// Get memberships by gym_id
membershipRouter.get('/gym/:gymId',
  getMembershipsByGymId
);

// Get memberships by type
membershipRouter.get('/type/:type',
  getMembershipsByType
);

export default membershipRouter;
