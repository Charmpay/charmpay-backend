import { compareSync } from "bcrypt";
import Task from "../models/Task.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import { Sequelize } from "sequelize";
import compileEmail from "../util/emailCompiler.js";
import sendMail from "../util/sendMail.js";

/**
 * This endpoint is used to create a new task
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, amount } = req.body;
    const { id: userId } = req.user;

    if (userId === assignedTo)
      return res
        .status(422)
        .json({ message: "Your can't assign task to your self" });

    const user = await User.findByPk(userId, { include: { all: true } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const userWallet = await Wallet.findByPk(user.wallet.id);

    if (userWallet.currentBalance < parseFloat(amount))
      return res.status(422).json({ message: "Insufficient balance" });
    const assignee = await User.findByPk(assignedTo, {
      include: { all: true },
    });
    if (!assignee)
      return res.status(404).json({ message: "Assignee not found" });

    const task = await Task.create({
      title,
      description,
      assignerId: user.id,
      assigneeId: assignee.id,
    });

    if (task.isNewRecord)
      return res.status(422).json({ message: "Unable to create task" });

    const transaction = await Transaction.create({
      senderId: user.id,
      receiverId: assignee.id,
      senderWalletId: user.wallet.id,
      receiverWalletId: assignee.wallet.id,
      taskId: task.id,
      amount: parseFloat(amount),
    });

    if (transaction.isNewRecord)
      return res.status(422).json({ message: "Unable to create transaction" });

    await userWallet.update({
      currentBalance: userWallet.currentBalance - amount,
    });

    compileEmail("new-task", {
      user: {
        firstName: assignee.firstName,
      },
      assigner: {
        firstName: user.firstName,
      },
      task: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
      transaction: {
        amount: transaction.amount,
      },
      timestamp: Date(),
    }).then((html) => {
      sendMail("New Task Assigned to you - Charmpay Inc", assignee.email, html);
    });
    res.json({ message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating task", error });
  }
};

/**
 * This endpoint is used to create a new task
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const editTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);

    if (!task) return res.status(422).json({ message: "Task not found" });

    await task.update({ title, description });

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating task", error });
  }
};

/**
 * This endpoint is used to get all tasks the current
 * logged in user assigned to people
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTaskIAssigned = async (req, res) => {
  try {
    const { id } = req.user;

    const tasks = await Task.findAll({
      where: {
        assignerId: id,
      },
      include: { all: true },
    });

    if (tasks.length === 0)
      return res
        .status(404)
        .json({ message: "You haven't assigned task to anyone" });

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks", error });
  }
};

/**
 * This endpoint is used to get all tasks the current
 * logged in user assigned to people by status
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTaskIAssignedByStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const { status } = req.params;

    const tasks = await Task.findAll({
      where: {
        assignerId: id,
        status,
      },
      include: { all: true },
    });

    if (tasks.length === 0)
      return res
        .status(404)
        .json({ message: "You haven't assigned task to anyone" });

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks", error });
  }
};

/**
 * This endpoint is used to get all tasks the current
 * logged in user was assigned to
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTaskIWasAssignedTo = async (req, res) => {
  try {
    const { id } = req.user;

    const tasks = await Task.findAll({
      where: {
        assigneeId: id,
      },
      include: { all: true },
    });

    if (tasks.length === 0)
      return res
        .status(404)
        .json({ message: "You haven't been assigned any task" });

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks", error });
  }
};

/**
 * This endpoint is used to get all tasks the current
 * logged in user was assigned to
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTaskIWasAssignedToByStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const { status } = req.params;

    const tasks = await Task.findAll({
      where: {
        assigneeId: id,
        status,
      },
      include: { all: true },
    });

    if (tasks.length === 0)
      return res
        .status(404)
        .json({ message: "You haven't been assigned any task" });

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks", error });
  }
};

/**
 * This endpoint is used to get a task by id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId, {
      include: { all: true },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving task", error });
  }
};

/**
 * This endpoint is used to get all tasks
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllTasks = async (req, res) => {
  try {
    const { id } = req.user;

    const task = await Task.findAll({
      where: Sequelize.or({ assignerId: id }, { assigneeId: id }),
      include: { all: true },
    });

    if (task.length === 0)
      return res.status(404).json({ message: "No tasks available" });

    res.json(task);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks", error });
  }
};

/**
 * This endpoint is used to get all tasks by status
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllTasksByStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const { status } = req.params;

    const task = await Task.findAll({
      where: Sequelize.and(
        Sequelize.or({ assignerId: id }, { assigneeId: id }),
        { status }
      ),
      include: { all: true },
    });

    if (task.length === 0)
      return res.status(404).json({ message: "No tasks available" });

    res.json(task);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks", error });
  }
};

/**
 * This endpoint is used to get a transaction by task id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTaskTransaction = async (req, res) => {
  try {
    const { taskId } = req.params;

    const transaction = await Transaction.findOne({
      where: { taskId },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
      ],
    });

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving transaction",
      error,
    });
  }
};

/**
 * This endpoint is used to approve a task
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const approveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { id } = req.user;
    const { transactionPin } = req.body;

    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let isTransactionPinCorrect = compareSync(
      String(transactionPin),
      user.transactionPin
    );
    if (!isTransactionPinCorrect)
      return res.status(401).json({ message: "Incorrect transaction pin" });

    const task = await Task.findByPk(taskId, {
      include: { all: true },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.status === "completed" || task.status === "canceled")
      return res.status(422).json({ message: "Task already closed" });

    if (task.assignerId !== id)
      return res
        .status(422)
        .json({ message: "Only task creator can approve task" });

    const transaction = await Transaction.findByPk(task.transaction.id);
    // update assignee wallet
    const assignee = await User.findByPk(task.assigneeId);
    if (!assignee)
      return res.status(404).json({ message: "Assignee not found" });

    const assigneeWallet = await Wallet.findOne({
      where: { userId: assignee.id },
    });

    await assigneeWallet.update({
      currentBalance: assigneeWallet.currentBalance + task.transaction.amount,
    });
    // Update task status
    await task.update({
      status: "completed",
    });

    // update transaction status
    await transaction.update({
      status: "successful",
    });

    res.json({ message: "Task approved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while approving task",
      error,
    });
  }
};

/**
 * This endpoint is used to disapprove a task
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const disapproveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { id } = req.user;
    const { transactionPin } = req.body;

    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let isTransactionPinCorrect = compareSync(
      String(transactionPin),
      user.transactionPin
    );
    if (!isTransactionPinCorrect)
      return res.status(401).json({ message: "Incorrect transaction pin" });

    const task = await Task.findByPk(taskId, {
      include: { all: true },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.status === "completed" || task.status === "canceled")
      return res.status(422).json({ message: "Task already closed" });

    if (task.assigneeId !== id)
      return res
        .status(422)
        .json({ message: "Only task assignee can disapprove task" });

    const transaction = await Transaction.findByPk(task.transaction.id);
    // update assignee wallet
    const assigner = await User.findByPk(task.assignerId);
    if (!assigner)
      return res.status(404).json({ message: "Assigner not found" });

    const assigneeWallet = await Wallet.findOne({
      where: { userId: assigner.id },
    });

    await assigneeWallet.update({
      currentBalance: assigneeWallet.currentBalance + task.transaction.amount,
    });
    // Update task status
    await task.update({
      status: "canceled",
    });

    // update transaction status
    await transaction.update({
      status: "reversed",
    });

    res.json({ message: "Task disapproved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while disapproving task",
      error,
    });
  }
};
