import { FileText, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";

const categories = ["Technology", "Design", "Business", "Language", "Music", "Fitness", "Academics", "Other"];

const SkillCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    level: "Beginner",
    outcomes: "Understand the basics, Practice with guided resources",
    thumbnailUrl: "",
    creditsPerHour: 2,
    lessons: [
      { title: "Introduction", contentType: "text", contentData: "What this skill covers and how the session works." },
      { title: "Practice resource", contentType: "video", contentData: "https://youtube.com/" }
    ],
    availability: [{ day: "Saturday", startTime: "10:00", endTime: "12:00" }]
  });
  const [material, setMaterial] = useState(null);

  const updateAvailability = (field, value) => {
    setForm({
      ...form,
      availability: [{ ...form.availability[0], [field]: value }]
    });
  };

  const updateLesson = (index, field, value) => {
    setForm({
      ...form,
      lessons: form.lessons.map((lesson, lessonIndex) => (lessonIndex === index ? { ...lesson, [field]: value } : lesson))
    });
  };

  const addLesson = () => {
    setForm({
      ...form,
      lessons: [...form.lessons, { title: "", contentType: "text", contentData: "" }]
    });
  };

  const removeLesson = (index) => {
    setForm({
      ...form,
      lessons: form.lessons.filter((_, lessonIndex) => lessonIndex !== index)
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("level", form.level);
    data.append("outcomes", JSON.stringify(form.outcomes.split(",").map((item) => item.trim()).filter(Boolean)));
    if (form.thumbnailUrl) data.append("thumbnailUrl", form.thumbnailUrl);
    data.append("creditsPerHour", form.creditsPerHour);
    data.append("lessons", JSON.stringify(form.lessons.filter((lesson) => lesson.title.trim())));
    data.append("availability", JSON.stringify(form.availability));
    if (material) data.append("material", material);

    await api.post("/skills", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    navigate("/skills");
  };

  return (
    <>
      <PageHeader title="Offer a skill course" description="Create a marketplace course with outcomes, curriculum, supporting PDF, credits, and availability." />
      <form onSubmit={submit} className="grid gap-5 rounded border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-2">
        <label className="block text-sm font-medium">
          Skill title
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Level
          <select
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.level}
            onChange={(event) => setForm({ ...form, level: event.target.value })}
          >
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Credits per hour
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            type="number"
            min="1"
            max="20"
            value={form.creditsPerHour}
            onChange={(event) => setForm({ ...form, creditsPerHour: Number(event.target.value) })}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Thumbnail URL
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.thumbnailUrl}
            onChange={(event) => setForm({ ...form, thumbnailUrl: event.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm font-medium">
            Day
            <input
              className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={form.availability[0].day}
              onChange={(event) => updateAvailability("day", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            From
            <input
              className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
              type="time"
              value={form.availability[0].startTime}
              onChange={(event) => updateAvailability("startTime", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            To
            <input
              className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
              type="time"
              value={form.availability[0].endTime}
              onChange={(event) => updateAvailability("endTime", event.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm font-medium lg:col-span-2">
          Description
          <textarea
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            rows="5"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
        </label>
        <label className="block text-sm font-medium lg:col-span-2">
          Learning outcomes
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.outcomes}
            onChange={(event) => setForm({ ...form, outcomes: event.target.value })}
            placeholder="Build a portfolio, Understand basics, Complete practice task"
          />
        </label>
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Course curriculum</h2>
            <button type="button" className="focus-ring flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm" onClick={addLesson}>
              <Plus size={16} />
              Add lesson
            </button>
          </div>
          <div className="grid gap-3">
            {form.lessons.map((lesson, index) => (
              <div key={index} className="grid gap-3 rounded border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_140px_auto]">
                <label className="block text-sm font-medium">
                  Lesson title
                  <input
                    className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    value={lesson.title}
                    onChange={(event) => updateLesson(index, "title", event.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Type
                  <select
                    className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    value={lesson.contentType}
                    onChange={(event) => updateLesson(index, "contentType", event.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="focus-ring mt-6 rounded border border-slate-300 p-2 text-slate-600"
                  onClick={() => removeLesson(index)}
                  aria-label="Remove lesson"
                >
                  <Trash2 size={18} />
                </button>
                <label className="block text-sm font-medium md:col-span-3">
                  Lesson resource or summary
                  <input
                    className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    value={lesson.contentData}
                    onChange={(event) => updateLesson(index, "contentData", event.target.value)}
                    placeholder="Short summary, YouTube URL, or Drive PDF link"
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
        <label className="block text-sm font-medium lg:col-span-2">
          Supporting PDF
          <span className="mt-1 flex items-center gap-2 rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-600">
            <FileText size={18} />
            {material?.name || "Upload notes, syllabus, proof, or sample work PDF"}
          </span>
          <input
            className="sr-only"
            type="file"
            accept="application/pdf"
            onChange={(event) => setMaterial(event.target.files?.[0] || null)}
          />
        </label>
        <div className="lg:col-span-2">
          <button className="focus-ring flex items-center gap-2 rounded bg-mint px-4 py-2 font-semibold text-white hover:bg-[#268579]">
            <Save size={18} />
            Publish skill
          </button>
        </div>
      </form>
    </>
  );
};

export default SkillCreate;
