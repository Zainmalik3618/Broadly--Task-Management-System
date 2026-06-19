import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { InlineForm } from "./InlineForm";
import { TaskCard } from "./TaskCard";

export const ListColumn = ({ list, onAddTask, onEditList, onDeleteList, onOpenTask }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <section className="w-[85vw] max-w-[320px] shrink-0 sm:w-80">
      <div className="rounded-2xl border bg-slate-100/80 p-2.5">
        <div className="mb-2 flex min-h-10 items-center gap-2 px-1.5">
          {editing ? (
            <div className="flex-1">
              <InlineForm
                initialValue={list.title}
                onCancel={() => setEditing(false)}
                onSubmit={async (title) => {
                  await onEditList(list.id, title);
                  setEditing(false);
                }}
              />
            </div>
          ) : (
            <>
              <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{list.title}</h3>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500">
                {list.tasks.length}
              </span>
              <div className="relative">
                <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}><MoreHorizontal size={18} /></button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border bg-white p-1.5 shadow-lift">
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() => { setEditing(true); setMenuOpen(false); }}
                    >
                      <Pencil size={15} /> Rename
                    </button>
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={() => { onDeleteList(list); setMenuOpen(false); }}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <Droppable droppableId={String(list.id)}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-16 space-y-2.5 rounded-xl transition ${
                snapshot.isDraggingOver ? "bg-brand-50/80 p-1.5" : ""
              }`}
            >
              {list.tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onClick={onOpenTask} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800"
          onClick={() => onAddTask(list.id)}
        >
          <Plus size={17} /> Add a task
        </button>
      </div>
    </section>
  );
};
