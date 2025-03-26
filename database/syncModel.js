import database from "./database.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Task from "../models/Task.js";
import Wallet from "../models/Wallet.js";
import Otp from "../models/Otp.js";
import Beneficiary from "../models/Beneficiary.js";
import Notification from "../models/Notification.js";

// Dont't remove the below imports
import "pg";
import "pg-hstore";

const syncModel = async () => {
  User.hasMany(Transaction, { foreignKey: "senderId", as: "sentTransactions" });
  Transaction.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  User.hasMany(Transaction, {
    foreignKey: "receiverId",
    as: "receivedTransactions",
  });
  Transaction.belongsTo(User, {
    foreignKey: "receiverId",
    as: "receiver",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
  // Task associations
  User.hasMany(Task, { foreignKey: "assignerId", as: "assignedTasks" });
  Task.belongsTo(User, {
    foreignKey: "assignerId",
    as: "assigner",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  User.hasMany(Task, { foreignKey: "assigneeId", as: "tasksToDo" });
  Task.belongsTo(User, {
    foreignKey: "assigneeId",
    as: "assignee",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  // Associate Wallet with Transaction for the sender wallet
  Wallet.hasMany(Transaction, {
    foreignKey: "senderWalletId",
    as: "sentTransactions",
  });
  Transaction.belongsTo(Wallet, {
    foreignKey: "senderWalletId",
    as: "senderWallet",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  // Associate Wallet with Transaction for the receiver wallet
  Wallet.hasMany(Transaction, {
    foreignKey: "receiverWalletId",
    as: "receivedTransactions",
  });
  Transaction.belongsTo(Wallet, {
    foreignKey: "receiverWalletId",
    as: "receiverWallet",
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  User.hasOne(Wallet);
  Wallet.belongsTo(User, { onDelete: "CASCADE", onUpdate: "NO ACTION" });

  Task.hasOne(Transaction);
  Transaction.belongsTo(Task, { onDelete: "CASCADE", onUpdate: "NO ACTION" });

  // User.hasMany(Beneficiary, {
  //   foreignKey: "beneficiaryId",
  //   as: "beneficiaries",
  // });
  // Beneficiary.belongsTo(User, {
  //   foreignKey: "userId",
  //   as: "user",
  //   onDelete: "CASCADE",
  //   onUpdate: "NO ACTION",
  // });

  User.hasMany(Beneficiary, { foreignKey: "userId", as: "beneficiaries" });
  Beneficiary.belongsTo(User, { foreignKey: "userId", as: "owner" });

  User.hasMany(Beneficiary, { foreignKey: "beneficiaryId", as: "benefitedBy" });
  Beneficiary.belongsTo(User, {
    foreignKey: "beneficiaryId",
    as: "beneficiaryUser",
  });

  User.hasMany(Notification, {
    foreignKey: "senderId",
    as: "sentNotifications",
  });
  Notification.belongsTo(User, { foreignKey: "senderId", as: "sender" });

  User.hasMany(Notification, {
    foreignKey: "recieverId",
    as: "recievedtNotifications",
  });
  Notification.belongsTo(User, { foreignKey: "recieverId", as: "reciever" });

  Transaction.hasMany(Notification);
  Notification.belongsTo(Transaction);

  Task.hasMany(Notification);
  Notification.belongsTo(Task);

  await database.sync({ alter: true });
  console.log("Model sync successful");
};

export default syncModel;
