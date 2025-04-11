import express from "express";
import {
  addExpoPushToken,
  editProfile,
  fetchUserByEmail,
  getMyProfile,
  removeExpoPushToken,
} from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getMyProfile);
userRouter.patch("/me/edit", authMiddleware, editProfile);
userRouter.post("/registerPushToken", authMiddleware, addExpoPushToken);
userRouter.post("/removePushToken", authMiddleware, removeExpoPushToken);
userRouter.get("/:email", authMiddleware, fetchUserByEmail);

export default userRouter;
