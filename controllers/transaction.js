import { Sequelize } from "sequelize";
import Task from "../models/Task.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/**
 * This endpoint is used to get a transaction id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findByPk(transactionId, {
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
        { model: Task },
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
 * This endpoint is used to get all transactions
 * the current logged in user has made
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTransactionsIMade = async (req, res) => {
  try {
    const { id } = req.user;

    const transactions = await Transaction.findAll({
      where: { senderId: id },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
        { model: Task },
      ],
    });

    if (transactions.length === 0)
      return res
        .status(404)
        .json({ message: "You haven't made any transactions" });

    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving transactions",
      error,
    });
  }
};

/**
 * This endpoint is used to get all transactions made
 * to the current logged in user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getTransactionsMadeToMe = async (req, res) => {
  try {
    const { id } = req.user;

    const transactions = await Transaction.findAll({
      where: { receiverId: id },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
        { model: Task },
      ],
    });

    if (transactions.length === 0)
      return res
        .status(404)
        .json({ message: "No transactions has been made to you" });

    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving transactions",
      error,
    });
  }
};

/**
 * This endpoint is used to get all transactions made
 * to the current logged in user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllTransactions = async (req, res) => {
  try {
    const { id } = req.user;

    const transactions = await Transaction.findAll({
      where: Sequelize.or({ receiverId: id }, { senderId: id }),
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
        { model: Task },
      ],
    });

    if (transactions.length === 0)
      return res.status(404).json({ message: "No transactions found" });

    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving transactions",
      error,
    });
  }
};

/**
 * This endpoint is used to get all transactions made by status
 * to the current logged in user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllTransactionsByStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const { status } = req.params;

    const transactions = await Transaction.findAll({
      where: Sequelize.and(Sequelize.or({ receiverId: id }, { senderId: id }), {
        status,
      }),
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
        { model: Task },
      ],
    });

    if (transactions.length === 0)
      return res.status(404).json({ message: "No transactions found" });

    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving transactions",
      error,
    });
  }
};
