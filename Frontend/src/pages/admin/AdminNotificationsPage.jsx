import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getNotifications, resendNotification, cancelNotification } from "@/Services/adminApi";
import { RefreshCw, Send, XCircle, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPE_LABELS = {
  reminder: "Signup Reminder",
  "download-link": "Drive Link",
};

const TYPE_COLORS = {
  reminder: "bg-indigo-50 text-indigo-700",
  "download-link": "bg-emerald-50 text-emerald-700",
};

const STATUS_COLORS = {
  sent: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const limit = 20;

  const fetchData = useCallback(async (opts = {}) => {
    try {
      const res = await getNotifications({
        page: opts.page ?? page,
        limit,
        type: opts.type ?? filterType,
        status: opts.status ?? filterStatus,
        search: opts.search ?? search,
      });
      setNotifications(res.data?.notifications ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch (err) {
      toast.error("Failed to load notifications", { description: err.message });
    }
  }, [page, filterType, filterStatus, search]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [page, filterType, filterStatus, search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success("Refreshed");
  };

  const handleFilterChange = (key, value) => {
    setPage(1);
    if (key === "type") setFilterType(value);
    if (key === "status") setFilterStatus(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleResend = async (id) => {
    setActionId(id);
    try {
      const res = await resendNotification(id);
      toast.success(res.message || "Notification resent");
      await fetchData();
    } catch (err) {
      toast.error("Resend failed", { description: err.message });
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id) => {
    setActionId(id);
    try {
      await cancelNotification(id);
      toast.success("Notification cancelled");
      await fetchData();
    } catch (err) {
      toast.error("Cancel failed", { description: err.message });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
          <p className="mt-0.5 text-xs text-gray-500">Email notification log — {total} total</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </header>

      <main className="flex-1 p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email..."
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
            />
            <Button type="submit" size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">Search</Button>
            {search && (
              <Button type="button" variant="outline" size="sm" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}>
                Clear
              </Button>
            )}
          </form>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Types</option>
            <option value="reminder">Signup Reminder</option>
            <option value="download-link">Drive Link</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-400">
              <Bell className="h-10 w-10 opacity-30" />
              <p className="text-sm">No notifications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3 text-left">User</th>
                    <th className="px-5 py-3 text-left">Type</th>
                    <th className="px-5 py-3 text-left">Resume</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Sent At</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <tr key={n._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-800">{n.userName || "—"}</p>
                        <p className="text-xs text-gray-400">{n.userEmail}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge label={TYPE_LABELS[n.type] ?? n.type} colorClass={TYPE_COLORS[n.type] ?? "bg-gray-100 text-gray-600"} />
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-gray-600 truncate max-w-[140px]">{n.resumeTitle || "—"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <Badge label={n.status} colorClass={STATUS_COLORS[n.status] ?? "bg-gray-100 text-gray-600"} />
                          {n.status === "failed" && n.errorMessage && (
                            <p className="mt-0.5 text-[10px] text-red-400 max-w-[160px] truncate" title={n.errorMessage}>{n.errorMessage}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{formatDate(n.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {n.status !== "cancelled" && (
                            <>
                              <button
                                onClick={() => handleResend(n._id)}
                                disabled={actionId === n._id}
                                title="Resend"
                                className="flex items-center gap-1 rounded-lg border border-indigo-200 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                              >
                                <Send className="h-3 w-3" />
                                Resend
                              </button>
                              <button
                                onClick={() => handleCancel(n._id)}
                                disabled={actionId === n._id}
                                title="Cancel"
                                className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                              >
                                <XCircle className="h-3 w-3" />
                                Cancel
                              </button>
                            </>
                          )}
                          {n.status === "cancelled" && (
                            <span className="text-xs text-gray-400 italic">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Page {page} of {totalPages} &mdash; {total} records</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
