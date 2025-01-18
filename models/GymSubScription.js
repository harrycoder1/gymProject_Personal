import mongoose from 'mongoose';

const GymSubscriptionSchema = new mongoose.Schema({
  gym_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'gym', 
    required: true 
  },
  subscription_plan_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'subscriptionPlan', 
    required: true 
  },
  start_date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  end_date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Expired', 'Suspended'], 
    default: 'Active' 
  },
//   is_auto_renew: { 
//     type: Boolean, 
//     default: true 
//   },
  coupon_code: { 
    type: String, 
    default: null 
  },
  payment_details: {
    method: { 
      type: String, 
      enum: ['Card', 'Cash', 'Online'], 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    } , 
    transaction_id :{
        type :String , 
        required:true
    }
  }
}, { timestamps: true });

// Indexing for gym_id and subscription_plan_id for quick access
GymSubscriptionSchema.index({ gym_id: 1, subscription_plan_id: 1 });

export const GymSubscription = mongoose.model('gymSubscription', GymSubscriptionSchema);
