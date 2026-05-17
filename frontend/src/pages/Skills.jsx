import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import SkillCard from "../components/SkillCard.jsx";

const categories = ["", "Technology", "Design", "Business", "Language", "Music", "Fitness", "Academics", "Other"];

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [bookingSkill, setBookingSkill] = useState(null);
  const [booking, setBooking] = useState({ scheduledAt: "", durationHours: 1, meetingNote: "" });
  const [message, setMessage] = useState("");

  const loadSkills = useCallback(async () => {
    const response = await api.get("/skills", { params: filters });
    setSkills(response.data);
  }, [filters]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const book = async (event) => {
    event.preventDefault();
    await api.post("/bookings", { ...booking, skillId: bookingSkill._id });
    setBookingSkill(null);
    setBooking({ scheduledAt: "", durationHours: 1, meetingNote: "" });
    setMessage("Booking request sent to the teacher.");
  };

  return (
    <>
      <PageHeader title="Skill marketplace" description="Search community offers and request sessions using skill credits." />

      <form
        className="mb-5 flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 shadow-soft md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          loadSkills();
        }}
      >
        <label className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="focus-ring w-full rounded border border-slate-300 py-2 pl-10 pr-3"
            placeholder="Search React, Photoshop, guitar..."
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
        </label>
        <select
          className="focus-ring rounded border border-slate-300 px-3 py-2"
          value={filters.category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category || "All categories"}
            </option>
          ))}
        </select>
        <button className="focus-ring rounded bg-ink px-4 py-2 font-semibold text-white">Search</button>
      </form>

      {message ? <p className="mb-4 rounded border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">{message}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill._id} skill={skill} onBook={setBookingSkill} />
        ))}
      </section>

      {bookingSkill ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4">
          <form onSubmit={book} className="w-full max-w-lg rounded border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Book {bookingSkill.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{bookingSkill.creditsPerHour} credits per hour</p>
            <label className="mt-4 block text-sm font-medium">
              Schedule
              <input
                className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                type="datetime-local"
                value={booking.scheduledAt}
                onChange={(event) => setBooking({ ...booking, scheduledAt: event.target.value })}
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Duration hours
              <input
                className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                type="number"
                min="1"
                max="8"
                value={booking.durationHours}
                onChange={(event) => setBooking({ ...booking, durationHours: Number(event.target.value) })}
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Meeting note
              <textarea
                className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                rows="3"
                value={booking.meetingNote}
                onChange={(event) => setBooking({ ...booking, meetingNote: event.target.value })}
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="focus-ring rounded border border-slate-300 px-4 py-2" onClick={() => setBookingSkill(null)}>
                Cancel
              </button>
              <button className="focus-ring rounded bg-mint px-4 py-2 font-semibold text-white">Request</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default Skills;
