import CreditTransaction from "../models/CreditTransaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const myTransactions = asyncHandler(async (req, res) => {
  const transactions = await CreditTransaction.find({ user: req.user._id })
    .populate("booking")
    .sort({ createdAt: -1 });
  res.json(transactions);
});
