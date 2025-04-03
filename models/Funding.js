import database from "../database/database.js";
import { DataTypes, UUID } from "sequelize";
import User from "./User.js";

const Funding = database.define("funding", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  paystack_reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  paystack_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM(),
    allowNull: false,
    values: ["pending", "successful", "failed"],
    defaultValue: "pending",
  },
});

export default Funding;
