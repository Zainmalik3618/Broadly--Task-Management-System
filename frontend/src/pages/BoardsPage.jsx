import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { EmptyState } from "../components/EmptyState";
import { InlineForm } from "../components/InlineForm";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.boards()
      .then((data) => setBoards(data.boards))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createBoard = async (title) => {
    const { board } = await api.createBoard({ title });
    navigate(`/boards/${board.id}`);
  };

  return (
    <AppShell boards={boards} onCreateBoard={() => setCreating(true)}>
      <main className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-600">Workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold text-ink">Good to see you, {user?.name?.split(" ")[0]}.</h1>
            <p className="mt-2 text-slate-500">Choose a board and keep things moving.</p>
          </div>
          <button className="btn-primary" onClick={() => setCreating(true)}><Plus size={17} /> New board</button>
        </div>
        {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <Spinner /> : boards.length === 0 && !creating ? (
          <EmptyState
            icon={LayoutDashboard}
            title="Create your first board"
            text="Boards give your tasks a home. Start with a project, routine, or anything you want to move forward."
            action={<button className="btn-primary" onClick={() => setCreating(true)}><Plus size={17} /> Create board</button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {creating && (
              <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/40 p-5">
                <p className="mb-3 text-sm font-bold text-ink">Name your board</p>
                <InlineForm placeholder="e.g. Product launch" onSubmit={createBoard} onCancel={() => setCreating(false)} />
              </div>
            )}
            {boards.map((board, index) => (
              <Link
                key={board.id}
                to={`/boards/${board.id}`}
                className="group rounded-2xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
              >
                <div className={`mb-8 h-2 w-12 rounded-full ${["bg-brand-500", "bg-cyan-500", "bg-violet-500"][index % 3]}`} />
                <h2 className="text-lg font-bold text-ink">{board.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{board.list_count} lists · {board.task_count} tasks</p>
                <span className="mt-6 flex items-center gap-1.5 text-sm font-bold text-brand-600">
                  Open board <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
};
