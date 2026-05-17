import Booking from "../models/Booking.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analytics = asyncHandler(async (_req, res) => {
  const [users, skills, bookings, completedBookings, reportedUsers] = await Promise.all([
    User.countDocuments(),
    Skill.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "completed" }),
    User.countDocuments({ "reports.0": { $exists: true } })
  ]);

  res.json({ users, skills, bookings, completedBookings, reportedUsers });
});

export const adminUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const setUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  user.isActive = req.body.isActive;
  await user.save();
  res.json({ message: "User status updated", user });
});
