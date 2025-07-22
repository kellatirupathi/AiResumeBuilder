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
import { changePassword } from '@/Services/login';
import { Loader2, FaLock } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await changePassword({ currentPassword, newPassword, confirmNewPassword });
      toast.success(response.message || 'Password changed successfully!');
      onClose();
    } catch (err) {
      setError(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-8 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">Change Password</DialogTitle>
          <DialogDescription className="text-center text-gray-500 pt-2">
            Update your account's password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <div className="flex items-center border rounded-lg p-3">
              <FaLock className="text-gray-400 mr-3" />
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                className="border-none focus:ring-0 outline-none"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-gray-400">
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="flex items-center border rounded-lg p-3">
              <FaLock className="text-gray-400 mr-3" />
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="border-none focus:ring-0 outline-none"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-gray-400">
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <div className="flex items-center border rounded-lg p-3">
              <FaLock className="text-gray-400 mr-3" />
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="border-none focus:ring-0 outline-none"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400">
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3">
              {loading ? <Loader2 className="animate-spin" /> : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordModal;
