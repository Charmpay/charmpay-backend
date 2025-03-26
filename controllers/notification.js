import Notification from "../models/Notification.js";

/**
 * This endpoint is used to retrieve all notifications
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllNotifications = async (req, res) => {
  try {
    const { id: userId } = req.user;

    let notifications = await Notification.findAll({
      where: { receiverId: userId },
      include: { all: true },
    });

    if (notifications.length === 0)
      return res.status(404).json({ message: "No notifications yet" });

    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
};
/**
 * This endpoint is used to retrieve all notifications by type
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllNotificationsByType = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { type } = req.params;

    let notifications = await Notification.findAll({
      where: { receiverId: userId, type },
      include: { all: true },
    });

    if (notifications.length === 0)
      return res.status(404).json({ message: "No notifications found" });

    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
};
