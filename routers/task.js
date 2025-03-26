import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  approveTask,
  disapproveTask,
  createTask,
  editTask,
  getAllTasks,
  getAllTasksByStatus,
  getTaskById,
  getTaskIAssigned,
  getTaskIAssignedByStatus,
  getTaskIWasAssignedTo,
  getTaskIWasAssignedToByStatus,
  getTaskTransaction,
} from "../controllers/task.js";

const taskRouter = express.Router();

taskRouter.post("/create", authMiddleware, createTask);
taskRouter.get("/me", authMiddleware, getAllTasks);
taskRouter.get("/toothers", authMiddleware, getTaskIAssigned);
taskRouter.get("/toothers/:status", authMiddleware, getTaskIAssignedByStatus);
taskRouter.get("/tome", authMiddleware, getTaskIWasAssignedTo);
taskRouter.get("/tome/:status", authMiddleware, getTaskIWasAssignedToByStatus);
taskRouter.get("/:taskId", authMiddleware, getTaskById);
taskRouter.patch("/:taskId/edit", authMiddleware, editTask);
taskRouter.get("/:taskId/transaction", authMiddleware, getTaskTransaction);
taskRouter.post("/:taskId/approve", authMiddleware, approveTask);
taskRouter.post("/:taskId/disapprove", authMiddleware, disapproveTask);

export default taskRouter;
