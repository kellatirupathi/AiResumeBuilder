import React from 'react';
import { useSelector, useDispatch } from "react-redux";
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
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <PlusCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">Additional Sections</h2>
        </div>
        <p className="text-gray-500 mb-6">
          Add custom sections like "Awards", "Languages", or "Volunteer Work" to make your resume unique.
        </p>

        <AdditionalSectionForm 
          resumeInfo={resumeInfo} 
          onUpdate={handleSectionListUpdate} 
        />
        
        <AddSection 
          onSectionAdd={handleAddNewSection} 
        />
        
        <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Pro Tip</h4>
            <p className="text-sm">
              Any sections you add here will appear at the bottom of your resume. Drag and drop functionality to reorder sections will be coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAdditionalSections;
