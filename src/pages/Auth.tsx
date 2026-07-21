import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Added Eye and EyeOff to the lucide-react imports
import { Sparkles, Mail, Lock, Loader2, ArrowRight, User as UserIcon, Eye, EyeOff } from "lucide-react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 2. State to manage password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const { user, demoSignIn } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (acc: { displayName: string; email: string }) => {
    demoSignIn({ displayName: acc.displayName, email: acc.email });
    toast.success(`Signed in as ${acc.displayName} (demo)`);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    document.title = mode === "login" ? "Sign in · OperatorDocks" : "Create account · OperatorDocks";
  }, [mode]);

  const handleGoogle = async () => {
    try {
      setBusy(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google");
      navigate("/", { replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password");
    if (mode === "signup" && !fullName.trim())
      return toast.error("Please enter your full name");
    try {
      setBusy(true);
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back");
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName.trim() });
        toast.success("Account created");
      }
      navigate("/", { replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-brand/20 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-glow/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(154,237,102,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(154,237,102,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left — brand story */}
        <div className="hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="OperatorDocks Logo"
              className="w-40 h-auto object-contain"
            />
          </div>

          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs text-brand">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand" />
              Enterprise-grade workforce orchestration
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] xl:text-5xl">
              Orchestrate humans,{" "}
              <span className="text-gradient">AI agents & digital workers</span> from one control
              plane.
            </h1>
            <p className="text-base text-muted-foreground">
              Intelligent scheduling, workload balancing, performance analytics, and operational
              forecasting unified for the AI-first enterprise.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-6">
              {[
                { k: "Agents", v: "128" },
                { k: "Tasks / day", v: "24.6K" },
                { k: "Uptime", v: "99.98%" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="glass-panel rounded-xl p-4"
                >
                  <div className="font-display text-2xl font-semibold text-white">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.k}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OperatorDocks. All rights reserved.
          </div>
        </div>

        {/* Right — auth card */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <div className="brand-gradient grid h-9 w-9 place-items-center rounded-xl">
                <Sparkles className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="font-display text-base font-semibold">OperatorDocks</div>
            </div>

            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-white">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your workforce control plane."
                  : "Start orchestrating your AI workforce today."}
              </p>
            </div>

            <button
              onClick={handleGoogle}
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white/95 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-white disabled:opacity-60"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or with email
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleEmail} className="space-y-3">
              {mode === "signup" && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Full name
                  </span>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </label>
              
              {/* 3. Modified Password section */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-10 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="brand-gradient group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-glow transition hover:opacity-95 disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign in" : "Create account"}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New to OperatorDocks?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setShowPassword(false); // Optional: Reset toggle on mode swap
                }}
                className="font-semibold text-brand hover:underline"
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12A6.99 6.99 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}