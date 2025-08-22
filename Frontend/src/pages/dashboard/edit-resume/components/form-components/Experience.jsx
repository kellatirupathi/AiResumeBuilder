import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Briefcase, Building, MapPin, Calendar, Plus, Check, ChevronDown, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { debounce } from "lodash-es"; // Ensure you have installed lodash: npm install lodash

// Template for a new experience entry
const createEmptyFormFields = () => ({
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  workSummary: "",
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

// The DatePicker component can remain the same, it is self-contained.
function DatePicker({ name, value, onChange, min, isDisabled, label }) {
    // ... DatePicker code remains unchanged ...
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  
  // Parse the initial value (if any)
  const parseInitialValue = () => {
    if (!value) return { day: "", month: "", year: "" };
    
    try {
      const date = new Date(value);
      if (isNaN(date)) {
        // If date is invalid but we have a value string, try to parse it
        const [yearStr, monthStr, dayStr] = value.split('-').map(v => v.trim());
        return {
          year: yearStr || "",
          month: monthStr ? parseInt(monthStr) - 1 : "",
          day: dayStr || ""
        };
      }
      
      return {
        year: date.getFullYear().toString(),
        month: date.getMonth(),
        day: date.getDate().toString()
      };
    } catch (e) {
      return { day: "", month: "", year: "" };
    }
  };
  
  const initialValue = parseInitialValue();
  const [selectedDay, setSelectedDay] = useState(initialValue.day);
  const [selectedMonth, setSelectedMonth] = useState(initialValue.month);
  const [selectedYear, setSelectedYear] = useState(initialValue.year);
  const [currentView, setCurrentView] = useState("day"); // 'day', 'month', or 'year'
  
  // Calculate days in the selected month
  const daysInMonth = selectedMonth !== "" && selectedYear 
    ? getDaysInMonth(selectedMonth, selectedYear) 
    : 31;
  
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const handleDayChange = (day) => {
    setSelectedDay(day);
    updateDate(day, selectedMonth + 1, selectedYear);
    setShowDropdown(false);
  };
  
  const handleMonthChange = (monthIndex) => {
    setSelectedMonth(monthIndex);
    
    // Adjust selected day if it exceeds days in the new month
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
    
    // Check if Feb 29 in leap year
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
  
  const updateDate = (day, month, year) => {
    if (day && month && year) {
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      onChange({ target: { name, value: `${year}-${formattedMonth}-${formattedDay}` } });
    }
  };

  // Calculate dropdown position when showing
  const calculateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If there's more space above than below, or if space below is less than 300px
      if (spaceAbove > spaceBelow || spaceBelow < 300) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  };

  // Toggle dropdown and calculate position
  const toggleDropdown = () => {
    if (!isDisabled) {
      if (!showDropdown) {
        calculateDropdownPosition();
      }
      setShowDropdown(!showDropdown);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`flex items-center justify-between p-3 border rounded-md ${isDisabled ? 'bg-gray-50' : 'bg-white'} ${showDropdown ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} cursor-pointer transition-all duration-200`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {selectedDay && selectedMonth !== "" && selectedYear ? (
            <span className="text-gray-800">{selectedDay} {MONTHS[selectedMonth]}, {selectedYear}</span>
          ) : (
            <span className="text-gray-400">{label}</span>
          )}
        </div>
        {!isDisabled && <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />}
      </div>
      
      {showDropdown && !isDisabled && (
        <div 
          ref={dropdownRef}
          className={`absolute z-50 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 animate-fadeIn`}
        >
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <button 
              type="button" 
              className="text-sm font-medium text-primary hover:text-primary-dark"
              onClick={() => setCurrentView("day")}
            >
              Day
            </button>
            <button 
              type="button" 
              className="text-sm font-medium text-primary hover:text-primary-dark"
              onClick={() => setCurrentView("month")}
            >
              Month
            </button>
            <button 
              type="button" 
              className="text-sm font-medium text-primary hover:text-primary-dark"
              onClick={() => setCurrentView("year")}
            >
              Year
            </button>
          </div>
          
          {currentView === "day" && selectedMonth !== "" && selectedYear && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Select Day - {MONTHS[selectedMonth]} {selectedYear}
                </h4>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }, (_, i) => (
                  <div key={`empty-${i}`} className="h-8 w-8"></div>
                ))}
                
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChange(day)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 
                      ${selectedDay == day ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {currentView === "month" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Select Month {selectedYear ? `- ${selectedYear}` : ''}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthChange(index)}
                    className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedMonth === index ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {currentView === "year" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Year</h4>
              <div className="max-h-36 overflow-y-auto grid grid-cols-4 gap-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                {YEARS.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedYear === year.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  // Read from Redux store as the source of truth
  const reduxExperienceList = useSelector(state => state.editResume.resumeData?.experience) || [];
  
  // Local state for fast UI updates
  const [localExperienceList, setLocalExperienceList] = useState(reduxExperienceList);
  const [loading, setLoading] = useState(false);
  const [activeExperience, setActiveExperience] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync local state when Redux changes (initial load, external changes)
  useEffect(() => {
    setLocalExperienceList(reduxExperienceList);
  }, [reduxExperienceList]);

  // Debounced function to update Redux store
  const debouncedReduxUpdate = useMemo(
    () => debounce((newList) => {
      dispatch(addResumeData({ ...resumeInfo, experience: newList }));
      setHasUnsavedChanges(true);
    }, 500),
    [dispatch, resumeInfo]
  );

  useEffect(() => {
    // Cleanup debounce on component unmount
    return () => debouncedReduxUpdate.cancel();
  }, [debouncedReduxUpdate]);

  const addExperience = () => {
    const newList = [...localExperienceList, createEmptyFormFields()];
    setLocalExperienceList(newList);
    setActiveExperience(newList.length - 1);
    debouncedReduxUpdate(newList); // Update Redux after a delay
  };
  
  const removeExperience = async (index) => {
    const newList = localExperienceList.filter((_, i) => i !== index);
    
    setLocalExperienceList(newList);
    if (activeExperience >= newList.length) {
      setActiveExperience(Math.max(0, newList.length - 1));
    }
    
    dispatch(addResumeData({ ...resumeInfo, experience: newList }));
    
    try {
      await updateThisResume(resume_id, { data: { experience: newList } });
      toast("Experience removed successfully.", {
        description: "Your work history has been updated.",
        icon: <Trash2 className="h-4 w-4 text-green-500" />,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      toast("Error removing experience", {
        description: "Could not save. Please try again.",
        variant: "destructive",
      });
      setLocalExperienceList(reduxExperienceList); // Revert on failure
    }
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    
    const { name, value } = e.target;
    const newList = [...localExperienceList];
    newList[index] = { ...newList[index], [name]: value };
    
    setLocalExperienceList(newList);
    debouncedReduxUpdate(newList);
  };

  const handleCheckboxChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    
    const { checked } = e.target;
    const newList = [...localExperienceList];
    newList[index] = {
      ...newList[index],
      currentlyWorking: checked,
      endDate: checked ? "" : newList[index].endDate,
    };
    
    setLocalExperienceList(newList);
    debouncedReduxUpdate(newList);
  };
  
  const handleRichTextEditor = (value, name, index) => {
    const newList = [...localExperienceList];
    newList[index] = { ...newList[index], [name]: value };
    
    setLocalExperienceList(newList);
    debouncedReduxUpdate(newList);
  };

  const onSave = async () => {
    setLoading(true);
    debouncedReduxUpdate.cancel(); // Cancel any pending updates
    
    // Ensure Redux has the latest local data
    dispatch(addResumeData({ ...resumeInfo, experience: localExperienceList }));
    
    const data = { data: { experience: localExperienceList } };
    
    try {
      await updateThisResume(resume_id, data);
      toast("Experience details updated successfully!", {
        description: "Your work history has been saved.",
      });
      setHasUnsavedChanges(false);
      enanbledNext(true);
      enanbledPrev(true);
    } catch (error) {
      toast("Error updating resume", { description: `${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "";

      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const getOrdinalSuffix = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
      };
      
      return `${day}${getOrdinalSuffix(day)} ${MONTHS[month]}, ${year}`;
    } catch(e) {
      return dateString;
    }
  };

  const calculateDuration = (startDate, endDate, currentlyWorking) => {
    if (!startDate) return "";
    
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : new Date(endDate);
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let duration = "";
    if (years > 0) {
      duration += `${years} ${years === 1 ? 'year' : 'years'}`;
    }
    
    if (months > 0 || (months < 0 && years > 0)) {
      const adjustedMonths = months < 0 ? 12 + months : months;
      if (duration) duration += " ";
      duration += `${adjustedMonths} ${adjustedMonths === 1 ? 'month' : 'months'}`;
    }
    
    if (!duration) duration = "Less than a month";
    
    return `(${duration})`;
  };

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">
            Work Experience
            {hasUnsavedChanges && (
              <span className="ml-2 text-sm text-orange-500 font-normal">
                (Unsaved changes)
              </span>
            )}
          </h2>
        </div>
        
        {localExperienceList?.length === 0 && (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
            <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No experience added yet</h3>
            <p className="text-gray-400 mb-4">Add your work history to make your resume stand out</p>
            <Button 
              onClick={addExperience}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Work Experience
            </Button>
          </div>
        )}
        
        {localExperienceList?.length > 0 && (
          <div className="space-y-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
              {localExperienceList.map((experience, index) => (
                <Button
                  key={`tab-${index}`}
                  variant={activeExperience === index ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    activeExperience === index ? "bg-primary" : "border-primary text-primary"
                  }`}
                  onClick={() => setActiveExperience(index)}
                >
                  <span className={`flex items-center justify-center ${activeExperience === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>
                    {index + 1}
                  </span>
                  {experience.title || experience.companyName || `Experience ${index + 1}`}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap"
                onClick={addExperience}
              >
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>
            
            {localExperienceList.map((experience, index) => (
              <div
                key={`content-${index}`}
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${activeExperience === index ? "block" : "hidden"}`}
              >
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{experience.title || experience.companyName || `Experience ${index + 1}`}</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Position Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={experience?.title || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      Company Name
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={experience?.companyName || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Acme Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={experience?.city || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. San Francisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      State/Country
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={experience?.state || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. California"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Start Date
                    </label>
                    <DatePicker
                      name="startDate"
                      value={experience?.startDate ? experience.startDate.substring(0, 10) : ""}
                      onChange={(e) => handleChange(e, index)}
                      label="Select start date"
                    />
                    {experience?.startDate && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary/70" />
                        {formatFullDate(experience.startDate)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        End Date
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`currently-working-${index}`}
                          checked={!!experience?.currentlyWorking}
                          onChange={(e) => handleCheckboxChange(e, index)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`currently-working-${index}`}
                          className="text-sm text-gray-600 cursor-pointer hover:text-primary transition-colors"
                        >
                          Present (Current job)
                        </label>
                      </div>
                    </div>
                    
                    {experience?.currentlyWorking ? (
                      <div className="p-3 border rounded-md bg-gradient-to-r from-primary/10 to-transparent border-primary/20 text-gray-700 flex items-center">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        Present
                      </div>
                    ) : (
                      <DatePicker
                        name="endDate"
                        value={experience?.endDate ? experience.endDate.substring(0, 10) : ""}
                        onChange={(e) => handleChange(e, index)}
                        min={experience?.startDate ? experience.startDate.substring(0, 10) : ""}
                        isDisabled={!!experience?.currentlyWorking}
                        label="Select end date"
                      />
                    )}
                    
                    {(experience?.startDate && (experience?.endDate || experience?.currentlyWorking)) && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span className="text-primary/70 font-medium">Duration:</span> 
                        {calculateDuration(
                          experience.startDate, 
                          experience.endDate, 
                          experience.currentlyWorking
                        )}
                      </p>
                    )}
                  </div>
                  
                  <div className="col-span-full mt-4">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-primary" />
                      Work Description
                    </label>
                    <RichTextEditor
                      index={index}
                      defaultValue={experience?.workSummary}
                      onRichTextEditorChange={(event) =>
                        handleRichTextEditor(event, "workSummary", index)
                      }
                      resumeInfo={resumeInfo}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {localExperienceList?.length > 0 && (
            <Button
              onClick={addExperience}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> 
              Add {localExperienceList?.length > 0 ? "Another Experience" : " Experience"}
            </Button>
          )}
          
          {localExperienceList?.length > 0 && (
            <Button 
              onClick={onSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save Experiences"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Experience;
