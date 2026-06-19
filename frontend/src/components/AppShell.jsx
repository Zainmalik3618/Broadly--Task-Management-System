import { LogOut, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";

export const AppShell = ({ boards = [], onCreateBoard, children }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r bg-white p-4">
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <button className="icon-btn lg:hidden" onClick={() => setOpen(false)}><X size={19} /></button>
      </div>
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Your boards</span>
        <button className="icon-btn h-7 w-7" onClick={onCreateBoard} aria-label="Create board"><Plus size={16} /></button>
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {boards.map((board) => {
          const active = location.pathname === `/boards/${board.id}`;
          return (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded ${active ? "bg-brand-500" : "bg-slate-300"}`} />
              <span className="truncate">{board.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
          <button className="icon-btn" onClick={logout} title="Log out"><LogOut size={17} /></button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {open && (
        <>
          <button className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebar}</div>
        </>
      )}
      <div className="min-w-0 flex-1 lg:pl-64">
        <button
          className="fixed left-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-xl border bg-white shadow-card lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};
