import { Sequelize } from "sequelize";
import Dispute from "../models/Dispute.js";
import Evidence from "../models/Evidence.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import compileEmail from "../util/emailCompiler.js";
import sendMail from "../util/sendMail.js";

/**
 * This endpoint is used to raise a dispute
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const raiseDispute = async (req, res) => {
  try {
    const { id: raiserId } = req.user;
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findByPk(taskId, { include: { all: true } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const raisedBy = task.assignerId === raiserId ? "assigner" : "assignee";

    const raiser = await User.findByPk(raiserId);
    const evidence = await Evidence.create({
      text,
      userId: raiserId,
    });

    const dispute = await Dispute.create({
      taskId,
      raisedBy,
      raiserId,
      raiserEvidenceId: evidence.id,
      receiverId: raisedBy === "assignee" ? task.assignerId : task.assigneeId,
    });

    compileEmail("new-dispute", {
      user: {
        firstName:
          raisedBy === "assignee"
            ? task.assigner.firstName
            : task.assignee.firstName,
      },
      task: {
        title: task.title,
      },
      disputedBy: raiser.firstName,
      disputeReason: text,
      disputeDate: Date(),
      disputeId: dispute.id,
    }).then((html) => {
      sendMail(
        `Dispute Notification - Charmpay`,
        raisedBy === "assignee" ? task.assigner.email : task.assignee.email,
        html
      );
    });
    res.json({ message: "Dispute raised successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while trying to raise a dispute" });
  }
};

/**
 * This endpoint is used to add receiver evidence to the dispute
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addReceiverEvidence = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { disputeId } = req.params;
    const { text } = req.body;

    const dispute = await Dispute.findByPk(disputeId, {
      include: { all: true },
    });

    if (!dispute) return res.status(404).json({ message: "Dispute not found" });

    const evidence = await Evidence.create({ text, userId });

    dispute.update({ receiverEvidenceId: evidence.id });

    compileEmail("dispute-evidence-provided", {
      user: {
        firstName: dispute.raiser.firstName,
      },
      task: {
        title: dispute.task.title,
      },
      submittedBy: dispute.receiver.firstName,
      submissionDate: Date(),
      disputeId: dispute.id,
    }).then((html) => {
      sendMail(
        `Dispute Evidence Submitted - Charmpay`,
        dispute.raiser.email,
        html
      );
    });
    res.json({
      message:
        "Your evidence as been added successfully.\nPlease wait while Charmpay reviews this dispute",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while add your evidence",
    });
  }
};

/**
 * This endpoint is used get all disputes
 * @param {import("express").Response} res
 */
export const getAllDisputes = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const dispute = await Dispute.findAll({
      where: Sequelize.or({ raiserId: userId }, { receiverId: userId }),
      include: { all: true },
    });

    if (dispute.length === 0)
      return res.status(404).json({ message: "No dispute yet" });

    res.json(dispute);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred retrieving your disputes",
    });
  }
};

/**
 * This endpoint is used get dispute by id
 * @param {import("express").Response} res
 */
export const getDisputeById = async (req, res) => {
  try {
    const { disputeId } = req.params;

    const dispute = await Dispute.findByPk(disputeId, {
      include: { all: true },
    });

    if (!dispute) return res.status(404).json({ message: "No dispute yet" });

    res.json(dispute);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred retrieving your disputes",
    });
  }
};
