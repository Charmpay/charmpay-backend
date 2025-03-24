import Beneficiary from "../models/Beneficiary.js";
import User from "../models/User.js";

/**
 * This endpoint is used to fetch all user beneficiary
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllBeneficiaries = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const beneficiaries = await Beneficiary.findAll({
      where: { userId },
      include: [
        // { model: User, as: "user" },
        { model: User, as: "beneficiary" },
      ],
    });

    if (beneficiaries.length === 0)
      return res.status(404).json({ message: "No beneficiary yet" });

    res.json(beneficiaries);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured while retrieving beneficiaries" });
  }
};

/**
 * This endpoint is used to remove a beneficiary
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeBeneficiary = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { beneficiaryId } = req.params;

    const beneficiary = await Beneficiary.findOne({
      where: { userId, beneficiaryId },
    });

    if (!beneficiary)
      return res.status(404).json({ message: "Beneficiary not found" });

    await beneficiary.destroy({ force: true });

    res.json({ message: "Beneficiary removed sucessfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured while removing beneficiary" });
  }
};
