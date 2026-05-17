import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    durationHours: { type: Number, required: true, min: 1, max: 8 },
    totalCredits: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending"
    },
    meetingNote: { type: String, default: "", maxlength: 300 },
    learningResourceUrl: { type: String, default: "", maxlength: 500 },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
