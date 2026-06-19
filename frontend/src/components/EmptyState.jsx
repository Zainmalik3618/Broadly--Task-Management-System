export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-8 text-center">
    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
      <Icon size={22} />
    </div>
    <h2 className="text-lg font-bold text-ink">{title}</h2>
    <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
