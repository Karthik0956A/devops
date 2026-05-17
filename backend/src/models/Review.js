import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500, default: "" }
  },
  { timestamps: true }
);

reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
