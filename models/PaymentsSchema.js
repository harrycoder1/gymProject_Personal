import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },
  amount: { 
    type: mongoose.Types.Decimal128, 
    required: true, 
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: 'Amount must be greater than zero.'
    }
  },
  transaction_id: { 
    type: String, 
    unique: true, 
    default: null,
    validate: {
      validator: function (value) {
        // If payment_method is not 'Cash', transaction_id must be provided
        if (this.payment_method !== 'Cash' && !value) {
          return false;
        }
        return true;
      },
      message: 'Transaction ID is required for non-cash payments.'
    }
  },
  isSuccess: { type: Boolean, default: false },
  verificationStatus: { type: Boolean, default: false },
  verifyDate: { type: Date },
  verifyBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  payment_date: { type: Date, default: Date.now },
  payment_method: { 
    type: String, 
    enum: ['Card', 'Cash', 'Online', 'UPI'], 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'gym', 
    required: true 
  }
});

export const Payment = mongoose.models.payment || mongoose.model('payment', PaymentSchema);
