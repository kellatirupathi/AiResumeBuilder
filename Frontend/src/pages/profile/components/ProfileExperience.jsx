import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import DatePicker from '@/components/custom/DatePicker'; // Use the new reusable DatePicker

const emptyExperience = {
  title: "", companyName: "", city: "", state: "",
  startDate: "", endDate: "", currentlyWorking: false, workSummary: ""
};

function ProfileExperience() {
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.editUser.userData);
  const experienceList = profileData?.experience || [];

  const handleUpdate = (newList) => {
    dispatch(addUserData({ ...profileData, experience: newList }));
  };

  const handleAddExperience = () => handleUpdate([...experienceList, emptyExperience]);
  const handleRemoveExperience = (index) => handleUpdate(experienceList.filter((_, i) => i !== index));

  const handleExperienceChange = (index, field, value) => {
    const newList = experienceList.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'currentlyWorking' && value === true) {
          updatedItem.endDate = "";
        }
        return updatedItem;
      }
      return item;
    });
    handleUpdate(newList);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">

      <div className="space-y-6">
        {experienceList.map((exp, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50/50 relative">
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleRemoveExperience(index)}><Trash2 className="h-4 w-4" /></Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Job Title</label>
                <Input value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium">Company Name</label>
                <Input value={exp.companyName} onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium">City</label>
                <Input value={exp.city} onChange={(e) => handleExperienceChange(index, 'city', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium">State/Country</label>
                <Input value={exp.state} onChange={(e) => handleExperienceChange(index, 'state', e.target.value)} />
              </div>
              {/* --- USING THE DATEPICKER --- */}
              <div>
                <label className="text-xs font-medium">Start Date</label>
                <DatePicker name="startDate" label="Select start date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium">End Date</label>
                <DatePicker name="endDate" label="Select end date" value={exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} isDisabled={exp.currentlyWorking} />
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id={`currentlyWorking-profile-${index}`} checked={exp.currentlyWorking} onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)} className="h-4 w-4 rounded" />
                  <label htmlFor={`currentlyWorking-profile-${index}`} className="text-xs">I currently work here</label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium">Work Summary</label>
                <GenericRichTextEditor defaultValue={exp.workSummary} onUpdate={(val) => handleExperienceChange(index, 'workSummary', val)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6"><Button variant="outline" className="w-full" onClick={handleAddExperience}><Plus className="h-4 w-4 mr-2" /> Add Experience</Button></div>
    </div>
  );
}

export default ProfileExperience;
