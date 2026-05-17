import { Router } from "express";
import { addReview, reviewsForUser } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reviewValidator } from "../validators/domainValidators.js";

const router = Router();

router.get("/user/:userId", protect, reviewsForUser);
router.post("/", protect, reviewValidator, validate, addReview);

export default router;
