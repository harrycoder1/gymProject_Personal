import { Wallet } from "../models/Wallet.js";
import { Transaction } from "../models/Transaction.js";
import { processUPIPayment } from "../services/upiService.js";

export const payForMembership = async (req, res) => {
  const { memberId, gymId, amount, upiId } = req.body;

  try {
    // Fetch member and gym wallets
    const memberWallet = await Wallet.findOne({ ownerId: memberId, ownerType: "member" });
    const gymWallet = await Wallet.findOne({ ownerId: gymId, ownerType: "gym" });

    if (!memberWallet || !gymWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Process UPI payment
    const upiResponse = await processUPIPayment(upiId, amount);

    if (upiResponse.status !== "success") {
      throw new Error("UPI payment failed");
    }

    // Create a new transaction
    const transaction = await Transaction.create({
      transactionId: upiResponse.transactionId,
      senderId: memberWallet._id,
      receiverId: gymWallet._id,
      amount,
      paymentMethod: "upi",
      status: "completed",
      description: "Gym Membership Payment",
    });

    // Update balances
    gymWallet.balance += amount;
    await gymWallet.save();

    return res.status(200).json({ message: "Transaction successful", transaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
