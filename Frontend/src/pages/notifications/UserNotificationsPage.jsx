import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Download,
  LoaderCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getNotificationPreferences, updateNotificationPreferences } from "@/Services/login";

const NOTIFICATION_TYPES = [
  {
    key: "reminder",
    icon: Bell,
    label: "Resume Reminder",
    description:
      "Receive occasional nudges to create your first resume if you haven't done so yet. We send at most 3 reminders over 6 months.",
    color: "indigo",
  },
  {
    key: "downloadLink",
    icon: Download,
    label: "Drive Link on Download",
    description:
      "Get an email with your Google Drive link each time you download a resume PDF, so you can access it from any device.",
    color: "emerald",
  },
];

const COLOR_MAP = {
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    icon: "bg-indigo-100 text-indigo-600",
    ring: "ring-indigo-200",
    on: "bg-indigo-600",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
    ring: "ring-emerald-200",
    on: "bg-emerald-600",
  },
};

function ToggleSwitch({ checked, onChange, disabled, onColor }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-13 min-w-[52px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? onColor : "bg-gray-200 focus:ring-gray-300"
      }`}
      style={{ width: "52px" }}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function UserNotificationsPage() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    getNotificationPreferences()
      .then((res) => setPrefs(res.data))
      .catch((err) => toast.error("Failed to load preferences", { description: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setUpdating((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await updateNotificationPreferences({ [key]: value });
      setPrefs(res.data);
      toast.success(value ? "Notifications turned on" : "Notifications turned off");
    } catch (err) {
      setPrefs((prev) => ({ ...prev, [key]: !value }));
      toast.error("Failed to save preference", { description: err.message });
    } finally {
      setUpdating((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm px-5 py-3.5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-800">Email Notifications</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Intro */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Notification Preferences</h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Choose which emails you'd like to receive. Changes take effect immediately.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <LoaderCircle className="h-8 w-8 animate-spin text-indigo-400" />
            <span className="text-sm">Loading your preferences…</span>
          </div>
        ) : (
          <div className="space-y-3">

            {NOTIFICATION_TYPES.map(({ key, icon: Icon, label, description, color }) => {
              const isOn = prefs?.[key] !== false;
              const isSaving = !!updating[key];
              const colors = COLOR_MAP[color];

              return (
                <div
                  key={key}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${
                    isOn ? "border-gray-200" : "border-gray-100 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: icon + text */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">{label}</span>
                          {isOn ? (
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${colors.badge}`}>
                              <CheckCircle2 className="h-2.5 w-2.5" /> ON
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                              <XCircle className="h-2.5 w-2.5" /> OFF
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                      </div>
                    </div>

                    {/* Right: toggle */}
                    <div className="flex-shrink-0 flex items-center gap-2 pt-0.5">
                      {isSaving && (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin text-gray-400" />
                      )}
                      <ToggleSwitch
                        checked={isOn}
                        onChange={(val) => handleToggle(key, val)}
                        disabled={isSaving}
                        onColor={colors.on}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* System emails notice */}
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 mt-2">
              <ShieldCheck className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="font-medium text-gray-500">Security emails</span> such as password
                resets and account alerts are always sent and cannot be turned off.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
