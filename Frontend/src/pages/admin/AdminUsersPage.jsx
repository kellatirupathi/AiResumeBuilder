import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getUsersPaginated, createAdminUser, updateAdminUser, deleteAdminUser,
} from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2, RefreshCw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { UserFormDialog, DeleteConfirmDialog } from "./AdminCrudDialogs";
import { toast as sonnerToast } from "sonner";

const PAGE_SIZE = 20;

function exportToCsv(users) {
  if (!users.length) { sonnerToast.warning("Nothing to export."); return; }
  const headers = ["Full Name", "Student ID", "Email", "Created At"];
  const rows = users.map((u) => [u.fullName, u.niatId, u.email, format(new Date(u.createdAt), "PPpp")]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "users_export.csv", style: "display:none" });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [userDialog, setUserDialog] = useState({ open: false, mode: "create", record: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, records: [] });
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchTimer = useRef(null);

  const fetchPage = useCallback(async (page, q) => {
    try {
      const res = await getUsersPaginated({ page, limit: PAGE_SIZE, search: q });
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
      setSelected([]);
    } catch (err) {
      toast.error("Failed to load users", { description: err.message });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPage(1, "").finally(() => setLoading(false));
  }, [fetchPage]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchPage(1, q), 400);
  };

  const handlePageChange = (p) => fetchPage(p, search);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPage(pagination.page, search);
    setRefreshing(false);
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
      await fetchPage(pagination.page, search);
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
      await fetchPage(pagination.page, search);
    } catch (err) {
      toast.error("Delete failed", { description: err.message });
    } finally {
      setDeleteLoading(false);
    }
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
            <Input placeholder="Search by name, email, ID..." value={search} onChange={handleSearchChange} className="w-72 pl-10 border-indigo-200" />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          </div>
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{format(new Date(user.createdAt), "PP")}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
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
    </>
  );
}
