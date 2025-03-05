import { config } from "dotenv";
import transporter from "./emailTransporter.js";

/**
 * Send an mail to an email account
 *
 * @param {string} subject The subject of the mail
 * @param {string} to Email to which the mail is to be sent
 * @param {string} body The HTML body of the mail
 *
 */
const sendMail = async (subject, to, body) => {
  try {
    await transporter.sendMail({
      from: `Charmpay Inc <${process.env.EMAIL_USER}>`,
      sender: process.env.EMAIL_USER,
      sender: "Charmpay Inc",
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
