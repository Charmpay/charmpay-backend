import database from "../database/database.js";
import { DataTypes } from "sequelize";

/**
 * Dispute Model
 */

const Dispute = database.define("dispute", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  raisedBy: {
    type: DataTypes.ENUM,
    values: ["assigner", "assignee"],
    allowNull: false,
  },
});

export default Dispute;
