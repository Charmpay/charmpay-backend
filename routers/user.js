import express from "express";
import {
  editProfile,
  fetchUserByEmail,
  getMyProfile,
} from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getMyProfile);
userRouter.patch("/me/edit", authMiddleware, editProfile);
userRouter.get("/:email", fetchUserByEmail);

export default userRouter;
