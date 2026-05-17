import Notification from "../models/Notification.js";

export const createNotification = ({ user, type = "system", message }) =>
  Notification.create({ user, type, message });

export const listNotifications = (userId) =>
  Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(40);

export const markNotificationRead = (notificationId, userId) =>
  Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
