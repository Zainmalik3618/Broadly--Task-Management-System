import { DragDropContext } from "@hello-pangea/dnd";
import { ChevronLeft, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { InlineForm } from "../components/InlineForm";
import { ListColumn } from "../components/ListColumn";
import { Spinner } from "../components/Spinner";
import { TaskModal } from "../components/TaskModal";
import { api } from "../services/api";

export const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [taskModal, setTaskModal] = useState({ open: false, task: null, listId: null });
  const [confirm, setConfirm] = useState(null);
  const [pending, setPending] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [boardData, boardsData] = await Promise.all([api.board(id), api.boards()]);
      setBoard(boardData.board);
      setBoards(boardsData.boards);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const perform = async (action) => {
    setPending(true);
    setError("");
    try {
      return await action();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPending(false);
    }
  };

  const updateBoardTitle = async (title) => {
    const { board: updated } = await perform(() => api.updateBoard(board.id, { title }));
    setBoard((current) => ({ ...current, title: updated.title }));
    setBoards((current) => current.map((item) => item.id === updated.id ? { ...item, title } : item));
    setEditingTitle(false);
  };

  const addList = async (title) => {
    const { list } = await perform(() => api.createList(board.id, { title }));
    setBoard((current) => ({ ...current, lists: [...current.lists, list] }));
    setAddingList(false);
  };

  const editList = async (listId, title) => {
    await perform(() => api.updateList(listId, { title }));
    setBoard((current) => ({
      ...current,
      lists: current.lists.map((list) => list.id === listId ? { ...list, title } : list)
    }));
  };

  const saveTask = async (form, listId) => {
    await perform(async () => {
      if (taskModal.task) {
        const { task } = await api.updateTask(taskModal.task.id, form);
        setBoard((current) => ({
          ...current,
          lists: current.lists.map((list) => ({
            ...list,
            tasks: list.tasks.map((item) => item.id === task.id ? task : item)
          }))
        }));
      } else {
        const { task } = await api.createTask(listId, form);
        setBoard((current) => ({
          ...current,
          lists: current.lists.map((list) =>
            list.id === listId ? { ...list, tasks: [...list.tasks, task] } : list
          )
        }));
      }
      setTaskModal({ open: false, task: null, listId: null });
    });
  };

  const deleteConfirmed = async () => {
    const item = confirm;
    await perform(async () => {
      if (item.type === "board") {
        await api.deleteBoard(board.id);
        navigate("/boards");
      } else if (item.type === "list") {
        await api.deleteList(item.data.id);
        setBoard((current) => ({ ...current, lists: current.lists.filter((list) => list.id !== item.data.id) }));
      } else {
        await api.deleteTask(item.data.id);
        setBoard((current) => ({
          ...current,
          lists: current.lists.map((list) => ({
            ...list,
            tasks: list.tasks.filter((task) => task.id !== item.data.id)
          }))
        }));
        setTaskModal({ open: false, task: null, listId: null });
      }
      setConfirm(null);
    });
  };

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const previous = board;
    const nextLists = board.lists.map((list) => ({ ...list, tasks: [...list.tasks] }));
    const sourceList = nextLists.find((list) => String(list.id) === source.droppableId);
    const targetList = nextLists.find((list) => String(list.id) === destination.droppableId);
    const [moved] = sourceList.tasks.splice(source.index, 1);
    moved.list_id = targetList.id;
    targetList.tasks.splice(destination.index, 0, moved);
    setBoard({ ...board, lists: nextLists });

    try {
      const { board: updated } = await api.moveTask(Number(draggableId), {
        listId: targetList.id,
        position: destination.index
      });
      setBoard(updated);
    } catch (err) {
      setBoard(previous);
      setError(err.message);
    }
  };

  if (loading) return <AppShell boards={boards}><Spinner fullPage /></AppShell>;

  if (!board) {
    return (
      <AppShell boards={boards}>
        <main className="grid min-h-screen place-items-center p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold text-ink">Board unavailable</h1>
            <p className="mt-2 text-slate-500">{error || "This board could not be found."}</p>
            <Link className="btn-primary mt-5" to="/boards">Back to boards</Link>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell boards={boards} onCreateBoard={() => navigate("/boards")}>
      <main className="flex min-h-screen flex-col pt-16 lg:pt-0">
        <header className="flex flex-wrap items-center gap-3 border-b bg-white px-5 py-4 sm:px-7">
          <Link to="/boards" className="icon-btn"><ChevronLeft size={20} /></Link>
          {editingTitle ? (
            <div className="w-72"><InlineForm initialValue={board.title} onSubmit={updateBoardTitle} onCancel={() => setEditingTitle(false)} /></div>
          ) : (
            <h1 className="min-w-0 flex-1 truncate text-xl font-extrabold text-ink">{board.title}</h1>
          )}
          <div className="relative ml-auto">
            <button className="btn-secondary px-3" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border bg-white p-1.5 shadow-lift">
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={() => { setEditingTitle(true); setMenuOpen(false); }}
                >
                  <Pencil size={15} /> Rename board
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => { setConfirm({ type: "board", data: board }); setMenuOpen(false); }}
                >
                  <Trash2 size={15} /> Delete board
                </button>
              </div>
            )}
          </div>
        </header>
        {error && <p className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7">{error}</p>}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board-scroll flex flex-1 items-start gap-4 overflow-x-auto p-5 sm:p-7">
            {board.lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                onAddTask={(listId) => setTaskModal({ open: true, task: null, listId })}
                onOpenTask={(task) => setTaskModal({ open: true, task, listId: task.list_id })}
                onEditList={editList}
                onDeleteList={(data) => setConfirm({ type: "list", data })}
              />
            ))}
            <div className="w-[85vw] max-w-[320px] shrink-0 sm:w-80">
              {addingList ? (
                <div className="rounded-2xl border bg-white p-3 shadow-card">
                  <InlineForm placeholder="List title" onSubmit={addList} onCancel={() => setAddingList(false)} />
                </div>
              ) : (
                <button
                  className="flex w-full items-center gap-2 rounded-2xl border border-dashed bg-white/70 px-4 py-3.5 text-sm font-semibold text-slate-500 transition hover:border-brand-300 hover:bg-white hover:text-brand-700"
                  onClick={() => setAddingList(true)}
                >
                  <Plus size={18} /> Add another list
                </button>
              )}
            </div>
          </div>
        </DragDropContext>
      </main>
      <TaskModal
        {...taskModal}
        pending={pending}
        onClose={() => setTaskModal({ open: false, task: null, listId: null })}
        onSave={saveTask}
        onDelete={(data) => setConfirm({ type: "task", data })}
      />
      <ConfirmDialog
        open={Boolean(confirm)}
        pending={pending}
        title={`Delete this ${confirm?.type || "item"}?`}
        text={
          confirm?.type === "board"
            ? "Every list and task on this board will be permanently deleted."
            : confirm?.type === "list"
              ? "Every task in this list will be permanently deleted."
              : "This task will be permanently deleted."
        }
        onClose={() => setConfirm(null)}
        onConfirm={deleteConfirmed}
      />
    </AppShell>
  );
};
