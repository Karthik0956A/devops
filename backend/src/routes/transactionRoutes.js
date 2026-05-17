import { Router } from "express";
import { myTransactions } from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/mine", protect, myTransactions);

export default router;
