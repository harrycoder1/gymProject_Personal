import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  join_date: { type: Date, default: Date.now },
  profileImg: { type: String, default: "" },

  gender: { type: String, enum: ['male', 'female'] },
  date_of_birth: { type: Date, default: "" },
  contact_number: { type: String, default: "" },
  address: { type: String, default: "" },

  gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'gym', default: null },
  
  enrollment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'enrollment', default: null },
  enrollmentExpiresAt: { type: Date, default: null }, // New field for enrollment expiration
  password: { type: String, default: "" },

  // New Fields for Verification and Password Reset
  isVerified: { type: Boolean, default: false }, // For email verification
  otp: { type: String, default: null }, // OTP for email verification
  otpExpiresAt: { type: Date, default: null }, // OTP expiry time

  resetToken: { type: String, default: null }, // Token for password reset
  resetTokenExpiresAt: { type: Date, default: null }, // Token expiry time for password reset
});

// Middleware to handle enrollment expiration
MemberSchema.pre('save', function (next) {
  if (this.enrollment_id && !this.enrollmentExpiresAt) {
    // Set the expiration date to 30 days from now
    this.enrollmentExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Static method to find and handle expired enrollments
MemberSchema.statics.expireEnrollments = async function () {
  const now = new Date();
  await this.updateMany(
    { enrollmentExpiresAt: { $lt: now } },
    { $set: { enrollment_id: null, enrollmentExpiresAt: null } }
  );
};

const Member = mongoose.models.member || mongoose.model('member', MemberSchema);

export default Member;
