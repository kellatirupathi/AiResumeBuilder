import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Briefcase, Building, MapPin, Calendar, Plus, Check, ChevronDown, ArrowUp, ArrowDown, ArrowUpDown, X, Save } from "lucide-react";
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

// Updated DatePicker component with Year-Month only flow and clear icon
function DatePicker({ name, value, onChange, min, isDisabled, label }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });
  
  // Parse the initial value (if any)
  const parseInitialValue = () => {
    if (!value) return { month: "", year: "" };
    
    try {
      const date = new Date(value);
      if (isNaN(date)) {
        // If date is invalid but we have a value string, try to parse it
        const [yearStr, monthStr] = value.split('-').map(v => v.trim());
        return {
          year: yearStr || "",
          month: monthStr ? parseInt(monthStr) - 1 : ""
        };
      }
      
      return {
        year: date.getFullYear().toString(),
        month: date.getMonth()
      };
    } catch (e) {
      return { month: "", year: "" };
    }
  };
  
  const initialValue = parseInitialValue();
  const [selectedMonth, setSelectedMonth] = useState(initialValue.month);
  const [selectedYear, setSelectedYear] = useState(initialValue.year);
  
  // Start with "year" view
  const [currentView, setCurrentView] = useState("year"); // 'year' -> 'month'
  
  const handleMonthChange = (monthIndex) => {
    setSelectedMonth(monthIndex);
    updateDate(monthIndex + 1, selectedYear);
    setShowDropdown(false); // Close dropdown after month selection
  };
  
  const handleYearChange = (year) => {
    setSelectedYear(year);
    
    // Move to month view after year selection
    setCurrentView("month");
  };
  
  const updateDate = (month, year) => {
    if (month && year) {
      const formattedMonth = month.toString().padStart(2, '0');
      onChange({ target: { name, value: `${year}-${formattedMonth}-01` } }); // Add default day as 01
    }
  };

  // New function to clear the date
  const clearDate = (e) => {
    e.stopPropagation(); // Prevent dropdown from toggling
    setSelectedMonth("");
    setSelectedYear("");
    onChange({ target: { name, value: "" } });
  };

  // Calculate dropdown position when showing
  const calculateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 320;
      const sideOffset = 6;
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

      setDropdownCoords({
        top: shouldOpenAbove ? rect.top - dropdownHeight - sideOffset : rect.bottom + sideOffset,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Toggle dropdown and calculate position
  const toggleDropdown = () => {
    if (!isDisabled) {
      if (!showDropdown) {
        calculateDropdownPosition();
        // Reset to year view when opening dropdown
        setCurrentView("year");
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
          {selectedMonth !== "" && selectedYear ? (
            <span className="text-xs text-gray-800">{MONTHS[selectedMonth]}, {selectedYear}</span>
          ) : (
            <span className="text-xs text-gray-400">{label}</span>
          )}
        </div>
        <div className="flex items-center">
          {selectedMonth !== "" && selectedYear && !isDisabled && (
            <button 
              type="button"
              onClick={clearDate}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors mr-1"
              aria-label="Clear date"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!isDisabled && <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />}
        </div>
      </div>
      
      {showDropdown && !isDisabled && (
        <div 
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: `${dropdownCoords.top}px`,
            left: `${dropdownCoords.left}px`,
            width: `${dropdownCoords.width}px`,
          }}
          className="date-picker-portal z-[10000] bg-white border border-gray-200 rounded-md shadow-lg p-4 animate-fadeIn"
        >
          {/* Header with steps and clear button */}
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${currentView === 'year' ? 'bg-primary text-white' : 'text-gray-500'}`}>
                Year
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2 py-1 rounded ${currentView === 'month' ? 'bg-primary text-white' : 'text-gray-500'}`}>
                Month
              </span>
            </div>
            <div className="flex items-center gap-2">
              
              {/* Back button for navigation */}
              {currentView !== 'year' && (
                <button 
                  type="button" 
                  className="text-sm text-primary hover:text-primary-dark px-2 py-1 border border-primary rounded"
                  onClick={() => setCurrentView('year')}
                >
                  Back
                </button>
              )}
            </div>
          </div>
          
          {/* Year view comes first */}
          {currentView === "year" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Year</h4>
              <div className="max-h-36 overflow-y-auto grid grid-cols-4 gap-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                {YEARS.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={`px-2 py-2 text-xs rounded-md transition-colors duration-200 ${selectedYear === year.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Month view comes second */}
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
                    className={`px-2 py-2 text-xs rounded-md transition-colors duration-200 ${selectedMonth === index ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {month.substring(0, 3)}
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

      const month = date.getMonth();
      const year = date.getFullYear();
      
      return `${MONTHS[month]}, ${year}`;
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
    <div className="bg-white overflow-hidden">
      {/* Section header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100">
            <Briefcase className="h-4 w-4 text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Work Experience</p>
            <p className="text-xs text-gray-400">Your employment history</p>
          </div>
        </div>
        {hasUnsavedChanges && (
          <span className="text-xs font-medium text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
            Unsaved
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="px-5 py-5 space-y-4">
        {/* Empty state */}
        {localExperienceList?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 mb-3">
              <Briefcase className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">No experience added yet</h3>
            <p className="text-xs text-gray-400 mb-4">Add your work history to make your resume stand out</p>
            <Button
              onClick={addExperience}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs h-8 px-4 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Work Experience
            </Button>
          </div>
        )}

        {localExperienceList?.length > 0 && (
          <div className="space-y-4">
            {/* Item tabs row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {localExperienceList.map((experience, index) => (
                <button
                  key={`tab-${index}`}
                  type="button"
                  onClick={() => setActiveExperience(index)}
                  className={`whitespace-nowrap rounded-full text-xs px-3 py-1.5 transition-colors ${
                    activeExperience === index
                      ? "bg-sky-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {experience.title || experience.companyName || `Experience ${index + 1}`}
                </button>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="whitespace-nowrap rounded-full text-xs px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 hover:text-sky-500 hover:border-sky-300 transition-colors flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add More
              </button>
            </div>

            {/* Item cards */}
            {localExperienceList.map((experience, index) => (
              <div
                key={`content-${index}`}
                className={`rounded-lg border border-gray-100 overflow-hidden ${activeExperience === index ? "block" : "hidden"}`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-700">
                    {experience.title || experience.companyName || `Experience ${index + 1}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Card body */}
                <div className="grid grid-cols-2 gap-4 p-4">
                  {/* Position Title */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      Position Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={experience?.title || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 text-xs border-gray-200 focus:border-sky-400"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <Building className="h-3.5 w-3.5 text-gray-400" />
                      Company Name
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={experience?.companyName || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 text-xs border-gray-200 focus:border-sky-400"
                      placeholder="e.g. Acme Corporation"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={experience?.city || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 text-xs border-gray-200 focus:border-sky-400"
                      placeholder="e.g. San Francisco"
                    />
                  </div>

                  {/* State/Country */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      State/Country
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={experience?.state || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="h-9 text-xs border-gray-200 focus:border-sky-400"
                      placeholder="e.g. California"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      Start Date
                    </label>
                    <DatePicker
                      name="startDate"
                      value={experience?.startDate ? experience.startDate.substring(0, 10) : ""}
                      onChange={(e) => handleChange(e, index)}
                      label="Select start date"
                    />
                    {experience?.startDate && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatFullDate(experience.startDate)}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        End Date
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id={`currently-working-${index}`}
                          checked={!!experience?.currentlyWorking}
                          onChange={(e) => handleCheckboxChange(e, index)}
                          className="rounded text-sky-600 focus:ring-sky-400"
                        />
                        <label
                          htmlFor={`currently-working-${index}`}
                          className="text-xs text-gray-500 cursor-pointer hover:text-sky-600 transition-colors"
                        >
                          Present
                        </label>
                      </div>
                    </div>

                    {experience?.currentlyWorking ? (
                      <div className="h-9 flex items-center px-3 border border-sky-100 rounded-md bg-sky-50 text-xs text-sky-600 gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Present (Current job)
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
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <span className="text-sky-500 font-medium">Duration:</span>
                        {calculateDuration(
                          experience.startDate,
                          experience.endDate,
                          experience.currentlyWorking
                        )}
                      </p>
                    )}
                  </div>

                  {/* Work Summary — full width */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <Check className="h-3.5 w-3.5 text-gray-400" />
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
      </div>

      {/* Footer — only when there are entries */}
      {localExperienceList?.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <Button
            onClick={addExperience}
            variant="outline"
            className="border-sky-200 text-sky-600 hover:bg-sky-50 text-xs h-8 px-3 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Another Experience
          </Button>
          <Button
            onClick={onSave}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs h-8 px-4 gap-2"
          >
            {loading ? (
              <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-3.5 w-3.5" /> Save Experience</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Experience;
