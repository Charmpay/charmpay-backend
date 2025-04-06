import database from "../database/database.js";
import { DataTypes, UUID } from "sequelize";

const Task = database.define("task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  assigneeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  description: DataTypes.STRING(1000),
  status: {
    type: DataTypes.ENUM(),
    allowNull: false,
    values: ["in-progress", "completed", "canceled"],
    defaultValue: "in-progress",
  },
});

export default Task;
