// import User from "../models/User.js";
import { ERROR_MSG } from "../content/index.js";
import User from "../models/UserSchema.js";
import { sendEmail } from "../utils/emailSender.js";
import { responseSender } from "../utils/index.js";
import bcrypt from 'bcryptjs'
import crypto from "crypto"; 
import { generateUserToken } from "../utils/userHelper.js";
const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP


// get All Users :
const getAllUsers = async(req,res)=>{
// accessible for Admins only
  try {
    const excludeFields = ["password", "otp", "resetToken", "otpExpiresAt", "resetTokenExpiresAt"];
const data = await User.find({}).select(excludeFields.map(field => `-${field}`).join(" "));
    
  

    responseSender("All User Fetch Successfully" , true , 200 , res , {data})


  } catch (error) {

    responseSender(ERROR_MSG , false , 500 , res , error )
  }

}


// get userProfile :
const getUserProfile = async(req,res)=>{
  try{
 const userId =   req.body.userId

 const excludeFields = ["password", "otp", "resetToken", "otpExpiresAt", "resetTokenExpiresAt"];
const user = await User.findById(userId).select(excludeFields.map(field => `-${field}`).join(" "));

// const user = await User.findById(userId).select("-password")
if(!user){
  return responseSender("User Not Founf" , false , 404 , res)
}

responseSender("User Proifle Fetch SuccessFully !" , true , 200 , res , {user})

}
catch(error){

  responseSender(ERROR_MSG , false , 500 , res)

}


}

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseSender(
        "User with this email already exists",
        false,
        400,
        res
      );
    }

    // password hashing :
    const salt =await bcrypt.genSalt(10)
    const hashPass =await bcrypt.hash(password , salt)
    // Save user to DB
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    const newUser = new User({
      name,
      email,
   
      phone,
      otp,
      otpExpiresAt,
      password:hashPass
    });
    
    // console.log(process.env.SMTP_USER , process.env.SMTP_PASS)

    await newUser.save();

    // Send OTP via email
    const subject = "Your OTP for Verification";
    const text = `Your OTP is ${otp}. It is valid for 10 minutes.`;
    const html = `<p>Your OTP is <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`;

    await sendEmail(email, subject, text, html);

    responseSender("User registered successfully. Verify OTP sent to email!", true, 201, res);
  } catch (error) {
    responseSender("Error registering user", false, 500, res, error);
  }
};



// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return responseSender("User not found", false, 404, res);
    }

    // Check OTP and expiration
    if (user.otp !== parseInt(otp) || user.otpExpiresAt < new Date()) {
      return responseSender("Invalid or expired OTP", false, 400, res);
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    responseSender("User verified successfully!", true, 200, res);
  } catch (error) {
    responseSender("Error verifying OTP", false, 500, res, error);
  }
};



// Forword Password :


// Generate a random token
const generateResetToken = () => crypto.randomBytes(32).toString("hex");

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return responseSender("User not found", false, 404, res);
    }

    // Generate reset token and expiration
    const resetToken = generateResetToken();
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`;
    const html = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>The link is valid for 15 minutes.</p>
    `;

    await sendEmail(email, subject, text, html);

    responseSender("Password reset email sent successfully!", true, 200, res);
  } catch (error) {
    responseSender("Error initiating password reset", false, 500, res, error);
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() }, // Token must not be expired
    });

    if (!user) {
      return responseSender("Invalid or expired reset token", false, 400, res);
    }

    // hash the reset password :
    const salt = await bcrypt.genSalt(10)
    const hasPass  = await bcrypt.hash(newPassword , salt)

    // Update password and clear reset token
    user.password = hasPass; // Ensure password is hashed in the User model middleware
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    responseSender("Password reset successfully!", true, 200, res);
  } catch (error) {
    responseSender("Error resetting password", false, 500, res, error);
  }
};


// login User :
const userLogin =async(req,res)=>{

try  {const {email , password} = req.body 

const user = await User.findOne({email:email})

if(!user){
  return responseSender("User Not Found !" , false , 404 , res , {user} )
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return responseSender("Invalid email or password", false, 401, res);
}

const token = generateUserToken(user)

responseSender('user Login SuccessFully !' , true  , 200 , res , {token: token})

}catch(error){
  responseSender(ERROR_MSG , false , 500 , res )
}

}

export { registerUser, verifyOTP, forgotPassword, resetPassword ,getAllUsers ,getUserProfile  ,userLogin};



// export { registerUser, verifyOTP };
