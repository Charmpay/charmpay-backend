import database from "../database/database.js";
import { DataTypes } from "sequelize";

/**
 * Evidence Model
 */

const Evidence = database.define("evidence", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
});

export default Evidence;
