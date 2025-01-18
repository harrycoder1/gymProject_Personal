import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Gym ID or Member ID
    ownerType: { type: String, enum: ["gym", "member"], required: true }, // Specify wallet owner
    balance: { type: Number, default: 0 }, // Wallet balance
    locked: { type: Boolean, default: false }, // Prevent concurrent modifications
  },
  { timestamps: true }
);

walletSchema.index({ ownerId: 1, ownerType: 1 });

export const Wallet = mongoose.model("Wallet", walletSchema);
