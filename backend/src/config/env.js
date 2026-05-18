import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/skillswap",
  jwtSecret: process.env.JWT_SECRET || "dev_only_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120),
  failStartup: process.env.FAIL_STARTUP === "true",
  failHealth: process.env.FAIL_HEALTH === "true"
};
