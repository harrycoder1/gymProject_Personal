import express from 'express';
import { body, param, validationResult ,query } from 'express-validator';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  addTrainerToClass,
  acceptTrainerInvite,
  removeTrainerFromClass,
  getClassesByGymId,
} from '../controllers/classController.js';
import gymAuthMiddleWare from '../middleware/gymAuth.js';
import { logPath } from '../utils/index.js';
import { addClassSchedule, deleteClassSchedule, updateClassSchedule } from '../controllers/classScheduleController.js';

const classRouter = express.Router();

// Route: Create a new class By Admin
classRouter.post(
  '/create',
  logPath , 
  gymAuthMiddleWare , 
  [
    body('name').notEmpty().withMessage('Class name is required'),
    body('description').notEmpty().withMessage('Class name is required'),
    body('duration').notEmpty().withMessage('Duration is required in month'), 
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
    // body('gym_id').notEmpty().withMessage('Gym ID is required'),
    (req, res,next) => {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next()
    } ,
   
  ],
  createClass
);

// Route: Get all classes
classRouter.get('/get-all',  getClasses);

classRouter.get('/gym/get/:gymId' , getClassesByGymId )
// Route: Get a class by ID
classRouter.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid class ID'),
  getClassById
);

// add the trainer to the request :
classRouter.patch('/add-trainer-to-class-request/:classId' , logPath , gymAuthMiddleWare ,  addTrainerToClass)

classRouter.get("/tr/accept-invite"  ,[
  query('token').notEmpty().withMessage('token required'),
], acceptTrainerInvite)
// Route: Update a class by ID
classRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid class ID'),
    body('name').optional().notEmpty().withMessage('Class name cannot be empty'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  ],
  updateClass
);

// removeTrainer from the class :
classRouter.delete('/remove/:classId' , logPath, gymAuthMiddleWare ,  removeTrainerFromClass)
// Route: Delete a class by ID
classRouter.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid class ID'),
  deleteClass
);



// ================ For manage the  Schedule :
// ++++++++++ make the Validator is Remaining 
// Add a new class schedule
classRouter.post("/schedule/add/:classId", gymAuthMiddleWare , addClassSchedule);

// Update an existing class schedule
classRouter.put("/schedule/update/:classId/:scheduleId", gymAuthMiddleWare, updateClassSchedule);

// Delete a class schedule
classRouter.delete("/schedule/delete/:classId/:scheduleId", gymAuthMiddleWare ,  deleteClassSchedule);




export default classRouter;
