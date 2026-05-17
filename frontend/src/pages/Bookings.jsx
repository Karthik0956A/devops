import { Check, ExternalLink, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [resourceLinks, setResourceLinks] = useState({});
  const [reviews, setReviews] = useState({});
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    const response = await api.get("/bookings/mine");
    setBookings(response.data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const changeStatus = async (booking, status, extra = {}) => {
    try {
      await api.patch(`/bookings/${booking._id}/status`, { status, ...extra });
      await loadBookings();
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update booking.");
      return false;
    }
  };

  const acceptBooking = async (booking) => {
    const learningResourceUrl = resourceLinks[booking._id]?.trim();
    if (!learningResourceUrl) {
      setMessage("Add a Google Drive, YouTube, or class material link before accepting.");
      return;
    }
    const updated = await changeStatus(booking, "accepted", { learningResourceUrl });
    if (updated) setMessage("Booking accepted and learning resource shared.");
  };

  const completeAndReview = async (booking) => {
    const review = reviews[booking._id] || { rating: 5, comment: "" };
    const updated = await changeStatus(booking, "completed");
    if (!updated) return;
    await api.post("/reviews", {
      bookingId: booking._id,
      rating: Number(review.rating),
      comment: review.comment
    });
    setMessage("Session completed. Credits transferred and rating submitted.");
    await loadBookings();
  };

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Teachers share learning links after accepting. Learners finish the material, complete the booking, and rate the teacher."
      />
      {message ? <p className="mb-4 rounded border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">{message}</p> : null}
      <section className="grid gap-4">
        {bookings.map((booking) => {
          const isTeacher = booking.teacher?._id === user?.id;
          const isLearner = booking.learner?._id === user?.id;
          const review = reviews[booking._id] || { rating: 5, comment: "" };

          return (
            <article key={booking._id} className="rounded border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-ink">{booking.skill?.title || "Skill session"}</h2>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Teacher: {booking.teacher?.name} | Learner: {booking.learner?.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {new Date(booking.scheduledAt).toLocaleString()} | {booking.durationHours} hr | {booking.totalCredits} credits
                    </p>
                  </div>

                  {isTeacher && booking.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        className="focus-ring rounded bg-coral p-2 text-white"
                        onClick={() => changeStatus(booking, "rejected")}
                        aria-label="Reject booking"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : null}
                </div>

                {isTeacher && booking.status === "pending" ? (
                  <label className="block text-sm font-medium">
                    Learning resource link
                    <input
                      className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                      placeholder="drive.google.com/... or youtube.com/..."
                      value={resourceLinks[booking._id] || ""}
                      onChange={(event) => setResourceLinks({ ...resourceLinks, [booking._id]: event.target.value })}
                    />
                    <button
                      className="focus-ring mt-3 inline-flex items-center gap-2 rounded bg-mint px-4 py-2 text-sm font-semibold text-white"
                      type="button"
                      onClick={() => acceptBooking(booking)}
                    >
                      <Check size={16} />
                      Accept and share material
                    </button>
                  </label>
                ) : null}

                {booking.learningResourceUrl && booking.status === "accepted" ? (
                  <div className="rounded border border-slate-200 bg-slate-50 p-3">
                    <a
                      className="focus-ring inline-flex items-center gap-2 rounded px-1 py-1 text-sm font-semibold text-mint"
                      href={booking.learningResourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={16} />
                      Open learning material
                    </a>
                  </div>
                ) : null}

                {isLearner && booking.status === "accepted" ? (
                  <div className="rounded border border-mint/20 bg-mint/5 p-4">
                    <div className="grid gap-3 md:grid-cols-[160px_1fr_auto] md:items-end">
                      <label className="block text-sm font-medium">
                        Rating
                        <select
                          className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                          value={review.rating}
                          onChange={(event) =>
                            setReviews({ ...reviews, [booking._id]: { ...review, rating: Number(event.target.value) } })
                          }
                        >
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                              {rating} stars
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium">
                        Review comment
                        <input
                          className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
                          placeholder="Was the material useful?"
                          value={review.comment}
                          onChange={(event) => setReviews({ ...reviews, [booking._id]: { ...review, comment: event.target.value } })}
                        />
                      </label>
                      <button
                        className="focus-ring flex items-center justify-center gap-2 rounded bg-ink px-4 py-2 text-sm font-semibold text-white"
                        onClick={() => completeAndReview(booking)}
                      >
                        <Star size={16} />
                        Complete
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
};

export default Bookings;
