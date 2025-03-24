import express from "express";
import { editProfile, fetchUser, getMyProfile } from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getMyProfile);
userRouter.patch("/me/edit", authMiddleware, editProfile);
userRouter.get("/:email", fetchUser);

export default userRouter;
