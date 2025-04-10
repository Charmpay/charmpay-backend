import express from "express";
import axios from "axios";
import paystack from "../libs/paystack.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const withdrawRouter = express.Router();

withdrawRouter.get("/banks", async (req, res) => {
  try {
    let response = await paystack.misc.list_banks();
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ me: "failed" });
    console.log(error);
  }
});
withdrawRouter.get("/banks/search", async (req, res) => {
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
});
withdrawRouter.post("/createRecipient", authMiddleware, async (req, res) => {
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
});
withdrawRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { amount, recipient } = req.body;

    const userWallet = await Wallet.findOne({
      where: {
        userId,
      },
    });

    if (userWallet.currentBalance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

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

    console.log(transfer.data);

    if (transfer.data.data.status != "success")
      return res.status(400).json({ message: "Withdraw failed" });

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

    res.json({ message: "Withdraw successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while performing this request" });
    console.log(error);
  }
});

export default withdrawRouter;
