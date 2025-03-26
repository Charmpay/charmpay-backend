import express from "express";
import {
  initFundingTransaction,
  verifyFundingTransaction,
} from "../controllers/funding.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const fundingRouter = express.Router();

fundingRouter.post("/init", authMiddleware, initFundingTransaction);
fundingRouter.post("/verify", authMiddleware, verifyFundingTransaction);

export default fundingRouter;
