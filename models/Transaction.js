import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }, // Member's wallet
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }, // Gym's wallet
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["upi"], required: true }, // For now, UPI is supported
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    description: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
