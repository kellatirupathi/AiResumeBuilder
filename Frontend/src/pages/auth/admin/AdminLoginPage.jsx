import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "@/Services/adminApi";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  LoaderCircle,
  ShieldCheck,
  LayoutDashboard,
  BellRing,
  Users,
} from "lucide-react";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Protected admin access",
    description: "Restricted sign-in for operator workflows.",
  },
  {
    icon: LayoutDashboard,
    title: "Operational visibility",
    description: "Track resumes, invites, notifications, and growth.",
  },
  {
    icon: BellRing,
    title: "Automated follow-up",
    description: "Run reminders and resume-link processing automatically.",
  },
];

const STATS = [
  { label: "Ops Surface", value: "Users + Resumes", icon: Users },
  { label: "Access Mode", value: "Admin Only", icon: ShieldCheck },
];

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await loginAdmin({ email, password });
      toast.success("Admin login successful", {
        description: "Redirecting to dashboard...",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Login failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#f4efe8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.14),_transparent_34%)]" />

      <div className="relative grid h-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:flex lg:flex-col lg:justify-between overflow-hidden border-r border-black/5 bg-[#111827] px-10 py-8 text-white">
          <div>
            <div className="flex items-center gap-3">
              <NxtResumeLogoMark className="h-11 w-11" />
              <div>
                <p className="text-xl font-semibold tracking-tight">NxtResume</p>
                <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Admin Console</p>
              </div>
            </div>

            <div className="mt-12 max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-orange-300">
                Operator Access
              </p>
              <h1 className="mt-4 text-[42px] font-semibold leading-[1.08]">
                Control the resume platform without losing operational clarity.
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-6 text-slate-300">
                Review system activity, manage invites, monitor resume processing, and
                handle admin workflows from a single protected surface.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-3">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
                <div className="flex items-center gap-2 text-orange-300">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.24em]">{label}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex h-full items-center justify-center overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <NxtResumeLogoMark className="h-10 w-10" />
              <div>
                <p className="text-lg font-semibold text-slate-900">NxtResume</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-orange-600">
                  Admin Console
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-7">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-orange-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Login
                </div>
                <h2 className="mt-3 text-[30px] font-semibold tracking-tight text-slate-900">
                  Sign in to admin
                </h2>
                <p className="mt-2 text-sm leading-5 text-slate-500">
                  Use your admin credentials to access dashboard operations and management tools.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-orange-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((currentValue) => !currentValue)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-[#ea580c] text-white shadow-[0_12px_30px_rgba(234,88,12,0.28)] transition hover:bg-[#c2410c]"
                >
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4.5 w-4.5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Access Notice</p>
                <p className="mt-2 text-sm leading-5 text-slate-600">
                  This panel is reserved for admins. Standard user accounts should sign in through the main application.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminLoginPage;
