import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Plan description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,
      required: [true, 'Plan duration is required'],
      min: [1, 'Duration must be at least 1 month'],
      max: [36, 'Duration cannot exceed 36 months'],
    },
    features: {
      type: [String], //it add the tools and extra features
      required: [true, 'Features are required'],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: 'Status must be either Active or Inactive',
      },
      default: 'Active',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    // New Fields
    discount: {
      type: Number, // Percentage discount (e.g., 10 for 10%)
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    trial_period: {
      type: Number, // Trial duration in days
      min: [0, 'Trial period cannot be negative'],
      default: 0,
    },
  
    is_featured: {
      type: Boolean, // Highlight the plan for marketing purposes
      default: false,
    },
    category: {
      type: String, // Categorize the subscription (e.g., "Basic", "Premium")
      enum: {
        values: ['Basic', 'Premium'],
        message: 'Category must be one of Basic, Premium, Enterprise, or Custom',
      },
      default: 'Basic',
    },
    image_url: {
      type: String, // URL to an image/icon for the subscription plan
      trim: true,
      default: null,
    },
    max_users: {
      type: Number, // Maximum number of users allowed for this plan
      min: [1, 'At least one user must be allowed'],
      default: 1,
    },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'admin'  } , 
    lastUpdatedDate : {
      type:Date  , default:Date.now
    }

  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Compound index for name and status to speed up queries
SubscriptionPlanSchema.index({ name: 1, status: 1 });

// Ensure name is case-insensitive for uniqueness
SubscriptionPlanSchema.path('name').validate({
  validator: async function (value) {
    const count = await mongoose.models.subscriptionPlan.countDocuments({
      name: { $regex: new RegExp(`^${value}$`, 'i') }, // Case-insensitive check
    });
    return count === 0;
  },
  message: 'Plan name must be unique',
});

export const SubscriptionPlan =
  mongoose.models.subscriptionPlan ||
  mongoose.model('subscriptionPlan', SubscriptionPlanSchema);
