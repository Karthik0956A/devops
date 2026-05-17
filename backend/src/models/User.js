import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const reviewSummarySchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String, default: "", maxlength: 500 },
    skillsOffered: [{ type: String, trim: true }],
    skillsWanted: [{ type: String, trim: true }],
    credits: { type: Number, default: 10, min: 0 },
    rating: { type: reviewSummarySchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
    reports: [
      {
        reason: { type: String, required: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
