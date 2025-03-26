import { Sequelize } from "sequelize";
import Task from "../models/Task.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import { compareSync } from "bcrypt";
import Beneficiary from "../models/Beneficiary.js";

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
/**
 * This endpoint is used to do direct transaction from one charmpay account to another
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const directTransaction = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { recipientId, amount, transactionPin } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let isTransactionPinCorrect = compareSync(
      String(transactionPin),
      user.transactionPin
    );
    if (!isTransactionPinCorrect)
      return res.status(401).json({ message: "Incorrect transaction pin" });

    // first check if the user have suficient balance
    const userWallet = await Wallet.findOne({ where: { userId } });

    if (userWallet.currentBalance < amount)
      return res.status(422).json({ message: "Insufficient Balance" });

    const recipientWallet = await Wallet.findOne({
      where: { userId: recipientId },
    });
    if (!recipientWallet)
      return res.status(404).json({ message: "Recipient not found" });

    // performing transaction
    await userWallet.update({
      currentBalance: userWallet.currentBalance - amount,
    });

    await recipientWallet.update({
      currentBalance: recipientWallet.currentBalance + amount,
    });

    // recording the transaction
    let transaction = await Transaction.create({
      senderId: userId,
      receiverId: recipientId,
      senderWalletId: userWallet.id,
      receiverWalletId: recipientWallet.id,
      amount: parseFloat(amount),
      status: "successful",
    });

    let beneficiary = await Beneficiary.findOne({
      where: { userId, beneficiaryId: recipientId },
    });
    if (!beneficiary)
      await Beneficiary.create({
        userId,
        beneficiaryId: recipientId,
      });

    await Notification.create({
      receiverId: recipientId,
      senderId: userId,
      transactionId: transaction.id,
      type: "recieve-new-transfer",
    });
    await Notification.create({
      receiverId: userId,
      senderId: recipientId,
      transactionId: transaction.id,
      type: "send-new-transfer",
    });
    res.json({ message: "Transaction successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while performing transactionn",
      error,
    });
  }
};
