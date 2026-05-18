import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { _id: false }
);

const materialSchema = new mongoose.Schema(
  {
    originalName: { type: String },
    fileName: { type: String },
    url: { type: String },
    mimeType: { type: String },
    size: { type: Number }
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    contentType: { type: String, enum: ["text", "video", "pdf"], default: "text" },
    contentData: { type: String, default: "", maxlength: 700 }
  },
  { _id: true }
);

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 1000 },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Design", "Business", "Language", "Music", "Fitness", "Academics", "Other"]
    },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    outcomes: [{ type: String, trim: true, maxlength: 160 }],
    lessons: [lessonSchema],
    thumbnailUrl: { type: String, default: "" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creditsPerHour: { type: Number, required: true, min: 1, max: 20 },
    availability: [availabilitySchema],
    material: { type: materialSchema, default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

skillSchema.index({ title: "text", description: "text", category: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
