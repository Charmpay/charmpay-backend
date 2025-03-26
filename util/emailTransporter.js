import { config } from "dotenv";
import * as nodemailer from "nodemailer";

config();

/**
 * Email service for sending of email's to user.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// verify connection configuration
transporter.verify(function (error) {
  if (error) {
    console.log("Email transporter connection failed:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;
