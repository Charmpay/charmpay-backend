import database from "../database/database.js";
import { DataTypes } from "sequelize";

/**
 * ExpoPushToken Model
 */

const ExpoPushToken = database.define("expoPushToken", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default ExpoPushToken;
