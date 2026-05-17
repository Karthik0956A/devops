import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token required");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select("-password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "User not authorized");
  }

  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};
