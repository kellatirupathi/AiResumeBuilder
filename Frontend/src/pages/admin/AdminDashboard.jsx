/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkAdminSession,
  createAdminUser,
  deleteAdminResume,
  deleteAdminUser,
  getAllResumes,
  getAllUsers,
  logoutAdmin,
  processPendingResumeLinks,
  updateAdminResume,
  updateAdminUser,
} from "@/Services/adminApi";
import {
  Download,
  FileText,
  Fingerprint,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import ResumePreviewModal from "./ResumePreviewModal";
import UserResumesModal from "./UserResumesModal";
import NiatManagementPage from "./NiatManagementPage";
import {
  DeleteConfirmDialog,
  ResumeFormDialog,
  UserFormDialog,
} from "./AdminCrudDialogs";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import { cn } from "@/lib/utils";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [resumeSearchQuery, setResumeSearchQuery] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedUserForResumes, setSelectedUserForResumes] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedResumeIds, setSelectedResumeIds] = useState([]);
  const [userDialogState, setUserDialogState] = useState({ open: false, mode: "create", record: null });
  const [resumeDialogState, setResumeDialogState] = useState({ open: false, mode: "create", record: null });
  const [deleteState, setDeleteState] = useState({ open: false, type: "user", records: [] });
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    const [usersRes, resumesRes] = await Promise.all([getAllUsers(), getAllResumes()]);
    setUsers(usersRes.data || []);
    setResumes(resumesRes.data || []);
  };

  useEffect(() => {
    const verifySessionAndFetch = async () => {
      setLoading(true);
      try {
        await checkAdminSession();
        await fetchDashboardData();
      } catch (error) {
        toast.error("Session invalid or expired", { description: "Redirecting to admin login." });
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    verifySessionAndFetch();
  }, [navigate]);

  const usersWithResumeData = useMemo(() => {
    const resumeMap = new Map();

    resumes.forEach((resume) => {
      const userId = resume.user?._id;
      if (!userId) return;
      if (!resumeMap.has(userId)) {
        resumeMap.set(userId, []);
      }
      resumeMap.get(userId).push(resume);
    });

    return users.map((user) => ({
      ...user,
      resumes: resumeMap.get(user._id) || [],
      resumeCount: resumeMap.get(user._id)?.length || 0,
    }));
  }, [users, resumes]);

  const filteredUsers = useMemo(
    () =>
      usersWithResumeData
        .filter(
          (user) =>
            (user.fullName || "").toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            (user.niatId || "").toLowerCase().includes(userSearchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [usersWithResumeData, userSearchQuery]
  );

  const filteredResumes = useMemo(
    () =>
      resumes
        .filter(
          (resume) =>
            (resume.title || "").toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
            (resume.user?.fullName || "").toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
            (resume.user?.email || "").toLowerCase().includes(resumeSearchQuery.toLowerCase()) ||
            (resume.user?.niatId || "").toLowerCase().includes(resumeSearchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [resumes, resumeSearchQuery]
  );

  useEffect(() => {
    const visibleUserIds = new Set(filteredUsers.map((user) => user._id));
    setSelectedUserIds((currentValue) => currentValue.filter((id) => visibleUserIds.has(id)));
  }, [filteredUsers]);

  useEffect(() => {
    const visibleResumeIds = new Set(filteredResumes.map((resume) => resume._id));
    setSelectedResumeIds((currentValue) => currentValue.filter((id) => visibleResumeIds.has(id)));
  }, [filteredResumes]);

  const selectedUsers = useMemo(
    () => filteredUsers.filter((user) => selectedUserIds.includes(user._id)),
    [filteredUsers, selectedUserIds]
  );

  const selectedResumes = useMemo(
    () => filteredResumes.filter((resume) => selectedResumeIds.includes(resume._id)),
    [filteredResumes, selectedResumeIds]
  );

  const selectedRecords = activeTab === "users" ? selectedUsers : activeTab === "resumes" ? selectedResumes : [];
  const selectedCount = selectedRecords.length;
  const isSingleSelection = selectedCount === 1;
  const allUsersSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedUserIds.includes(user._id));
  const allResumesSelected = filteredResumes.length > 0 && filteredResumes.every((resume) => selectedResumeIds.includes(resume._id));

  const dashboardStats = useMemo(() => {
    const today = new Date().toDateString();
    const newUsersToday = users.filter((user) => new Date(user.createdAt).toDateString() === today).length;
    const newResumesToday = resumes.filter((resume) => new Date(resume.createdAt).toDateString() === today).length;
    const usersWithResumes = users.filter((user) => resumes.some((resume) => resume.user?._id === user._id)).length;
    const averageResumesPerUser = users.length ? (resumes.length / users.length).toFixed(1) : 0;

    return {
      totalUsers: users.length,
      totalResumes: resumes.length,
      newUsersToday,
      newResumesToday,
      usersWithResumes,
      averageResumesPerUser,
    };
  }, [users, resumes]);
  const updateSelectedIds = (setSelectedIds, id, checked) => {
    setSelectedIds((currentValue) => {
      if (checked) {
        return currentValue.includes(id) ? currentValue : [...currentValue, id];
      }

      return currentValue.filter((currentId) => currentId !== id);
    });
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out successfully.");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Logout failed", { description: error.message });
    }
  };

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
  };

  const handleViewUserResumes = (user) => {
    setSelectedUserForResumes(user);
  };

  const openCreateUserDialog = () => {
    setUserDialogState({ open: true, mode: "create", record: null });
  };

  const openEditUserDialog = (user) => {
    setUserDialogState({ open: true, mode: "edit", record: user });
  };

  const openEditResumeDialog = (resume) => {
    setResumeDialogState({ open: true, mode: "edit", record: resume });
  };

  const openDeleteDialog = (type, records) => {
    const nextRecords = Array.isArray(records) ? records : [records];
    setDeleteState({ open: true, type, records: nextRecords.filter(Boolean) });
  };

  const handleEditSelected = () => {
    if (!isSingleSelection) {
      return;
    }

    if (activeTab === "users" && selectedUsers[0]) {
      openEditUserDialog(selectedUsers[0]);
    }

    if (activeTab === "resumes" && selectedResumes[0]) {
      openEditResumeDialog(selectedResumes[0]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0 || activeTab === "studentids") {
      return;
    }

    openDeleteDialog(activeTab === "users" ? "user" : "resume", selectedRecords);
  };

  const handleUserSelection = (userId, checked) => {
    updateSelectedIds(setSelectedUserIds, userId, checked);
  };

  const handleResumeSelection = (resumeId, checked) => {
    updateSelectedIds(setSelectedResumeIds, resumeId, checked);
  };

  const handleSelectAllUsers = (checked) => {
    setSelectedUserIds(checked ? filteredUsers.map((user) => user._id) : []);
  };

  const handleSelectAllResumes = (checked) => {
    setSelectedResumeIds(checked ? filteredResumes.map((resume) => resume._id) : []);
  };

  const handleUserSubmit = async (payload) => {
    setDialogSubmitting(true);

    try {
      if (userDialogState.mode === "edit" && userDialogState.record?._id) {
        await updateAdminUser(userDialogState.record._id, payload);
        toast.success("User updated successfully");
      } else {
        await createAdminUser(payload);
        toast.success("User created successfully");
      }

      setUserDialogState({ open: false, mode: "create", record: null });
      setSelectedUserIds([]);
      await fetchDashboardData();
    } catch (error) {
      toast.error("Failed to save user", { description: error.message });
    } finally {
      setDialogSubmitting(false);
    }
  };

  const handleResumeSubmit = async (payload) => {
    setDialogSubmitting(true);

    try {
      if (resumeDialogState.record?._id) {
        await updateAdminResume(resumeDialogState.record._id, payload);
        toast.success("Resume updated successfully");
      }

      setResumeDialogState({ open: false, mode: "create", record: null });
      setSelectedResumeIds([]);
      await fetchDashboardData();
    } catch (error) {
      toast.error("Failed to save resume", { description: error.message });
    } finally {
      setDialogSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const recordsToDelete = deleteState.records || [];

    if (recordsToDelete.length === 0) {
      return;
    }

    setDeleteLoading(true);

    try {
      if (deleteState.type === "user") {
        for (const record of recordsToDelete) {
          await deleteAdminUser(record._id);

          if (selectedUserForResumes?._id === record._id) {
            setSelectedUserForResumes(null);
          }
        }

        setSelectedUserIds([]);
        toast.success(
          recordsToDelete.length === 1
            ? "User deleted successfully"
            : `${recordsToDelete.length} users deleted successfully`
        );
      } else {
        for (const record of recordsToDelete) {
          await deleteAdminResume(record._id);

          if (selectedResume?._id === record._id) {
            setSelectedResume(null);
          }
        }

        setSelectedResumeIds([]);
        toast.success(
          recordsToDelete.length === 1
            ? "Resume deleted successfully"
            : `${recordsToDelete.length} resumes deleted successfully`
        );
      }

      setDeleteState({ open: false, type: "user", records: [] });
      await fetchDashboardData();
    } catch (error) {
      toast.error("Delete failed", { description: error.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
    setSelectedUserIds([]);
    setSelectedResumeIds([]);

    if (tab === "studentids") {
      return;
    }

    setLoading(true);

    try {
      await fetchDashboardData();
    } catch (error) {
      toast.error("Failed to load data", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (activeTab === "users") {
      const headers = [
        { key: "fullName", label: "Full Name" },
        { key: "niatId", label: "Student ID" },
        { key: "email", label: "Email" },
        { key: "resumeCount", label: "Resume Count" },
        { key: "createdAt", label: "Created At" },
        { key: "updatedAt", label: "Updated At" },
      ];
      const data = filteredUsers.map((user) => ({
        ...user,
        createdAt: format(new Date(user.createdAt), "PPpp"),
        updatedAt: format(new Date(user.updatedAt), "PPpp"),
      }));
      exportToCsv("users_export.csv", headers, data);
    }

    if (activeTab === "resumes") {
      const { headers, flattenedData } = getFlattenedResumeData(filteredResumes);
      exportToCsv("resumes_export.csv", headers, flattenedData);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);

    try {
      let processSummary = null;

      if (activeTab === "resumes") {
        const processResponse = await processPendingResumeLinks();
        processSummary = processResponse.data || null;
      }

      const [usersRes, resumesRes] = await Promise.all([getAllUsers(), getAllResumes()]);
      setUsers(usersRes.data || []);
      setResumes(resumesRes.data || []);

      if (activeTab === "resumes" && processSummary?.attempted) {
        const descriptionParts = [];
        if (processSummary.failed) descriptionParts.push(`Failed: ${processSummary.failed}`);
        if (processSummary.skipped) descriptionParts.push(`Skipped: ${processSummary.skipped}`);

        toast.success("Data refreshed successfully", {
          description: `Processed ${processSummary.processed} pending resume link(s)${
            descriptionParts.length ? `. ${descriptionParts.join(", ")}` : ""
          }.`,
        });
      } else {
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      toast.error("Failed to refresh data", { description: error.message });
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <aside className="noPrint fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 shadow-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <NxtResumeLogoMark className="h-10 w-10" />
              <div>
                <p className="text-base font-bold leading-tight text-white">NxtResume</p>
                <p className="text-xs text-indigo-400">Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 border-b border-white/10 px-4 py-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Management
            </p>

            <button
              onClick={() => handleTabChange("users")}
              className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <User className="h-4 w-4 flex-shrink-0" />
                  Users
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === "users" ? "bg-white/20 text-white" : "bg-white/10 text-indigo-300"}`}>
                  {filteredUsers.length}
                </span>
              </span>
            </button>

            <button
              onClick={() => handleTabChange("resumes")}
              className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === "resumes"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  Resumes
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === "resumes" ? "bg-white/20 text-white" : "bg-white/10 text-indigo-300"}`}>
                  {filteredResumes.length}
                </span>
              </span>
            </button>

            <button
              onClick={() => handleTabChange("studentids")}
              className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === "studentids"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Fingerprint className="h-4 w-4 flex-shrink-0" />
                Student IDs
              </span>
            </button>
          </nav>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Overview
            </p>
            {[
              { label: "Total Users", value: dashboardStats.totalUsers, color: "text-indigo-300" },
              { label: "Total Resumes", value: dashboardStats.totalResumes, color: "text-blue-300" },
              { label: "New Users Today", value: `+${dashboardStats.newUsersToday}`, color: "text-emerald-400" },
              { label: "New Resumes Today", value: `+${dashboardStats.newResumesToday}`, color: "text-amber-400" },
              { label: "Users with Resumes", value: dashboardStats.usersWithResumes, color: "text-purple-300" },
              { label: "Avg Resumes/User", value: dashboardStats.averageResumesPerUser, color: "text-cyan-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 transition-colors hover:bg-white/8">
                <span className="text-xs text-indigo-300">{label}</span>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-4 py-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Logout
            </button>
          </div>
        </aside>

        <div className="ml-64 flex h-screen min-h-0 flex-1 flex-col overflow-hidden">
          <header className="noPrint sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div>
              <h1 className="text-xl font-bold capitalize text-gray-800">
                {activeTab === "users" ? "Users" : activeTab === "resumes" ? "Resumes" : "Student IDs"}
              </h1>
              <p className="mt-0.5 text-xs text-gray-500">
                {activeTab === "users"
                  ? "Manage registered users"
                  : activeTab === "resumes"
                    ? "Browse all resumes"
                    : "Manage allowed Student IDs"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeTab !== "studentids" && (
                <div className="relative">
                  <Input
                    placeholder={activeTab === "users" ? "Search by name, email, ID..." : "Search resumes..."}
                    value={activeTab === "users" ? userSearchQuery : resumeSearchQuery}
                    onChange={(event) =>
                      activeTab === "users"
                        ? setUserSearchQuery(event.target.value)
                        : setResumeSearchQuery(event.target.value)
                    }
                    className="w-72 rounded-lg border-indigo-200 pl-10 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
                </div>
              )}
              {activeTab !== "studentids" && selectedCount > 0 ? (
                <>
                  <div className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                    {selectedCount} selected
                  </div>
                  {isSingleSelection && (
                    <Button
                      variant="outline"
                      onClick={handleEditSelected}
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  <Button onClick={handleDeleteSelected} className="bg-rose-600 text-white hover:bg-rose-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  {activeTab === "users" && (
                    <Button onClick={openCreateUserDialog} className="bg-indigo-600 text-white hover:bg-indigo-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create User
                    </Button>
                  )}
                  {activeTab !== "studentids" && (
                    <Button variant="outline" onClick={handleExport} className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50">
                      <Download className="mr-2 h-4 w-4 text-indigo-500" />
                      Export CSV
                    </Button>
                  )}
                  {activeTab !== "studentids" && (
                    <Button
                      onClick={refreshData}
                      variant="outline"
                      size="sm"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      disabled={refreshing}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? "Refreshing..." : "Refresh Data"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </header>

          <main className={`noPrint flex min-h-0 flex-1 flex-col ${activeTab === "studentids" ? "overflow-y-auto p-6" : "overflow-hidden bg-white"}`}>
            {activeTab === "studentids" ? (
              <NiatManagementPage embedded />
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
              </div>
            ) : activeTab === "users" ? (
              <UsersTable
                users={filteredUsers}
                onViewResumes={handleViewUserResumes}
                selectedUserIds={selectedUserIds}
                allUsersSelected={allUsersSelected}
                onToggleUser={handleUserSelection}
                onToggleAllUsers={handleSelectAllUsers}
              />
            ) : (
              <DetailedResumesTable
                resumes={filteredResumes}
                onViewResume={handleViewResume}
                selectedResumeIds={selectedResumeIds}
                allResumesSelected={allResumesSelected}
                onToggleResume={handleResumeSelection}
                onToggleAllResumes={handleSelectAllResumes}
              />
            )}
          </main>
        </div>
      </div>

      <ResumePreviewModal resumeInfo={selectedResume} onClose={() => setSelectedResume(null)} />
      <UserResumesModal user={selectedUserForResumes} isOpen={!!selectedUserForResumes} onClose={() => setSelectedUserForResumes(null)} />
      <UserFormDialog
        open={userDialogState.open}
        onOpenChange={(open) => setUserDialogState((currentValue) => ({ ...currentValue, open }))}
        mode={userDialogState.mode}
        initialData={userDialogState.record}
        onSubmit={handleUserSubmit}
        loading={dialogSubmitting}
      />
      <ResumeFormDialog
        open={resumeDialogState.open}
        onOpenChange={(open) => setResumeDialogState((currentValue) => ({ ...currentValue, open }))}
        mode={resumeDialogState.mode}
        initialData={resumeDialogState.record}
        users={users}
        onSubmit={handleResumeSubmit}
        loading={dialogSubmitting}
      />
      <DeleteConfirmDialog
        open={deleteState.open}
        onOpenChange={(open) => setDeleteState((currentValue) => ({ ...currentValue, open }))}
        title={deleteState.type === "user" ? (deleteState.records.length > 1 ? `Delete ${deleteState.records.length} users?` : "Delete user?") : (deleteState.records.length > 1 ? `Delete ${deleteState.records.length} resumes?` : "Delete resume?")}
        description={deleteState.type === "user" ? (deleteState.records.length > 1 ? `This will permanently delete ${deleteState.records.length} users and all resumes owned by them.` : `This will permanently delete ${deleteState.records[0]?.fullName || "this user"} and all resumes owned by them.`) : (deleteState.records.length > 1 ? `This will permanently delete ${deleteState.records.length} resumes.` : `This will permanently delete ${deleteState.records[0]?.title || "this resume"}.`)}
        confirmLabel={deleteState.type === "user" ? (deleteState.records.length > 1 ? `Delete ${deleteState.records.length} Users` : "Delete User") : (deleteState.records.length > 1 ? `Delete ${deleteState.records.length} Resumes` : "Delete Resume")}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}

const exportToCsv = (filename, headers, data) => {
  if (!headers || headers.length === 0 || !data || data.length === 0) {
    toast.warning("Nothing to export.");
    return;
  }

  const csvRows = [];
  const headerRow = headers.map((header) => `"${header.label.replace(/"/g, '""')}"`).join(",");
  csvRows.push(headerRow);

  data.forEach((row) => {
    const values = headers.map((header) => {
      const escaped = String(row[header.key] ?? "").replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
const getFlattenedResumeData = (resumes) => {
  if (!resumes || resumes.length === 0) {
    return { headers: [], flattenedData: [] };
  }

  const maxExperience = Math.max(0, ...resumes.map((resume) => resume.experience?.length || 0));
  const maxEducation = Math.max(0, ...resumes.map((resume) => resume.education?.length || 0));
  const maxProjects = Math.max(0, ...resumes.map((resume) => resume.projects?.length || 0));
  const maxSkills = Math.max(0, ...resumes.map((resume) => resume.skills?.length || 0));
  const maxCerts = Math.max(0, ...resumes.map((resume) => resume.certifications?.length || 0));

  const truncate = (text, length = 50) => {
    if (!text) {
      return "";
    }

    const cleanedText = String(text).replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
    return cleanedText.length > length ? `${cleanedText.substring(0, length)}...` : cleanedText;
  };

  const baseHeaders = [
    { key: "userName", label: "User Name" },
    { key: "title", label: "Resume Title" },
    { key: "userNiatId", label: "User Student ID" },
    { key: "googleDriveLink", label: "Resume Link (Google Drive)" },
    { key: "userEmail", label: "User Email" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Last Updated" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Contact Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "githubUrl", label: "GitHub" },
    { key: "linkedinUrl", label: "LinkedIn" },
    { key: "portfolioUrl", label: "Portfolio" },
    { key: "template", label: "Template" },
    { key: "jobTitle", label: "Job Title" },
    { key: "summary", label: "Summary" },
  ];

  const experienceHeaders = Array.from({ length: maxExperience }, (_, index) => [
    { key: `experience_${index}_title`, label: `Exp ${index + 1} Title` },
    { key: `experience_${index}_company`, label: `Exp ${index + 1} Company` },
    { key: `experience_${index}_summary`, label: `Exp ${index + 1} Summary` },
  ]).flat();
  const educationHeaders = Array.from({ length: maxEducation }, (_, index) => [
    { key: `education_${index}_university`, label: `Edu ${index + 1} University` },
    { key: `education_${index}_degree`, label: `Edu ${index + 1} Degree` },
  ]).flat();
  const projectHeaders = Array.from({ length: maxProjects }, (_, index) => [
    { key: `project_${index}_name`, label: `Proj ${index + 1} Name` },
    { key: `project_${index}_tech`, label: `Proj ${index + 1} Tech` },
  ]).flat();
  const skillHeaders = Array.from({ length: maxSkills }, (_, index) => ({ key: `skill_${index}`, label: `Skill ${index + 1}` }));
  const certHeaders = Array.from({ length: maxCerts }, (_, index) => [
    { key: `cert_${index}_name`, label: `Cert ${index + 1} Name` },
    { key: `cert_${index}_issuer`, label: `Cert ${index + 1} Issuer` },
  ]).flat();
  const headers = [...baseHeaders, ...experienceHeaders, ...educationHeaders, ...projectHeaders, ...skillHeaders, ...certHeaders];

  const flattenedData = resumes.map((resume) => {
    const flat = {
      title: resume.title,
      userName: resume.user?.fullName,
      userNiatId: resume.user?.niatId,
      googleDriveLink: resume.googleDriveLink || "Processing...",
      userEmail: resume.user?.email,
      createdAt: format(new Date(resume.createdAt), "yyyy-MM-dd"),
      updatedAt: format(new Date(resume.updatedAt), "yyyy-MM-dd HH:mm"),
      firstName: resume.firstName,
      lastName: resume.lastName,
      email: resume.email,
      phone: resume.phone,
      address: resume.address,
      githubUrl: resume.githubUrl,
      linkedinUrl: resume.linkedinUrl,
      portfolioUrl: resume.portfolioUrl,
      template: resume.template,
      jobTitle: resume.jobTitle,
      summary: truncate(resume.summary),
    };

    for (let index = 0; index < maxExperience; index += 1) {
      const experience = resume.experience?.[index];
      flat[`experience_${index}_title`] = experience?.title || "";
      flat[`experience_${index}_company`] = experience?.companyName || "";
      flat[`experience_${index}_summary`] = truncate(experience?.workSummary, 40) || "";
    }
    for (let index = 0; index < maxEducation; index += 1) {
      const education = resume.education?.[index];
      flat[`education_${index}_university`] = education?.universityName || "";
      flat[`education_${index}_degree`] = education?.degree || "";
    }
    for (let index = 0; index < maxProjects; index += 1) {
      const project = resume.projects?.[index];
      flat[`project_${index}_name`] = project?.projectName || "";
      flat[`project_${index}_tech`] = truncate(project?.techStack, 25) || "";
    }
    for (let index = 0; index < maxSkills; index += 1) {
      flat[`skill_${index}`] = resume.skills?.[index]?.name || "";
    }
    for (let index = 0; index < maxCerts; index += 1) {
      const certification = resume.certifications?.[index];
      flat[`cert_${index}_name`] = certification?.name || "";
      flat[`cert_${index}_issuer`] = certification?.issuer || "";
    }

    return flat;
  });

  return { headers, flattenedData };
};

const SelectionCheckbox = ({ checked, onChange, label }) => (
  <input
    type="checkbox"
    aria-label={label}
    checked={checked}
    onChange={(event) => onChange(event.target.checked)}
    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  />
);
const UsersTable = ({
  users,
  onViewResumes,
  selectedUserIds,
  allUsersSelected,
  onToggleUser,
  onToggleAllUsers,
}) => (
  <div className="flex-1 min-h-0 overflow-auto bg-white">
    <table className="min-w-full bg-white">
      <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 to-blue-50">
        <tr>
          <th className="w-12 px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-indigo-700">
            <SelectionCheckbox checked={allUsersSelected} onChange={onToggleAllUsers} label="Select all users" />
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Full Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Student ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Resumes Count</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Created At</th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Updated At</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <tr key={user._id} className={`transition-colors hover:bg-indigo-50/30 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
            <td className="w-12 px-3 py-4 text-center">
              <SelectionCheckbox checked={selectedUserIds.includes(user._id)} onChange={(checked) => onToggleUser(user._id, checked)} label={`Select ${user.fullName || "user"}`} />
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                  <span className="text-sm font-medium text-indigo-700">{(user.fullName || "").charAt(0).toUpperCase()}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              <span className="rounded-md bg-blue-50 px-2 py-1 font-mono text-xs font-medium text-blue-700">{user.niatId}</span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{user.email}</td>
            <td className="whitespace-nowrap px-6 py-4 text-sm">
              {user.resumeCount > 0 ? (
                <Button variant="link" className="h-auto p-0 font-medium text-indigo-600 hover:text-indigo-800" onClick={() => onViewResumes(user)}>
                  <span className="flex items-center">
                    {user.resumeCount}
                    <FileText className="ml-1 h-3.5 w-3.5 text-indigo-400" />
                  </span>
                </Button>
              ) : (
                <span className="text-gray-400">0</span>
              )}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{format(new Date(user.createdAt), "PPpp")}</td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{format(new Date(user.updatedAt), "PPpp")}</td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <User className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const DetailedResumesTable = ({
  resumes,
  onViewResume,
  selectedResumeIds,
  allResumesSelected,
  onToggleResume,
  onToggleAllResumes,
}) => {
  const { headers, flattenedData } = useMemo(() => getFlattenedResumeData(resumes), [resumes]);

  if (resumes.length === 0) {
    return (
      <div className="flex flex-1 min-h-0 items-center justify-center bg-white py-12 text-center text-gray-500">
        <div className="flex flex-col items-center">
          <FileText className="mb-2 h-10 w-10 text-gray-300" />
          <p className="text-lg font-medium">No matching resumes found</p>
          <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  const getColumnWidth = (key) => {
    switch (key) {
      case "title":
      case "userName":
      case "userEmail":
      case "googleDriveLink":
      case "summary":
        return "w-64 max-w-64";
      case "userNiatId":
        return "w-32 max-w-32";
      case "updatedAt":
      case "createdAt":
        return "w-48 max-w-48";
      default:
        return "w-40 max-w-40";
    }
  };
  const getStickyColumnClasses = (key, rowIndex, isHeader = false) => {
    if (key === "userName") {
      return cn(
        "sticky left-12 border-r border-gray-200",
        isHeader
          ? "z-30 bg-indigo-50"
          : rowIndex % 2 === 0
            ? "bg-white group-hover:bg-indigo-50"
            : "bg-gray-50 group-hover:bg-indigo-50"
      );
    }

    return "";
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-white">
      <table className="min-w-full bg-white text-sm">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 to-blue-50">
          <tr>
            <th className="sticky left-0 top-0 z-30 w-12 min-w-12 border-r border-gray-200 bg-indigo-50 px-3 py-3 text-center">
              <SelectionCheckbox checked={allResumesSelected} onChange={onToggleAllResumes} label="Select all resumes" />
            </th>
            {headers.map((header) => (
              <th
                key={header.key}
                className={cn(
                  "sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700",
                  getColumnWidth(header.key),
                  getStickyColumnClasses(header.key, 0, true)
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {flattenedData.map((row, rowIndex) => (
            <tr key={resumes[rowIndex]._id} className={`group transition-colors hover:bg-indigo-50/30 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
              <td className={cn("sticky left-0 z-20 w-12 min-w-12 border-r border-gray-200 px-3 py-3 text-center", rowIndex % 2 === 0 ? "bg-white group-hover:bg-indigo-50" : "bg-gray-50 group-hover:bg-indigo-50")}>
                <SelectionCheckbox checked={selectedResumeIds.includes(resumes[rowIndex]._id)} onChange={(checked) => onToggleResume(resumes[rowIndex]._id, checked)} label={`Select ${resumes[rowIndex].title || "resume"}`} />
              </td>
              {headers.map((header) => (
                <td key={`${rowIndex}-${header.key}`} className={cn("whitespace-nowrap px-4 py-3", getColumnWidth(header.key), getStickyColumnClasses(header.key, rowIndex))}>
                  <div className="truncate" title={String(row[header.key] ?? "")}>
                    {header.key === "title" ? (
                      <button onClick={() => onViewResume(resumes[rowIndex])} className="flex items-center truncate text-left font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                        <FileText className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>{String(row[header.key] ?? "")}</span>
                      </button>
                    ) : header.key === "googleDriveLink" && row[header.key] !== "Processing..." ? (
                      <a href={String(row[header.key] ?? "")} target="_blank" rel="noopener noreferrer" className="flex items-center truncate text-blue-600 hover:text-blue-800 hover:underline">
                        <Download className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>View PDF</span>
                      </a>
                    ) : header.key === "userNiatId" ? (
                      <span className="truncate rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs text-blue-700">{String(row[header.key] ?? "")}</span>
                    ) : header.key === "userName" ? (
                      <div className="flex items-center">
                        <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                          <span className="text-xs font-medium text-indigo-700">{String(row[header.key] ?? "").charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="truncate text-gray-700">{String(row[header.key] ?? "")}</span>
                      </div>
                    ) : header.key === "updatedAt" || header.key === "createdAt" ? (
                      <span className="truncate text-xs text-gray-600">{String(row[header.key] ?? "")}</span>
                    ) : (
                      <span className="truncate text-gray-600">{String(row[header.key] ?? "")}</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
