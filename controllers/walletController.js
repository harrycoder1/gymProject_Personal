import { Wallet } from "../models/Wallet.js";
import { Transaction } from "../models/Transaction.js";

export const getWalletDetails = async (req, res) => {
  const { ownerId, ownerType } = req.params;

  try {
    const wallet = await Wallet.findOne({ ownerId, ownerType });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactions = await Transaction.find({
      $or: [{ senderId: wallet._id }, { receiverId: wallet._id }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ wallet, transactions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
