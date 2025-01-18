import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },
  membership_id: { type: mongoose.Schema.Types.ObjectId, ref: "membership", required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'class', required: true },
  enrollment_date: { type: Date, default: Date.now },
  enrollmentExpireDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

// Middleware to check and update `isActive` based on `enrollmentExpireDate`
EnrollmentSchema.pre('save', function (next) {
  const currentDate = new Date();

  // Automatically set isActive to false if enrollmentExpireDate is in the past
  if (this.enrollmentExpireDate < currentDate) {
    this.isActive = false;
  }
  next();
});

// Middleware to ensure `isActive` is updated on every update
EnrollmentSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const currentDate = new Date();

  if (update.enrollmentExpireDate && update.enrollmentExpireDate < currentDate) {
    update.isActive = false;
  }
  next();
});

export const Enrollment = mongoose.models.enrollment || mongoose.model('enrollment', EnrollmentSchema);
