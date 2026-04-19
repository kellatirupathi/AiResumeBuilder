import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";
import { googleLogin } from "@/Services/login";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };

function parseHash(hash) {
  const result = {};
  const raw = (hash || "").replace(/^#/, "");
  if (!raw) return result;
  for (const pair of raw.split("&")) {
    const [k, v] = pair.split("=");
    if (k) result[decodeURIComponent(k)] = decodeURIComponent(v || "");
  }
  return result;
}

function parseState(state) {
  try {
    const params = new URLSearchParams(state || "");
    return {
      invite: params.get("invite") || "",
      nonce: params.get("nonce") || "",
    };
  } catch {
    return { invite: "", nonce: "" };
  }
}

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const hashParams = parseHash(window.location.hash);
    const queryParams = new URLSearchParams(window.location.search);

    const providerError =
      hashParams.error || queryParams.get("error");
    if (providerError) {
      setError(
        queryParams.get("error_description") ||
          hashParams.error_description ||
          "Google sign-in was cancelled or failed."
      );
      return;
    }

    const idToken = hashParams.id_token;
    if (!idToken) {
      setError("Missing Google credential. Please try signing in again.");
      return;
    }

    const { invite, nonce: returnedNonce } = parseState(hashParams.state);
    const expectedNonce = window.sessionStorage.getItem("google_oauth_nonce");
    window.sessionStorage.removeItem("google_oauth_nonce");

    if (expectedNonce && returnedNonce && expectedNonce !== returnedNonce) {
      setError("Security check failed. Please try signing in again.");
      return;
    }

    let cancelled = false;
    googleLogin(idToken, invite)
      .then((user) => {
        if (cancelled) return;
        if (user?.statusCode === 200) {
          navigate("/dashboard", { replace: true });
        } else {
          setError("Google sign-in failed.");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Google sign-in failed.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white text-slate-900 antialiased">
      <div className="w-full max-w-[380px] px-6 text-center">
        <div className="mb-6 flex justify-center">
          <NxtResumeWordmark size="22px" color="#0F172A" />
        </div>

        {error ? (
          <>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
              <AlertCircle className="h-4 w-4" style={{ color: "#FF4800" }} />
            </div>
            <h1
              className="mt-5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
              style={DISPLAY}
            >
              Couldn't sign you in.
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">{error}</p>
            <button
              onClick={() => navigate("/auth/sign-in", { replace: true })}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#FF4800]"
            >
              Back to sign in
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
            <h1
              className="mt-5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
              style={DISPLAY}
            >
              Signing you in…
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-slate-500">
              Hold on while we set up your session.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
