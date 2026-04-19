import { useState } from "react";
import { toast } from "sonner";
import {
  cancelNotification,
  cancelReminderNotification,
  resendNotification,
  sendReminderNotification,
} from "@/Services/adminApi";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminNotificationsQuery } from "@/hooks/useAdminQueryData";

const TYPE_LABELS = {
  reminder: "Signup Reminder",
  "download-link": "Drive Link",
};

const TYPE_COLORS = {
  reminder: "text-slate-900",
  "download-link": "text-emerald-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  sent: "Sent",
  failed: "Failed",
  cancelled: "Cancelled",
};

const STATUS_COLORS = {
  pending: "text-amber-700",
  sent: "text-green-700",
  failed: "text-red-700",
  cancelled: "text-slate-500",
};

function Badge({ label, colorClass }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}

function RowActionMenu({ children }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1.5">
        <div className="space-y-1">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

function MenuActionButton({
  children,
  onClick,
  disabled = false,
  tone = "default",
}) {
  const toneClass =
    tone === "danger"
      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toneClass}`}
    >
      {children}
    </button>
  );
}

function StageCell({ stage }) {
  const label =
    stage?.status === "na"
      ? "-"
      : STATUS_LABELS[stage?.status] ?? "Pending";
  const colorClass =
    stage?.status === "na"
      ? "text-slate-400"
      : STATUS_COLORS[stage?.status] ?? "text-amber-700";

  return <Badge label={label} colorClass={colorClass} />;
}

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EmptyState({ title, description }) {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
      <Bell className="h-10 w-10 opacity-30" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

export default function AdminNotificationsPage() {
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const limit = 20;
  const notificationsQuery = useAdminNotificationsQuery({
    page,
    limit,
    type: filterType,
    status: filterStatus,
    search,
  });
  const reminderControls = notificationsQuery.data?.reminderControls ?? [];
  const notifications = notificationsQuery.data?.notifications ?? [];
  const total = notificationsQuery.data?.total ?? 0;
  const totalPages = notificationsQuery.data?.totalPages ?? 1;
  const loading = notificationsQuery.isPending && !reminderControls.length && !notifications.length;
  const refreshing = notificationsQuery.isFetching && !loading;

  const handleRefresh = async () => {
    await notificationsQuery.refetch();
    toast.success("Refreshed");
  };

  const handleFilterChange = (key, value) => {
    setPage(1);

    if (key === "type") {
      setFilterType(value);
    }

    if (key === "status") {
      setFilterStatus(value);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handleReminderSend = async (userId, status) => {
    const actionKey = `reminder-send-${userId}`;
    setActionId(actionKey);

    try {
      const response = await sendReminderNotification(userId);
      toast.success(
        response.message ||
          (status === "sent"
            ? "Reminder email resent"
            : "Reminder email sent")
      );
      await notificationsQuery.refetch();
    } catch (error) {
      toast.error("Reminder send failed", {
        description: error.message,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleReminderCancel = async (userId) => {
    const actionKey = `reminder-cancel-${userId}`;
    setActionId(actionKey);

    try {
      const response = await cancelReminderNotification(userId);
      toast.success(response.message || "Reminder cancelled");
      await notificationsQuery.refetch();
    } catch (error) {
      toast.error("Reminder cancel failed", {
        description: error.message,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleHistoryResend = async (id) => {
    const actionKey = `history-resend-${id}`;
    setActionId(actionKey);

    try {
      const response = await resendNotification(id);
      toast.success(response.message || "Notification resent");
      await notificationsQuery.refetch();
    } catch (error) {
      toast.error("Resend failed", {
        description: error.message,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleHistoryCancel = async (id) => {
    const actionKey = `history-cancel-${id}`;
    setActionId(actionKey);

    try {
      const response = await cancelNotification(id);
      toast.success(response.message || "Notification cancelled");
      await notificationsQuery.refetch();
    } catch (error) {
      toast.error("Cancel failed", {
        description: error.message,
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Reminder queue follows cron rules. History below keeps the audit log.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </header>

      <main className="flex-1 space-y-5 p-6">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Reminder Queue
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Users in the current cron window with no resume. Pending and
                failed rows are what cron can still send.
              </p>
            </div>
            <Badge
              label={`${reminderControls.length} users`}
              colorClass="rounded-full bg-slate-100 px-3 py-1 text-slate-900"
            />
          </div>

          <div className="border-b border-slate-100 px-5 py-4">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search queue and history by name or email..."
                className="w-full max-w-sm rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full bg-slate-900 text-white hover:bg-[#FF4800] transition-colors"
              >
                Search
              </Button>
              {search && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                  className="rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
                >
                  Clear
                </Button>
              )}
            </form>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-slate-900" style={{ borderBottomColor: "#FF4800" }} />
            </div>
          ) : reminderControls.length === 0 ? (
            <EmptyState
              title="No reminder candidates"
              description="No users currently match the cron reminder rules."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 text-left">User</th>
                    <th className="px-5 py-3 text-left">Signed Up</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Last Activity</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reminderControls.map((reminder) => (
                    <tr
                      key={reminder.userId}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-slate-900">
                          {reminder.userName || "-"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {reminder.userEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(reminder.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <Badge
                            label={
                              STATUS_LABELS[reminder.currentStatus] ??
                              reminder.currentStatus
                            }
                            colorClass={
                              STATUS_COLORS[reminder.currentStatus] ??
                              "bg-slate-100 text-slate-600"
                            }
                          />
                          {reminder.currentStatus === "failed" &&
                            reminder.lastErrorMessage && (
                              <p
                                className="max-w-[220px] truncate text-[10px] text-red-400"
                                title={reminder.lastErrorMessage}
                              >
                                {reminder.lastErrorMessage}
                              </p>
                            )}
                          {reminder.cronEligible && (
                            <p className="text-[10px] text-amber-600">
                              Cron can still send this reminder.
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {reminder.sentAt ? (
                          <div>
                            <p className="font-medium text-slate-600">
                              Last sent
                            </p>
                            <p>{formatDate(reminder.sentAt)}</p>
                          </div>
                        ) : reminder.latestNotificationAt ? (
                          <div>
                            <p className="font-medium text-slate-600">
                              Last attempt
                            </p>
                            <p>{formatDate(reminder.latestNotificationAt)}</p>
                          </div>
                        ) : (
                          <span>No attempts yet</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {reminder.currentStatus !== "cancelled" && (
                            <>
                              <button
                                onClick={() =>
                                  handleReminderSend(
                                    reminder.userId,
                                    reminder.currentStatus
                                  )
                                }
                                disabled={
                                  actionId === `reminder-send-${reminder.userId}`
                                }
                                className="flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
                              >
                                <Send className="h-3 w-3" />
                                {reminder.currentStatus === "sent"
                                  ? "Resend"
                                  : "Send"}
                              </button>
                              <button
                                onClick={() =>
                                  handleReminderCancel(reminder.userId)
                                }
                                disabled={
                                  actionId ===
                                  `reminder-cancel-${reminder.userId}`
                                }
                                className="flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                              >
                                <XCircle className="h-3 w-3" />
                                Cancel
                              </button>
                            </>
                          )}
                          {reminder.currentStatus === "cancelled" && (
                            <span className="text-xs italic text-slate-400">
                              Cancelled for cron
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Notification History
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Tracking summary with {total} rows across reminder and download-link notifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterType}
                onChange={(event) =>
                  handleFilterChange("type", event.target.value)
                }
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All Types</option>
                <option value="reminder">Signup Reminder</option>
                <option value="download-link">Drive Link</option>
              </select>

              <select
                value={filterStatus}
                onChange={(event) =>
                  handleFilterChange("status", event.target.value)
                }
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-slate-900" style={{ borderBottomColor: "#FF4800" }} />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications found"
              description="Try changing the filters or search term."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 text-left">User Name</th>
                    <th className="px-5 py-3 text-left">User Email</th>
                    <th className="px-5 py-3 text-left">Type</th>
                    <th className="px-5 py-3 text-left">Resume</th>
                    <th className="px-5 py-3 text-left">Current Status</th>
                    <th className="px-5 py-3 text-left">Stage 1</th>
                    <th className="px-5 py-3 text-left">Stage 1 Sent At</th>
                    <th className="px-5 py-3 text-left">Stage 2</th>
                    <th className="px-5 py-3 text-left">Stage 2 Sent At</th>
                    <th className="px-5 py-3 text-left">Stage 3</th>
                    <th className="px-5 py-3 text-left">Stage 3 Sent At</th>
                    <th className="px-5 py-3 text-left">Last Error</th>
                    <th className="px-5 py-3 text-left">Signed Up At</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {notifications.map((notification) => (
                    <tr
                      key={notification.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="text-sm font-medium text-slate-900">
                          {notification.userName || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {notification.userEmail}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <Badge
                          label={
                            TYPE_LABELS[notification.type] ?? notification.type
                          }
                          colorClass={
                            TYPE_COLORS[notification.type] ??
                            "text-slate-600"
                          }
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="max-w-[160px] truncate text-xs text-slate-600">
                          {notification.resumeTitle || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <Badge
                            label={
                              STATUS_LABELS[notification.currentStatus] ??
                              notification.currentStatus
                            }
                            colorClass={
                              STATUS_COLORS[notification.currentStatus] ??
                              "text-slate-600"
                            }
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StageCell stage={notification.stages?.[1]} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(notification.stages?.[1]?.sentAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StageCell stage={notification.stages?.[2]} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(notification.stages?.[2]?.sentAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StageCell stage={notification.stages?.[3]} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(notification.stages?.[3]?.sentAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p
                          className="max-w-[180px] truncate text-xs text-red-400"
                          title={notification.lastError || ""}
                        >
                          {notification.lastError || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(notification.signupAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end">
                          <RowActionMenu>
                            <MenuActionButton
                              onClick={() =>
                                handleHistoryResend(notification.latestNotificationId)
                              }
                              disabled={
                                !notification.actions?.canResend ||
                                actionId ===
                                  `history-resend-${notification.latestNotificationId}`
                              }
                            >
                              <Send className="h-4 w-4" />
                              Resend
                            </MenuActionButton>
                            <MenuActionButton
                              onClick={() =>
                                notification.type === "reminder"
                                  ? handleReminderCancel(notification.userId)
                                  : handleHistoryCancel(notification.latestNotificationId)
                              }
                              disabled={
                                !notification.actions?.canCancel ||
                                actionId ===
                                  (notification.type === "reminder"
                                    ? `reminder-cancel-${notification.userId}`
                                    : `history-cancel-${notification.latestNotificationId}`)
                              }
                              tone="danger"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel
                            </MenuActionButton>
                          </RowActionMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Page {page} of {totalPages} - {total} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={page === 1}
                className="rounded-full border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(totalPages, currentPage + 1)
                  )
                }
                disabled={page === totalPages}
                className="rounded-full border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
