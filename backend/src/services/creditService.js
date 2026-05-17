import CreditTransaction from "../models/CreditTransaction.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const calculateBookingCredits = (creditsPerHour, durationHours) =>
  Number(creditsPerHour) * Number(durationHours);

export const ensureSufficientCredits = (user, amount) => {
  if (user.credits < amount) {
    throw new ApiError(400, "Not enough skill credits for this booking");
  }
};

export const transferCreditsForCompletedBooking = async (booking) => {
  const learner = await User.findById(booking.learner);
  const teacher = await User.findById(booking.teacher);

  if (!learner || !teacher) throw new ApiError(404, "Booking user not found");
  ensureSufficientCredits(learner, booking.totalCredits);

  learner.credits -= booking.totalCredits;
  teacher.credits += booking.totalCredits;
  await learner.save();
  await teacher.save();

  await CreditTransaction.create([
    {
      user: learner._id,
      booking: booking._id,
      type: "spend",
      amount: -booking.totalCredits,
      balanceAfter: learner.credits,
      description: `Spent credits for ${booking.durationHours} hour skill session`
    },
    {
      user: teacher._id,
      booking: booking._id,
      type: "earn",
      amount: booking.totalCredits,
      balanceAfter: teacher.credits,
      description: `Earned credits for teaching a skill session`
    }
  ]);

  return { learner, teacher };
};
