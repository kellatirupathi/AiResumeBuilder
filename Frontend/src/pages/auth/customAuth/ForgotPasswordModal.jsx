import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { forgotPassword } from '@/Services/login';
import { Loader2, FaEnvelope, FaLock } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await forgotPassword({ email, newPassword, confirmPassword });
      toast.success(response.message || 'Password reset successfully!', {
        description: 'You can now log in with your new password.',
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-gray-800 p-8 rounded-lg shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-indigo-600">Reset Your Password</DialogTitle>
          <DialogDescription className="text-center text-gray-500 pt-2">
            Enter your email and a new password to reset your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-5 pt-4">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium">Email Address</label>
            <div className="flex items-center border rounded-lg p-3">
                <FaEnvelope className="text-gray-400 mr-3" />
                <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="border-none focus:ring-0 outline-none w-full"
                />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
            <div className="flex items-center border rounded-lg p-3">
                <FaLock className="text-gray-400 mr-3" />
                <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="border-none focus:ring-0 outline-none w-full"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
            <div className="flex items-center border rounded-lg p-3">
                <FaLock className="text-gray-400 mr-3" />
                <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    className="border-none focus:ring-0 outline-none w-full"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md text-center">{error}</p>}
          
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 text-white py-3 rounded-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPasswordModal;
