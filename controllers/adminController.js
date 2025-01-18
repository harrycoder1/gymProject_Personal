import bcrypt from "bcryptjs";
import Admin from "../models/AdminSchema.js";
import { responseSender } from "../utils/index.js"; // Utility function for standardized responses
import jwt from 'jsonwebtoken'
import { generateAdminToken } from "../utils/adminHelper.js";
import { ERROR_MSG } from "../content/index.js";
import { sendEmail } from "../utils/emailSender.js";
import crypto from 'crypto'
const generateToken = () => crypto.randomBytes(32).toString("hex");
export const getAlladmins =async (req, res)=>{
  
  try {
    const data = await Admin.find({})
  responseSender("Admins Fetch SuccessFully !" , true , 200 , res , {data:data})
  } catch (error) {
    responseSender(ERROR_MSG , false , 400 , res )
  }

}

// Admin Registration with Email Verification
export const registerAdmin = async (req, res) => {
  const { name, email, role, access, password , accessTill } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newAdmin = new Admin({
      name,
      email,
      role,
      access,
      password: hashedPassword,
      
      emailVerificationExpires,
      accessTill,
      emailVerificationToken,

    });

    await newAdmin.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
    const subject = "Email Verification for Admin Account";
    const text = `Please verify your email by clicking the following link: ${verificationUrl}`;
    const html = `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`;

    await sendEmail(email, subject, text, html);

    res.status(201).json({ message: "Admin registered successfully! Verify your email to activate your account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    const resetToken = generateToken();
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    admin.resetToken = resetToken;
    admin.resetTokenExpires = resetTokenExpires;
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const text = `Reset your password using the following link: ${resetUrl}`;
    const html = `<p>Reset your password by clicking the link below:</p><a href="${resetUrl}">${resetUrl}</a>`;

    await sendEmail(email, subject, text, html);

    res.status(200).json({ message: "Password reset link sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};


// Admin Email Verification
export const verifyAdminEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if(!token){
      return responseSender('Invalid Token !' , false , 400 , res)
    }
    const admin = await Admin.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired verification token." });
    }

    admin.emailVerified = true;
    admin.emailVerificationToken = null;
    admin.emailVerificationExpires = null;

    await admin.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetToken = null;
    admin.resetTokenExpires = null;

    await admin.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR_MSG, error });
  }
};


// Add a new admin
export const addAdmin = async (req, res) => {
  const { name, email, role, access, password, accessTill } = req.body;

  try {
    // Check if the admin email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return responseSender("Admin with this email already exists!", false, 400, res);
    }
    if(!password) {
      return responseSender("Pass not be empty!", false, 400, res);
    }
    // Hash the password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      role,
      access,
      password: hashedPassword,
      accessTill: role === "temp-admin" ? accessTill : undefined,
    });

    // Save the admin to the database
    await newAdmin.save();
     
    const token =  generateAdminToken(newAdmin)

    responseSender("Admin created successfully!", true, 201, res, {token:token });
  } catch (error) {
    console.error("Error adding admin:", error);
    responseSender("An error occurred while adding the admin.", false, 500, res);
  }
};

// Update an existing admin
export const updateAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { name, email, role, access, password, accessTill } = req.body;

  try {
    // Find the admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return responseSender("Admin not found!", false, 404, res);
    }

    // Update fields if provided
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (access) admin.access = access;
    if (password) admin.password = await bcrypt.hash(password, 10); // Hash the new password
    if (role === "temp-admin" && accessTill) admin.accessTill = accessTill;

    // Save the updated admin
    await admin.save();

    const token = generateAdminToken(admin)

    responseSender("Admin updated successfully!", true, 200, res, { token:token });
  } catch (error) {
    console.error("Error updating admin:", error);
    responseSender("An error occurred while updating the admin.", false, 500, res);
  }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Find and delete the admin by ID
    const admin = await Admin.findByIdAndDelete(adminId);

    if (!admin) {
      return responseSender("Admin not found!", false, 404, res);
    }
    // if(admin.role !== "admin"){
    //     return responseSender("You Don't have Write to Delete Other , Because You are temperatory Admin " , false , 400 , res)
    // }

    responseSender("Admin deleted successfully!", true, 200, res);
  } catch (error) {
    console.error("Error deleting admin:", error);
    responseSender("An error occurred while deleting the admin.", false, 500, res);
  }
};



// login admin :
// Admin Login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email :email });
      if (!admin) {
        return responseSender("Invalid email or password!", false, 400, res);
      }
      console.log(admin)
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return responseSender("Invalid email or password!", false, 400, res);
      }
  
      // Check if temp-admin's access is expired
      if (admin.role === "temp-admin" && new Date() > new Date(admin.accessTill)) {
        return responseSender("Your temporary access has expired!", false, 403, res);
      }
  
      // Generate a JWT token
      const token = generateAdminToken(admin);
  
      responseSender("Login successful!", true, 200, res, { token });
    } catch (error) {
      console.error("Login error:", error);
      responseSender("An error occurred during login.", false, 500, res );
    }
  };






  