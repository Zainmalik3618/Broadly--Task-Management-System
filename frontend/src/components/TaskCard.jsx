import { CalendarDays, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

const priorityStyle = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700"
};

const formatDate = (date) => {
  if (!date) return null;
  const dateOnly = String(date).slice(0, 10);
  const parsedDate = new Date(`${dateOnly}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(parsedDate);
};

export const TaskCard = ({ task, index, onClick }) => (
  <Draggable draggableId={String(task.id)} index={index}>
    {(provided, snapshot) => (
      <article
        ref={provided.innerRef}
        {...provided.draggableProps}
        onClick={() => onClick(task)}
        className={`group cursor-pointer rounded-xl border bg-white p-3.5 shadow-card transition hover:border-brand-200 ${
          snapshot.isDragging ? "rotate-2 shadow-lift" : ""
        }`}
      >
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-sm font-semibold leading-5 text-ink">{task.title}</p>
          <span
            {...provided.dragHandleProps}
            onClick={(event) => event.stopPropagation()}
            className="mt-0.5 text-slate-300 opacity-0 transition group-hover:opacity-100"
          >
            <GripVertical size={16} />
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${priorityStyle[task.priority]}`}>
            {task.priority}
          </span>
          {task.due_date && (
            <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <CalendarDays size={13} />
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </article>
    )}
  </Draggable>
);
