const PageHeader = ({ title, description, action }) => (
  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-normal text-ink md:text-3xl">{title}</h1>
      {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
    {action}
  </div>
);

export default PageHeader;
