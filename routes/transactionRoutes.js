import express from "express";
import { payForMembership } from "../controllers/transactionController.js";

const transactionRouter = express.Router();

transactionRouter.post("/pay", payForMembership);

export default transactionRouter;
