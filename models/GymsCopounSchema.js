import mongoose from 'mongoose';

const CouponCodeSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  discount_percentage: { 
    type: Number, 
    required: true, 
    min: 1, // Minimum discount of 1%
    max: 100 // Maximum discount of 100%
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  valid_from: { 
    type: Date, 
    required: true 
  },
  valid_until: { 
    type: Date, 
    required: true 
  },
  is_all_eligible_gyms :{
    type:Boolean ,  default:false , 
  } ,

  eligible_gym_ids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'gym' 
  }],
  eligible_plan_ids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'subscriptionPlan' 
  }],
  max_usage: { 
    type: Number, 
    default: 1, 
    min: 1 
  },
  used_count: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Expired', 'Disabled'], 
    default: 'Active' 
  }
}, { timestamps: true });

// Indexing for code and status to quickly lookup active coupons
CouponCodeSchema.index({ code: 1, status: 1 });

 const CouponCode = mongoose.models.couponCode || mongoose.model('couponCode', CouponCodeSchema);
export default CouponCode