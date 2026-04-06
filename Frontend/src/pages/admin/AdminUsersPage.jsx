import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { createAdminUser, updateAdminUser, deleteAdminUser } from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  BadgeAlert,
  Filter,
  X,
} from "lucide-react";
import { UserFormDialog, DeleteConfirmDialog } from "./AdminCrudDialogs";
import { toast as sonnerToast } from "sonner";
import { useAdminUsersQuery } from "@/hooks/useAdminQueryData";

const PAGE_SIZE = 20;
const DEFAULT_FILTERS = {
  niatIdVerified: "",
  reminderEnabled: "",
  downloadLinkEnabled: "",
  createdFrom: "",
  createdTo: "",
  resumeCountMin: "",
  resumeCountMax: "",
};

function countActiveFilters(filters) {
  return Object.values(filters).filter((value) => String(value || "").trim() !== "").length;
}

function normalizeFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
  );
}

function UserFiltersSheet({
  open,
  onOpenChange,
  draftFilters,
  onDraftChange,
  onApply,
  onReset,
  activeCount,
}) {
  const handleFieldChange = (field, value) => {
    onDraftChange((currentValue) => ({ ...currentValue, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        setOpenDialog={onOpenChange}
        className="left-auto right-0 top-0 h-screen max-w-md translate-x-0 translate-y-0 rounded-none border-l border-slate-200 p-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-right-full data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-right-full data-[state=open]:slide-in-from-top-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col bg-white">
          <DialogHeader className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl text-slate-900">Filter Users</DialogTitle>
              </div>
              {activeCount > 0 ? (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {activeCount} active
                </span>
              ) : null}
            </div>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Resume Count</h3>
                <p className="text-xs text-slate-500">Filter users by how many resumes they have created.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Minimum</label>
                  <Input
                    type="number"
                    min="0"
                    value={draftFilters.resumeCountMin}
                    onChange={(event) => handleFieldChange("resumeCountMin", event.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Maximum</label>
                  <Input
                    type="number"
                    min="0"
                    value={draftFilters.resumeCountMax}
                    onChange={(event) => handleFieldChange("resumeCountMax", event.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Student ID Status</h3>
                <p className="text-xs text-slate-500">Filter users by Student ID verification.</p>
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={draftFilters.niatIdVerified}
                onChange={(event) => handleFieldChange("niatIdVerified", event.target.value)}
              >
                <option value="">All users</option>
                <option value="true">Verified</option>
                <option value="false">Not verified</option>
              </select>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Notification Preferences</h3>
                <p className="text-xs text-slate-500">
                  Control reminder and download-link opt-in states separately.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Reminder Emails
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    value={draftFilters.reminderEnabled}
                    onChange={(event) => handleFieldChange("reminderEnabled", event.target.value)}
                  >
                    <option value="">All users</option>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Download Link Emails
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    value={draftFilters.downloadLinkEnabled}
                    onChange={(event) => handleFieldChange("downloadLinkEnabled", event.target.value)}
                  >
                    <option value="">All users</option>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Created Date</h3>
                <p className="text-xs text-slate-500">Filter users by signup date range.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">From</label>
                  <Input
                    type="date"
                    value={draftFilters.createdFrom}
                    onChange={(event) => handleFieldChange("createdFrom", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">To</label>
                  <Input
                    type="date"
                    value={draftFilters.createdTo}
                    onChange={(event) => handleFieldChange("createdTo", event.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="border-t border-slate-200 px-6 py-4 sm:justify-between sm:space-x-0">
            <Button type="button" variant="outline" onClick={onReset}>
              Reset
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={onApply} className="bg-indigo-600 text-white hover:bg-indigo-700">
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function exportToCsv(users) {
  if (!users.length) { sonnerToast.warning("Nothing to export."); return; }
  const headers = ["Full Name", "Student ID", "Email", "Resumes Count", "Student ID Status", "External", "Created At"];
  const rows = users.map((u) => [
    u.fullName,
    u.niatId,
    u.email,
    u.resumeCount || 0,
    u.niatIdVerified ? "Verified" : "Not Verified",
    u.userType === "external" ? "External" : "Internal",
    format(new Date(u.createdAt), "PPpp"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "users_export.csv", style: "display:none" });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [userDialog, setUserDialog] = useState({ open: false, mode: "create", record: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, records: [] });
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchTimer = useRef(null);
  const usersQuery = useAdminUsersQuery({
    page,
    limit: PAGE_SIZE,
    search,
    ...normalizeFilters(filters),
  });
  const users = useMemo(() => usersQuery.data?.users || [], [usersQuery.data?.users]);
  const pagination = usersQuery.data?.pagination || { page: 1, totalPages: 1, total: 0 };
  const loading = usersQuery.isPending && !users.length;
  const refreshing = usersQuery.isFetching && !loading;

  useEffect(() => {
    setSelected([]);
  }, [users]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchInput(q);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setSearch(q.trim());
    }, 400);
  };

  const handlePageChange = (p) => setPage(p);

  const handleRefresh = async () => {
    await usersQuery.refetch();
    toast.success("Refreshed");
  };

  const toggleSelect = (id, checked) =>
    setSelected((s) => checked ? [...s, id] : s.filter((x) => x !== id));

  const toggleAll = (checked) =>
    setSelected(checked ? users.map((u) => u._id) : []);

  const allSelected = users.length > 0 && users.every((u) => selected.includes(u._id));
  const selectedUsers = users.filter((u) => selected.includes(u._id));

  const handleUserSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (userDialog.mode === "edit") {
        await updateAdminUser(userDialog.record._id, payload);
        toast.success("User updated successfully");
      } else {
        await createAdminUser(payload);
        toast.success("User created successfully");
      }
      setUserDialog({ open: false, mode: "create", record: null });
      await usersQuery.refetch();
    } catch (err) {
      toast.error("Failed to save user", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      for (const u of deleteDialog.records) await deleteAdminUser(u._id);
      toast.success(deleteDialog.records.length > 1 ? `${deleteDialog.records.length} users deleted` : "User deleted");
      setDeleteDialog({ open: false, records: [] });
      await usersQuery.refetch();
    } catch (err) {
      toast.error("Delete failed", { description: err.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeFilterCount = countActiveFilters(filters);

  const handleApplyFilters = async () => {
    const normalizedDraft = normalizeFilters(draftFilters);
    setFilters(normalizedDraft);
    setFiltersOpen(false);
    setPage(1);
  };

  const handleResetFilters = async () => {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setFiltersOpen(false);
    setPage(1);
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Users</h1>
          <p className="mt-0.5 text-xs text-gray-500">{pagination.total} total registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input placeholder="Search by name, email, ID..." value={searchInput} onChange={handleSearchChange} className="w-72 pl-10 border-indigo-200" />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setDraftFilters(filters);
              setFiltersOpen(true);
            }}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFilterCount > 0 ? (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {activeFilterCount}
              </span>
            ) : null}
          </Button>
          {selected.length > 0 ? (
            <>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">{selected.length} selected</span>
              {selected.length === 1 && (
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => setUserDialog({ open: true, mode: "edit", record: selectedUsers[0] })}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => setDeleteDialog({ open: true, records: selectedUsers })}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setUserDialog({ open: true, mode: "create", record: null })} className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Create User
              </Button>
              <Button variant="outline" onClick={() => exportToCsv(users)} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </>
          )}
        </div>
      </header>

      {activeFilterCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/50 px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Active Filters</span>
          {filters.resumeCountMin !== "" || filters.resumeCountMax !== "" ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Resume count: {filters.resumeCountMin || "0"} to {filters.resumeCountMax || "any"}
            </span>
          ) : null}
          {filters.niatIdVerified !== "" ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Student ID: {filters.niatIdVerified === "true" ? "Verified" : "Not verified"}
            </span>
          ) : null}
          {filters.reminderEnabled !== "" ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Reminder: {filters.reminderEnabled === "true" ? "Enabled" : "Disabled"}
            </span>
          ) : null}
          {filters.downloadLinkEnabled !== "" ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Download link: {filters.downloadLinkEnabled === "true" ? "Enabled" : "Disabled"}
            </span>
          ) : null}
          {filters.createdFrom || filters.createdTo ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Created: {filters.createdFrom || "Any"} to {filters.createdTo || "Any"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-900"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>
      ) : null}

      <main className="flex flex-1 min-h-0 flex-col overflow-hidden bg-white">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <tr>
                    <th className="w-12 px-3 py-3 text-center">
                      <input type="checkbox" checked={allSelected} onChange={(e) => toggleAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Resumes Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">External</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, i) => (
                    <tr key={user._id} className={`transition-colors hover:bg-indigo-50/30 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="w-12 px-3 py-4 text-center">
                        <input type="checkbox" checked={selected.includes(user._id)} onChange={(e) => toggleSelect(user._id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-sm font-medium text-indigo-700">{(user.fullName || "").charAt(0).toUpperCase()}</span>
                          </div>
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline text-left"
                          >
                            {user.fullName}
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-md bg-blue-50 px-2 py-1 font-mono text-xs font-medium text-blue-700">{user.niatId || "—"}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex min-w-10 items-center justify-center text-sm font-semibold text-indigo-700">
                          {user.resumeCount || 0}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-semibold ${
                            user.niatIdVerified
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {user.niatIdVerified ? (
                            <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0" />
                          ) : (
                            <BadgeAlert className="h-3.5 w-3.5 flex-shrink-0" />
                          )}
                          <span>{user.niatIdVerified ? "Verified" : "Not Verified"}</span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`rounded-md px-2 py-1 text-xs font-medium ${user.userType === "external" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {user.userType === "external" ? "External" : "Internal"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {format(new Date(user.createdAt), "PPp")}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} — {pagination.total} users
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)} className="border-indigo-200">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)} className="border-indigo-200">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      <UserFormDialog
        open={userDialog.open}
        onOpenChange={(open) => setUserDialog((s) => ({ ...s, open }))}
        mode={userDialog.mode}
        initialData={userDialog.record}
        onSubmit={handleUserSubmit}
        loading={submitting}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((s) => ({ ...s, open }))}
        title={deleteDialog.records.length > 1 ? `Delete ${deleteDialog.records.length} users?` : "Delete user?"}
        description={deleteDialog.records.length > 1 ? `Permanently delete ${deleteDialog.records.length} users and all their resumes.` : `Permanently delete ${deleteDialog.records[0]?.fullName} and all their resumes.`}
        confirmLabel={deleteDialog.records.length > 1 ? `Delete ${deleteDialog.records.length} Users` : "Delete User"}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
      <UserFiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        draftFilters={draftFilters}
        onDraftChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        activeCount={countActiveFilters(draftFilters)}
      />
    </>
  );
}
