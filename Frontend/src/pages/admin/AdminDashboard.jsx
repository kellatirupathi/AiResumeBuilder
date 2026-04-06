import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Users, FileText, UserCheck, TrendingUp, BarChart2, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminDashboardStatsQuery } from "@/hooks/useAdminQueryData";

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

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function MiniBarChart({ data, color }) {
  if (!data || data.length === 0)
    return <div className="flex h-full items-center justify-center text-xs text-gray-400">No data yet</div>;
  const max = Math.max(...data.map((d) => d.count), 1);
  // show fewer labels to avoid clutter
  const labelStep = data.length <= 7 ? 1 : data.length <= 30 ? 7 : 15;
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 items-end gap-px">
        {data.map((d, i) => (
          <div key={d._id} className="group relative flex flex-1 flex-col items-center justify-end h-full">
            <div
              className={`w-full rounded-t ${color} opacity-75 group-hover:opacity-100 transition-all`}
              style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
            />
            {d.count > 0 && (
              <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-gray-800 px-1.5 py-0.5 text-xs text-white group-hover:block whitespace-nowrap z-10 pointer-events-none">
                {d._id.slice(5)}: {d.count}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 px-0.5">
        {data.map((d, i) => (
          <span key={d._id} className="flex-1 text-center" style={{ visibility: i % labelStep === 0 || i === data.length - 1 ? "visible" : "hidden" }}>
            {d._id.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

const DONUT_COLORS = [
  "#6366f1", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

const PROFILE_COMPLETION_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
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
    return <div className="flex h-full items-center justify-center text-xs text-gray-400">No data yet</div>;

  return (
    <div className="flex items-center gap-4 h-full">
      <svg viewBox="0 0 120 120" className="h-28 w-28 flex-shrink-0">
        {segments.map((seg, i) => (
          <path key={i} d={seg.path} fill={seg.color} className="hover:opacity-80 transition-opacity cursor-pointer">
            <title>{seg._id}: {seg.count} ({seg.pct}%)</title>
          </path>
        ))}
        {/* centre hole */}
        <circle cx="60" cy="60" r="24" fill="white" />
        <text x="60" y="64" textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="600">{total}</text>
      </svg>
      <div className="flex-1 space-y-1.5 min-w-0">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-gray-600 truncate capitalize flex-1">{seg._id}</span>
            <span className="text-xs font-semibold text-gray-700 flex-shrink-0">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileCompletionDistribution({ data, averageCompletion, fieldCount }) {
  const { total, segments } = buildDonutSegments(data, PROFILE_COMPLETION_COLORS);

  if (total === 0) {
    return <div className="flex h-full min-h-[240px] items-center justify-center text-xs text-gray-400">No profile data yet</div>;
  }

  return (
    <div className="flex h-full flex-col gap-5 md:flex-row md:items-center md:gap-6">
      <div className="flex flex-col items-center md:w-44 md:flex-shrink-0">
        <svg viewBox="0 0 120 120" className="h-32 w-32 flex-shrink-0">
          {segments.map((seg, i) => (
            <path key={i} d={seg.path} fill={seg.color} className="hover:opacity-80 transition-opacity cursor-pointer">
              <title>{seg._id}: {seg.count} users ({seg.pct}%)</title>
            </path>
          ))}
          <circle cx="60" cy="60" r="24" fill="white" />
          <text x="60" y="58" textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">{averageCompletion}%</text>
          <text x="60" y="69" textAnchor="middle" fontSize="6" fill="#6b7280" fontWeight="600">avg filled</text>
        </svg>
        <p className="mt-2 text-center text-xs text-gray-400">
          Based on {fieldCount} profile fields and sections
        </p>
      </div>

      <div className="flex-1 space-y-2.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
            <span className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <p className="min-w-0 flex-1 text-sm font-medium text-gray-700">
              {PROFILE_COMPLETION_LABELS[seg._id] || seg._id} complete <span className="text-gray-400">&rarr;</span> <span className="font-semibold text-gray-800">{seg.count} users</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Resume Completion Donut ──────────────────────────────────────────────────

const RESUME_COMPLETION_COLORS = ["#6366f1", "#e5e7eb"];

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
    return <div className="flex h-full min-h-[240px] items-center justify-center text-xs text-gray-400">No user data yet</div>;
  }

  return (
    <div className="flex h-full flex-col gap-5 md:flex-row md:items-center md:gap-6">
      <div className="flex flex-col items-center md:w-44 md:flex-shrink-0">
        <svg viewBox="0 0 120 120" className="h-32 w-32 flex-shrink-0">
          {segments.map((seg, i) => (
            <path key={i} d={seg.path} fill={seg.color} className="hover:opacity-80 transition-opacity cursor-pointer">
              <title>{seg._id}: {seg.count} users ({seg.pct}%)</title>
            </path>
          ))}
          <circle cx="60" cy="60" r="24" fill="white" />
          <text x="60" y="58" textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">{rate}%</text>
          <text x="60" y="69" textAnchor="middle" fontSize="6" fill="#6b7280" fontWeight="600">completed</text>
        </svg>
        <p className="mt-2 text-center text-xs text-gray-400">{label}</p>
      </div>

      <div className="flex-1 space-y-2.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
            <span className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <p className="min-w-0 flex-1 text-sm font-medium text-gray-700">
              {seg._id} <span className="text-gray-400">&rarr;</span> <span className="font-semibold text-gray-800">{seg.count} users</span>
            </p>
          </div>
        ))}
        <p className="text-xs text-gray-400 pt-1">{usersWithResumes} out of {totalUsers} users have at least 1 resume</p>
      </div>
    </div>
  );
}

function CompletionInsightsCard({ stats }) {
  return (
    <Tabs defaultValue="resume" className="flex h-full flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Completion Insights</h3>
        </div>
        <TabsList className="grid h-auto w-full grid-cols-2 bg-gray-100 p-1 sm:w-auto">
          <TabsTrigger value="resume" className="h-full whitespace-normal px-2 py-1.5 text-[11px] leading-4 text-center sm:text-xs">
            Resume Completion Rate
          </TabsTrigger>
          <TabsTrigger value="profile" className="h-full whitespace-normal px-2 py-1.5 text-[11px] leading-4 text-center sm:text-xs">
            Profile Completion %
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="resume" className="mt-0 flex-1">
        <p className="mb-4 text-xs text-gray-400">Users who have created at least 1 resume</p>
        <ResumeCompletionDonut
          rate={stats?.completionRate ?? 0}
          usersWithResumes={stats?.usersWithResumes ?? 0}
          totalUsers={stats?.totalUsers ?? 0}
        />
      </TabsContent>

      <TabsContent value="profile" className="mt-0 flex-1">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">Distribution by how complete each user profile is</p>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
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
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            value === p.value
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

const STAT_CARDS = (stats) => [
  { label: "Total Users", value: stats.totalUsers, icon: Users, light: "bg-indigo-50 text-indigo-700", path: "/admin/users" },
  { label: "Total Resumes", value: stats.totalResumes, icon: FileText, light: "bg-blue-50 text-blue-700", path: "/admin/resumes" },
  { label: "New Users Today", value: `+${stats.newUsersToday ?? 0}`, icon: TrendingUp, light: "bg-emerald-50 text-emerald-700", path: "/admin/users" },
  { label: "New Resumes Today", value: `+${stats.newResumesToday ?? 0}`, icon: BarChart2, light: "bg-amber-50 text-amber-700", path: "/admin/resumes" },
  { label: "Users with Resumes", value: stats.usersWithResumes, icon: UserCheck, light: "bg-purple-50 text-purple-700", path: "/admin/users" },
  { label: "Avg Resumes / User", value: stats.avgResumesPerUser, icon: BarChart2, light: "bg-cyan-50 text-cyan-700", path: null },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(30);
  const statsQuery = useAdminDashboardStatsQuery(period);
  const stats = statsQuery.data;
  const loading = statsQuery.isPending && !stats;
  const refreshing = statsQuery.isFetching && !loading;
  const userGrowth = useMemo(() => fillDays(stats?.userGrowth || [], period), [stats?.userGrowth, period]);
  const resumeGrowth = useMemo(() => fillDays(stats?.resumeGrowth || [], period), [stats?.resumeGrowth, period]);

  const handlePeriodChange = (days) => {
    setPeriod(days);
  };

  const handleRefresh = async () => {
    await statsQuery.refetch();
    toast.success("Stats refreshed");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-0.5 text-xs text-gray-500">Platform overview</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </header>

      <main className="flex-1 p-6 space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS(stats || {}).map(({ label, value, icon: Icon, light, path }) => (
            <div
              key={label}
              onClick={() => path && navigate(path)}
              className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4 ${path ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${light}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
              </div>
              {path && <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Growth Trends</h2>
          <PeriodToggle value={period} onChange={handlePeriodChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">User Signups</h3>
                <p className="text-xs text-gray-400">Last {period} days</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                +{stats?.newUsersToday || 0} today
              </span>
            </div>
            <div className="h-36">
              <MiniBarChart data={userGrowth} color="bg-indigo-400" />
            </div>
          </div>

          {/* Resume Growth */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Resumes Created</h3>
                <p className="text-xs text-gray-400">Last {period} days</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                +{stats?.newResumesToday || 0} today
              </span>
            </div>
            <div className="h-36">
              <MiniBarChart data={resumeGrowth} color="bg-blue-400" />
            </div>
          </div>
        </div>

        {/* ── Bottom row: Donut + Completion Rate ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Templates Donut */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Top Resume Templates</h3>
              <p className="text-xs text-gray-400">Distribution across all resumes</p>
            </div>
            <div className="h-36">
              <DonutChart data={stats?.templateDist || []} />
            </div>
          </div>

          {/* Completion Insights */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <CompletionInsightsCard stats={stats} />
          </div>
        </div>


      </main>
    </div>
  );
}
