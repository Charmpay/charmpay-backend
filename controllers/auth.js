import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import { config } from "dotenv";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;
import { compareSync, hashSync } from "bcrypt";
import paystack from "../libs/paystack.js";
import { Sequelize } from "sequelize";
import Otp from "../models/Otp.js";
import compileEmail from "../util/emailCompiler.js";
import sendMail from "../util/sendMail.js";
import crypto from "crypto";
config();
import axios from "axios";

/**
 * This endpoint is used to signup a new user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      passCode,
      transactionPin,
      countryCode,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !passCode ||
      !transactionPin ||
      !countryCode
    )
      return res.status(400).json({ message: "Incomplete fields gotten" });

    // checking country length
    if (String(countryCode).length < 1 || String(countryCode).length > 3)
      return res.status(422).json({ message: "Enter a valid country code" });

    // checking phone length
    if (String(phoneNumber).length < 9 || String(passCode).length > 13)
      return res.status(422).json({ message: "Enter a valid phone number" });

    const existingAccount = await User.findOne({
      where: Sequelize.or({ countryCode, phoneNumber }, { email }),
    });
    if (existingAccount)
      return res.status(422).json({ message: "Account already exists" });

    // checking passcode and transaction pin lengths
    if (String(passCode).length < 6 || String(passCode).length > 6)
      return res.status(422).json({ message: "Your passcode must be 6 digit" });
    if (String(transactionPin).length < 4 || String(transactionPin).length > 4)
      return res
        .status(422)
        .json({ message: "Your transaction pin must be 4 digit" });

    let customer = await paystack.customer.create({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: `+${countryCode}${phoneNumber}`,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      countryCode,
      passCode,
      transactionPin,
      paystack_customer_code: customer.data.customer_code,
    });
    if (newUser.isNewRecord)
      return res.status(422).json({ message: "Unable to create user account" });

    await Wallet.create({
      userId: newUser.id,
    });

    // sending otp to client's email
    try {
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
      const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Save OTP to database
      await Otp.create({ email, otp, expiresAt: expiration });

      compileEmail("otp", {
        user: {
          firstName: newUser.firstName,
        },
        otp: {
          code: otp,
        },
      }).then((html) => {
        sendMail(`Verify your Charmpay account`, newUser.email, html);
      });
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while signing up", error });
  }
};

/**
 * This endpoint is used to login a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const logIn = async (req, res) => {
  try {
    let { email, passCode } = req.body;

    let user = await User.findOne({ where: { email } });

    if (!user)
      return res
        .status(401)
        .json({ message: "Incorrect email or passcode" });

    let isPassCodeCorrect = compareSync(String(passCode), user.passCode);
    if (!isPassCodeCorrect)
      return res
        .status(401)
        .json({ message: "Incorrect email or passcode" });

    const tokenData = {
      id: user.id,
      customerId: user.paystack_customer_code,
      email: user.email,
    };
    const token = sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "60days",
    });

    const IPresponse = await axios.get(`https://api64.ipify.org?format=json`);
    const { ip } = IPresponse.data;
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    compileEmail("login", {
      user: {
        firstName: user.firstName,
        createdAt: user.createdAt,
      },
      ...response.data,
      timestamp: Date(),
    }).then((html) => {
      sendMail("New Login Alert - Charmpay Inc", user.email, html);
    });

    res.json({ token, user, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while logging in your account", error });
  }
};

/**
 * User request OTP Controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User account not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
    const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to database
    await Otp.create({ email, otp, expiresAt: expiration });

    compileEmail("otp", {
      user: {
        firstName: user.firstName,
      },
      otp: {
        code: otp,
      },
    }).then((html) => {
      sendMail(`OTP - ${otp} | Charmpay`, user.email, html);
    });

    res.json({ message: "OTP sent successfully" });

    setTimeout(
      () => Otp.destroy({ force: true, where: { otp, email } }),
      600000
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error Requesting reset password",
      error,
    });
  }
};

/**
 * This endpoint is used to verify a user with passcode
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const verifyPassCode = async (req, res) => {
  try {
    let { id } = req.user;
    let { passCode } = req.body;

    let user = await User.findByPk(id);

    let isPassCodeCorrect = compareSync(String(passCode), user.passCode);
    if (!isPassCodeCorrect)
      return res.status(401).json({ message: "Incorrect passcode" });

    res.json({ message: "Verified" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while verifying passcode" });
  }
};

/**
 * This endpoint is used to verify a user with transaction pin
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const verifyTransactionPin = async (req, res) => {
  try {
    let { id } = req.user;
    let { transactionPin } = req.body;

    let user = await User.findByPk(id);

    let isTransactionPinCorrect = compareSync(
      String(transactionPin),
      user.transactionPin
    );
    if (!isTransactionPinCorrect)
      return res.status(401).json({ message: "Incorrect transaction pin" });

    res.json({ message: "Verified" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while verifying transaction pin" });
  }
};

/**
 * User Verify account
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const verifyAccount = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User account not found" });

  // Find OTP record
  const otpRecord = await Otp.findOne({ where: { email, otp } });
  if (!otpRecord)
    return res.status(401).json({ message: "Invalid or expired OTP" });

  if (otpRecord.expiresAt < Date.now()) {
    otpRecord.destroy({ force: true });
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  await user.update({ emailVerified: true });
  await otpRecord.destroy({ force: true });

  compileEmail("welcome", {
    user: {
      firstName: user.firstName,
    },
  }).then((html) => {
    sendMail("🌟 Welcome to Charmpay!", user.email, html);
  });

  res.json({ message: "Account verified successfully" });
};
/**
 * User Validate OTP Controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User account not found" });

  // Find OTP record
  const otpRecord = await Otp.findOne({ where: { email, otp } });
  if (!otpRecord)
    return res.status(401).json({ message: "Invalid or expired OTP" });

  if (otpRecord.expiresAt < Date.now()) {
    otpRecord.destroy({ force: true });
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  await otpRecord.destroy({ force: true });

  res.json({ message: "OTP verified successfully" });
};
