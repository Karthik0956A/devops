const StatCard = ({ label, value, tone = "mint" }) => {
  const tones = {
    mint: "border-mint/20 bg-mint/10 text-mint",
    coral: "border-coral/20 bg-coral/10 text-coral",
    amber: "border-amber/30 bg-amber/15 text-[#9a6500]",
    ink: "border-ink/15 bg-ink/5 text-ink"
  };

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded px-3 py-1 text-2xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
};

export default StatCard;
