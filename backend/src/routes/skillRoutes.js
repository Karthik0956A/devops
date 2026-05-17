import { Router } from "express";
import { createSkill, deleteSkill, getSkill, listSkills, updateSkill } from "../controllers/skillController.js";
import { protect } from "../middleware/auth.js";
import { uploadSkillMaterial } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { skillValidator } from "../validators/domainValidators.js";

const router = Router();

router.get("/", listSkills);
router.get("/:id", getSkill);
router.post("/", protect, uploadSkillMaterial.single("material"), skillValidator, validate, createSkill);
router.put("/:id", protect, skillValidator, validate, updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;
