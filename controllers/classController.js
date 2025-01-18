import { validationResult } from 'express-validator';
import { Class } from '../models/ClassSchema.js';
import { responseSender } from '../utils/index.js';
import { Trainer } from '../models/TrainerSchema.js';
import jwt from 'jsonwebtoken';
import {sendEmail} from '../utils/emailSender.js'
// import { text } from 'body-parser';
// import { Class } from '../models/Class.js';

// Controller: Create a new class
export const createClass = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const gymId = req.body.gymId 

    const {name , duration , capacity } = req.body

    // if()

    const newClass = new Class({name , duration , capacity ,gymId});
    const savedClass = await newClass.save();

    return responseSender("new Class has added SuccessFully !" , true , 201 , res , {data:savedClass} )
    // res.status(201).json(savedClass);
  } catch (error) {
    console.log(error)
   return   responseSender(error.message  , false , 201 , res ) ;
  }
};

// ===========add trainer into the Class :
// we will send the invite request to from the gym class then they will accept the request and join at class as a trainer 

export const addTrainerToClass = async (req, res) => {
  const { classId } = req.params;
  const { trainerId, gymId } = req.body;

  try {
    // Check if the class exists
    const existingClass = await Class.findOne({ _id: classId, gymId: gymId });
    if (!existingClass) {
      return responseSender('Class not found', false, 404, res);
    }

    // Check if the trainer exists
    const trainerExists = await Trainer.findById(trainerId);
    if (!trainerExists) {
      return responseSender('Trainer not found', false, 404, res);
    }

    console.log(trainerExists)

    // Check if the trainer is already added to the class
    const isTrainerAlreadyAdded = existingClass.trainers_id.some(
      (trainer) => trainer.id.toString() === trainerId && trainer.isAccept ==true
    );

    if (isTrainerAlreadyAdded) {
      return responseSender('Trainer is already added to this class', false, 400, res);
    }
    const isTrainerAlreadyAddedBuNotAccept = existingClass.trainers_id.some(
      (trainer) => trainer.id.toString() === trainerId && trainer.isAccept ==false
    );

    if(!isTrainerAlreadyAddedBuNotAccept){
    // Add the trainer to the class
    existingClass.trainers_id.push({ id: trainerId, isAccept: false });
    await existingClass.save();

    }

    // Generate a JWT token for the invite
    const token = jwt.sign(
      { classId, trainerId },
      process.env.JWT_SECRET, // Ensure this is defined in your environment
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Email details
    const acceptInviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;
    const emailContent = `
      <h3>Hello ${trainerExists.first_name} ${trainerExists.last_name},</h3>
      <p>You have been invited to join the class <b>${existingClass.name}</b>.</p>
      <p>Please click the link below to accept the invitation:</p>
      <a href="${acceptInviteUrl}" style="display:inline-block; padding:10px 20px; color:white; background-color:green; text-decoration:none; border-radius:5px;">Accept Invitation</a>
      <p>If you did not expect this email, please ignore it.</p>
    `;

    console.log(token)
    // Send the email
    await sendEmail(
     trainerExists.email,
     'Class Invitation',
      "",
      emailContent,
    );

    return responseSender(
      'Trainer added to the class successfully and notification sent via email',
      true,
      200,
      res,
      { class: existingClass }
    );
  } catch (error) {
    return responseSender(error.message, false, 500, res);
  }
};

// ==========Update isAccept field :
export const acceptTrainerInvite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.query;
  console.log("token of accept : " ,token)

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { classId, trainerId } = decoded;

    // Find the class and update the trainer's acceptance
    const classData = await Class.findById(classId);
    if (!classData) {
      return responseSender('Class not found', false, 404, res);
    }

    const trainer = classData.trainers_id.find(
      (trainer) => trainer.id.toString() === trainerId
    );
    if (!trainer) {
      return responseSender('Trainer not found in the class', false, 404, res);
    }

    // Update the isAccept field to true
    trainer.isAccept = true;
    await classData.save();

    return responseSender('Invitation accepted successfully!', true, 200, res);
  } catch (error) {
    return responseSender('Invalid or expired token', false, 400, res);
  }
};


// export const removeTrainer  from  the class : 
  export const removeTrainerFromClass = async (req, res) => {
    const { classId } = req.params; // Class ID from route parameter
    const { trainerId, gymId } = req.body; // Trainer ID and Gym ID from request body
  
    try {
      // Validate if the class exists
      const existingClass = await Class.findOne({ _id: classId, gymId: gymId });
      if (!existingClass) {
        return responseSender('Class not found', false, 404, res);
      }
  
      // Validate if the trainer exists in the class
      const trainerIndex = existingClass.trainers_id.findIndex(
        (trainer) => trainer.id.toString() === trainerId
      );
  
      if (trainerIndex === -1) {
        return responseSender('Trainer not found in the class', false, 404, res);
      }
  
      // Remove the trainer from the class
      existingClass.trainers_id.splice(trainerIndex, 1);
      await existingClass.save();
  
      return responseSender(
        'Trainer removed from the class successfully',
        true,
        200,
        res,
        { class: existingClass }
      );
    } catch (error) {
      return responseSender(error.message, false, 500, res);
    }
  };





// Controller: Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate({
      path:"schedule.id",
      model:"classSchedule" , 
      select:"day startTime endTime isRecurring"

    }).populate({
      path: 'trainers_id.id', // Populate the `id` field in `trainers_id`
      model: 'trainer',  // Refer to the `trainer` model
      select: 'first_name last_name  email specialization experience profile_picture certifications '
    });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// 
export const getClassesByGymId = async (req, res) => {
  try {
    const {gymId} = req.params
    const classes = await Class.find({gymId:gymId}).populate({
      path:"schedule.id",
      model:"classSchedule" , 
      select:"day startTime endTime isRecurring"

    }).populate({
      path: 'trainers_id.id', // Populate the `id` field in `trainers_id`
      model: 'trainer',  // Refer to the `trainer` model
      select: 'first_name last_name  email specialization experience profile_picture certifications '
    });
   return  responseSender("Class fetched By Gym Id!" , true , 200 , res , {data:classes})
  } catch (error) {
   return  res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};
// Controller: Get a class by ID
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await Class.findById(id).populate('trainers_id gym_id');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    return responseSender("Class fetched By Gym Id!" , true , 200 , res , {data:classData})
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
};

// Controller: Update a class by ID
export const updateClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

// Controller: Delete a class by ID
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};
