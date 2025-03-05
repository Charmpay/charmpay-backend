import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const database = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  dialect: process.env.SEQUELIZE_DIALECT,
  logging: false,
});

try {
  database.authenticate();
  console.log("Database connection established");
} catch (error) {
  console.log("Error connecting to database", error);
}

export default database;
