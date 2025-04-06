import Transaction from "../models/Transaction.js";
import paystack from "../libs/paystack.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Funding from "../models/Funding.js";
import Notification from "../models/Notification.js";
import compileEmail from "../util/emailCompiler.js";
import sendMail from "../util/sendMail.js";
import { Op } from "sequelize";

/**
 * This endpoint is used to initialize a new transaction
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const initFundingTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const { amount } = req.body;
    const user = await User.findByPk(id, { include: Wallet });
    const transaction = await paystack.transaction.initialize({
      amount: parseInt(amount) * 100,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      currency: user.wallet.currency,
    });

    await Funding.create({
      walletId: user.wallet.id,
      userId: user.id,
      amount,
      paystack_reference: transaction.data.reference,
    });

    res.json(transaction);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while initializing a transaction" });
  }
};

export const verifyFundingTransaction = async () => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    await Funding.destroy({
      where: {
        createdAt: {
          [Op.lt]: twoHoursAgo, // more than two hour ago
        },
      },
    });
    let existingFunding = await Funding.findAll({
      where: {
        status: "pending",
      },
      include: {
        all: true,
      },
    });

    existingFunding.forEach(async (funding) => {
      if (!funding.user || !funding.wallet) return;

      const paystackTransaction = await paystack.transaction.verify(
        funding.paystack_reference
      );

      if (paystackTransaction.data.status !== "success") return;

      let amount = paystackTransaction.data.amount / 100;
      const wallet = await Wallet.findOne({
        where: {
          userId: funding.userId,
        },
      });
      await wallet.update({
        currentBalance: wallet.currentBalance + amount,
      });

      // recording the transaction
      let transaction = await Transaction.create({
        senderId: funding.userId,
        senderWalletId: funding.walletId,
        receiverId: funding.userId,
        receiverWalletId: funding.walletId,
        amount: parseFloat(amount),
        status: "successful",
        type: "funding",
      });
      await funding.update({ status: "successful" });

      await Notification.create({
        receiverId: funding.userId,
        transactionId: transaction.id,
        type: "account-deposit",
      });
      compileEmail("fund-account", {
        user: {
          firstName: funding.user.firstName,
        },
        transaction: {
          amount: `${funding.wallet.currency} ${amount}`,
          id: transaction.id,
          method: paystackTransaction.data.channel,
          ref: funding.paystack_reference,
        },
        timestamp: Date(),
      }).then((html) => {
        sendMail(
          "💰 Account Funded Successfully - Charmpay Inc",
          funding.user.email,
          html
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
};
