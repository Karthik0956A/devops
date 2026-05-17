import Booking from "../models/Booking.js";
import { requestBooking, updateBookingStatus } from "../services/bookingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await requestBooking({
    skillId: req.body.skillId,
    learnerId: req.user._id,
    scheduledAt: req.body.scheduledAt,
    durationHours: req.body.durationHours,
    meetingNote: req.body.meetingNote
  });
  res.status(201).json(booking);
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    $or: [{ teacher: req.user._id }, { learner: req.user._id }]
  })
    .populate(["skill", "teacher", "learner"])
    .sort({ createdAt: -1 });

  res.json(bookings);
});

export const changeBookingStatus = asyncHandler(async (req, res) => {
  const booking = await updateBookingStatus({
    bookingId: req.params.id,
    userId: req.user._id,
    status: req.body.status,
    learningResourceUrl: req.body.learningResourceUrl
  });
  res.json(booking);
});
