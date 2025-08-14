import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { updateThisResume } from '@/Services/resumeAPI';
import { toast } from 'sonner';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor'; // <-- Use the new generic editor

function AdditionalSectionForm({ resumeInfo, onUpdate }) {
  const { resume_id } = useParams();

  const handleContentChange = (index, newContent) => {
    const originalList = resumeInfo.additionalSections || [];
    // Create a new array and new object to avoid mutating Redux state
    const newList = originalList.map((item, i) => {
      if (i === index) {
        return { ...item, content: newContent };
      }
      return item;
    });
    onUpdate(newList);
  };

  const handleRemove = async (index) => {
    const originalList = [...(resumeInfo.additionalSections || [])];
    const newList = originalList.filter((_, i) => i !== index);
    onUpdate(newList); // Optimistic UI update
    
    // Persist removal to the backend
    try {
      await updateThisResume(resume_id, { data: { additionalSections: newList } });
      toast.success("Section removed successfully.");
    } catch {
      toast.error("Failed to remove section. Reverting change.");
      onUpdate(originalList); // Revert on error
    }
  };
  
  const onSave = async () => {
    try {
      await updateThisResume(resume_id, { data: { additionalSections: resumeInfo.additionalSections } });
      toast.success("Additional sections saved successfully.");
    } catch (error) {
      toast.error("Failed to save sections:", { description: error.message });
    }
  };

  if (!resumeInfo.additionalSections || resumeInfo.additionalSections.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mt-6">
      {resumeInfo.additionalSections.map((section, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">{section.title}</h3>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          {/* Use the new GenericRichTextEditor component */}
          <GenericRichTextEditor
            defaultValue={section.content}
            onUpdate={(val) => handleContentChange(index, val)}
          />
        </div>
      ))}
      <div className="flex justify-end">
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Sections
          </Button>
      </div>
    </div>
  );
}

export default AdditionalSectionForm;
