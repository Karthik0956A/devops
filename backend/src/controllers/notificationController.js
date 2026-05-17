import { listNotifications, markNotificationRead } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const myNotifications = asyncHandler(async (req, res) => {
  const notifications = await listNotifications(req.user._id);
  res.json(notifications);
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.params.id, req.user._id);
  res.json(notification);
});
