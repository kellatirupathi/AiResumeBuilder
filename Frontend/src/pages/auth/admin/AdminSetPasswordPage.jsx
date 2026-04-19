import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Loader2, Mail } from "lucide-react";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";
import { getAdminInviteDetails, setAdminPassword } from "@/Services/adminApi";

function AdminSetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [invite, setInvite] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const inviteToken = searchParams.get("token");

    if (!inviteToken) {
      setError("Invalid or missing invite token.");
      setValidating(false);
      return;
    }

    setToken(inviteToken);
    getAdminInviteDetails(inviteToken)
      .then((response) => {
        setInvite(response?.data || null);
      })
      .catch((err) => {
        setError(err.message || "This invite link is invalid or has expired.");
      })
      .finally(() => setValidating(false));
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await setAdminPassword({ token, password, confirmPassword });
      const admin = response?.data?.admin;

      toast.success("Password created successfully.", {
        description: "Redirecting to admin dashboard...",
      });

      navigate(admin?.role === "owner" ? "/admin/accounts" : "/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4">
        <Link to="/" className="flex items-center">
          <NxtResumeWordmark size="24px" color="#0F172A" />
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Admin Password</h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Set your password to activate your admin account.
          </p>

          {validating ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error && !invite ? (
            <div className="text-center py-4">
              <p className="text-red-600">{error}</p>
              <Button variant="link" asChild className="mt-4">
                <Link to="/admin/login">Back to Admin Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center border rounded-lg p-3 mt-1 bg-gray-50">
                  <Mail className="text-gray-400 mr-3 h-4 w-4" />
                  <Input
                    value={invite?.email || ""}
                    readOnly
                    className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="flex items-center border rounded-lg p-3 mt-1">
                  <FaLock className="text-gray-400 mr-3" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="flex items-center border rounded-lg p-3 mt-1">
                  <FaLock className="text-gray-400 mr-3" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {invite?.role ? (
                <p className="text-xs text-indigo-600 text-center">
                  This account will be activated as {invite.role === "owner" ? "Owner Admin" : "Admin"}.
                </p>
              ) : null}

              {error ? <p className="text-sm text-red-500 text-center">{error}</p> : null}

              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3">
                {loading ? <Loader2 className="animate-spin" /> : "Create Password"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminSetPasswordPage;
