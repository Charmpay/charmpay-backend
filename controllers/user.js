import User from "../models/User.js";
import paystack from "../libs/paystack.js";

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
export const fetchUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({where: {
      email
    }})

    if (!user) return res.status(404).json({
      message: "User not found"
    })

    res.json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred while fetching user" });
  }
};
