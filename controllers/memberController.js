import Member from "../models/MembersSchema.js";
import { sendEmail } from "../utils/emailSender.js";
import { responseSender } from "../utils/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ERROR_MSG } from "../content/index.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
const generateResetToken = () => crypto.randomBytes(32).toString("hex");

// Helper function to generate JWT token
const generateUserToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register a new member with OTP verification
 const registerMember = async (req, res) => {
  try {
    const { name, gender, email, password, contact_number, address, date_of_birth } = req.body;

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return responseSender("Member with this email already exists", false, 400, res);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    const newMember = new Member({
      name,
      gender,
      email,
      contact_number,
      address,
      date_of_birth,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    await newMember.save();

    const subject = "Your OTP for Verification";
    const text = `Your OTP is ${otp}. It is valid for 10 minutes.`;
    const html = `<p>Your OTP is <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`;

    await sendEmail(email, subject, text, html);

    responseSender("Member registered successfully. Verify OTP sent to email!", true, 201, res);
  } catch (error) {
    responseSender(ERROR_MSG, false, 500, res, error);
  }
};

// Verify OTP for account activation
 const verifyMemberOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;


    const member = await Member.findOne({ email:email });
    if (!member) {
      return responseSender("Member not found", false, 404, res);
    }
    // console.log(member)
    // console.log(member.otp , member.email)
    if (parseInt(member.otp) !== parseInt(otp) || member.otpExpiresAt < new Date()) {
      return responseSender("Invalid or expired OTP", false, 400, res);
    }

    member.isVerified = true;
    member.otp = null;
    member.otpExpiresAt = null;
    await member.save();

    responseSender("Member verified successfully!", true, 200, res);
  } catch (error) {
    responseSender(ERROR_MSG, false, 500, res, error);
  }
};

// Forgot password (request reset token)
 const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return responseSender("Member not found", false, 404, res);
    }

    const resetToken = generateResetToken();
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

    member.resetToken = resetToken;
    member.resetTokenExpiresAt = resetTokenExpiresAt;
    await member.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`;
    const html = `<p>You requested a password reset.</p><p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>The link is valid for 15 minutes.</p>`;

    await sendEmail(email, subject, text, html);

    responseSender("Password reset email sent successfully!", true, 200, res);
  } catch (error) {
    responseSender(ERROR_MSG, false, 500, res, error);
  }
};

// Reset password
 const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const member = await Member.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() }, // Token must not be expired
    });

    if (!member) {
      return responseSender("Invalid or expired reset token", false, 400, res);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    member.password = hashedPassword;
    member.resetToken = null;
    member.resetTokenExpiresAt = null;
    await member.save();

    responseSender("Password reset successfully!", true, 200, res);
  } catch (error) {
    responseSender(ERROR_MSG, false, 500, res, error);
  }
};

// Member login
 const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return responseSender("Member not found", false, 404, res);
    }

    const isPasswordMatch = await bcrypt.compare(password, member.password);
    if (!isPasswordMatch) {
      return responseSender("Invalid email or password", false, 401, res);
    }

    const token = generateUserToken({ id: member._id, email: member.email });

    responseSender("Member login successful!", true, 200, res, { token });
  } catch (error) {
    responseSender(ERROR_MSG, false, 500, res, error);
  }
};


// Update member data
 const updateMemberData = async (req, res) => {
    const { id } = req.user; // `id` extracted from the authenticated token
    const {gender,
       
        contact_number,
        address,
        date_of_birth,} = req.body;
  //   gender,
  //   email,
  //   contact_number,
  //   address,
  //   date_of_birth,
    try {
      const updatedMember = await Member.findByIdAndUpdate(id, {gender,
          
          contact_number,
          address,
          date_of_birth }, { new: true });
  
      if (!updatedMember) {
        return   responseSender('Member not found' , false , 400 , res )
      }
  
     return responseSender('Member Profile Updated SuccessFully !' , true , 201 , res  , {data:updatedMember})
    } catch (error) {
      return  responseSender(ERROR_MSG , false , 500 , res , {error:error} )
    }
  };
  
export { registerMember, verifyMemberOTP, updateMemberData, forgotPassword, resetPassword, loginMember };
