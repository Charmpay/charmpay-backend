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
const sendMail = async (subject, to, body, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.sendMail({
        from: `Charmpay Inc <${process.env.EMAIL_USER}>`,
        sender: process.env.EMAIL_USER,
        sender: "Charmpay Inc",
        to,
        subject,
        html: body,
      });
      return;
    } catch (error) {
      console.error(`Email send attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) return console.log("Email couldn't be sent. Error:", error)
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 sec before retrying
    }
  }
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
