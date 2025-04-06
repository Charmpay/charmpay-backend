import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addReceiverEvidence,
  getAllDisputes,
  getDisputeById,
  raiseDispute,
} from "../controllers/dispute.js";

const disputeRouter = express.Router();

disputeRouter.get("/me", authMiddleware, getAllDisputes);
disputeRouter.post("/raise/:taskId", authMiddleware, raiseDispute);
disputeRouter.get("/:disputeId", authMiddleware, getDisputeById);
disputeRouter.patch(
  "/:disputeId/addReceiverEvidence",
  authMiddleware,
  addReceiverEvidence
);

export default disputeRouter;
