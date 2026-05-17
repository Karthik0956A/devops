import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "./tokenService.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  skillsOffered: user.skillsOffered,
  skillsWanted: user.skillsWanted,
  credits: user.credits,
  rating: user.rating
});

export const registerUser = async (payload) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create(payload);
  return { token: signToken(user), user: publicUser(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new ApiError(403, "Account is disabled");

  return { token: signToken(user), user: publicUser(user) };
};

export const toPublicUser = publicUser;
