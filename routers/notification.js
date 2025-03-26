import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAllNotifications,
  getAllNotificationsByType,
} from "../controllers/notification.js";

const notificationsRouter = express.Router();

notificationsRouter.get("/me", authMiddleware, getAllNotifications);
notificationsRouter.get("/:type", authMiddleware, getAllNotificationsByType);

export default notificationsRouter;
