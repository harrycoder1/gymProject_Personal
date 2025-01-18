import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Unique coupon code
  description: { type: String }, // Optional description
  discount_percentage: { type: Number, required: true, min: 1, max: 100 }, // Discount percentage
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'gym', required: true }, // Gym that created the coupon
  valid_from: { type: Date, required: true }, // Start date of validity
  valid_until: { 
    type: Date, 
    required: true,
    validate: {
      validator: function (value) {
        return value > this.valid_from;
      },
      message: 'valid_until must be greater than valid_from',
    },
  }, 
  is_active: { type: Boolean, default: true }, // Whether the coupon is active
}, { timestamps: true }); // Adds created_at and updated_at

export const Coupon = mongoose.model('coupon', CouponSchema);
