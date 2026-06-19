import { AlertTriangle, X } from "lucide-react";

export const ConfirmDialog = ({ open, title, text, onConfirm, onClose, pending }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={21} />
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
