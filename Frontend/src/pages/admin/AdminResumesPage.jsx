import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  updateAdminResume,
  deleteAdminResume,
  processPendingResumeLinks,
} from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Pencil, Trash2, RefreshCw, Download, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { ResumeFormDialog, DeleteConfirmDialog } from "./AdminCrudDialogs";
import ResumePreviewModal from "./ResumePreviewModal";
import { useAdminResumesQuery, useAdminUsersLiteQuery } from "@/hooks/useAdminQueryData";

const PAGE_SIZE = 20;

export default function AdminResumesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [resumeDialog, setResumeDialog] = useState({ open: false, record: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, records: [] });
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewResume, setPreviewResume] = useState(null);
  const searchTimer = useRef(null);
  const resumesQuery = useAdminResumesQuery({ page, limit: PAGE_SIZE, search });
  const usersQuery = useAdminUsersLiteQuery();
  const resumes = useMemo(() => resumesQuery.data?.resumes || [], [resumesQuery.data?.resumes]);
  const users = useMemo(() => usersQuery.data || [], [usersQuery.data]);
  const pagination = resumesQuery.data?.pagination || { page: 1, totalPages: 1, total: 0 };
  const loading = (resumesQuery.isPending && !resumes.length) || (usersQuery.isPending && !users.length);
  const refreshing = (resumesQuery.isFetching || usersQuery.isFetching) && !loading;

  useEffect(() => {
    setSelected([]);
  }, [resumes]);

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
    let processingSummary = null;

    try {
      const processResponse = await processPendingResumeLinks();
      processingSummary = processResponse.data || null;
    } catch (err) {
      toast.error("Drive link processing failed", {
        description: err.message,
      });
    }

    await Promise.all([resumesQuery.refetch(), usersQuery.refetch()]);

    if (processingSummary) {
      const { attempted = 0, processed = 0, failed = 0, skipped = 0 } = processingSummary;
      const hasPendingWork = attempted > 0;
      const hasFailures = failed > 0;

      if (hasFailures) {
        toast.warning("Resumes refreshed with Drive link issues", {
          description: `Processed ${processed}, failed ${failed}, skipped ${skipped}.`,
        });
        return;
      }

      toast.success("Resumes refreshed", {
        description: hasPendingWork
          ? `Drive links checked: ${attempted}. Updated ${processed}, skipped ${skipped}.`
          : "No pending or out-of-sync Drive links were found.",
      });
      return;
    }

    toast.success("Resumes refreshed");
  };

  const toggleSelect = (id, checked) =>
    setSelected((s) => checked ? [...s, id] : s.filter((x) => x !== id));

  const toggleAll = (checked) =>
    setSelected(checked ? resumes.map((r) => r._id) : []);

  const allSelected = resumes.length > 0 && resumes.every((r) => selected.includes(r._id));
  const selectedResumes = resumes.filter((r) => selected.includes(r._id));

  const handleResumeSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await updateAdminResume(resumeDialog.record._id, payload);
      toast.success("Resume updated successfully");
      setResumeDialog({ open: false, record: null });
      await resumesQuery.refetch();
    } catch (err) {
      toast.error("Failed to update resume", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      for (const r of deleteDialog.records) await deleteAdminResume(r._id);
      toast.success(deleteDialog.records.length > 1 ? `${deleteDialog.records.length} resumes deleted` : "Resume deleted");
      setDeleteDialog({ open: false, records: [] });
      await resumesQuery.refetch();
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
          <h1 className="text-xl font-bold text-gray-800">Resumes</h1>
          <p className="mt-0.5 text-xs text-gray-500">{pagination.total} total resumes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input placeholder="Search by title, name, email..." value={searchInput} onChange={handleSearchChange} className="w-72 pl-10 border-indigo-200" />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          </div>
          {selected.length > 0 ? (
            <>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">{selected.length} selected</span>
              {selected.length === 1 && (
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => setResumeDialog({ open: true, record: selectedResumes[0] })}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => setDeleteDialog({ open: true, records: selectedResumes })}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Resume Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">User Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">External</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">User Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Drive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resumes.map((resume, i) => (
                    <tr key={resume._id} className={`transition-colors hover:bg-indigo-50/30 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="w-12 px-3 py-4 text-center">
                        <input type="checkbox" checked={selected.includes(resume._id)} onChange={(e) => toggleSelect(resume._id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-sm font-medium text-gray-800">{resume.title}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/resumes/${resume.user?._id}`)}
                          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-xs font-medium text-indigo-700">{(resume.user?.fullName || "").charAt(0).toUpperCase()}</span>
                          </div>
                          {resume.user?.fullName || "—"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-md bg-blue-50 px-2 py-1 font-mono text-xs font-medium text-blue-700">{resume.user?.niatId || "—"}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`rounded-md px-2 py-1 text-xs font-medium ${resume.user?.userType === "external" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {resume.user?.userType === "external" ? "External" : "Internal"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{resume.user?.email || "—"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{format(new Date(resume.createdAt), "PP")}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{format(new Date(resume.updatedAt), "PP")}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {resume.driveOutOfSync ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <LoaderCircle className="h-3 w-3 animate-spin" /> Updating...
                          </span>
                        ) : resume.googleDriveLink ? (
                          <a href={resume.googleDriveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Download className="h-3 w-3" /> PDF
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Processing...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {resumes.length === 0 && (
                    <tr><td colSpan="9" className="px-6 py-12 text-center text-gray-400">No resumes found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} — {pagination.total} resumes
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

      <ResumePreviewModal resumeInfo={previewResume} onClose={() => setPreviewResume(null)} />
      <ResumeFormDialog
        open={resumeDialog.open}
        onOpenChange={(open) => setResumeDialog((s) => ({ ...s, open }))}
        mode="edit"
        initialData={resumeDialog.record}
        users={users}
        onSubmit={handleResumeSubmit}
        loading={submitting}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((s) => ({ ...s, open }))}
        title={deleteDialog.records.length > 1 ? `Delete ${deleteDialog.records.length} resumes?` : "Delete resume?"}
        description={deleteDialog.records.length > 1 ? `Permanently delete ${deleteDialog.records.length} resumes.` : `Permanently delete "${deleteDialog.records[0]?.title}".`}
        confirmLabel={deleteDialog.records.length > 1 ? `Delete ${deleteDialog.records.length} Resumes` : "Delete Resume"}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}
