import { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import {
  createAdminAccount,
  deleteAdminAccount,
  updateAdminAccount,
} from "@/Services/adminApi";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, RefreshCw, Shield, ShieldCheck } from "lucide-react";
import { AdminAccountFormDialog, DeleteConfirmDialog } from "./AdminCrudDialogs";
import { useAdminAccountsQuery } from "@/hooks/useAdminQueryData";

function RoleBadge({ role }) {
  const isOwner = role === "owner";
  const Icon = isOwner ? ShieldCheck : Shield;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOwner ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {isOwner ? "Owner Admin" : "Admin"}
    </span>
  );
}

export default function AdminAccountsPage() {
  const { admin: currentAdmin } = useOutletContext();
  const [selected, setSelected] = useState([]);
  const [accountDialog, setAccountDialog] = useState({ open: false, mode: "create", record: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, records: [] });
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const accountsQuery = useAdminAccountsQuery();
  const accounts = useMemo(() => accountsQuery.data || [], [accountsQuery.data]);
  const loading = accountsQuery.isPending && !accounts.length;
  const refreshing = accountsQuery.isFetching && !loading;

  const toggleSelect = (id, checked) =>
    setSelected((currentValue) =>
      checked ? [...currentValue, id] : currentValue.filter((value) => value !== id)
    );

  const toggleAll = (checked) =>
    setSelected(checked ? accounts.map((account) => account._id) : []);

  const allSelected = accounts.length > 0 && accounts.every((account) => selected.includes(account._id));
  const selectedAccounts = accounts.filter((account) => selected.includes(account._id));

  const handleRefresh = async () => {
    await accountsQuery.refetch();
    toast.success("Refreshed");
  };

  const handleAccountSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (accountDialog.mode === "edit") {
        await updateAdminAccount(accountDialog.record._id, payload);
        toast.success("Admin account updated successfully");
      } else {
        await createAdminAccount(payload);
        toast.success("Admin account created successfully");
      }

      setAccountDialog({ open: false, mode: "create", record: null });
      await accountsQuery.refetch();
      setSelected([]);
    } catch (error) {
      toast.error("Failed to save admin account", { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      for (const account of deleteDialog.records) {
        await deleteAdminAccount(account._id);
      }

      toast.success(
        deleteDialog.records.length > 1
          ? `${deleteDialog.records.length} admin accounts deleted`
          : "Admin account deleted"
      );
      setDeleteDialog({ open: false, records: [] });
      await accountsQuery.refetch();
      setSelected([]);
    } catch (error) {
      toast.error("Delete failed", { description: error.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (currentAdmin?.role !== "owner") {
    return null;
  }

  if (accountsQuery.isError && !accounts.length) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-sm text-slate-500">Failed to load admin accounts.</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
          <p className="mt-0.5 text-xs text-gray-500">{accounts.length} total admin accounts</p>
        </div>
        <div className="flex items-center gap-3">
          {selected.length > 0 ? (
            <>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                {selected.length} selected
              </span>
              {selected.length === 1 && (
                <Button
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={() =>
                    setAccountDialog({ open: true, mode: "edit", record: selectedAccounts[0] })
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button
                className="bg-rose-600 text-white hover:bg-rose-700"
                onClick={() => setDeleteDialog({ open: true, records: selectedAccounts })}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setAccountDialog({ open: true, mode: "create", record: null })}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Account
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
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
          <div className="flex-1 overflow-auto">
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 to-blue-50">
                <tr>
                  <th className="w-12 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(event) => toggleAll(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account, index) => (
                  <tr
                    key={account._id}
                    className={`transition-colors hover:bg-indigo-50/30 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="w-12 px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(account._id)}
                        onChange={(event) => toggleSelect(account._id, event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                          <span className="text-sm font-medium text-indigo-700">
                            {(account.name || "").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {account.name}
                            {account._id === currentAdmin?._id ? " (You)" : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{account.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <RoleBadge role={account.role} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {format(new Date(account.createdAt), "PP")}
                    </td>
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No admin accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <AdminAccountFormDialog
        open={accountDialog.open}
        onOpenChange={(open) => setAccountDialog((currentValue) => ({ ...currentValue, open }))}
        mode={accountDialog.mode}
        initialData={accountDialog.record}
        onSubmit={handleAccountSubmit}
        loading={submitting}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((currentValue) => ({ ...currentValue, open }))}
        title={
          deleteDialog.records.length > 1
            ? `Delete ${deleteDialog.records.length} admin accounts?`
            : "Delete admin account?"
        }
        description={
          deleteDialog.records.length > 1
            ? `Permanently delete ${deleteDialog.records.length} admin accounts.`
            : `Permanently delete ${deleteDialog.records[0]?.name}.`
        }
        confirmLabel={
          deleteDialog.records.length > 1
            ? `Delete ${deleteDialog.records.length} Accounts`
            : "Delete Account"
        }
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}
