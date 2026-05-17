import Review from "../models/Review.js";
import { createReview } from "../services/reviewService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addReview = asyncHandler(async (req, res) => {
  const review = await createReview({
    bookingId: req.body.bookingId,
    reviewerId: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment
  });
  res.status(201).json(review);
});

export const reviewsForUser = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .populate("reviewer", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
});
