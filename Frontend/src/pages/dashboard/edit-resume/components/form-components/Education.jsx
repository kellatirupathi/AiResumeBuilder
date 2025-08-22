import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LoaderCircle, GraduationCap, School, BookOpen, Calendar, Award, 
  Plus, Trash2, ChevronDown, ChevronUp, ArrowUpDown, ArrowDown, ArrowUp 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { debounce } from "lodash-es"; // Make sure lodash-es is installed

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

// DatePicker sub-component remains unchanged
function DatePicker({ index, field, value, onChange, isDisabled, label }) {
  // ... (All DatePicker code remains the same as in your CertificationsForm.jsx)
  const [showDropdown, setShowDropdown] = useState(false);
  const triggerRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

  const initialDate = value ? new Date(value.split(' ').join(' 1, ')) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const calculateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropdownCoords({
        left: rect.left,
        top: spaceBelow > 310 ? rect.bottom + window.scrollY + 4 : rect.top + window.scrollY - 300 - 4,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (showDropdown) {
      calculateDropdownPosition();
      window.addEventListener('resize', calculateDropdownPosition);
      window.addEventListener('scroll', calculateDropdownPosition, true);
    }
    return () => {
      window.removeEventListener('resize', calculateDropdownPosition);
      window.removeEventListener('scroll', calculateDropdownPosition, true);
    };
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) && event.target.closest('.date-picker-portal') === null) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelection = (year, month) => {
    const formattedDate = `${MONTHS[month]} ${year}`;
    onChange({ target: { name: field, value: formattedDate } }, index);
    setShowDropdown(false);
  };
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  
  const dropdownJsx = (
    <div
      style={{
        position: 'absolute',
        top: `${dropdownCoords.top}px`,
        left: `${dropdownCoords.left}px`,
        width: `${dropdownCoords.width}px`,
      }}
      className="date-picker-portal"
    >
      <div className="z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-full">
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => setCurrentYear(y => y - 1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronDown /></button>
          <span className="mx-2 font-medium">{currentYear}</span>
          <button type="button" onClick={() => setCurrentYear(y => y + 1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronUp /></button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, monthIndex) => (
            <button key={month} type="button" onClick={() => handleDateSelection(currentYear, monthIndex)} className={`px-2 py-1.5 text-sm rounded-md transition-colors ${currentMonth === monthIndex && initialDate.getFullYear() === currentYear ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}>
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div 
        ref={triggerRef}
        className={`flex items-center w-full justify-between p-3 border rounded-md ${isDisabled ? 'bg-gray-50' : 'bg-white'} ${showDropdown ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} cursor-pointer transition-all`}
        onClick={() => !isDisabled && setShowDropdown(!showDropdown)}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value || label}</span>
        <Calendar className="h-4 w-4 text-primary ml-auto" />
      </div>
      {showDropdown && ReactDOM.createPortal(dropdownJsx, document.body)}
    </div>
  );
};


function Education({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  
  // 1. Source of truth from Redux
  const reduxEducationalList = useSelector((state) => state.editResume.resumeData?.education) || [];

  // 2. Local state for fast UI interaction
  const [localEducationalList, setLocalEducationalList] = useState(reduxEducationalList);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSorting, setIsSorting] = useState(false);
  const [activeEducation, setActiveEducation] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 3. Sync local state with Redux when it changes
  useEffect(() => {
    setLocalEducationalList(reduxEducationalList);
  }, [reduxEducationalList]);
  
  // 4. Debounced function to update Redux store
  const debouncedReduxUpdate = useMemo(
    () => debounce((newList) => {
        dispatch(addResumeData({ ...resumeInfo, education: newList }));
        setHasUnsavedChanges(true);
    }, 500),
    [dispatch, resumeInfo]
  );
  
  // 5. Cleanup debounce function
  useEffect(() => {
    return () => debouncedReduxUpdate.cancel();
  }, [debouncedReduxUpdate]);

  const AddNewEducation = () => {
    const newList = [...localEducationalList, { ...formFields }];
    setLocalEducationalList(newList);
    setActiveEducation(newList.length - 1);
    debouncedReduxUpdate(newList);
  };

  const RemoveEducation = async (index) => {
    const newList = localEducationalList.filter((_, i) => i !== index);
    
    // Update UI instantly
    setLocalEducationalList(newList);
    dispatch(addResumeData({ ...resumeInfo, education: newList }));
    
    if (activeEducation >= newList.length) {
      setActiveEducation(Math.max(0, newList.length - 1));
    }
    
    try {
      await updateThisResume(resume_id, { data: { education: newList } });
      toast("Education entry removed.");
      setHasUnsavedChanges(false);
    } catch (error) {
      toast("Error removing entry", { description: "Reverting change.", variant: "destructive"});
      setLocalEducationalList(reduxEducationalList); // Revert on failure
    }
  };

  const sortEducation = () => {
    setIsSorting(true);
    const sorted = [...localEducationalList].sort((a, b) => {
        const dateA = a.endDate ? new Date(a.endDate) : new Date(a.startDate);
        const dateB = b.endDate ? new Date(b.endDate) : new Date(b.startDate);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    setLocalEducationalList(sorted);
    debouncedReduxUpdate(sorted);
    setTimeout(() => setIsSorting(false), 500);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    setTimeout(sortEducation, 0); // Allow state to update before sorting
  };

  const onSave = async () => {
    setLoading(true);
    debouncedReduxUpdate.cancel();
    
    dispatch(addResumeData({ ...resumeInfo, education: localEducationalList }));

    try {
      await updateThisResume(resume_id, { data: { education: localEducationalList } });
      toast("Education details updated!");
      setHasUnsavedChanges(false);
      enanbledNext?.(true);
      enanbledPrev?.(true);
    } catch (error) {
      toast("Error updating education", { description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    enanbledNext?.(false);
    enanbledPrev?.(false);
    
    const { name, value } = e.target;
    const newList = [...localEducationalList];
    newList[index] = { ...newList[index], [name]: value };

    setLocalEducationalList(newList);
    debouncedReduxUpdate(newList);
  };
  
  const getDegreeDescription = (education) => education.degree || education.universityName || `Education ${localEducationalList.indexOf(education) + 1}`;
  
  const getSortAnimationClass = (index) => (isSorting ? "animate-pulse bg-primary/5" : "");

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Education
                  {hasUnsavedChanges && <span className="ml-2 text-sm text-orange-500 font-normal">(Unsaved changes)</span>}
                </h2>
            </div>
            {localEducationalList.length > 1 && (
                <Button variant="outline" size="sm" onClick={toggleSortOrder} className="border-primary/60 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Sort {sortOrder === 'desc' ? "Newest" : "Oldest"}
                    {sortOrder === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                </Button>
            )}
        </div>

        {!localEducationalList.length ? (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
                <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-500 font-medium mb-2">No education added yet</h3>
                <p className="text-gray-400 mb-4">Add your educational background to enhance your resume</p>
                <Button onClick={AddNewEducation} className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"><Plus className="h-4 w-4 mr-2" /> Add Education</Button>
            </div>
        ) : (
            <div className="space-y-8">
                <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
                    {localEducationalList.map((item, index) => (
                        <Button key={`tab-${index}`} variant={activeEducation === index ? 'default' : 'outline'} className={`flex items-center gap-2 whitespace-nowrap ${activeEducation === index ? 'bg-primary' : 'border-primary text-primary'}`} onClick={() => setActiveEducation(index)}>
                            <span className={`flex items-center justify-center ${activeEducation === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>{index + 1}</span>
                            {getDegreeDescription(item)}
                        </Button>
                    ))}
                    <Button variant="ghost" className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap" onClick={AddNewEducation}><Plus className="h-4 w-4 mr-2" /> Add More</Button>
                </div>

                {localEducationalList.map((item, index) => (
                    <div key={`content-${index}`} className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${getSortAnimationClass(index)} ${activeEducation === index ? "block" : "hidden"}`}>
                        <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                              <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">{index + 1}</span>
                              <span>{getDegreeDescription(item)}</span>
                          </h3>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300" onClick={() => RemoveEducation(index)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                           <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><School className="h-4 w-4 text-primary" />University/Institution Name</label>
                                <Input name="universityName" onChange={(e) => handleChange(e, index)} value={item?.universityName || ""} className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all" placeholder="e.g. Harvard University"/>
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" />Degree</label>
                               <Input name="degree" onChange={(e) => handleChange(e, index)} value={item?.degree || ""} className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all" placeholder="e.g. Bachelor of Science"/>
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Major/Field of Study</label>
                               <Input name="major" onChange={(e) => handleChange(e, index)} value={item?.major || ""} className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all" placeholder="e.g. Computer Science"/>
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Start Date</label>
                               <DatePicker index={index} field="startDate" value={item?.startDate || ""} onChange={(e) => handleChange(e, index)} label="Select start date" />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />End Date</label>
                               <DatePicker index={index} field="endDate" value={item?.endDate || ""} onChange={(e) => handleChange(e, index)} label="Select end date" />
                           </div>
                           <div className="col-span-2 space-y-2">
                               <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Award className="h-4 w-4 text-primary" />Grade</label>
                               <div className="flex gap-4">
                                   <select name="gradeType" className="py-2 px-4 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all bg-white" onChange={(e) => handleChange(e, index)} value={item?.gradeType || "CGPA"}>
                                       <option value="CGPA">CGPA</option>
                                       <option value="Percentage">Percentage</option>
                                       <option value="GPA">GPA</option>
                                   </select>
                                   <Input type="text" name="grade" onChange={(e) => handleChange(e, index)} value={item?.grade || ""} className="flex-1 border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all" placeholder="e.g. 3.8" />
                               </div>
                           </div>
                           <div className="col-span-2 space-y-2">
                               <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Description</label>
                               <Textarea name="description" onChange={(e) => handleChange(e, index)} value={item?.description || ""} className="min-h-24 resize-y border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all" placeholder="Describe relevant coursework, achievements, or activities during your education" />
                           </div>
                        </div>
                      </div>
                ))}
            </div>
        )}
        <div className="flex justify-between mt-8">
            {localEducationalList.length > 0 && (
              <Button variant="outline" onClick={AddNewEducation} className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add {localEducationalList.length > 0 ? "Another" : ""} Education
              </Button>
            )}
            {localEducationalList.length > 0 && (
              <Button disabled={loading} onClick={onSave} className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2">
                {loading ? <><LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Education"}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default Education;
