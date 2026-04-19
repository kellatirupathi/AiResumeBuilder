import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  UserCheck,
  TrendingUp,
  BarChart2,
  RefreshCw,
  ArrowUpRight,
  Mail,
  Link2,
  Bell,
  Fingerprint,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminDashboardStatsQuery } from "@/hooks/useAdminQueryData";

const DISPLAY_FONT = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fillDays(rawData, days) {
  const map = Object.fromEntries(rawData.map((d) => [d._id, d.count]));
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ _id: key, count: map[key] || 0 });
  }
  return result;
}

function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  return value;
}

function greetingFor(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function MiniBarChart({ data, color }) {
  if (!data || data.length === 0)
    return (
      <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
        No data yet
      </div>
    );
  const max = Math.max(...data.map((d) => d.count), 1);
  const labelStep = data.length <= 7 ? 1 : data.length <= 30 ? 7 : 15;
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-end gap-px">
        {data.map((d) => (
          <div
            key={d._id}
            className="group relative flex h-full flex-1 flex-col items-center justify-end"
          >
            <div
              className="w-full rounded-t-[2px] opacity-80 transition-all group-hover:opacity-100"
              style={{
                height: `${Math.max(3, (d.count / max) * 100)}%`,
                backgroundColor: color,
              }}
            />
            {d.count > 0 && (
              <div className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                {d._id.slice(5)}: {d.count}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between px-0.5 text-[9px] text-slate-400">
        {data.map((d, i) => (
          <span
            key={d._id}
            className="flex-1 text-center"
            style={{
              visibility:
                i % labelStep === 0 || i === data.length - 1
                  ? "visible"
                  : "hidden",
            }}
          >
            {d._id.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

const DONUT_COLORS = [
  "#0F172A",
  "#475569",
  "#94A3B8",
  "#CBD5E1",
  "#FF4800",
  "#FB923C",
  "#F59E0B",
  "#E2E8F0",
];

const PROFILE_COMPLETION_COLORS = ["#E2E8F0", "#CBD5E1", "#64748B", "#0F172A"];
const PROFILE_COMPLETION_LABELS = {
  "0-25%": "0\u201325%",
  "26-50%": "26\u201350%",
  "51-75%": "51\u201375%",
  "76-100%": "76\u2013100%",
};

function buildDonutSegments(data, colors = DONUT_COLORS) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return { total: 0, segments: [] };
  }

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = d.count / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const r = 40;
    const cx = 60;
    const cy = 60;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[i % colors.length],
      pct: Math.round(pct * 100),
    };
  });

  return { total, segments };
}

function DonutChart({ data }) {
  const { total, segments } = buildDonutSegments(data);
  if (total === 0)
    return (
      <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
        No data yet
      </div>
    );

  return (
    <div className="flex h-full items-center gap-5">
      <svg viewBox="0 0 120 120" className="h-28 w-28 flex-shrink-0">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.path}
            fill={seg.color}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            <title>
              {seg._id}: {seg.count} ({seg.pct}%)
            </title>
          </path>
        ))}
        <circle cx="60" cy="60" r="24" fill="white" />
        <text
          x="60"
          y="64"
          textAnchor="middle"
          fontSize="11"
          fill="#0F172A"
          fontWeight="600"
        >
          {total}
        </text>
      </svg>
      <div className="min-w-0 flex-1 space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-[2px]"
              style={{ backgroundColor: seg.color }}
            />
            <span className="flex-1 truncate text-[12px] capitalize text-slate-600">
              {seg._id}
            </span>
            <span className="flex-shrink-0 text-[12px] font-semibold text-slate-900">
              {seg.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileCompletionDistribution({ data, averageCompletion, fieldCount }) {
  const { total, segments } = buildDonutSegments(data, PROFILE_COMPLETION_COLORS);

  if (total === 0) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center text-[11px] text-slate-400">
        No profile data yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 md:flex-row md:items-center md:gap-6">
      <div className="flex flex-col items-center md:w-40 md:flex-shrink-0">
        <svg viewBox="0 0 120 120" className="h-32 w-32 flex-shrink-0">
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.path}
              fill={seg.color}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <title>
                {seg._id}: {seg.count} users ({seg.pct}%)
              </title>
            </path>
          ))}
          <circle cx="60" cy="60" r="24" fill="white" />
          <text
            x="60"
            y="58"
            textAnchor="middle"
            fontSize="14"
            fill="#0F172A"
            fontWeight="700"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {averageCompletion}%
          </text>
          <text
            x="60"
            y="69"
            textAnchor="middle"
            fontSize="6"
            fill="#64748B"
            fontWeight="600"
          >
            avg filled
          </text>
        </svg>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          Based on {fieldCount} profile fields
        </p>
      </div>

      <div className="flex-1 space-y-2">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-[2px]"
              style={{ backgroundColor: seg.color }}
            />
            <p className="min-w-0 flex-1 text-[13px] font-medium text-slate-700">
              {PROFILE_COMPLETION_LABELS[seg._id] || seg._id} complete{" "}
              <span className="text-slate-400">&rarr;</span>{" "}
              <span className="font-semibold text-slate-900">
                {seg.count} users
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Resume Completion Donut ──────────────────────────────────────────────────

const RESUME_COMPLETION_COLORS = ["#0F172A", "#E2E8F0"];

function ResumeCompletionDonut({ rate, usersWithResumes, totalUsers }) {
  const without = totalUsers - usersWithResumes;
  const data = [
    { _id: "With Resume", count: usersWithResumes },
    { _id: "Without Resume", count: without },
  ];
  const { total, segments } = buildDonutSegments(data, RESUME_COMPLETION_COLORS);

  const label =
    rate >= 80
      ? "Excellent engagement"
      : rate >= 50
      ? "Good engagement"
      : "Low engagement";

  if (total === 0) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center text-[11px] text-slate-400">
        No user data yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 md:flex-row md:items-center md:gap-6">
      <div className="flex flex-col items-center md:w-40 md:flex-shrink-0">
        <svg viewBox="0 0 120 120" className="h-32 w-32 flex-shrink-0">
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.path}
              fill={seg.color}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <title>
                {seg._id}: {seg.count} users ({seg.pct}%)
              </title>
            </path>
          ))}
          <circle cx="60" cy="60" r="24" fill="white" />
          <text
            x="60"
            y="58"
            textAnchor="middle"
            fontSize="14"
            fill="#0F172A"
            fontWeight="700"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {rate}%
          </text>
          <text
            x="60"
            y="69"
            textAnchor="middle"
            fontSize="6"
            fill="#64748B"
            fontWeight="600"
          >
            completed
          </text>
        </svg>
        <p className="mt-2 text-center text-[10px] text-slate-400">{label}</p>
      </div>

      <div className="flex-1 space-y-2">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-[2px]"
              style={{ backgroundColor: seg.color }}
            />
            <p className="min-w-0 flex-1 text-[13px] font-medium text-slate-700">
              {seg._id} <span className="text-slate-400">&rarr;</span>{" "}
              <span className="font-semibold text-slate-900">
                {seg.count} users
              </span>
            </p>
          </div>
        ))}
        <p className="pt-1 text-[11px] text-slate-400">
          {usersWithResumes} of {totalUsers} users have at least 1 resume
        </p>
      </div>
    </div>
  );
}

