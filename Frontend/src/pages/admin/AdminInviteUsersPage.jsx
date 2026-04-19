import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  Eye,
  LoaderCircle,
  MousePointerClick,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import {
  createExternalInvite,
  deleteExternalInvite,
  updateExternalInvite,
} from "@/Services/adminApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminExternalUsersQuery,
  useAdminInviteDetailQuery,
  useAdminInvitesQuery,
} from "@/hooks/useAdminQueryData";

const getDefaultExpiry = () => {
  const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return format(date, "PPpp");
};

const toDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const statusClassName = {
  active: "bg-emerald-50 text-emerald-700",
  revoked: "bg-red-50 text-red-700",
  expired: "bg-amber-50 text-amber-700",
  used: "bg-slate-100 text-slate-700",
};

export default function AdminInviteUsersPage() {
  const [selectedInviteId, setSelectedInviteId] = useState("");
  const [activeUsersTab, setActiveUsersTab] = useState("invite");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState("");
  const [inviteTitle, setInviteTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiry);
  const [editTitle, setEditTitle] = useState("");
  const [editExpiresAt, setEditExpiresAt] = useState("");
  const invitesQuery = useAdminInvitesQuery();
  const inviteDetailQuery = useAdminInviteDetailQuery(selectedInviteId);
  const externalUsersQuery = useAdminExternalUsersQuery({
    enabled: activeUsersTab === "all",
  });
  const invites = invitesQuery.data || [];
  const selectedInviteData = inviteDetailQuery.data || null;
  const externalUsers = externalUsersQuery.data || [];
  const loading = invitesQuery.isPending && !invites.length;
  const detailLoading = inviteDetailQuery.isPending && !selectedInviteData && Boolean(selectedInviteId);
  const externalUsersLoading = activeUsersTab === "all" && externalUsersQuery.isPending && !externalUsers.length;

  useEffect(() => {
    if (invites.length === 0) {
      setSelectedInviteId("");
      return;
    }

    const hasSelectedInvite = invites.some((invite) => invite._id === selectedInviteId);
    if (!hasSelectedInvite) {
      setSelectedInviteId(invites[0]._id);
    }
  }, [invites, selectedInviteId]);

  useEffect(() => {
    if (!selectedInviteData) {
      setEditTitle("");
      setEditExpiresAt("");
      return;
    }

    setEditTitle(selectedInviteData?.invite?.title || "");
    setEditExpiresAt(toDateTimeLocal(selectedInviteData?.invite?.expiresAt));
  }, [selectedInviteData]);

  const selectedInvite = selectedInviteData?.invite || null;
  const selectedInviteUsers = selectedInviteData?.invitedUsers || [];

  const totals = useMemo(
    () => ({
      invites: invites.length,
      opens: invites.reduce((sum, invite) => sum + (invite.openCount || 0), 0),
      signups: invites.reduce((sum, invite) => sum + (invite.signupCount || 0), 0),
    }),
    [invites]
  );

  const handleCreateInvite = async () => {
    const normalizedTitle = inviteTitle.trim();

    if (!normalizedTitle) {
      toast.error("Invite title is required");
      return;
    }

    setCreating(true);
    try {
      const response = await createExternalInvite({ title: normalizedTitle, expiresAt });
      const createdInvite = response?.data;
      toast.success("Invite link created");
      await invitesQuery.refetch();
      if (createdInvite?._id) {
        setSelectedInviteId(createdInvite._id);
      }
      setInviteTitle("");
      setExpiresAt(getDefaultExpiry());
      if (createdInvite?.inviteLink) {
        await navigator.clipboard.writeText(createdInvite.inviteLink);
        toast.success("Invite link copied", { description: "Share it with external users." });
      }
    } catch (error) {
      toast.error("Failed to create invite", { description: error.message });
    } finally {
      setCreating(false);
    }
  };

  const copyInviteLink = async (inviteLink) => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedInviteLink(inviteLink);
      toast.success("Invite link copied");
      window.setTimeout(() => {
        setCopiedInviteLink((currentValue) =>
          currentValue === inviteLink ? "" : currentValue
        );
      }, 2000);
    } catch {
      toast.error("Failed to copy invite link");
    }
  };

  const handleUpdateInvite = async (payload) => {
    if (!selectedInvite?._id) {
      return;
    }

    setSaving(true);
    try {
      await updateExternalInvite(selectedInvite._id, payload);
      toast.success("Invite updated");
      await Promise.all([invitesQuery.refetch(), inviteDetailQuery.refetch()]);
    } catch (error) {
      toast.error("Failed to update invite", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInvite = async () => {
    if (!selectedInvite?._id) {
      return;
    }

    setDeleting(true);
    try {
      await deleteExternalInvite(selectedInvite._id);
      toast.success("Invite deleted");
      await invitesQuery.refetch();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete invite", { description: error.message });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" style={{ borderBottomColor: "#FF4800" }} />
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Invite Users</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Admin-controlled external access that bypasses Student ID only for invited users.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Invite title</label>
            <Input
              value={inviteTitle}
              onChange={(event) => setInviteTitle(event.target.value)}
              placeholder="External hiring drive"
              className="w-80 rounded-full border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 xl:w-96"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Invite expires at</label>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="w-64 rounded-full border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
            />
          </div>
          <Button onClick={handleCreateInvite} disabled={creating} className="rounded-full bg-slate-900 text-white hover:bg-[#FF4800] transition-colors">
            {creating ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create Invite
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {[
            { label: "Invite Links", value: totals.invites, helper: "Admin-created external access links", accent: "text-slate-500 border-slate-100" },
            { label: "Link Opens", value: totals.opens, helper: "Total invite page opens", accent: "text-emerald-500 border-emerald-100" },
            { label: "Signed Up", value: totals.signups, helper: "External users created from invites", accent: "text-slate-500 border-slate-100" },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl border bg-white p-5 shadow-sm ${item.accent.split(" ")[1]}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${item.accent.split(" ")[0]}`}>{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 flex min-h-0 flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-[30%] lg:min-w-[340px] lg:max-h-[680px] rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex lg:flex-col lg:overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Invite Links</h2>
                <p className="mt-1 text-sm text-slate-500">Compact cards with quick actions.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {invites.length} links
              </span>
            </div>

            <div className="space-y-3 p-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              {invites.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No invite links yet.
                </div>
              ) : (
                invites.map((invite) => {
                  const isActive = selectedInviteId === invite._id;
                  const inviteTitleLabel = invite.title || "Untitled Invite";

                  return (
                    <div
                      key={invite._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedInviteId(invite._id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedInviteId(invite._id);
                        }
                      }}
                      className={`rounded-xl border px-3 py-3 transition-all ${
                        isActive ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{inviteTitleLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedInviteId(invite._id);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-800"
                          title="Open"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <MousePointerClick className="h-3.5 w-3.5" />
                            {invite.openCount || 0}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <UserPlus className="h-3.5 w-3.5" />
                            {invite.signupCount || 0}
                          </span>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClassName[invite.status] || "bg-slate-100 text-slate-600"}`}>
                          {invite.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-full lg:w-[70%]">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:max-h-[680px] lg:flex lg:flex-col lg:overflow-hidden">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Invite Details</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {selectedInvite ? selectedInvite.title || "Selected Invite" : "No Invite Selected"}
                  </h2>
                </div>
                {selectedInvite ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-[110px] rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      onClick={() => copyInviteLink(selectedInvite.inviteLink)}
                    >
                      {copiedInviteLink === selectedInvite.inviteLink ? (
                        "Copied"
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      onClick={() => handleUpdateInvite({ title: editTitle, expiresAt: editExpiresAt })}
                      disabled={saving || !editExpiresAt || !editTitle.trim()}
                    >
                      {saving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4" />}
                      Save Expiry
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={() =>
                        handleUpdateInvite({
                          status: selectedInvite.status === "revoked" ? "active" : "revoked",
                        })
                      }
                      disabled={saving}
                    >
                      {selectedInvite.status === "revoked" ? <Eye className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                      {selectedInvite.status === "revoked" ? "Activate" : "Revoke"}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={deleting}
                    >
                      {deleting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="p-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                {detailLoading ? (
                  <div className="flex h-52 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-slate-900" style={{ borderBottomColor: "#FF4800" }} />
                  </div>
                ) : !selectedInvite ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
                    Select an invite from the left to inspect and manage it.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Invite Title</label>
                      <Input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        className="mt-2 border-slate-200"
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Invite URL</p>
                      <p className="mt-2 break-all text-sm text-slate-700">{selectedInvite.inviteLink}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Expires At</p>
                          <Input
                            type="datetime-local"
                            value={editExpiresAt}
                            onChange={(event) => setEditExpiresAt(event.target.value)}
                            className="mt-2 border-slate-200"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Created</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{formatDateTime(selectedInvite.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Opened</p>
                          <p className="mt-2 text-lg font-bold text-slate-900">{selectedInvite.openCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Signed Up</p>
                          <p className="mt-2 text-lg font-bold text-slate-900">{selectedInvite.signupCount || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">Delete this invite link?</AlertDialogTitle>
              <AlertDialogDescription>
                This only works if no users have signed up with this invite. This action will permanently remove the link from admin invite management.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteInvite}
                disabled={deleting}
                className="rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete Invite
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Invited Users Data</h3>
              <p className="mt-1 text-sm text-slate-500">Open only the tab you need. The all-users list loads only when that tab is clicked.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveUsersTab("invite")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  activeUsersTab === "invite" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Users Registered From This Invite
              </button>
              <button
                type="button"
                onClick={() => setActiveUsersTab("all")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  activeUsersTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                All Invited Users Data
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                {activeUsersTab === "invite" ? "" : ""}
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                {activeUsersTab === "invite"
                  ? ""
                  : ""}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {activeUsersTab === "invite" ? selectedInviteUsers.length : externalUsers.length} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Provider</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Student ID</th>
                  {activeUsersTab === "all" ? (
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Invite Code</th>
                  ) : null}
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeUsersTab === "invite" ? (
                  !selectedInvite ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-400">
                        Select an invite to see its users.
                      </td>
                    </tr>
                  ) : selectedInviteUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-400">
                        No users have completed signup from this invite link yet.
                      </td>
                    </tr>
                  ) : (
                    selectedInviteUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-5 py-4 text-sm font-medium text-slate-900">{user.fullName}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                        <td className="px-5 py-4 text-sm capitalize text-slate-600">{user.authProvider}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{user.niatId || "Not required"}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{formatDateTime(user.createdAt)}</td>
                      </tr>
                    ))
                  )
                ) : externalUsersLoading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Loading invited users...
                      </span>
                    </td>
                  </tr>
                ) : externalUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-400">
                      No external invited users have signed up yet.
                    </td>
                  </tr>
                ) : (
                  externalUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">{user.fullName}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-5 py-4 text-sm capitalize text-slate-600">{user.authProvider}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{user.niatId || "Not required"}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{user.externalInvite?.code || "-"}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{formatDateTime(user.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

