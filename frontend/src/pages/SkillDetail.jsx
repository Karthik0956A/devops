import { ArrowLeft, CalendarPlus, CheckCircle2, ExternalLink, FileText, PlayCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";

const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const getYouTubeId = (value) => {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }
  return "";
};

const getYouTubeEmbedUrl = (value) => {
  const id = getYouTubeId(value);
  return id ? `https://www.youtube.com/embed/${id}` : "";
};

const isPdfLink = (value) => {
  if (!value) return false;
  return value.toLowerCase().endsWith(".pdf") || value.includes("drive.google.com");
};

const SkillDetail = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [booking, setBooking] = useState({ scheduledAt: "", durationHours: 1, meetingNote: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const skillResponse = await api.get(`/skills/${id}`);
      setSkill(skillResponse.data);
      const reviewsResponse = await api.get(`/reviews/user/${skillResponse.data.teacher._id}`);
      setReviews(reviewsResponse.data);
    };
    load();
  }, [id]);

  const book = async (event) => {
    event.preventDefault();
    try {
      await api.post("/bookings", { ...booking, skillId: skill._id });
      setMessage("Booking request sent. The teacher will share learning material after accepting.");
      setBooking({ scheduledAt: "", durationHours: 1, meetingNote: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to book this course.");
    }
  };

  if (!skill) return <div className="text-sm text-slate-600">Loading course...</div>;

  return (
    <>
      <Link className="focus-ring mb-4 inline-flex items-center gap-2 rounded px-1 py-1 text-sm font-semibold text-mint" to="/skills">
        <ArrowLeft size={16} />
        Back to marketplace
      </Link>

      <PageHeader
        title={skill.title}
        description={`${skill.category} | ${skill.level || "Beginner"} | ${skill.lessons?.length || 0} lessons | ${skill.creditsPerHour} credits/hour`}
      />

      {message ? <p className="mb-4 rounded border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">{message}</p> : null}

      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-soft">
            {skill.thumbnailUrl ? <img className="h-56 w-full object-cover" src={skill.thumbnailUrl} alt={skill.title} /> : null}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-ink">Course overview</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{skill.description}</p>
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">What learners will gain</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(skill.outcomes?.length ? skill.outcomes : ["Understand the core skill", "Practice with guided material"]).map((outcome) => (
                <p key={outcome} className="flex gap-2 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-1 shrink-0 text-mint" size={16} />
                  {outcome}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Curriculum</h2>
            <div className="mt-4 divide-y divide-slate-100 rounded border border-slate-200">
              {(skill.lessons?.length ? skill.lessons : [{ title: "Introductory session", contentType: "text", contentData: "Teacher will share learning content after accepting." }]).map(
                (lesson, index) => (
                  <div key={lesson._id || lesson.title} className="flex items-start gap-3 p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-slate-100 text-sm font-bold text-ink">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{lesson.title}</p>
                      {lesson.contentType === "text" ? (
                        <p className="mt-1 text-sm text-slate-600">{lesson.contentData || "Learning resource shared after booking acceptance."}</p>
                      ) : null}
                      {lesson.contentType === "video" ? (
                        getYouTubeEmbedUrl(lesson.contentData) ? (
                          <div className="mt-3 overflow-hidden rounded border border-slate-200 bg-white">
                            <iframe
                              className="aspect-video w-full"
                              src={getYouTubeEmbedUrl(lesson.contentData)}
                              title={`${lesson.title} video`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : lesson.contentData ? (
                          <a className="mt-2 inline-flex text-sm font-semibold text-mint hover:underline" href={lesson.contentData} target="_blank" rel="noreferrer">
                            Open video resource
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-slate-600">Video resource shared after booking acceptance.</p>
                        )
                      ) : null}
                      {lesson.contentType === "pdf" ? (
                        lesson.contentData && isPdfLink(lesson.contentData) ? (
                          <a className="mt-2 inline-flex text-sm font-semibold text-mint hover:underline" href={lesson.contentData} target="_blank" rel="noreferrer">
                            Open PDF resource
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-slate-600">PDF link shared after booking acceptance.</p>
                        )
                      ) : null}
                    </div>
                    <span className="rounded bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">{lesson.contentType}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Teacher reviews</h2>
            <div className="mt-4 grid gap-3">
              {reviews.length ? (
                reviews.slice(0, 4).map((review) => (
                  <div key={review._id} className="rounded border border-slate-200 p-3">
                    <p className="flex items-center gap-1 text-sm font-semibold text-ink">
                      <Star size={15} className="fill-amber text-amber" />
                      {review.rating}/5 by {review.reviewer?.name || "Learner"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{review.comment || "No comment added."}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No reviews yet. This is a good chance to be the first learner.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Teacher</p>
              <p className="font-semibold text-ink">{skill.teacher?.name}</p>
            </div>
            <p className="flex items-center gap-1 text-sm font-semibold text-ink">
              <Star size={15} className="fill-amber text-amber" />
              {skill.teacher?.rating?.average || 0}
            </p>
          </div>

          {skill.material?.url ? (
            <a
              className="focus-ring mt-4 flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-mint hover:bg-mint/10"
              href={`${apiOrigin}${skill.material.url}`}
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={16} />
              Preview uploaded PDF
            </a>
          ) : null}

          <form onSubmit={book} className="mt-5 border-t border-slate-100 pt-5">
            <h2 className="text-lg font-semibold text-ink">Book this course</h2>
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
              Learning goal
              <textarea
                className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                rows="3"
                value={booking.meetingNote}
                onChange={(event) => setBooking({ ...booking, meetingNote: event.target.value })}
              />
            </label>
            <button className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded bg-ink px-4 py-2 font-semibold text-white">
              <CalendarPlus size={18} />
              Request booking
            </button>
          </form>

          <div className="mt-5 rounded bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            After acceptance, the teacher shares a YouTube, Drive, or class material link. You complete the course and rate the teacher from bookings.
          </div>
          {skill.lessons?.some((lesson) => lesson.contentType === "video" && lesson.contentData?.startsWith("http")) ? (
            <a
              className="focus-ring mt-3 inline-flex items-center gap-2 rounded px-1 py-1 text-sm font-semibold text-mint"
              href={skill.lessons.find((lesson) => lesson.contentType === "video" && lesson.contentData?.startsWith("http")).contentData}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={16} />
              Open sample video
            </a>
          ) : null}
        </aside>
      </section>
    </>
  );
};

export default SkillDetail;
