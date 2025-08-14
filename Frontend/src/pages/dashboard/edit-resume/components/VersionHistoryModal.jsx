import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { revertToVersion } from '@/Services/resumeAPI';
import { useDispatch } from 'react-redux';
import { addResumeData } from '@/features/resume/resumeFeatures';
import { History, GitCommit, CornerUpLeft, LoaderCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function VersionHistoryModal({ isOpen, onClose, resumeInfo }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRevert = async (versionId) => {
    setLoading(true);
    try {
      const response = await revertToVersion(resumeInfo._id, versionId);
      if (response.success) {
        dispatch(addResumeData(response.data));
        toast.success("Resume reverted successfully!", {
          description: "Your editor has been updated with the selected version."
        });
        onClose();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error("Failed to revert version", { description: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  if (!resumeInfo || !resumeInfo.versions) {
    return null;
  }
  
  const sortedVersions = [...resumeInfo.versions].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Version History</DialogTitle>
          <DialogDescription>
            Restore your resume to a previously saved state. Up to 10 versions are saved.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-96 overflow-y-auto pr-4">
          {sortedVersions.length > 0 ? (
            <ul className="space-y-4">
              {sortedVersions.map(version => (
                <li key={version._id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <GitCommit className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Version saved {formatDistanceToNow(new Date(version.savedAt), { addSuffix: true })}</p>
                      <p className="text-xs text-gray-500">{new Date(version.savedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRevert(version._id)}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CornerUpLeft className="h-3.5 w-3.5"/>}
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">No saved versions yet. Click "Save Version" in the editor to create one.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default VersionHistoryModal;
