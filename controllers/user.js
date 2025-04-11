import User from "../models/User.js";
import paystack from "../libs/paystack.js";
import ExpoPushToken from "../models/ExpoPushToken.js";
import Expo from "expo-server-sdk";

/**
 * This endpoint is used to get the current logged in user profile
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getMyProfile = async (req, res) => {
  try {
    let { id } = req.user;

    const user = await User.findByPk(id, { include: { all: true } });

    if (!user) res.status(404).json({ message: "User profile not found" });

    res.json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while retrieving your profile", error });
  }
};

/**
 * This endpoint is edit the current logged in user profile
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const editProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { firstName, lastName } = req.body;

    const userProfile = await User.findByPk(id, { include: { all: true } });

    if (!userProfile)
      res.status(404).json({ message: "User profile not found" });

    userProfile.update({ firstName, lastName });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while editing your profile", error });
  }
};

/**
 * This endpoint is used to fetch user profile
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const fetchUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { email: myEmail } = req.user;

    if (email === myEmail)
      return res
        .status(400)
        .json({ message: "You can not select yourself as recipient" });

    const user = await User.findOne({
      where: {
        email,
        emailVerified: true,
      },
      attributes: {
        exclude: ["paystack_customer_code", "transactionPin", "passCode"],
      },
    });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred while fetching user" });
  }
};

/**
 * This endpoint is used to add an expo push token to the user account for notifications
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addExpoPushToken = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { token } = req.body;

    if (!Expo.isExpoPushToken(token))
      return res
        .status(400)
        .json({ message: "Please provide a valid expo push token" });

    let expoPushToken = await ExpoPushToken.create({ userId, token });

    res.json({ message: "Expo Push Token registered", expoPushToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
/**
 * This endpoint is used to remove an expo push token to the user account for notifications
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeExpoPushToken = async (req, res) => {
  try {
    const { tokenId } = req.params;

    let expoPushToken = await ExpoPushToken.findByPk(tokenId);

    if (!expoPushToken)
      return res.status(404).json({ message: "Push token not found" });

    await expoPushToken.destroy({ force: true });

    res.json({ message: "Expo Push Token deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
