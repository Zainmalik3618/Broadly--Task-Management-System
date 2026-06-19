import { useEffect, useState } from "react";
import { CalendarDays, Flag, Trash2, X } from "lucide-react";

const blankTask = { title: "", description: "", dueDate: "", priority: "Medium" };

export const TaskModal = ({ task, listId, open, onClose, onSave, onDelete, pending }) => {
  const [form, setForm] = useState(blankTask);

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title,
            description: task.description || "",
            dueDate: String(task.due_date || "").slice(0, 10),
            priority: task.priority
          }
        : blankTask
    );
  }, [task, open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (form.title.trim()) onSave({ ...form, title: form.title.trim() }, listId);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-lift">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold text-ink">{task ? "Task details" : "Create a task"}</h2>
          <button type="button" className="icon-btn" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="space-y-5 p-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Title</span>
            <input
              className="field"
              required
              autoFocus
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="What needs to be done?"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Description</span>
            <textarea
              className="field min-h-32 resize-y"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Add context, acceptance criteria, or notes…"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <CalendarDays size={15} /> Due date
              </span>
              <input
                className="field"
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Flag size={15} /> Priority
              </span>
              <select
                className="field"
                value={form.priority}
                onChange={(event) => setForm({ ...form, priority: event.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between border-t bg-slate-50 px-5 py-4">
          {task ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
              onClick={() => onDelete(task)}
            >
              <Trash2 size={16} /> Delete task
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" disabled={pending}>
              {pending ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
