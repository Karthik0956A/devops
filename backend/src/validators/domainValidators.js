import { body } from "express-validator";

export const profileValidator = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("bio").optional().isLength({ max: 500 }).withMessage("Bio must be 500 characters or less"),
  body("skillsOffered").optional().isArray().withMessage("Skills offered must be an array"),
  body("skillsWanted").optional().isArray().withMessage("Skills wanted must be an array")
];

export const skillValidator = [
  body("title").trim().isLength({ min: 3 }).withMessage("Skill title must be at least 3 characters"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("category").notEmpty().withMessage("Category is required"),
  body("level").optional().isIn(["Beginner", "Intermediate", "Advanced"]).withMessage("Invalid skill level"),
  body("outcomes")
    .optional()
    .customSanitizer((value) => (typeof value === "string" ? JSON.parse(value) : value))
    .isArray()
    .withMessage("Outcomes must be an array"),
  body("lessons")
    .optional()
    .customSanitizer((value) => (typeof value === "string" ? JSON.parse(value) : value))
    .isArray()
    .withMessage("Lessons must be an array"),
  body("thumbnailUrl").optional({ checkFalsy: true }).isURL().withMessage("Thumbnail must be a valid URL"),
  body("creditsPerHour").isInt({ min: 1, max: 20 }).withMessage("Credits per hour must be between 1 and 20"),
  body("availability")
    .optional()
    .customSanitizer((value) => (typeof value === "string" ? JSON.parse(value) : value))
    .isArray()
    .withMessage("Availability must be an array")
];

export const bookingValidator = [
  body("skillId").isMongoId().withMessage("Valid skill id is required"),
  body("scheduledAt").isISO8601().withMessage("Valid schedule date is required"),
  body("durationHours").isInt({ min: 1, max: 8 }).withMessage("Duration must be 1 to 8 hours"),
  body("meetingNote").optional().isLength({ max: 300 }).withMessage("Meeting note must be 300 characters or less")
];

export const statusValidator = [
  body("status").isIn(["accepted", "rejected", "completed", "cancelled"]).withMessage("Invalid booking status"),
  body("learningResourceUrl")
    .optional({ checkFalsy: true })
    .trim()
    .customSanitizer((value) => {
      if (!value) return value;
      return /^https?:\/\//i.test(value) ? value : `https://${value}`;
    })
    .isURL({ require_protocol: true })
    .withMessage("Learning resource link must be a valid URL with http or https")
];

export const reviewValidator = [
  body("bookingId").isMongoId().withMessage("Valid booking id is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isLength({ max: 500 }).withMessage("Comment must be 500 characters or less")
];

export const reportValidator = [
  body("reason").trim().isLength({ min: 5, max: 300 }).withMessage("Report reason must be 5 to 300 characters")
];
