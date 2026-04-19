import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Download,
  LoaderCircle,
  ArrowLeft,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { updateNotificationPreferences } from "@/Services/login";
import { useNotificationPreferencesQuery } from "@/hooks/useAppQueryData";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const NOTIFICATION_TYPES = [
  {
    key: "reminder",
    icon: Bell,
    label: "Resume Reminder",
    description:
      "Receive occasional nudges to create your first resume if you haven't done so yet. We send at most 3 reminders over 6 months.",
  },
  {
    key: "downloadLink",
    icon: Download,
    label: "Drive Link on Download",
    description:
      "Get an email with your Google Drive link each time you download a resume PDF, so you can access it from any device.",
  },
];

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-slate-900" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function UserNotificationsPage() {
  const navigate = useNavigate();
  const preferencesQuery = useNotificationPreferencesQuery();
  const [prefs, setPrefs] = useState(preferencesQuery.data || null);
  const [updating, setUpdating] = useState({});
  const loading = preferencesQuery.isPending && !prefs;

  useEffect(() => {
    if (!preferencesQuery.data) {
      return;
    }

    setPrefs(preferencesQuery.data);
  }, [preferencesQuery.data]);

  useEffect(() => {
    if (!preferencesQuery.isError) {
      return;
    }

    toast.error("Failed to load preferences", {
      description: preferencesQuery.error?.message,
    });
  }, [preferencesQuery.error?.message, preferencesQuery.isError]);

  const handleToggle = async (key, value) => {
    setPrefs((prev) => ({ ...(prev || {}), [key]: value }));
    setUpdating((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await updateNotificationPreferences({ [key]: value });
      setPrefs(res.data || res);
      toast.success(value ? "Notifications turned on" : "Notifications turned off");
    } catch (err) {
      setPrefs((prev) => ({ ...(prev || {}), [key]: !value }));
      toast.error("Failed to save preference", { description: err.message });
    } finally {
      setUpdating((prev) => ({ ...prev, [key]: false }));
    }
  };

  const enabledCount = NOTIFICATION_TYPES.filter(
    ({ key }) => prefs?.[key] !== false
  ).length;

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-5 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-500" />
            <span className="text-[13px] font-semibold text-slate-900">
              Email Notifications
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        {/* Hero */}
        <section className="border-b border-slate-200 pb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            Preferences
          </span>
          <h1
            style={DISPLAY}
            className="mt-4 text-[36px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[44px]"
          >
            Notifications
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
            Choose which emails you'd like to receive. Changes take effect
            immediately.
          </p>
          {!loading && (
            <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.18em] text-slate-500">
              {enabledCount} of {NOTIFICATION_TYPES.length} enabled
            </p>
          )}
        </section>

        {/* Preferences list */}
        <section className="pt-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
              <LoaderCircle
                className="h-7 w-7 animate-spin"
                style={{ color: ACCENT }}
              />
              <span className="text-[13px]">Loading your preferences…</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {NOTIFICATION_TYPES.map(
                ({ key, icon: Icon, label, description }) => {
                  const isOn = prefs?.[key] !== false;
                  const isSaving = !!updating[key];

                  return (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4 p-6 transition-colors hover:bg-slate-50/60"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[14.5px] font-semibold text-slate-900">
                              {label}
                            </span>
                            <StatusPill on={isOn} />
                          </div>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-2 pt-0.5">
                        {isSaving && (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-slate-400" />
                        )}
                        <ToggleSwitch
                          checked={isOn}
                          onChange={(val) => handleToggle(key, val)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Security emails notice */}
          {!loading && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#FBFAF7] px-5 py-4">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                <ShieldCheck
                  className="h-3.5 w-3.5"
                  style={{ color: ACCENT }}
                />
              </div>
              <p className="text-[13px] leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-900">
                  Security emails
                </span>{" "}
                such as password resets and account alerts are always sent and
                cannot be turned off.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusPill({ on }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        on
          ? "border-slate-900/10 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          on ? "bg-[#FF4800]" : "bg-slate-300"
        }`}
      />
      {on ? "On" : "Off"}
    </span>
  );
}
