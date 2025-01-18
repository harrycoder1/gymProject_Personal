import mongoose from 'mongoose';

// mongoose.set('strictPopulate', false);
const TrainerSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true }, // Specialized area
    contact_number: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^\d{10}$/, 'Invalid contact number format'], // Validates phone number format
    },
    password:{
      type:String ,
      required:true
    } ,
    email: { 
      type: String, 
      unique: true, 
      required: true, 
      match: [/.+\@.+\..+/, 'Invalid email format'], // Validates email format
    },
    gymId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'gym', 
      default:null
      
    },
    

    experience: { 
      type: Number, 
      default: 0, 
      min: [0, 'Experience cannot be negative'], // Minimum 0 years
    }, // Years of experience
    certifications: { 
      type: [
        {title:String , imgUrl:String}
      ], 
      default: [], 
    }, // List of certifications
    isActive: { 
      type: Boolean, 
      default: true, 
    }, // Trainer's active status

 isVerifiedByGym:{type:Boolean , default:false} ,  // it will verified by the gym which gymId inserted by the trainer
    profile_picture: { 
      type: String, 
      default: null, 
    }, // URL for profile picture
    hourly_rate: { 
      type: mongoose.Types.Decimal128, 
      default: 0.0, 
    }, // Trainer's hourly rate
    rating: { 
      type: Number, 
      min: [0, 'Rating cannot be less than 0'], 
      max: [5, 'Rating cannot exceed 5'], 
      default: 0, 
    }, // Rating out of 5
    social_media_links: { 
      type: Map, 
      of: String, 
      default: {}, 
    }, // Social media links (e.g., Instagram, LinkedIn, etc.)

    
    isEmailVerified: { type: Boolean, default: false }, // Email verification status
    emailVerificationToken: { type: String, default: null }, // Token for email verification
    resetPasswordToken: { type: String, default: null }, // Token for password reset
    resetPasswordTokenExpires: { type: Date, default: null }, // Expiry time for reset token
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Trainer =
  mongoose.models.trainer || mongoose.model('trainer', TrainerSchema);
