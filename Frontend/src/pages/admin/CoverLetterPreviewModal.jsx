import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PreviewCoverLetter from '@/pages/dashboard/cover-letter/components/PreviewCoverLetter';
import PaginatedA4Preview from '@/pages/dashboard/edit-resume/components/PaginatedA4Preview';

function CoverLetterPreviewModal({ coverLetterInfo, onClose }) {
  if (!coverLetterInfo) return null;

  return (
    <Dialog open={!!coverLetterInfo} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col bg-gray-50">
        <header className="p-4 bg-white border-b flex justify-between items-center noPrint">
          <h2 className="text-lg font-semibold text-gray-800">Cover Letter Preview: {coverLetterInfo.title}</h2>
        </header>
        <div id="print" className="flex-grow overflow-auto bg-gray-200">
          <div
            id="cover-letter-container-modal"
            className="mx-auto"
            style={{
              width: "210mm",
              minHeight: '297mm'
            }}
          >
            <PaginatedA4Preview>
              <PreviewCoverLetter coverLetterInfo={coverLetterInfo} />
            </PaginatedA4Preview>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CoverLetterPreviewModal;
