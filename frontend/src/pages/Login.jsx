import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to log in");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7faf9] px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded bg-mint text-white">SS</div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Exchange skills with credits, not cash.</p>
        </div>
        {error ? <p className="mb-4 rounded border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
        <label className="mb-4 block text-sm font-medium">
          Email
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label className="mb-5 block text-sm font-medium">
          Password
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        <button className="focus-ring flex w-full items-center justify-center gap-2 rounded bg-ink px-4 py-2 font-semibold text-white hover:bg-slate-700">
          <LogIn size={18} />
          Login
        </button>
        <p className="mt-4 text-center text-sm text-slate-600">
          New here?{" "}
          <Link className="font-semibold text-mint" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
