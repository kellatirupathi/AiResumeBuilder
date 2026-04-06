import { useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { addSingleNiatId, addBulkNiatIds, deleteNiatId } from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Trash2, RefreshCw, Download, Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "./AdminCrudDialogs";
import { useAdminStudentIdsQuery } from "@/hooks/useAdminQueryData";

const PAGE_SIZE = 50;

export default function AdminStudentIdsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("single");
  const [singleInput, setSingleInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // { id, value }
  const [editValue, setEditValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, records: [] });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const fileInputRef = useRef(null);
  const studentIdsQuery = useAdminStudentIdsQuery();
  const allIds = studentIdsQuery.data || [];
  const filtered = useMemo(
    () =>
      search.trim()
        ? allIds.filter((id) => id.niatId.toLowerCase().includes(search.toLowerCase()))
        : allIds,
    [allIds, search]
  );
  const loading = studentIdsQuery.isPending && !allIds.length;
  const refreshing = studentIdsQuery.isFetching && !loading;

  const handleRefresh = async () => {
    await studentIdsQuery.refetch();
    toast.success("Refreshed");
  };

  const toggleSelect = (id, checked) =>
    setSelected((s) => checked ? [...s, id] : s.filter((x) => x !== id));

  const toggleAll = (checked) => {
    const pageIds = paginatedIds.map((id) => id._id);
    setSelected((s) => {
      if (checked) return [...new Set([...s, ...pageIds])];
      return s.filter((x) => !pageIds.includes(x));
    });
  };

  const paginatedIds = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageSelected = paginatedIds.every((id) => selected.includes(id._id));
  const selectedRecords = allIds.filter((id) => selected.includes(id._id));

  const handleAddSingle = async () => {
    if (!singleInput.trim()) return;
    setSubmitting(true);
    try {
      await addSingleNiatId(singleInput.trim());
      toast.success("Student ID added successfully.");
      setSingleInput("");
      await studentIdsQuery.refetch();
    } catch (err) {
      toast.error("Failed to add ID", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBulk = async () => {
    const ids = bulkInput.split(/\r?\n/).map((id) => id.trim()).filter(Boolean);
    if (!ids.length) return;
    setSubmitting(true);
    try {
      const res = await addBulkNiatIds(ids);
      toast.success(res.message);
      setBulkInput("");
      await studentIdsQuery.refetch();
    } catch (err) {
      toast.error("Bulk add failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "text/csv") { toast.warning("Please upload a .csv file"); return; }
    setSubmitting(true);
    try {
      const text = await file.text();
      const ids = text.split(/\r?\n/).map((id) => id.trim()).filter(Boolean);
      const res = await addBulkNiatIds(ids);
      toast.success(res.message);
      await studentIdsQuery.refetch();
    } catch (err) {
      toast.error("File upload failed", { description: err.message });
    } finally {
      setSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setEditValue(record.niatId);
  };

  const cancelEdit = () => { setEditingId(null); setEditValue(""); };

  // Edit = delete old + add new (API has no update endpoint for niat IDs)
  const saveEdit = async (record) => {
    if (!editValue.trim() || editValue.trim().toUpperCase() === record.niatId) { cancelEdit(); return; }
    try {
      await deleteNiatId(record._id);
      await addSingleNiatId(editValue.trim());
      toast.success("Student ID updated.");
      cancelEdit();
      await studentIdsQuery.refetch();
    } catch (err) {
      toast.error("Failed to update ID", { description: err.message });
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      for (const r of deleteDialog.records) await deleteNiatId(r._id);
      toast.success(deleteDialog.records.length > 1 ? `${deleteDialog.records.length} IDs deleted` : "Student ID deleted");
      setSelected((s) => s.filter((x) => !deleteDialog.records.find((r) => r._id === x)));
      setDeleteDialog({ open: false, records: [] });
      await studentIdsQuery.refetch();
    } catch (err) {
      toast.error("Delete failed", { description: err.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportCSV = () => {
    if (!filtered.length) { toast.warning("Nothing to export."); return; }
    const csv = ["Student ID,Date Added", ...filtered.map((id) => `${id.niatId},"${format(new Date(id.createdAt), "PPpp")}"`)]
      .join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "student_ids_export.csv", style: "display:none" });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const addedToday = allIds.filter((id) => new Date(id.createdAt) >= today).length;

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Student IDs</h1>
          <p className="mt-0.5 text-xs text-gray-500">Manage allowed Student IDs</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-center">
              <div className="text-[10px] text-indigo-500 uppercase font-semibold">Total</div>
              <div className="text-lg font-bold text-indigo-700 leading-tight">{allIds.length}</div>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-center">
              <div className="text-[10px] text-indigo-500 uppercase font-semibold">Today</div>
              <div className="text-lg font-bold text-indigo-700 leading-tight">{addedToday}</div>
            </div>
          </div>
          <div className="relative">
            <Input placeholder="Search Student ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-56 pl-9 border-indigo-200" />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          </div>
          {selected.length > 0 ? (
            <>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">{selected.length} selected</span>
              {selected.length === 1 && (
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => startEdit(selectedRecords[0])}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => setDeleteDialog({ open: true, records: selectedRecords })}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={exportCSV} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {/* Add form */}
        <div className="flex-shrink-0 border-b border-gray-100 bg-white px-6 py-4">
          <div className="flex border-b border-gray-200 mb-4">
            {["single", "bulk", "file"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                {tab === "single" ? "Add Single ID" : tab === "bulk" ? "Add Multiple IDs" : "Upload CSV"}
              </button>
            ))}
          </div>
          {activeTab === "single" && (
            <div className="flex gap-3 items-end">
              <div className="flex-1 max-w-sm">
                <label className="block text-xs font-medium text-gray-700 mb-1">Student ID</label>
                <Input value={singleInput} onChange={(e) => setSingleInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && handleAddSingle()} placeholder="e.g. NW0001234" className="border-gray-300" />
              </div>
              <Button onClick={handleAddSingle} disabled={!singleInput.trim() || submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add ID
              </Button>
            </div>
          )}
          {activeTab === "bulk" && (
            <div className="max-w-sm space-y-3">
              <Textarea value={bulkInput} onChange={(e) => setBulkInput(e.target.value.toUpperCase())} placeholder="One ID per line" className="min-h-[80px] border-gray-300" />
              <Button onClick={handleAddBulk} disabled={!bulkInput.trim() || submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">Add From Text</Button>
            </div>
          )}
          {activeTab === "file" && (
            <div className="max-w-sm space-y-2">
              <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} disabled={submitting} className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <p className="text-xs text-gray-400">One ID per row. CSV format.</p>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto bg-white">
              <table className="min-w-full">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <tr>
                    <th className="w-12 px-3 py-3 text-center">
                      <input type="checkbox" checked={pageSelected && paginatedIds.length > 0} onChange={(e) => toggleAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedIds.map((record, i) => (
                    <tr key={record._id} className={`transition-colors hover:bg-indigo-50/30 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="w-12 px-3 py-4 text-center">
                        <input type="checkbox" checked={selected.includes(record._id)} onChange={(e) => toggleSelect(record._id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {editingId === record._id ? (
                          <Input value={editValue} onChange={(e) => setEditValue(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(record); if (e.key === "Escape") cancelEdit(); }} className="h-7 w-40 font-mono text-sm border-indigo-300" autoFocus />
                        ) : (
                          <span className="font-mono text-sm text-gray-900">{record.niatId}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{format(new Date(record.createdAt), "PPpp")}</td>
                    </tr>
                  ))}
                  {paginatedIds.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                      {search ? "No IDs match your search" : "No Student IDs registered yet"}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                <span className="text-sm text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-indigo-200">Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="border-indigo-200">Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((s) => ({ ...s, open }))}
        title={deleteDialog.records.length > 1 ? `Delete ${deleteDialog.records.length} Student IDs?` : "Delete Student ID?"}
        description={deleteDialog.records.length > 1 ? `Permanently delete ${deleteDialog.records.length} Student IDs.` : `Permanently delete "${deleteDialog.records[0]?.niatId}".`}
        confirmLabel={deleteDialog.records.length > 1 ? `Delete ${deleteDialog.records.length} IDs` : "Delete ID"}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}
