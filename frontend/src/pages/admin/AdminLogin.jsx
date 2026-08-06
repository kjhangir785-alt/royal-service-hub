import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiError } from "@/lib/api";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(apiError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-[#d4af37]/50 font-display text-xl text-[#d4af37]">B</span>
          <span className="font-display text-lg tracking-tight text-white">THE BULLET <span className="gold-text">ZONE</span></span>
        </Link>
        <form onSubmit={submit} className="border border-white/10 bg-[#111111] p-8" data-testid="admin-login-form">
          <div className="mb-6 flex items-center gap-3">
            <Lock className="h-5 w-5 text-[#d4af37]" />
            <h1 className="font-display text-2xl tracking-tight text-white">Owner Login</h1>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-body text-[11px] uppercase tracking-widest text-white/50">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="admin-login-email"
                className="w-full rounded-none border border-white/15 bg-[#0a0a0a] px-3 py-3 font-body text-sm text-white outline-none focus:border-[#d4af37]" placeholder="you@thebulletzone.in" />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-body text-[11px] uppercase tracking-widest text-white/50">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="admin-login-password"
                className="w-full rounded-none border border-white/15 bg-[#0a0a0a] px-3 py-3 font-body text-sm text-white outline-none focus:border-[#d4af37]" placeholder="••••••••" />
            </label>
          </div>
          <button type="submit" disabled={loading} data-testid="admin-login-submit"
            className="mt-6 flex w-full items-center justify-center gap-2 border border-[#d4af37] bg-[#d4af37] px-6 py-3.5 font-body text-sm uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-[#d4af37] disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
          <Link to="/" className="mt-4 block text-center font-body text-xs text-white/40 hover:text-[#d4af37]">← Back to website</Link>
        </form>
      </div>
    </div>
  );
}
