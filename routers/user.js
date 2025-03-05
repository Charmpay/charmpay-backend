import express from "express";
import { editProfile, getMyProfile } from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getMyProfile);
userRouter.patch("/me/edit", authMiddleware, editProfile);

export default userRouter;
