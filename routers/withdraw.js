import express from "express";
import axios from "axios";
import paystack from "../libs/paystack.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import {
  getAllBanks,
  searchBanks,
  createRecipient,
  withdraw,
} from "../controllers/withdraw.js";

const withdrawRouter = express.Router();

withdrawRouter.get("/banks", getAllBanks);
withdrawRouter.get("/banks/search", searchBanks);
withdrawRouter.post("/createRecipient", authMiddleware, createRecipient);
withdrawRouter.post("/", authMiddleware, withdraw);

export default withdrawRouter;
