import database from "../database/database.js";
import { DataTypes, UUID } from "sequelize";

const Notification = database.define("notification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Notification;
