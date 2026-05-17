import fs from "fs";
import path from "path";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const uploadRoot = path.resolve("uploads", "skill-materials");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadRoot);
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    callback(null, `${Date.now()}-${safeName}`);
  }
});

const fileFilter = (_req, file, callback) => {
  if (file.mimetype !== "application/pdf") {
    return callback(new ApiError(400, "Only PDF files are allowed"));
  }
  callback(null, true);
};

export const uploadSkillMaterial = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
