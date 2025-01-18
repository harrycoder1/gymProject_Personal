import mongoose from 'mongoose';

const GymSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  gLocation: { type: String, required: true },
  panCard: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true, unique: true },
  ownerPanVerification: { type: Boolean, default: false },
  address: { type: String, required: true },
  password: { type: String, required: true },
  shopLicenceID: { type: String, required: true },
  shopLicenceIDVerification: { type: Boolean, default: false },
  gymImages: { type: Array, default: [] },
  profileImage: { type: String },
  creationTime: { type: Date, default: Date.now },
  contact_number: { type: Array }, // Format: [{"name": "xyz", "position": "xyz", "no": 232143}]
  socialContacts: { type: Array, default: [] }, // Format: [{"type": "facebook", "link": "xyz"}]
  subscription_plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'gymSubscription',
    default: null,
  },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
});

const Gym = mongoose.models.gym || mongoose.model('gym', GymSchema);

export default Gym;
