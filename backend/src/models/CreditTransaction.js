import mongoose from "mongoose";

const creditTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    type: { type: String, enum: ["earn", "spend", "adjustment"], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const CreditTransaction = mongoose.model("CreditTransaction", creditTransactionSchema);

export default CreditTransaction;
