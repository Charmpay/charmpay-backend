import database from "../database/database.js";
import { DataTypes, UUID } from "sequelize";
import User from "./User.js";

const Transaction = database.define("transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderWalletId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverWalletId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM(),
    allowNull: false,
    values: ["pending", "in-escrow", "successful", "failed", "reversed"],
    defaultValue: "in-escrow",
  },
  type: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ["transfer", "withdrawal", "funding"],
    defaultValue: "transfer",
  },
});

export default Transaction;
