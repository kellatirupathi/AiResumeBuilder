import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import DatePicker from '@/components/custom/DatePicker'; // <-- IMPORT THE NEW COMPONENT

const emptyEducation = { universityName: "", degree: "", major: "", grade: "", gradeType: "CGPA", startDate: "", endDate: "", description: "" };

function ProfileEducation() {
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.editUser.userData);
  const educationList = profileData?.education || [];

  const handleUpdate = (newList) => {
      dispatch(addUserData({ ...profileData, education: newList }));
  };

  const handleAddEducation = () => handleUpdate([...educationList, emptyEducation]);
  const handleRemoveEducation = (index) => handleUpdate(educationList.filter((_, i) => i !== index));

  const handleEducationChange = (index, field, value) => {
    const newList = educationList.map((item, i) => i === index ? { ...item, [field]: value } : item);
    handleUpdate(newList);
  };

  return (
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">

          <div className="space-y-6">
              {educationList.map((edu, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50/50 relative">
                      <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleRemoveEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2"><label className="text-xs font-medium">University / Institution</label><Input value={edu.universityName} onChange={(e) => handleEducationChange(index, 'universityName', e.target.value)} /></div>
                          <div><label className="text-xs font-medium">Degree</label><Input value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} placeholder="e.g., Bachelor of Science" /></div>
                          <div><label className="text-xs font-medium">Major / Field of Study</label><Input value={edu.major} onChange={(e) => handleEducationChange(index, 'major', e.target.value)} placeholder="e.g., Computer Science"/></div>
                          
                          {/* --- START: UPDATED DATE PICKERS --- */}
                          <div>
                              <label className="text-xs font-medium">Start Date</label>
                              <DatePicker name="startDate" label="Select start date" value={edu.startDate} onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)} />
                          </div>
                          <div>
                              <label className="text-xs font-medium">End Date</label>
                              <DatePicker name="endDate" label="Select end date" value={edu.endDate} onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)} />
                          </div>
                          {/* --- END: UPDATED DATE PICKERS --- */}
                          
                          <div className="md:col-span-2">
                              <label className="text-xs font-medium">Grade</label>
                              <div className="flex gap-2 items-center">
                                  <select value={edu.gradeType} onChange={(e) => handleEducationChange(index, 'gradeType', e.target.value)} className="border-gray-300 rounded-md p-2"><option>CGPA</option><option>Percentage</option><option>GPA</option></select>
                                  <Input value={edu.grade} onChange={(e) => handleEducationChange(index, 'grade', e.target.value)} placeholder="e.g., 3.8"/>
                              </div>
                          </div>
                          <div className="md:col-span-2">
                              <label className="text-xs font-medium">Description</label>
                              <Textarea value={edu.description} onChange={(e) => handleEducationChange(index, 'description', e.target.value)} className="min-h-24"/>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-6"><Button variant="outline" className="w-full" onClick={handleAddEducation}><Plus className="h-4 w-4 mr-2" /> Add Education</Button></div>
      </div>
  );
}

export default ProfileEducation;
