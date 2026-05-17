import Skill from "../models/Skill.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSkill = asyncHandler(async (req, res) => {
  const material = req.file
    ? {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        url: `/uploads/skill-materials/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    : null;

  const skill = await Skill.create({ ...req.body, material, teacher: req.user._id });
  await skill.populate("teacher", "name email rating");
  res.status(201).json(skill);
});

export const listSkills = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const skills = await Skill.find(filter)
    .populate("teacher", "name email rating")
    .sort({ createdAt: -1 })
    .limit(60);

  res.json(skills);
});

export const getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate("teacher", "name email bio rating");
  if (!skill || !skill.isActive) throw new ApiError(404, "Skill not found");
  res.json(skill);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) throw new ApiError(404, "Skill not found");
  if (String(skill.teacher) !== String(req.user._id)) throw new ApiError(403, "You can edit only your skill offers");

  ["title", "description", "category", "level", "outcomes", "lessons", "thumbnailUrl", "creditsPerHour", "availability", "isActive"].forEach((field) => {
    if (req.body[field] !== undefined) skill[field] = req.body[field];
  });
  await skill.save();
  res.json(skill);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) throw new ApiError(404, "Skill not found");
  if (String(skill.teacher) !== String(req.user._id)) throw new ApiError(403, "You can delete only your skill offers");
  skill.isActive = false;
  await skill.save();
  res.json({ message: "Skill offer removed" });
});
