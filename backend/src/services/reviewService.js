import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "./notificationService.js";

export const createReview = async ({ bookingId, reviewerId, rating, comment }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.status !== "completed") throw new ApiError(400, "Only completed sessions can be reviewed");

  const reviewerIsTeacher = String(booking.teacher) === String(reviewerId);
  const reviewerIsLearner = String(booking.learner) === String(reviewerId);
  if (!reviewerIsTeacher && !reviewerIsLearner) throw new ApiError(403, "You cannot review this booking");

  const reviewee = reviewerIsTeacher ? booking.learner : booking.teacher;
  const review = await Review.create({
    booking: bookingId,
    reviewer: reviewerId,
    reviewee,
    rating,
    comment
  });

  const summary = await Review.aggregate([
    { $match: { reviewee } },
    { $group: { _id: "$reviewee", average: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  await User.findByIdAndUpdate(reviewee, {
    rating: {
      average: Number((summary[0]?.average || 0).toFixed(1)),
      count: summary[0]?.count || 0
    }
  });

  await createNotification({
    user: reviewee,
    type: "review",
    message: "You received a new review"
  });

  return review.populate(["reviewer", "reviewee", "booking"]);
};
