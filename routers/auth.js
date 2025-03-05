import express from "express";
import {
  logIn,
  requestOTP,
  signUp,
  verifyAccount,
  verifyOTP,
  verifyPassCode,
  verifyTransactionPin,
} from "../controllers/auth.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/verify/passCode", authMiddleware, verifyPassCode);
authRouter.post("/verify/tranPin", authMiddleware, verifyTransactionPin);
authRouter.post("/verify/requestOTP", requestOTP);
authRouter.post("/verify/OTP", verifyOTP);
authRouter.post("/verify/account", verifyAccount);

export default authRouter;
