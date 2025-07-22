import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PreviewPage from '@/pages/dashboard/edit-resume/components/PreviewPage';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addResumeData } from '@/features/resume/resumeFeatures';

function ResumePreviewModal({ resumeInfo, onClose }) {
  const dispatch = useDispatch();

  // When the modal opens, update the Redux store so PreviewPage can access the data
  useEffect(() => {
    if (resumeInfo) {
      dispatch(addResumeData(resumeInfo));
    }
  }, [resumeInfo, dispatch]);

  if (!resumeInfo) return null;

  return (
    <Dialog open={!!resumeInfo} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col bg-gray-50">
        <header className="p-4 bg-white border-b flex justify-between items-center noPrint">
          <h2 className="text-lg font-semibold text-gray-800">Resume Preview: {resumeInfo.title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <div id="print" className="flex-grow overflow-auto bg-gray-200">
            <div 
              id="resume-container-modal" 
              className="mx-auto" 
              style={{ 
                width: "210mm", 
                minHeight: '297mm' 
              }}
            >
              <PreviewPage />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResumePreviewModal;
