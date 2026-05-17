import { Router } from "express";
import { adminUsers, analytics, setUserActive } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect, requireAdmin);
router.get("/analytics", analytics);
router.get("/users", adminUsers);
router.patch("/users/:id/active", setUserActive);

export default router;
