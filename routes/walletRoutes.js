import express from "express";
import { getWalletDetails } from "../controllers/walletController.js";

const walletRouter = express.Router();

walletRouter.get("/:ownerId/:ownerType", getWalletDetails);

export default walletRouter;