function CompletionInsightsCard({ stats }) {
  return (
    <Tabs defaultValue="resume" className="flex h-full flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Insights
          </p>
          <h3
            className="mt-1 text-[20px] font-semibold tracking-tight text-slate-900"
            style={DISPLAY_FONT}
          >
            Completion insights
          </h3>
        </div>
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-full border border-slate-200 bg-white p-1 sm:w-auto">
          <TabsTrigger
            value="resume"
            className="h-full whitespace-normal rounded-full px-3 py-1.5 text-center text-[11px] leading-4 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Resume rate
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="h-full whitespace-normal rounded-full px-3 py-1.5 text-center text-[11px] leading-4 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Profile %
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="resume" className="mt-0 flex-1">
        <p className="mb-4 text-[12px] text-slate-500">
          Users who have created at least 1 resume
        </p>
        <ResumeCompletionDonut
          rate={stats?.completionRate ?? 0}
          usersWithResumes={stats?.usersWithResumes ?? 0}
          totalUsers={stats?.totalUsers ?? 0}
        />
      </TabsContent>

      <TabsContent value="profile" className="mt-0 flex-1">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[12px] text-slate-500">
            Distribution by profile completeness
          </p>
          <span
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700"
          >
            Avg {stats?.averageProfileCompletion ?? 0}%
          </span>
        </div>
        <ProfileCompletionDistribution
          data={stats?.profileCompletionDist || []}
          averageCompletion={stats?.averageProfileCompletion ?? 0}
          fieldCount={stats?.profileCompletionFieldCount ?? 0}
        />
      </TabsContent>
    </Tabs>
  );
}

