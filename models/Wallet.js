import database from "../database/database.js";
import { DataTypes, UUID } from "sequelize";

const Wallet = database.define("wallet", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  currentBalance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "NGN",
    allowNull: false,
  },
});

export default Wallet;
