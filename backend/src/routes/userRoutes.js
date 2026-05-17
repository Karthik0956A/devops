import { Router } from "express";
import { getUser, listUsers, reportUser, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { profileValidator, reportValidator } from "../validators/domainValidators.js";

const router = Router();

router.get("/", protect, listUsers);
router.get("/:id", protect, getUser);
router.put("/me/profile", protect, profileValidator, validate, updateProfile);
router.post("/:id/report", protect, reportValidator, validate, reportUser);

export default router;
