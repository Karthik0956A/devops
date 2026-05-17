import Booking from "../models/Booking.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateBookingCredits, ensureSufficientCredits, transferCreditsForCompletedBooking } from "./creditService.js";
import { createNotification } from "./notificationService.js";

export const requestBooking = async ({ skillId, learnerId, scheduledAt, durationHours, meetingNote }) => {
  const skill = await Skill.findById(skillId);
  const learner = await User.findById(learnerId);
  if (!skill || !skill.isActive) throw new ApiError(404, "Skill offer not found");
  if (String(skill.teacher) === String(learnerId)) throw new ApiError(400, "You cannot book your own skill");

  const totalCredits = calculateBookingCredits(skill.creditsPerHour, durationHours);
  ensureSufficientCredits(learner, totalCredits);

  const booking = await Booking.create({
    skill: skill._id,
    teacher: skill.teacher,
    learner: learnerId,
    scheduledAt,
    durationHours,
    totalCredits,
    meetingNote
  });

  await createNotification({
    user: skill.teacher,
    type: "booking",
    message: `New booking request for ${skill.title}`
  });

  return booking.populate(["skill", "teacher", "learner"]);
};

export const updateBookingStatus = async ({ bookingId, userId, status, learningResourceUrl }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  const isTeacher = String(booking.teacher) === String(userId);
  const isLearner = String(booking.learner) === String(userId);
  if (!isTeacher && !isLearner) throw new ApiError(403, "You cannot update this booking");

  if (["accepted", "rejected"].includes(status) && !isTeacher) {
    throw new ApiError(403, "Only the teacher can accept or reject requests");
  }
  if (status === "accepted") {
    if (booking.status !== "pending") throw new ApiError(400, "Only pending bookings can be accepted");
    if (!learningResourceUrl) throw new ApiError(400, "Learning resource link is required when accepting");
    booking.learningResourceUrl = learningResourceUrl;
  }
  if (status === "rejected" && booking.status !== "pending") {
    throw new ApiError(400, "Only pending bookings can be rejected");
  }
  if (status === "completed" && !isLearner) {
    throw new ApiError(403, "Only the learner can mark the session completed");
  }

  if (status === "completed") {
    if (booking.status !== "accepted") throw new ApiError(400, "Only accepted bookings can be completed");
    await transferCreditsForCompletedBooking(booking);
    booking.completedAt = new Date();
  }

  booking.status = status;
  await booking.save();

  await createNotification({
    user: isTeacher ? booking.learner : booking.teacher,
    type: status === "completed" ? "credit" : "booking",
    message: `Booking status updated to ${status}`
  });

  return booking.populate(["skill", "teacher", "learner"]);
};
