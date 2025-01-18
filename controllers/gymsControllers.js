import Gym from "../models/GymSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/emailSender.js";
import { responseSender } from "../utils/index.js";
import { ERROR_MSG } from "../content/index.js";
import { GymLicenceIDVerification, pandCardVefication } from "../utils/gymhelper.js";

// Helper Functions
// : { type: String, default: null },
// : { type: Date, default: null },
// : { type: String, default: null },
// : { type: Date, default: null },

const hidefilterlist = ["emailVerificationToken" ,"emailVerificationExpires" ,"resetToken" , "resetTokenExpires" , "password"]
const generateToken = () => crypto.randomBytes(32).toString("hex");

// Register Gym with Email Verification
const registerGym = async (req, res) => {
  const {
    gymName,
    gLocation,
    ownerName,
    ownerEmail,
    panCard,
    address,
    shopLicenseID,
    gymImages , 
    profileImage , 
    
    contact_number,
    socialContacts,
    password,
  } = req.body;

  try {
    const existingGym = await Gym.findOne({ ownerEmail });
    if (existingGym) {
      return res.status(400).json({ message: "Gym with this email already exists!" });
    }

    const verifyPan = pandCardVefication(panCard);
    if (!verifyPan) {
      return res.status(400).json({ message: "Invalid Pan Card!" });
    }

    const verifyLicence = GymLicenceIDVerification(shopLicenseID);
    if (!verifyLicence) {
      return res.status(400).json({ message: "Invalid License ID!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newGym = new Gym({
      gymName,
      gLocation,
      ownerName,
      ownerEmail,
      panCard,
      address,
      contact_number,
      socialContacts,
      password: hashedPassword,
      shopLicenceID: shopLicenseID,
      gymImages , 
      profileImage , 
      ownerPanVerification: true,
      shopLicenceIDVerification: true,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await newGym.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
    const subject = "Email Verification for Gym Account";
    const text = `Please verify your email by clicking the following link: ${verificationUrl}`;
    const html = `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`;

    await sendEmail(ownerEmail, subject, text, html);

    res.status(201).json({ message: "Gym registered successfully! Verify your email to activate your account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const gym = await Gym.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!gym) {
      return res.status(400).json({ message: "Invalid or expired verification token." });
    }

    gym.emailVerified = true;
    gym.emailVerificationToken = null;
    gym.emailVerificationExpires = null;

    await gym.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { ownerEmail } = req.body;

  try {
    const gym = await Gym.findOne({ ownerEmail });
    if (!gym) {
      return res.status(404).json({ message: "Gym not found!" });
    }

    const resetToken = generateToken();
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    gym.resetToken = resetToken;
    gym.resetTokenExpires = resetTokenExpires;
    await gym.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const text = `Reset your password using the following link: ${resetUrl}`;
    const html = `<p>Reset your password by clicking the link below:</p><a href="${resetUrl}">${resetUrl}</a>`;

    await sendEmail(ownerEmail, subject, text, html);

    res.status(200).json({ message: "Password reset link sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const gym = await Gym.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!gym) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    gym.password = await bcrypt.hash(newPassword, 10);
    gym.resetToken = null;
    gym.resetTokenExpires = null;

    await gym.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};






// get profile :
const getGymProfile =async(req,res)=>{
  try {
    const gymId = req.body.gymId 

    const data = await  Gym.findById(gymId).select(hidefilterlist.map(fields => `-${fields}`).join(" "))

    responseSender("Gyms Profile Fetch SucessFully !" , true , 200 , res , data['_doc'])
  } catch (error) {
    responseSender(ERROR_MSG , false , 400 , res ,error )
    
  }
}

// getAll path
const getAllGyms = async(req,res)=>{
  try {
    
    const data = await  Gym.find({}).select(hidefilterlist.map(fields => `-${fields}`).join(" "))
    responseSender("All Gyms Fetch SucessFully !" , true , 200 , res , {data :data})
  } catch (error) {
    responseSender(ERROR_MSG , false , 400 , res ,error )
    
  }
  
  } 


const loginGym = async (req, res) => {
  const { ownerEmail, password } = req.body;

  try {
    // Find gym by email
    const gym = await Gym.findOne({ ownerEmail });
    if (!gym) {
      return res.status(400).json({ message: "This email ID is not registered!" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, gym.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { gymId: gym._id, gymName: gym.gymName }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "60h" } // Expiration
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      gym: {
        gymName: gym.gymName,
        ownerName: gym.ownerName,
        gLocation: gym.gLocation,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    // return res.status(500).json({ message: ERROR_MSG  ,error});
    return responseSender(ERROR_MSG)
  }
};



const updateGym = async (req, res) => {
  const { gymId } = req.body; // Gym ID from request parameters
  const updates = req.body; // Updates from request body

  try {
    // Find the gym by ID
    // console.log(gymId)
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found!" });
    }



    // Prevent updating immutable fields
    const immutableFields = ["_id", "ownerEmail", "creationTime" , 'password' ];
    immutableFields.forEach(field => {
      if (updates[field]) {
        delete updates[field];
      }
    });

    // Update the gym document
    const updatedGym = await Gym.findByIdAndUpdate(gymId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Gym updated successfully!",
      updatedGym,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to update gym details!",
    });
  }
};

// Now make for delete Gyms : 




export { registerGym, verifyEmail, forgotPassword, resetPassword, getGymProfile, getAllGyms, loginGym, updateGym };
