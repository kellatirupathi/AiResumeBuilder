import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const startYear = currentYear - 60;
const endYear = currentYear + 10;
const YEARS = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

function DatePicker({ name, value, onChange, isDisabled, label, selects = 'day' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const parseInitialValue = () => {
    if (!value) return { day: "", month: "", year: "" };
    try {
      const date = new Date(value.includes(' ') ? value.replace(/, /g, ' 1, ') : value);
      if (isNaN(date.getTime())) return { day: "", month: "", year: "" };
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
  
  // THE FIX for the view flow: Start with 'year' view by default when opened.
  const [currentView, setCurrentView] = useState("year"); 

  const daysInMonth = selectedMonth !== "" && selectedYear ? getDaysInMonth(selectedMonth, selectedYear) : 31;
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const updateDate = (day, month, year) => {
    if (day && month && year) {
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      onChange({ target: { name, value: `${year}-${formattedMonth}-${formattedDay}` } });
    }
  };
  
  const handleDayChange = (day) => {
    setSelectedDay(day);
    updateDate(day, selectedMonth + 1, selectedYear);
    setShowDropdown(false);
  };
  
  const handleMonthChange = (monthIndex) => {
    setSelectedMonth(monthIndex);
    if (selects === 'month') {
        const year = selectedYear || new Date().getFullYear().toString();
        setSelectedYear(year);
        const formattedDate = `${MONTHS[monthIndex]} ${year}`;
        onChange({ target: { name, value: formattedDate } });
        setShowDropdown(false);
    } else {
      const day = selectedDay > getDaysInMonth(monthIndex, selectedYear) ? getDaysInMonth(monthIndex, selectedYear) : selectedDay;
      setSelectedDay(day);
      updateDate(day, monthIndex + 1, selectedYear);
      setCurrentView("day"); // <- Transition to Day view
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year.toString());
     if (selects !== 'month' && selectedMonth !== "") {
        updateDate(selectedDay, selectedMonth + 1, year);
    }
    setCurrentView("month"); // <- Transition to Month view
  };
  
  // THE FIX for the "getBoundingClientRect" error. This runs *after* render.
  useLayoutEffect(() => {
    if (showDropdown && containerRef.current) {
      const calculatePosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        
        let position = {};
        if (spaceBelow < 350 && rect.top > spaceBelow) { // Show on top
          position = {
            bottom: `${window.innerHeight - rect.top + 4}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`
          };
        } else { // Show on bottom
          position = {
            top: `${rect.bottom + 4}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`
          };
        }
        setDropdownStyle(position);
      };

      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);

      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [showDropdown]);
  
  const toggleDropdown = () => {
    if (!isDisabled) {
        if (!showDropdown) {
            // THE FIX for the view flow: Reset to year view every time it opens
            setCurrentView('year');
        }
        setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        const portalNode = document.querySelector('.date-picker-portal');
        if (
            containerRef.current && 
            !containerRef.current.contains(event.target) &&
            (!portalNode || !portalNode.contains(event.target))
        ) {
            setShowDropdown(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const { day, month, year } = parseInitialValue();
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [value]);
  
  const getDisplayValue = () => {
      if (!value) return <span className="text-gray-400">{label}</span>;
      if (selects === 'month') return <span className="text-gray-800">{value}</span>;
      if (selectedDay && selectedMonth !== "" && selectedYear) {
          return <span className="text-gray-800">{selectedDay} {MONTHS[selectedMonth]}, {selectedYear}</span>;
      }
      return <span className="text-gray-400">{label}</span>;
  }

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={`date-picker-portal fixed z-[9999] w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 animate-fadeIn`}
      style={dropdownStyle}
    >
        <div className="flex justify-between items-center mb-2 border-b pb-2">
            {selects === 'day' && <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => setCurrentView("day")}>Day</button>}
            <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => setCurrentView("month")}>Month</button>
            <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => setCurrentView("year")}>Year</button>
        </div>
        
        {currentView === "day" && selects === 'day' && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 text-center mb-2">{MONTHS[selectedMonth]} {selectedYear}</h4>
              <div className="grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">{day}</div>)}
                {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, i) => <div key={`empty-${i}`} className="h-8 w-8"></div>)}
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => handleDayChange(day)} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 ${selectedDay == day ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>{day}</button>
                ))}
              </div>
            </div>
        )}

        {currentView === "month" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Select Month {selectedYear ? `- ${selectedYear}` : ''}</h4>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => (
                  <button key={month} type="button" onClick={() => handleMonthChange(index)} className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedMonth === index ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
        )}
        
        {currentView === "year" && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Select Year</h4>
              <div className="max-h-48 overflow-y-auto grid grid-cols-4 gap-2 pr-2">
                {YEARS.map(year => (
                  <button key={year} type="button" onClick={() => handleYearChange(year)} className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 ${selectedYear == year.toString() ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>
                    {year}
                  </button>
                ))}
              </div>
            </div>
        )}
    </div>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`flex items-center justify-between p-3 border rounded-md ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${showDropdown ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-300'} cursor-pointer transition-all duration-200`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          {getDisplayValue()}
        </div>
        {!isDisabled && <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />}
      </div>
      
      {showDropdown && !isDisabled && ReactDOM.createPortal(dropdownContent, document.body)}
    </div>
  );
}

export default DatePicker;
