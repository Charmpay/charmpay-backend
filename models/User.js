import { hashSync } from "bcrypt";
import database from "../database/database.js";
import { DataTypes } from "sequelize";
import crypto from "crypto";

const User = database.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  paystack_customer_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  avatar: DataTypes.STRING,
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Enter a valid email",
      },
    },
  },
  countryCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.BIGINT,
    unique: true,
    allowNull: false,
  },
  passCode: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue("passCode", hashSync(`${value}`, 10));
    },
  },
  transactionPin: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue("transactionPin", hashSync(`${value}`, 10));
    },
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  accountStatus: {
    type: DataTypes.ENUM,
    values: ["active", "unverified", "inactive", "suspended", "banned"],
    defaultValue: "unverified",
    allowNull: false,
  },
});

export default User;
