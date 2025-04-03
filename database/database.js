import { Sequelize } from "sequelize";
import { config } from "dotenv";

// Dont't remove the below imports
import "pg";
import "pg-hstore";

config();

/**
 * Charmpay Database
 */
const database = new Sequelize(process.env.DB_URI, {
  dialect: process.env.SEQUELIZE_DIALECT,
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production" && {
      required: true,
      rejectUnauthorized: false,
      ca: process.env.DB_CA,
    },
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    idle: 10000, // Connection idle time before release (in ms)
  },
  logging: false,
});

try {
  database.authenticate();
  console.log("Database connection established");
} catch (error) {
  console.log("Error connecting to database", error);
}

export default database;
