import database from "../database/database.js";
import { DataTypes } from "sequelize";

const Beneficiary = database.define("beneficiary", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
});

export default Beneficiary;
