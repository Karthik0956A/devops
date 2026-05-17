import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] || "there"}`}
        description="Track credits, skill offers, requests, and community reputation from one place."
        action={
          <Link className="focus-ring rounded bg-mint px-4 py-2 text-sm font-semibold text-white hover:bg-[#268579]" to="/skills/new">
            Offer a skill
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Available credits" value={user?.credits ?? 0} tone="mint" />
        <StatCard label="Skills offered" value={user?.skillsOffered?.length ?? 0} tone="coral" />
        <StatCard label="Skills wanted" value={user?.skillsWanted?.length ?? 0} tone="amber" />
        <StatCard label="Average rating" value={user?.rating?.average ?? 0} tone="ink" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink">How the barter flow works</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Offer a skill with hourly credits", "Accept learner bookings", "Complete sessions to earn credits"].map((step, index) => (
              <div key={step} className="rounded border border-slate-200 p-4">
                <span className="grid h-8 w-8 place-items-center rounded bg-ink text-sm font-bold text-white">{index + 1}</span>
                <p className="mt-3 text-sm font-medium leading-6">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Viva talking points</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>JWT protected REST APIs</li>
            <li>MongoDB container with persistent volume</li>
            <li>Docker Compose runs the full stack locally</li>
            <li>GitHub Actions checks lint, tests, builds, and images</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
