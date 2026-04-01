/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";

const TEMPLATE_OPTIONS = [
  "modern",
  "professional",
  "creative",
  "minimalist",
  "executive",
  "creative-modern",
  "tech-startup",
  "elegant-portfolio",
  "modern-timeline",
  "modern-grid",
  "modern-sidebar",
  "gradient-accent",
  "bold-impact",
  "split-frame",
  "minimalist-pro",
  "digital-card",
];

const USER_DEFAULTS = {
  fullName: "",
  email: "",
  niatId: "",
  password: "",
  niatIdVerified: false,
  jobTitle: "",
  phone: "",
};

const RESUME_DEFAULTS = {
  user: "",
  title: "",
  template: "modern",
  themeColor: "#4f46e5",
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  phone: "",
  address: "",
  summary: "",
};

const normalizeUserForm = (user) => ({
  fullName: user?.fullName || "",
  email: user?.email || "",
  niatId: user?.niatId || "",
  password: "",
  niatIdVerified: Boolean(user?.niatIdVerified),
  jobTitle: user?.jobTitle || "",
  phone: user?.phone || "",
});

const normalizeResumeForm = (resume) => ({
  user: resume?.user?._id || resume?.user || "",
  title: resume?.title || "",
  template: resume?.template || "modern",
  themeColor: resume?.themeColor || "#4f46e5",
  firstName: resume?.firstName || "",
  lastName: resume?.lastName || "",
  email: resume?.email || "",
  jobTitle: resume?.jobTitle || "",
  phone: resume?.phone || "",
  address: resume?.address || "",
  summary: resume?.summary || "",
});

const selectClassName =
  "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export function UserFormDialog({ open, onOpenChange, mode, initialData, onSubmit, loading }) {
  const [form, setForm] = useState(USER_DEFAULTS);

  useEffect(() => {
    if (open) {
      setForm(mode === "edit" ? normalizeUserForm(initialData) : USER_DEFAULTS);
    }
  }, [open, mode, initialData]);

  const handleChange = (field, value) => {
    setForm((currentValue) => ({ ...currentValue, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      ...form,
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      niatId: form.niatId.trim(),
      jobTitle: form.jobTitle.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the selected user record from the admin dashboard."
              : "Create a new user record directly from the admin dashboard."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Student ID</label>
              <Input
                value={form.niatId}
                onChange={(event) => handleChange("niatId", event.target.value)}
                placeholder="NIAT12345"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {mode === "edit" ? "New Password" : "Password"}
              </label>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => handleChange("password", event.target.value)}
                placeholder={mode === "edit" ? "Leave blank to keep current password" : "Minimum 6 characters"}
                required={mode !== "edit"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Job Title</label>
              <Input
                value={form.jobTitle}
                onChange={(event) => handleChange("jobTitle", event.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <Input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="+91 99999 99999"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Student ID Verified</label>
              <select
                className={selectClassName}
                value={String(form.niatIdVerified)}
                onChange={(event) => handleChange("niatIdVerified", event.target.value === "true")}
              >
                <option value="true">Verified</option>
                <option value="false">Not verified</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === "edit" ? "Save User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ResumeFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  users,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState(RESUME_DEFAULTS);

  useEffect(() => {
    if (open) {
      const nextForm = mode === "edit" ? normalizeResumeForm(initialData) : RESUME_DEFAULTS;
      const fallbackUser = nextForm.user || users?.[0]?._id || "";
      setForm({ ...nextForm, user: fallbackUser });
    }
  }, [open, mode, initialData, users]);

  const handleChange = (field, value) => {
    setForm((currentValue) => ({ ...currentValue, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      ...form,
      user: form.user,
      title: form.title.trim(),
      themeColor: form.themeColor.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      summary: form.summary.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Resume" : "Create Resume"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the selected resume record from the admin dashboard."
              : "Create a new resume record for any user directly from admin."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Owner</label>
              <select
                className={selectClassName}
                value={form.user}
                onChange={(event) => handleChange("user", event.target.value)}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Resume Title</label>
              <Input
                value={form.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Frontend Developer Resume"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Template</label>
              <select
                className={selectClassName}
                value={form.template}
                onChange={(event) => handleChange("template", event.target.value)}
              >
                {TEMPLATE_OPTIONS.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Theme Color</label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={form.themeColor}
                  onChange={(event) => handleChange("themeColor", event.target.value)}
                  className="h-10 w-16 p-1"
                  required
                />
                <Input
                  value={form.themeColor}
                  onChange={(event) => handleChange("themeColor", event.target.value)}
                  placeholder="#4f46e5"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Job Title</label>
              <Input
                value={form.jobTitle}
                onChange={(event) => handleChange("jobTitle", event.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <Input
                value={form.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <Input
                value={form.lastName}
                onChange={(event) => handleChange("lastName", event.target.value)}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Contact Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <Input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="+91 99999 99999"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Address</label>
              <Input
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
                placeholder="Hyderabad, India"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Summary</label>
              <Textarea
                value={form.summary}
                onChange={(event) => handleChange("summary", event.target.value)}
                placeholder="Add a short professional summary for this resume."
                className="min-h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === "edit" ? "Save Resume" : "Create Resume"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  loading,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
