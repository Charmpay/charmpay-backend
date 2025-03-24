import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAllBeneficiaries,
  removeBeneficiary,
} from "../controllers/beneficiary";

const beneficiaryRouter = express.Router();

beneficiaryRouter.get("/me", authMiddleware, getAllBeneficiaries);
beneficiaryRouter.delete("/:beneficiaryId", authMiddleware, removeBeneficiary);

export default beneficiaryRouter;
