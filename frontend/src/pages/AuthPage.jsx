import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export const AuthPage = ({ mode }) => {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/boards" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await (isRegister ? register(form) : login(form));
      navigate(location.state?.from || "/boards", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div className="max-w-lg">
          <p className="mb-5 text-sm font-bold uppercase tracking-[.25em] text-brand-100">Make work visible</p>
          <h1 className="text-5xl font-extrabold leading-tight">Small boards.<br />Big momentum.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            A focused workspace for turning ideas into clear, manageable next steps.
          </p>
          <div className="mt-9 space-y-4 text-sm text-slate-300">
            {["Drag work forward", "Prioritize what matters", "Stay clear on deadlines"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-brand-100" /> {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-500">Simple on purpose.</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-extrabold text-ink">{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-slate-500">
            {isRegister ? "Start organizing your work in minutes." : "Sign in to pick up where you left off."}
          </p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            {isRegister && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Name</span>
                <input
                  className="field"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Alex Morgan"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Email</span>
              <input
                className="field"
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Password</span>
              <input
                className="field"
                required
                minLength={6}
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="At least 6 characters"
              />
            </label>
            {error && <p className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full" disabled={pending}>
              {pending ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <ArrowRight size={17} />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? "Already have an account?" : "New to Boardly?"}{" "}
            <Link className="font-bold text-brand-600 hover:text-brand-700" to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};
