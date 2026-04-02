import React from 'react';
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import AddSection from "./AddSection";
import AdditionalSectionForm from "./AdditionalSectionForm";
import { Info, PlusCircle } from 'lucide-react';

function ManageAdditionalSections({ resumeInfo }) {
  const dispatch = useDispatch();

  const handleSectionListUpdate = (newList) => {
    dispatch(addResumeData({ ...resumeInfo, additionalSections: newList }));
  };

  const handleAddNewSection = (newSection) => {
    const currentSections = resumeInfo.additionalSections || [];
    const newList = [...currentSections, newSection];
    handleSectionListUpdate(newList);
  };
  
  return (
    <div className="bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
            <PlusCircle className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Additional Sections</p>
            <p className="text-xs text-gray-400">Add custom sections like awards, languages, volunteering, or research</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <AdditionalSectionForm 
          resumeInfo={resumeInfo} 
          onUpdate={handleSectionListUpdate} 
        />
        
        <AddSection 
          onSectionAdd={handleAddNewSection} 
        />
        
        <div className="flex items-start gap-3 rounded-lg border border-violet-100 bg-violet-50 p-4 text-violet-800">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-500" />
          <div>
            <h4 className="font-semibold text-violet-900">Pro Tip</h4>
            <p className="text-sm">
              Any sections you add here will appear at the bottom of your resume. Drag the handle on any section to reorder it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAdditionalSections;
