import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Briefcase, Building, MapPin, Calendar, Plus, Check, ChevronDown, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addResumeData, 
  updateExperienceField,
  addExperienceItem,
  removeExperienceItem
} from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

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
  
  const [selectedDate, setSelectedDate] = useState(parseInitialValue);
  const [currentView, setCurrentView] = useState("month");
  
  useEffect(() => {
    // Only update if value changes from outside this component
    if (value !== formatDateOutput()) {
      setSelectedDate(parseInitialValue());
    }
  }, [value]);
  
  useEffect(() => {
    if (showDropdown && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [showDropdown]);
  
  const formatDateOutput = () => {
    if (!selectedDate.year || selectedDate.month === "") return "";
    
    const year = selectedDate.year;
    const month = (selectedDate.month + 1).toString().padStart(2, '0');
    const day = selectedDate.day ? selectedDate.day.toString().padStart(2, '0') : "01";
    
    return `${year}-${month}-${day}`;
  };
  
  const handleDayChange = (day) => {
    setSelectedDate(prev => ({ ...prev, day: day.toString() }));
    setCurrentView("month");
    
    const newDate = {
      ...selectedDate,
      day: day.toString()
    };
    
    const formattedDate = formatDateWithNewValue(newDate);
    onChange({ target: { name, value: formattedDate } });
    setShowDropdown(false);
  };
  
  const handleMonthChange = (monthIndex) => {
    setSelectedDate(prev => ({ ...prev, month: monthIndex }));
    setCurrentView("day");
  };
  
  const handleYearChange = (year) => {
    setSelectedDate(prev => ({ ...prev, year }));
    setCurrentView("month");
  };
  
  const formatDateWithNewValue = (dateObj) => {
    const { year, month, day } = dateObj;
    if (!year || month === "") return "";
    
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day ? day.toString().padStart(2, '0') : "01";
    
    return `${year}-${monthStr}-${dayStr}`;
  };
  
  const toggleDropdown = () => {
    if (!isDisabled) {
      setShowDropdown(!showDropdown);
      if (!showDropdown) {
        // If opening the dropdown, reset to month view
        setCurrentView("month");
      }
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);
  
  const handlePrevMonth = () => {
    if (selectedDate.month === 0) {
      setSelectedDate(prev => ({
        ...prev,
        month: 11,
        year: (parseInt(prev.year) - 1).toString()
      }));
    } else {
      setSelectedDate(prev => ({
        ...prev,
        month: prev.month - 1
      }));
    }
  };
  
  const handleNextMonth = () => {
    if (selectedDate.month === 11) {
      setSelectedDate(prev => ({
        ...prev,
        month: 0,
        year: (parseInt(prev.year) + 1).toString()
      }));
    } else {
      setSelectedDate(prev => ({
        ...prev,
        month: prev.month + 1
      }));
    }
  };
  
  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`flex items-center w-full justify-between p-3 border rounded-md ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'} ${showDropdown ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}`}
        onClick={toggleDropdown}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : label || "Select date"}
        </span>
        <Calendar className="h-4 w-4 text-gray-500 ml-auto" />
      </div>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className={`absolute z-50 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3`}
        >
          <div className="mb-3 flex justify-between items-center">
            <button 
              type="button"
              className="text-xs font-medium p-1 hover:bg-gray-100 rounded"
              onClick={() => setCurrentView("year")}
            >
              {selectedDate.year || "Year"}
            </button>
            
            {currentView === "day" && (
              <div className="flex items-center">
                <button 
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded mr-1"
                  onClick={handlePrevMonth}
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <button 
                  type="button"
                  className="text-xs font-medium p-1 hover:bg-gray-100 rounded"
                  onClick={() => setCurrentView("month")}
                >
                  {selectedDate.month !== "" ? MONTHS[selectedDate.month] : "Month"}
                </button>
                <button 
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded ml-1"
                  onClick={handleNextMonth}
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
              </div>
            )}
            
            {currentView !== "day" && (
              <button 
                type="button"
                className="text-xs font-medium p-1 hover:bg-gray-100 rounded"
                onClick={() => currentView === "month" ? setCurrentView("day") : setCurrentView("month")}
              >
                {selectedDate.month !== "" ? MONTHS[selectedDate.month] : "Month"}
              </button>
            )}
          </div>
          
          {currentView === "day" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {MONTHS[selectedDate.month]} {selectedDate.year}
              </h4>
              <div className="grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                    {day}
                  </div>
                ))}
                
                {selectedDate.month !== "" && selectedDate.year && Array.from({ length: getDaysInMonth(selectedDate.month, selectedDate.year) }, (_, i) => i + 1).map(day => {
                  // Get the day of the week (0 = Sunday, 6 = Saturday)
                  const firstDayOfMonth = new Date(selectedDate.year, selectedDate.month, 1).getDay();
                  
                  // Calculate grid column position for the first week
                  const gridColumnStart = day === 1 ? firstDayOfMonth + 1 : null;
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      style={day === 1 ? { gridColumnStart } : {}}
                      onClick={() => handleDayChange(day)}
                      className={`p-1 text-center text-sm rounded-md transition-colors duration-200 ${selectedDate.day === day.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {currentView === "month" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Select Month {selectedDate.year ? `- ${selectedDate.year}` : ''}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthChange(index)}
                    className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedDate.month === index ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
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
                    onClick={() => handleYearChange(year.toString())}
                    className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedDate.year === year.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
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

  // Read the experience list directly from the Redux store
  const experienceList = useSelector(state => state.editResume.resumeData?.experience) || [];
  
  const [loading, setLoading] = useState(false);
  const [activeExperience, setActiveExperience] = useState(0);

  // Add a new experience entry
  const addExperience = () => {
    const newExperience = createEmptyFormFields();
    dispatch(addExperienceItem(newExperience));
    setActiveExperience(experienceList.length); // Set to the index of the new item
  };
  
  // Remove an experience entry with backend sync
  const removeExperience = async (index) => {
    // First, update the Redux store for immediate UI response
    dispatch(removeExperienceItem(index));
    
    // Adjust the active experience index if needed
    if (activeExperience >= experienceList.length - 1) {
      setActiveExperience(Math.max(0, experienceList.length - 2));
    }
    
    // Create the data payload for the backend
    const data = {
      data: {
        experience: experienceList.filter((_, i) => i !== index),
      },
    };

    // Save the updated list to the backend
    try {
      await updateThisResume(resume_id, data);
      toast("Experience removed successfully.", {
        description: "Your experience section has been updated.",
        icon: <Trash2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      toast("Failed to save changes", {
        description: "There was an error updating your resume.",
        variant: "destructive",
      });
      // Note: We don't restore the deleted item because it would complicate the code
      // and the backend error is rare. The user can refresh to get the latest state.
    }
  };

  // Handle input field changes with granular Redux updates
  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    
    // Use the new granular update action
    dispatch(updateExperienceField({ 
      index,
      field: name,
      value: finalValue
    }));
  };

  // Handle rich text editor changes
  const handleWorkSummaryChange = (value, index) => {
    dispatch(updateExperienceField({
      index,
      field: 'workSummary',
      value
    }));
  };

  // Save changes to the backend
  const onSave = async () => {
    setLoading(true);
    try {
      const data = {
        data: {
          experience: experienceList,
        },
      };
      await updateThisResume(resume_id, data);
      toast("Changes saved successfully.", {
        description: "Your experience section has been updated.",
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      toast("Failed to save changes", {
        description: "There was an error updating your resume.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set currently working and clear end date
  const handleCurrentlyWorkingChange = (e, index) => {
    const isCurrentlyWorking = e.target.checked;
    
    // Update the currently working field
    dispatch(updateExperienceField({
      index,
      field: 'currentlyWorking',
      value: isCurrentlyWorking
    }));
    
    // If currently working is checked, clear the end date
    if (isCurrentlyWorking) {
      dispatch(updateExperienceField({
        index,
        field: 'endDate',
        value: ''
      }));
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Professional Experience
          </h2>
          {experienceList.length > 0 && (
            <Button variant="outline" onClick={addExperience} className="bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add {experienceList.length > 0 ? "Another" : ""} Experience
            </Button>
          )}
        </div>
        
        {experienceList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Briefcase className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Experience Added</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              Add your professional experience to make your resume stand out.
            </p>
            <Button onClick={addExperience} className="bg-primary hover:bg-primary/90 text-white transition-colors duration-300 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-gray-100">
                {experienceList.map((experience, index) => (
                  <Button
                    key={index}
                    variant={index === activeExperience ? "default" : "outline"}
                    onClick={() => setActiveExperience(index)}
                    className={`px-4 py-2 ${index === activeExperience ? 'bg-primary text-white' : 'border-gray-300 text-gray-700 hover:border-primary'} transition-colors duration-300 whitespace-nowrap`}
                  >
                    {experience.companyName || experience.title || `Experience ${index + 1}`}
                  </Button>
                ))}
              </div>
              
              {experienceList[activeExperience] && (
                <div className="border border-gray-200 rounded-lg p-6 bg-white/70">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-lg font-medium text-gray-800">
                      Experience Details
                    </h3>
                    {experienceList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(activeExperience)}
                        className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" /> Job Title*
                      </label>
                      <Input
                        name="title"
                        onChange={e => handleChange(e, activeExperience)}
                        value={experienceList[activeExperience]?.title || ""}
                        className="border-gray-300 focus:border-primary"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" /> Company*
                      </label>
                      <Input
                        name="companyName"
                        onChange={e => handleChange(e, activeExperience)}
                        value={experienceList[activeExperience]?.companyName || ""}
                        className="border-gray-300 focus:border-primary"
                        placeholder="e.g. Acme Corporation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> City
                      </label>
                      <Input
                        name="city"
                        onChange={e => handleChange(e, activeExperience)}
                        value={experienceList[activeExperience]?.city || ""}
                        className="border-gray-300 focus:border-primary"
                        placeholder="e.g. San Francisco"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> State/Province
                      </label>
                      <Input
                        name="state"
                        onChange={e => handleChange(e, activeExperience)}
                        value={experienceList[activeExperience]?.state || ""}
                        className="border-gray-300 focus:border-primary"
                        placeholder="e.g. California"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" /> Start Date
                      </label>
                      <DatePicker
                        name="startDate"
                        value={experienceList[activeExperience]?.startDate || ""}
                        onChange={e => handleChange(e, activeExperience)}
                        label="Select start date"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> End Date
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="currentlyWorking"
                            checked={experienceList[activeExperience]?.currentlyWorking || false}
                            onChange={e => handleCurrentlyWorkingChange(e, activeExperience)}
                            className="sr-only peer"
                          />
                          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          <span className="ml-2 text-xs font-medium text-gray-500">
                            Currently Working
                          </span>
                        </label>
                      </div>
                      <DatePicker
                        name="endDate"
                        value={experienceList[activeExperience]?.endDate || ""}
                        onChange={e => handleChange(e, activeExperience)}
                        label="Select end date"
                        isDisabled={experienceList[activeExperience]?.currentlyWorking || false}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Job Description</label>
                    <RichTextEditor
                      value={experienceList[activeExperience]?.workSummary || ""}
                      onChange={content => handleWorkSummaryChange(content, activeExperience)}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              {experienceList.length === 0 && (
                <Button
                  onClick={addExperience}
                  className="bg-primary hover:bg-primary/90 text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Experience
                </Button>
              )}
              
              {experienceList.length > 0 && (
                <Button
                  onClick={addExperience}
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" /> Add {experienceList.length > 0 ? "Another" : ""} Experience
                </Button>
              )}
              
              {experienceList.length > 0 && (
                <Button
                  onClick={onSave}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? (
                    <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    "Save Experience"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Experience;
