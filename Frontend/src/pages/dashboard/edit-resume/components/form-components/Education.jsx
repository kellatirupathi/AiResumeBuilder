import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LoaderCircle, 
  GraduationCap, 
  School, 
  BookOpen, 
  Calendar, 
  Award, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  ArrowDown,
  ArrowUp 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const startYear = currentYear - 60;
const endYear = currentYear + 10;
const YEARS = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const getEducationLevelWeight = (degree) => {
  if (!degree) return 0;
  const degreeText = degree.toLowerCase();
  if (degreeText.includes("phd") || degreeText.includes("doctorate")) return 5;
  if (degreeText.includes("master") || degreeText.includes("mba") || degreeText.includes("ms") || degreeText.includes("ma")) return 4;
  if (degreeText.includes("bachelor") || degreeText.includes("btech") || degreeText.includes("bsc") || degreeText.includes("ba")) return 3;
  if (degreeText.includes("diploma") || degreeText.includes("associate")) return 2;
  if (degreeText.includes("high school") || degreeText.includes("secondary") || degreeText.includes("ssc") || degreeText.includes("hsc")) return 1;
  return 0;
};

function DatePicker({ index, field, value, onChange, isDisabled, label }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  
  const parseInitialValue = () => {
    if (!value) return { day: "", month: "", year: "" };
    try {
      const date = new Date(value);
      if (isNaN(date)) {
        const [yearStr, monthStr, dayStr] = value.split('-').map(v => v.trim());
        return { year: yearStr || "", month: monthStr ? parseInt(monthStr) - 1 : "", day: dayStr || "" };
      }
      return { year: date.getFullYear().toString(), month: date.getMonth(), day: date.getDate().toString() };
    } catch (e) {
      return { day: "", month: "", year: "" };
    }
  };

  const initialValue = parseInitialValue();
  const [selectedDay, setSelectedDay] = useState(initialValue.day);
  const [selectedMonth, setSelectedMonth] = useState(initialValue.month);
  const [selectedYear, setSelectedYear] = useState(initialValue.year);
  const [currentView, setCurrentView] = useState("day");
  
  const daysInMonth = selectedMonth !== "" && selectedYear ? getDaysInMonth(selectedMonth, selectedYear) : 31;
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const updateDate = (day, month, year) => {
    if (day && month && year) {
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      onChange({ target: { name: field, value: `${year}-${formattedMonth}-${formattedDay}` } });
    }
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
    updateDate(day, selectedMonth + 1, selectedYear);
    setShowDropdown(false);
  };
  
  const handleMonthChange = (monthIndex) => {
    setSelectedMonth(monthIndex);
    const maxDaysInNewMonth = getDaysInMonth(monthIndex, selectedYear);
    if (selectedDay > maxDaysInNewMonth) {
      setSelectedDay(maxDaysInNewMonth);
      updateDate(maxDaysInNewMonth, monthIndex + 1, selectedYear);
    } else {
      updateDate(selectedDay, monthIndex + 1, selectedYear);
    }
    setCurrentView("day");
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (selectedMonth === 1) {
      const maxDaysInNewMonth = getDaysInMonth(selectedMonth, year);
      if (selectedDay > maxDaysInNewMonth) {
        setSelectedDay(maxDaysInNewMonth);
        updateDate(maxDaysInNewMonth, selectedMonth + 1, year);
        return;
      }
    }
    updateDate(selectedDay, selectedMonth + 1, year);
    setCurrentView("month");
  };

  const calculateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      spaceBelow < 300 ? setDropdownPosition('top') : setDropdownPosition('bottom');
    }
  };

  const toggleDropdown = () => {
    if (!isDisabled) {
      if (!showDropdown) calculateDropdownPosition();
      setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`date-picker-trigger flex items-center justify-between p-3 border rounded-md ${isDisabled ? 'bg-gray-50' : 'bg-white'} ${showDropdown ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} cursor-pointer transition-all duration-200`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {selectedDay && selectedMonth !== "" && selectedYear ? (
            <span className="text-gray-800">{selectedDay} {months[selectedMonth]}, {selectedYear}</span>
          ) : (
            <span className="text-gray-400">{label}</span>
          )}
        </div>
        {!isDisabled && <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />}
      </div>
      {showDropdown && !isDisabled && (
        <div 
          ref={dropdownRef}
          className={`date-picker-container absolute z-50 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-fadeIn`}
        >
            <div className="flex justify-between items-center mb-2 border-b pb-2">
                <button type="button" className="text-sm font-medium text-primary hover:text-primary-dark" onClick={() => setCurrentView("day")}>Day</button>
                <button type="button" className="text-sm font-medium text-primary hover:text-primary-dark" onClick={() => setCurrentView("month")}>Month</button>
                <button type="button" className="text-sm font-medium text-primary hover:text-primary-dark" onClick={() => setCurrentView("year")}>Year</button>
            </div>
            
            {currentView === "day" && selectedMonth !== "" && selectedYear && (
              <div className="grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => ( <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">{day}</div> ))}
                {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, i) => (<div key={`empty-${i}`} className="h-8 w-8"></div>))}
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => handleDayChange(day)} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 ${selectedDay == day ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>{day}</button>
                ))}
              </div>
            )}
            
            {currentView === "month" && (
                <div className="grid grid-cols-3 gap-2">
                    {months.map((month, index) => (
                        <button key={month} type="button" onClick={() => handleMonthChange(index)} className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedMonth === index ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                            {month.substring(0, 3)}
                        </button>
                    ))}
                </div>
            )}
            
            {currentView === "year" && (
                <div className="max-h-36 overflow-y-auto grid grid-cols-4 gap-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                    {YEARS.map(year => (
                        <button key={year} type="button" onClick={() => handleYearChange(year)} className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedYear === year.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}


function Education({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  const educationalList = useSelector((state) => state.editResume.resumeData?.education) || [];

  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSorting, setIsSorting] = useState(false);
  const [activeEducation, setActiveEducation] = useState(0);

  const setEducationalList = (newList) => {
    dispatch(addResumeData({ ...resumeInfo, education: newList }));
  };

  const AddNewEducation = () => {
    const newList = [...educationalList, { ...formFields }];
    setEducationalList(newList);
    setActiveEducation(newList.length - 1);
  };

  const RemoveEducation = async (index) => {
    const originalList = [...educationalList];
    const newList = educationalList.filter((_, i) => i !== index);
    setEducationalList(newList); // Optimistically update UI

    if (activeEducation >= newList.length) {
      setActiveEducation(Math.max(0, newList.length - 1));
    }
    
    const data = {
      data: {
        education: newList,
      },
    };

    try {
      await updateThisResume(resume_id, data);
      toast("Education entry removed.", { description: "Your education history has been updated." });
    } catch (error) {
      toast("Error removing entry", {
        description: "Could not save the change. Reverting.",
        variant: "destructive"
      });
      setEducationalList(originalList); // Revert on failure
    }
  };

  const sortEducation = () => {
    setIsSorting(true);
    const sorted = [...educationalList].sort((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date(a.startDate);
      const dateB = b.endDate ? new Date(b.endDate) : new Date(b.startDate);

      if (!isNaN(dateA) && !isNaN(dateB)) {
        if(dateA.getTime() !== dateB.getTime()) {
           return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        }
      }

      const weightA = getEducationLevelWeight(a.degree);
      const weightB = getEducationLevelWeight(b.degree);
      return sortOrder === "desc" ? weightB - weightA : weightA - weightB;
    });

    setEducationalList(sorted);
    setTimeout(() => {
      setIsSorting(false);
      toast("Education sorted", { description: `Sorted from ${sortOrder === 'desc' ? 'most recent' : 'oldest'}.` });
    }, 500);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setTimeout(sortEducation, 0);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        education: educationalList,
      },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => toast("Education details updated!"))
        .catch(error => toast("Error updating: " + error.message, { variant: "destructive" }))
        .finally(() => {
          setLoading(false);
          enanbledNext?.(true);
          enanbledPrev?.(true);
        });
    }
  };

  const handleChange = (e, index) => {
    enanbledNext?.(false);
    enanbledPrev?.(false);
    const { name, value } = e.target;
    const list = [...educationalList];
    list[index] = { ...list[index], [name]: value };
    setEducationalList(list);
  };

  const getDegreeDescription = (education) => {
    return education.degree || education.universityName || `Education ${educationalList.indexOf(education) + 1}`;
  };

  const getSortAnimationClass = (index) => (isSorting ? "animate-pulse bg-primary/5" : "");

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
            </div>
            {educationalList.length > 1 && (
                <Button variant="outline" size="sm" onClick={toggleSortOrder} className="border-primary/60 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Sort {sortOrder === 'desc' ? "Newest" : "Oldest"}
                    {sortOrder === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                </Button>
            )}
        </div>
        <p className="text-gray-500 mb-6">Add your educational background to highlight your academic qualifications</p>

        {!educationalList.length ? (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
                <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-500 font-medium mb-2">No education added yet</h3>
                <p className="text-gray-400 mb-4">Add your educational background to enhance your resume</p>
                <Button onClick={AddNewEducation} className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"><Plus className="h-4 w-4 mr-2" /> Add Education</Button>
            </div>
        ) : (
            <div className="space-y-8">
                <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
                    {educationalList.map((item, index) => (
                        <Button key={`tab-${index}`} variant={activeEducation === index ? 'default' : 'outline'} className={`flex items-center gap-2 whitespace-nowrap ${activeEducation === index ? 'bg-primary' : 'border-primary text-primary'}`} onClick={() => setActiveEducation(index)}>
                            <span className={`flex items-center justify-center ${activeEducation === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>{index + 1}</span>
                            {getDegreeDescription(item)}
                        </Button>
                    ))}
                    <Button variant="ghost" className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap" onClick={AddNewEducation}><Plus className="h-4 w-4 mr-2" /> Add More</Button>
                </div>

                {educationalList.map((item, index) => (
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
                                       <option value="GPA">GPA</option>
                                       <option value="Percentage">Percentage</option>
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
                  {educationalList.length > 0 && (
                    <Button variant="outline" onClick={AddNewEducation} className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add {educationalList.length > 0 ? "Another" : ""} Education
                    </Button>
                  )}
                  {educationalList.length > 0 && (
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
