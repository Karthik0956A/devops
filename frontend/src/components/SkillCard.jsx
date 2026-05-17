import { BookOpen, CalendarPlus, FileText, Star } from "lucide-react";
import { Link } from "react-router-dom";

const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const SkillCard = ({ skill, onBook }) => (
  <article className="flex h-full flex-col rounded border border-slate-200 bg-white p-4 shadow-soft">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-normal text-mint">{skill.category}</p>
        <Link to={`/skills/${skill._id}`} className="focus-ring mt-1 block rounded text-lg font-semibold text-ink hover:text-mint">
          {skill.title}
        </Link>
      </div>
      <span className="rounded bg-amber/20 px-2 py-1 text-sm font-semibold text-[#805300]">{skill.creditsPerHour}/hr</span>
    </div>
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
      <span className="rounded bg-slate-100 px-2 py-1">{skill.level || "Beginner"}</span>
      <span className="rounded bg-slate-100 px-2 py-1">{skill.lessons?.length || 0} lessons</span>
    </div>
    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{skill.description}</p>
    {skill.material?.url ? (
      <a
        className="focus-ring mt-3 inline-flex w-fit items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-mint hover:bg-mint/10"
        href={`${apiOrigin}${skill.material.url}`}
        target="_blank"
        rel="noreferrer"
      >
        <FileText size={16} />
        View PDF
      </a>
    ) : null}
    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
      <div>
        <p className="text-sm font-medium">{skill.teacher?.name || "Teacher"}</p>
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <Star size={13} className="fill-amber text-amber" />
          {skill.teacher?.rating?.average || 0} ({skill.teacher?.rating?.count || 0})
        </p>
      </div>
      <button className="focus-ring rounded bg-ink p-2 text-white hover:bg-slate-700" onClick={() => onBook(skill)} aria-label="Book skill">
        <CalendarPlus size={18} />
      </button>
      <Link className="focus-ring rounded border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" to={`/skills/${skill._id}`} aria-label="View course">
        <BookOpen size={18} />
      </Link>
    </div>
  </article>
);

export default SkillCard;
