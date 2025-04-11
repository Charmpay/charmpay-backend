import axios from "axios";
import paystack from "../libs/paystack.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import ExpoPushToken from "../models/ExpoPushToken.js";
import pushNotifications from "../util/pushNotifications.js";
import { compareSync } from "bcrypt";
import User from "../models/User.js";

/**
 * Get all banks
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllBanks = async (req, res) => {
  try {
    let response = await paystack.misc.list_banks();
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ me: "failed" });
    console.log(error);
  }
};

/**
 * Search banks
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const searchBanks = async (req, res) => {
  try {
    let { q } = req.query;
    let response = await paystack.misc.list_banks();

    let banks = response.data;

    let filteredBanks = banks.filter((bank) =>
      bank.name.toLowerCase().startsWith(q.toLowerCase())
    );
    res.json(filteredBanks);
  } catch (error) {
    res.status(500).json({ me: "failed" });
    console.log(error);
  }
};

/**
 * Create Recipient Endpoint
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createRecipient = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { type, bankCode, name, accountNumber } = req.body;

    const userWallet = await Wallet.findOne({
      where: {
        userId,
      },
    });

    let response = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type,
        name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: userWallet.currency,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Request failed" });
    console.log(error);
  }
};

/**
 * Withdrawal Endpoint
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const withdraw = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { amount, recipient, transactionPin } = req.body;

    const userWallet = await Wallet.findOne({
      where: {
        userId,
      },
      include: User,
    });

    let isTransactionPinCorrect = compareSync(
      String(transactionPin),
      userWallet.user.transactionPin
    );
    if (!isTransactionPinCorrect)
      return res.status(401).json({ message: "Incorrect transaction pin" });

    if (userWallet.currentBalance < amount)
      return res.status(422).json({ message: "Insufficient balance" });

    let transfer = await axios.post(
      "https://api.paystack.co/transfer",
      {
        amount: parseInt(amount) * 100,
        recipient,
        source: "balance",
        currency: userWallet.currency,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        },
      }
    );

    if (transfer.data.data.status != "success")
      return res.status(422).json({ message: "Withdraw failed" });

    // recording the transaction
    const transaction = await Transaction.create({
      senderId: userId,
      senderWalletId: userWallet.id,
      receiverId: userId,
      receiverWalletId: userWallet.id,
      amount: parseFloat(amount),
      status: "successful",
      type: "withdrawal",
    });

    await userWallet.update({
      currentBalance: userWallet.currentBalance - amount,
    });

    await Notification.create({
      receiverId: userId,
      transactionId: transaction.id,
      type: "withdrawal",
    });

    /**
     * @type {import("expo-server-sdk").ExpoPushMessage[]}
     */
    let messages = [];

    let expoPushTokens = await ExpoPushToken.findAll({
      where: { userId: userWallet.userId },
    });

    expoPushTokens.forEach((expoPushToken) => {
      messages.push({
        to: expoPushToken.token,
        title: "Withdraw successful",
        body: `Withdrawal of ${userWallet.currency}${amount} was successful, ${userWallet.currency}${amount} has been deducted from your account`,
        data: {
          transactionId: transaction.id,
        },
      });
    });
    pushNotifications(messages);

    res.json({ message: "Withdraw successful", transactionId: transaction.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while performing this request" });
    console.log(error);
  }
};
