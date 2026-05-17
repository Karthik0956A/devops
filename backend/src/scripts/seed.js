import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";

const upsertUser = async (email, payload) => {
  const existing = await User.findOne({ email });
  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }
  return User.create({ email, ...payload });
};

const seed = async () => {
  await connectDatabase();

  const admin = await upsertUser("admin@skillswap.local", {
    name: "SkillSwap Admin",
    password: "admin123",
    role: "admin",
    bio: "Platform admin for local demos.",
    skillsOffered: ["Community moderation"],
    skillsWanted: ["DevOps ideas"],
    credits: 50
  });

  const teacher = await upsertUser("react.teacher@skillswap.local", {
    name: "Riya React",
    password: "password123",
    bio: "Frontend mentor who enjoys teaching React fundamentals.",
    skillsOffered: ["React.js", "JavaScript"],
    skillsWanted: ["Photoshop"],
    credits: 20
  });

  await Skill.findOneAndUpdate(
    { title: "React.js for Beginners", teacher: teacher._id },
    {
      title: "React.js for Beginners",
      description: "Learn components, props, state, and API calls through a guided practical session.",
      category: "Technology",
      level: "Beginner",
      outcomes: ["Build reusable React components", "Manage state and props", "Call REST APIs from React"],
      lessons: [
        { title: "React component basics", contentType: "text", contentData: "Components, JSX, props, and composition." },
        { title: "State and events", contentType: "text", contentData: "useState, event handlers, and form inputs." },
        { title: "API integration demo", contentType: "video", contentData: "https://www.youtube.com/watch?v=SqcY0GlETPk" }
      ],
      teacher: teacher._id,
      creditsPerHour: 2,
      availability: [{ day: "Saturday", startTime: "10:00", endTime: "12:00" }],
      isActive: true
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seed complete");
  console.log("Admin login: admin@skillswap.local / admin123");
  console.log(`Admin id: ${admin._id}`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
