import User from "../models/User.js";
import { toPublicUser } from "../services/authService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({ isActive: true }).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user || !user.isActive) throw new ApiError(404, "User not found");
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "skillsOffered", "skillsWanted"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: toPublicUser(req.user) });
});

export const reportUser = asyncHandler(async (req, res) => {
  const reported = await User.findById(req.params.id);
  if (!reported) throw new ApiError(404, "User not found");
  reported.reports.push({ reason: req.body.reason, reportedBy: req.user._id });
  await reported.save();
  res.status(201).json({ message: "Report submitted" });
});
