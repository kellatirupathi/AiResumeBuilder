import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { changePassword } from '@/Services/login';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [currentPassword,    setCurrentPassword]    = useState('');
  const [newPassword,        setNewPassword]        = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent,        setShowCurrent]        = useState(false);
  const [showNew,            setShowNew]            = useState(false);
  const [showConfirm,        setShowConfirm]        = useState(false);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword({ currentPassword, newPassword, confirmNewPassword });
      toast.success(response.message || 'Password changed successfully!');
      navigate(-1);
    } catch (err) {
      setError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* ── top bar ── */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3.5 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-white">Change Password</span>
        </div>
      </header>

      {/* ── centered card ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">

          {/* card header */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-8 py-7 text-center">
            <h2 className="text-xl font-bold text-white">Update your password</h2>
            <p className="text-indigo-200 text-sm mt-1">Keep your account secure</p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 bg-gray-50 dark:bg-gray-700/50 transition-all">
                <FaLock className="text-gray-400 mr-3 flex-shrink-0 text-xs" />
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2 flex-shrink-0">
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 bg-gray-50 dark:bg-gray-700/50 transition-all">
                <FaLock className="text-gray-400 mr-3 flex-shrink-0 text-xs" />
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  className="border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2 flex-shrink-0">
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 bg-gray-50 dark:bg-gray-700/50 transition-all">
                <FaLock className="text-gray-400 mr-3 flex-shrink-0 text-xs" />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  className="border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2 flex-shrink-0">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-indigo-900/20 transition-all mt-2"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : 'Change Password'}
            </Button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
