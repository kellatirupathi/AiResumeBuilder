import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

function CloneResumeModal({ isOpen, onClose, onClone, originalTitle, loading }) {
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewTitle(`Copy of ${originalTitle}`);
    }
  }, [isOpen, originalTitle]);

  const handleClone = () => {
    if (newTitle.trim()) {
      onClone(newTitle.trim());
    } else {
      toast.error("Title cannot be empty.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" /> Clone Resume
          </DialogTitle>
          <DialogDescription>
            Create a copy of "{originalTitle}". Enter a new title for the duplicate resume.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <label htmlFor="new-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            New Resume Title
          </label>
          <Input
            id="new-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Senior Developer Resume"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleClone} disabled={loading || !newTitle.trim()}>
            {loading ? <LoaderCircle className="animate-spin h-4 w-4" /> : 'Clone'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CloneResumeModal;
