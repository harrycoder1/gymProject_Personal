import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'gym',
      required: [true, 'Gym ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Membership type is required'],
      trim: true, // Ensures no leading/trailing spaces
      enum: {
        values: ['Basic', 'Premium', 'VIP'],
        message: '{VALUE} is not a valid membership type', // Only allow specific types
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 month'], // Ensure duration is at least 1
      max: [36, 'Duration cannot exceed 36 months'], // Limit duration
    },
    fee: {
      type: mongoose.Types.Decimal128,
      required: [true, 'Membership fee is required'],
      min: [0, 'Fee cannot be negative'], // Ensure fee is non-negative
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: 'Status must be either Active or Inactive',
      },
      default: 'Active', // Default status is Active
    },
    created_at: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
    updated_at: {
      type: Date,
      default: Date.now, // Automatically set the update date
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Indexing for faster lookups by gym_id and type
MembershipSchema.index({ gym_id: 1, type: 1 });

// Optional validation for fee (ensure decimal128 type is correctly stored and fetched)
MembershipSchema.path('fee').validate({
  validator(value) {
    return !isNaN(value) && value > 0;
  },
  message: 'Fee must be a valid positive number',
});

export const Membership =
  mongoose.models.membership || mongoose.model('membership', MembershipSchema);

