

import { Trainer } from "../models/TrainerSchema.js";
import {responseSender} from '../utils/index.js'
import {sendEmail} from '../utils/emailSender.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import crypto from 'crypto'
import { ERROR_MSG } from "../content/index.js";
// Create a new trainer
const hidls= ["-isVerifiedByGym","password" , "isEmailVerified","emailVerificationToken" ,"resetPasswordToken" ,"resetPasswordTokenExpires"]

export const createTrainer = async (req, res) => {


  try {
    const {first_name , last_name ,password, specialization ,contact_number , email ,experience ,certifications ,hourly_rate ,social_media_links} =req.body

    const isExists = await Trainer.findOne({contact_number:contact_number , email:email})
    
    if(isExists){
      return responseSender("This email id or MobileNumber Already Registerd with our website !" , false , 404 , res )
    }
    const salt = await bcrypt.genSalt(10)
    const hashPass =await bcrypt.hash(password , salt)

    // const gymId = req.body.gymId
    const trainer = new Trainer({first_name , last_name  , specialization ,contact_number , email ,experience ,certifications ,hourly_rate ,social_media_links   , password:hashPass } );
    // await trainer.save();


    // Generate a token
    const token = crypto.randomBytes(32).toString("hex");
    trainer.emailVerificationToken = token;
    await trainer.save();

    // Send verification email
    const verificationUrl = `http://localhost:8080/verify-email/${token}`;
    await sendEmail(
      email,
      "Verify Your Email","" , 
      `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
    );

     return responseSender( "Verification email sent successfully! , verify Your Mail to active your account !" , true , 201 , res);
  



    
  } catch (error) {
    console.log(error)
   return res.status(400).json({ success: false, message: error.message  });
  }
};





// Handle email verification : it will help to verify the mail 
export const handleEmailVerification = async (req, res) => {


  try {
    const { token } = req.query;
    const trainer = await Trainer.findOne({ emailVerificationToken: token });
    if (!trainer) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    trainer.isEmailVerified = true;
    trainer.emailVerificationToken = null;
    await trainer.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
   return  res.status(500).json({ message: "Failed to verify email" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found!" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    trainer.resetPasswordToken = resetToken;
    trainer.resetPasswordTokenExpires = Date.now() + 3600000; // Token valid for 1 hour
    await trainer.save();
   
  

    // Send reset password email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Reset Your Password","" , 
      `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

   return res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error(error);
  return  res.status(500).json({ message: "Failed to send reset password email" });
  }
};

// send the request to Confirm :
// send the request to join in gym as trainer
export const senRequestToJoinGym = async(req,res)=>{

  try {
  const trainerId = req.trainerId
  const {gymId} = req.body
  
  const check = await Trainer.findById(trainerId)
  if(!check){
    return responseSender("Trainer not Found !" , false, 404 , res)
  }
  
  const gymVfy = await Trainer.findById(gymId)

  console.log(gymVfy)

  check.gymId = gymId 
  await check.save()  

return responseSender("You have send the  request to the Gym SuccessFully "  , true , 201 , res) 
  } catch (error) {
    console.log(error)
    return responseSender(ERROR_MSG , false , 400 , res )
  }

}


// Reset Password Route : 
export const resetPassword = async (req, res) => {
  // const {  } = req.params;
  const {token ,  newPassword } = req.body;

  try {
    const trainer = await Trainer.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }, // Check token expiry
    });

    if (!trainer) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    trainer.password = hashedPassword;
    trainer.resetPasswordToken = null;
    trainer.resetPasswordTokenExpires = null;
    await trainer.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};


// Get a trainer by ID
export const getTrainerById = async (req, res) => {
    const gymId =  req.body.gymId
  try {
    
    const trainer = await Trainer.find({gymId:gymId}).select(hidls.join(" -") );

 return   responseSender("Trainer by id fetch SuccessFully !" , true  , 200 , res , {data:trainer}) 
  } catch (error) {
  return  responseSender(error.message, false , 400 , res)
  }
};

// login Trainer :

export const loginTrainer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the trainer exists by email
    const trainer = await Trainer.findOne({ email });
    
    if (!trainer) {
      return responseSender('Trainer not found!', false, 400, res);
    }

    // Check if the trainer is verified
    if (!trainer.isEmailVerified) {
      return responseSender('Trainer email is not verified!', false, 400, res);
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, trainer.password);
    
    if (!isMatch) {
      return responseSender('Invalid password!', false, 401, res);
    }

    // Generate a JWT token with trainer's id and gymId as payload
    const token = jwt.sign(
      { trainerId: trainer._id, gymId: trainer.gymId }, // Payload with trainer's _id and gymId
      process.env.JWT_SECRET, // Secret key for JWT
      { expiresIn: '48h' } // Expiration time for the token
    );

    // Return success response with token and trainer data
    return responseSender('Login successful!', true, 200, res, {
      token,
      trainer: {
        first_name: trainer.first_name,
        last_name: trainer.last_name,
        specialization: trainer.specialization,
        contact_number: trainer.contact_number,
        email: trainer.email,
        gymId: trainer.gymId,
        isActive: trainer.isActive,
        rating: trainer.rating,
      }
    });
  } catch (error) {
    console.error(error);
    return responseSender(ERROR_MSG, false, 500, res);
  }
};

// Update a trainer
export const updateTrainer = async (req, res) => {

  

  try {
    const trainerId = req.trainerId
    // console.log(req.trainerId )
    const trainer = await Trainer.findByIdAndUpdate(trainerId ,  req.body, {
      new: true,
      runValidators: true,
    });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.status(200).json({ success: true, message: 'Trainer updated successfully', trainer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a trainer
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.status(200).json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// List all trainers
export const listAllTrainers = async (req, res) => {
  try {
 
    const trainers = await Trainer.find().select(hidls.join(" -")).populate('gymId' , "gymName gLocation profileImage" );
   return res.status(200).json({ success: true, trainers });
  } catch (error) {
   return res.status(400).json({ success: false, message: error.message });
  }
};

// Verify a trainer
export const verifyTrainer = async (req, res) => {
  try {

    const check = await Trainer.findOne({_id :req.params.id})
    if(check.isVerifiedByGym){
      return responseSender("Your Account Already Verified By Gym" , false  ,404 , res )

    }
    if(!check){
     return responseSender("This Trainer Not found in DB" , false  ,404 , res )
    }
    if(!check.profile_picture ) 
      return  responseSender("Add Your Profile Photo First!" , false  ,400 , res )
    if(!check.isEmailVerified)
      return responseSender("Verify your Email Address First !" , false , 400 , res)

    const trainer = await Trainer.updateOne(
      req.params.id,
      { isVerifiedByGym: true },
      { new: true }
    );
 
   return res.status(200).json({ success: true, message: 'Trainer verified successfully', trainer });
  } catch (error) {
   return res.status(400).json({ success: false, message: error.message });
  }
};
