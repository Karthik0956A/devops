const StatusBadge = ({ status }) => {
  const classes = {
    pending: "bg-amber/20 text-[#805300]",
    accepted: "bg-mint/15 text-mint",
    rejected: "bg-coral/15 text-coral",
    completed: "bg-ink/10 text-ink",
    cancelled: "bg-slate-100 text-slate-600"
  };

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${classes[status] || classes.pending}`}>{status}</span>;
};

export default StatusBadge;