// ─── Period Toggle ────────────────────────────────────────────────────────────

const PERIODS = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
];

function PeriodToggle({ value, onChange }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-white p-0.5">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
            value === p.value
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const outletCtx = useOutletContext();
  const admin = outletCtx?.admin;
  const [period, setPeriod] = useState(30);
  const statsQuery = useAdminDashboardStatsQuery(period);
  const stats = statsQuery.data;
  const loading = statsQuery.isPending && !stats;
  const refreshing = statsQuery.isFetching && !loading;
  const userGrowth = useMemo(
    () => fillDays(stats?.userGrowth || [], period),
    [stats?.userGrowth, period]
  );
  const resumeGrowth = useMemo(
    () => fillDays(stats?.resumeGrowth || [], period),
    [stats?.resumeGrowth, period]
  );

  const handlePeriodChange = (days) => {
    setPeriod(days);
  };

  const handleRefresh = async () => {
    await statsQuery.refetch();
    toast.success("Stats refreshed");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  const adminFirstName = (admin?.fullName || admin?.name || admin?.email || "")
    .split(" ")[0]
    ?.split("@")[0] || "there";
  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const greeting = greetingFor(today.getHours());

  // Editorial stats row
  const editorialStats = [
    {
      value: formatNumber(stats?.totalUsers),
      label: "Total users",
      path: "/admin/users",
    },
    {
      value: formatNumber(stats?.totalResumes),
      label: "Resumes built",
      path: "/admin/resumes",
    },
    {
      value: `+${stats?.newUsersToday ?? 0}`,
      label: "New signups today",
      path: "/admin/users",
    },
    {
      value: `+${stats?.newResumesToday ?? 0}`,
      label: "Resumes today",
      path: "/admin/resumes",
    },
  ];

  const secondaryStats = [
    {
      label: "Users with resumes",
      value: formatNumber(stats?.usersWithResumes),
      icon: UserCheck,
      path: "/admin/users",
    },
    {
      label: "Avg resumes per user",
      value: stats?.avgResumesPerUser ?? "—",
      icon: BarChart2,
      path: null,
    },
    {
      label: "Completion rate",
      value: `${stats?.completionRate ?? 0}%`,
      icon: TrendingUp,
      path: null,
    },
  ];

  const quickLinks = [
    {
      eyebrow: "Users",
      title: "Manage user accounts",
      body: "Inspect, filter, and moderate every registered user across the platform.",
      to: "/admin/users",
      icon: Users,
    },
    {
      eyebrow: "Resumes",
      title: "Review recent resumes",
      body: "See what's being built today and drill into any user's resume collection.",
      to: "/admin/resumes",
      icon: FileText,
    },
    {
      eyebrow: "Invites",
      title: "Invite new users",
      body: "Generate onboarding links and share access to private cohorts.",
      to: "/admin/invite-users",
      icon: Link2,
    },
    {
      eyebrow: "Notifications",
      title: "Broadcast an update",
      body: "Post platform-wide announcements and track delivery.",
      to: "/admin/notifications",
      icon: Bell,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white text-slate-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-8 py-5 backdrop-blur">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            Admin overview
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 lg:px-8">
        {/* Editorial stats */}
        <section className="mb-14 border-y border-slate-200 bg-[#FAFAF9]">
          <div className="grid grid-cols-2 divide-slate-200 py-8 sm:grid-cols-4 sm:divide-x">
            {editorialStats.map((s, i) => (
              <button
                key={s.label}
                onClick={() => s.path && navigate(s.path)}
                className={`group px-5 py-2 text-left transition-colors sm:text-center ${
                  i === 0 ? "sm:pl-6" : ""
                } ${i === editorialStats.length - 1 ? "sm:pr-6" : ""}`}
              >
                <div
                  className="text-[32px] font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-slate-700 sm:text-[44px]"
                  style={DISPLAY_FONT}
                >
                  {s.value ?? "—"}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {s.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Secondary stat strip */}
        <section className="mb-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {secondaryStats.map(({ label, value, icon: Icon, path }) => (
            <div
              key={label}
              onClick={() => path && navigate(path)}
              className={`rounded-xl border border-slate-200 bg-white p-5 transition-all ${
                path
                  ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon
                  className="h-4 w-4"
                  style={{ color: ACCENT }}
                />
                {path && (
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-700" />
                )}
              </div>
              <p
                className="mt-4 text-[28px] font-semibold tracking-tight text-slate-900"
                style={DISPLAY_FONT}
              >
                {value ?? "—"}
              </p>
              <p className="mt-1 text-[12px] uppercase tracking-wider text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </section>

        {/* Quick links */}
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Shortcuts
              </p>
              <h2
                className="mt-2 text-[30px] font-semibold tracking-tight text-slate-900 sm:text-[36px]"
                style={DISPLAY_FONT}
              >
                Jump back into work.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.button
                  key={link.to}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => navigate(link.to)}
                  className="group rounded-xl border border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: ACCENT }}
                    >
                      <span
                        className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                        style={{ backgroundColor: ACCENT }}
                      />
                      {link.eyebrow}
                    </p>
                    <Icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-700" />
                  </div>
                  <h3
                    className="mt-4 text-[19px] font-semibold leading-tight tracking-tight text-slate-900"
                    style={DISPLAY_FONT}
                  >
                    {link.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    {link.body}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-slate-900">
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Growth header */}
        <section className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Trends
            </p>
            <h2
              className="mt-2 text-[28px] font-semibold tracking-tight text-slate-900 sm:text-[32px]"
              style={DISPLAY_FONT}
            >
              Growth over time.
            </h2>
          </div>
          <PeriodToggle value={period} onChange={handlePeriodChange} />
        </section>

        {/* Growth charts */}
        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Signups
                </p>
                <h3
                  className="mt-1 text-[20px] font-semibold tracking-tight text-slate-900"
                  style={DISPLAY_FONT}
                >
                  User signups
                </h3>
                <p className="mt-1 text-[12px] text-slate-500">
                  Last {period} days
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700">
                +{stats?.newUsersToday || 0} today
              </span>
            </div>
            <div className="h-36">
              <MiniBarChart data={userGrowth} color="#0F172A" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Resumes
                </p>
                <h3
                  className="mt-1 text-[20px] font-semibold tracking-tight text-slate-900"
                  style={DISPLAY_FONT}
                >
                  Resumes created
                </h3>
                <p className="mt-1 text-[12px] text-slate-500">
                  Last {period} days
                </p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
                style={{ backgroundColor: ACCENT }}
              >
                +{stats?.newResumesToday || 0} today
              </span>
            </div>
            <div className="h-36">
              <MiniBarChart data={resumeGrowth} color={ACCENT} />
            </div>
          </div>
        </section>

        {/* Templates + completion */}
        <section className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Templates
              </p>
              <h3
                className="mt-1 text-[20px] font-semibold tracking-tight text-slate-900"
                style={DISPLAY_FONT}
              >
                Top resume templates
              </h3>
              <p className="mt-1 text-[12px] text-slate-500">
                Distribution across all resumes
              </p>
            </div>
            <div className="h-36">
              <DonutChart data={stats?.templateDist || []} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <CompletionInsightsCard stats={stats} />
          </div>
        </section>

        {/* Admin side-menu quick access */}
        <section className="mb-12 rounded-xl border border-slate-200 bg-[#FAFAF9] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            More tools
          </p>
          <h2
            className="mt-2 text-[24px] font-semibold tracking-tight text-slate-900 sm:text-[28px]"
            style={DISPLAY_FONT}
          >
            Everything else, one click away.
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Cover letters", path: "/admin/cover-letters", icon: Mail },
              { label: "Student IDs", path: "/admin/student-ids", icon: Fingerprint },
              { label: "Notifications", path: "/admin/notifications", icon: Bell },
              { label: "Invite users", path: "/admin/invite-users", icon: Link2 },
            ].map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-slate-400"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                <span className="text-[13px] font-medium text-slate-800">
                  {label}
                </span>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-300" />
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
