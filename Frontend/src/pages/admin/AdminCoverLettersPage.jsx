import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  deleteAdminCoverLetter,
  getAdminCoverLetterById,
  processPendingCoverLetterLinks,
} from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { DeleteConfirmDialog } from "./AdminCrudDialogs";
import CoverLetterPreviewModal from "./CoverLetterPreviewModal";
import { useAdminCoverLettersQuery } from "@/hooks/useAdminQueryData";

const PAGE_SIZE = 20;

export default function AdminCoverLettersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, records: [] });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewCoverLetter, setPreviewCoverLetter] = useState(null);
  const [previewLoadingId, setPreviewLoadingId] = useState(null);
  const searchTimer = useRef(null);
  const coverLettersQuery = useAdminCoverLettersQuery({ page, limit: PAGE_SIZE, search });
  const coverLetters = useMemo(
    () => coverLettersQuery.data?.coverLetters || [],
    [coverLettersQuery.data?.coverLetters]
  );
  const pagination = coverLettersQuery.data?.pagination || { page: 1, totalPages: 1, total: 0 };
  const loading = coverLettersQuery.isPending && !coverLetters.length;
  const refreshing = coverLettersQuery.isFetching && !loading;

  useEffect(() => {
    setSelected([]);
  }, [coverLetters]);

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
      const processResponse = await processPendingCoverLetterLinks();
      processingSummary = processResponse.data || null;
    } catch (err) {
      toast.error("Drive link processing failed", {
        description: err.message,
      });
    }

    await coverLettersQuery.refetch();

    if (processingSummary) {
      const { attempted = 0, processed = 0, failed = 0, skipped = 0 } = processingSummary;
      const hasPendingWork = attempted > 0;
      const hasFailures = failed > 0;

      if (hasFailures) {
        toast.warning("Cover letters refreshed with Drive link issues", {
          description: `Processed ${processed}, failed ${failed}, skipped ${skipped}.`,
        });
        return;
      }

      toast.success("Cover letters refreshed", {
        description: hasPendingWork
          ? `Drive links checked: ${attempted}. Updated ${processed}, skipped ${skipped}.`
          : "No pending or out-of-sync Drive links were found.",
      });
      return;
    }

    toast.success("Cover letters refreshed");
  };

  const toggleSelect = (id, checked) =>
    setSelected((s) => (checked ? [...s, id] : s.filter((x) => x !== id)));

  const toggleAll = (checked) =>
    setSelected(checked ? coverLetters.map((c) => c._id) : []);

  const allSelected =
    coverLetters.length > 0 && coverLetters.every((c) => selected.includes(c._id));
  const selectedCoverLetters = coverLetters.filter((c) => selected.includes(c._id));

  const handlePreview = async (id) => {
    setPreviewLoadingId(id);
    try {
      const response = await getAdminCoverLetterById(id);
      const data = response?.data || null;
      if (!data) {
        toast.error("Cover letter not found");
        return;
      }
      setPreviewCoverLetter(data);
    } catch (err) {
      toast.error("Failed to load cover letter", { description: err.message });
    } finally {
      setPreviewLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      for (const c of deleteDialog.records) await deleteAdminCoverLetter(c._id);
      toast.success(
        deleteDialog.records.length > 1
          ? `${deleteDialog.records.length} cover letters deleted`
          : "Cover letter deleted"
      );
      setDeleteDialog({ open: false, records: [] });
      await coverLettersQuery.refetch();
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
          <h1 className="text-xl font-bold text-gray-800">Cover Letters</h1>
          <p className="mt-0.5 text-xs text-gray-500">{pagination.total} total cover letters</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search by title, company, job, name, email..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-72 pl-10 rounded-full border-slate-200 focus:border-slate-900"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {selected.length > 0 ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900">
                {selected.length} selected
              </span>
              <Button
                className="rounded-full bg-red-600 text-white hover:bg-red-700"
                onClick={() => setDeleteDialog({ open: true, records: selectedCoverLetters })}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
        </div>
      </header>

      <main className="flex flex-1 min-h-0 flex-col overflow-hidden bg-white">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 z-10 bg-slate-50/70 text-slate-500">
                  <tr>
                    <th className="w-12 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-slate-900 focus:ring-slate-900/10"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      User Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Drive
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coverLetters.map((coverLetter, i) => (
                    <tr
                      key={coverLetter._id}
                      className={`transition-colors hover:bg-slate-50/60 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="w-12 px-3 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(coverLetter._id)}
                          onChange={(e) => toggleSelect(coverLetter._id, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 accent-slate-900 focus:ring-slate-900/10"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => handlePreview(coverLetter._id)}
                          className="text-sm font-medium text-slate-900 hover:text-[#FF4800] hover:underline text-left"
                        >
                          {coverLetter.title}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <span className="text-xs font-medium text-slate-900">
                              {(coverLetter.user?.fullName || "").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {coverLetter.user?.fullName || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {coverLetter.user?.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium capitalize text-white">
                          {coverLetter.template || "classic"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                        {coverLetter.jobTitle || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {coverLetter.companyName || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {format(new Date(coverLetter.createdAt), "PP")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex min-w-10 items-center justify-center text-sm font-semibold text-slate-900">
                          {coverLetter.viewCount || 0}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {coverLetter.driveOutOfSync ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <LoaderCircle className="h-3 w-3 animate-spin" /> Updating...
                          </span>
                        ) : coverLetter.googleDriveLink ? (
                          <a
                            href={coverLetter.googleDriveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-slate-900 hover:text-[#FF4800] hover:underline"
                          >
                            <Download className="h-3 w-3" /> PDF
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Processing...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {coverLetters.length === 0 && (
                    <tr>
                      <td colSpan="10" className="px-6 py-12 text-center text-gray-400">
                        No cover letters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} — {pagination.total} cover letters
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="rounded-full border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="rounded-full border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      <CoverLetterPreviewModal
        coverLetterInfo={previewCoverLetter}
        onClose={() => setPreviewCoverLetter(null)}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((s) => ({ ...s, open }))}
        title={
          deleteDialog.records.length > 1
            ? `Delete ${deleteDialog.records.length} cover letters?`
            : "Delete cover letter?"
        }
        description={
          deleteDialog.records.length > 1
            ? `Permanently delete ${deleteDialog.records.length} cover letters.`
            : `Permanently delete "${deleteDialog.records[0]?.title}".`
        }
        confirmLabel={
          deleteDialog.records.length > 1
            ? `Delete ${deleteDialog.records.length} Cover Letters`
            : "Delete Cover Letter"
        }
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}
