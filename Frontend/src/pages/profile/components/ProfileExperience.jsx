import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor';
import { Briefcase, Plus, Trash2, Sparkles, LoaderCircle, MessageSquareMore } from 'lucide-react';
import DatePicker from '@/components/custom/DatePicker'; // Use the new reusable DatePicker

const emptyExperience = {
  title: "", companyName: "", city: "", state: "",
  startDate: "", endDate: "", currentlyWorking: false, workSummary: ""
};

function ProfileExperience({
  onGenerateExperience,
  onEnhanceExperience,
  loadingMap = {},
  generateLoadingMap = {},
  impactQuestions = {},
  targetRole = "",
}) {
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
            <div className="mb-4 rounded-2xl border border-indigo-100 bg-white p-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">AI Experience Enhancer</div>

                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onGenerateExperience?.(index)}
                    disabled={generateLoadingMap[index]}
                  >
                    {generateLoadingMap[index] ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onEnhanceExperience?.(index)}
                    disabled={loadingMap[index]}
                  >
                    {loadingMap[index] ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Enhance With AI
                  </Button>
                </div>
              </div>
              {impactQuestions[index]?.length > 0 && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    <MessageSquareMore className="h-3.5 w-3.5" />
                    Impact Finder Questions
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-amber-900">
                    {impactQuestions[index].map((question) => (
                      <li key={question} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
