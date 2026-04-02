import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, Trash2, Award, Calendar, Building2,
  LoaderCircle, Plus, Link as LinkIcon, ChevronDown, ChevronUp 
} from "lucide-react";
import { updateThisResume } from "@/Services/resumeAPI";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { debounce } from 'lodash-es'; // Ensure you have installed lodash-es

const formFields = {
  name: "",
  issuer: "",
  date: "",
  credentialLink: "",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

function FieldLabel({ icon: Icon, label, required }) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
      <Icon className="h-3.5 w-3.5 text-gray-400" />
      {label}
      {required && <span className="text-[10px] text-red-400">*</span>}
    </label>
  );
}

// DatePicker sub-component for Month/Year selection
function DatePicker({ index, field, value, onChange, isDisabled, label }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const triggerRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

  // Parse initial month/year from a string like "Month Year"
  const parseInitialValue = () => {
    if (!value || typeof value !== 'string') return { year: new Date().getFullYear(), month: null };
    const parts = value.split(' ');
    const monthIndex = MONTHS.findIndex(m => m.toLowerCase().startsWith(parts[0]?.toLowerCase()));
    const year = parseInt(parts[1], 10);
    return {
      year: isNaN(year) ? new Date().getFullYear() : year,
      month: monthIndex !== -1 ? monthIndex : null
    };
  };
  
  const { year: initialYear, month: initialMonth } = parseInitialValue();
  const [currentYear, setCurrentYear] = useState(initialYear);

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

  const handleDateSelection = (year, monthIndex) => {
    const formattedDate = `${MONTHS[monthIndex]} ${year}`;
    onChange({ target: { name: field, value: formattedDate } }, index);
    setShowDropdown(false);
  };

  const dropdownJsx = (
    <div
      style={{ position: 'absolute', ...dropdownCoords }}
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
            <button key={month} type="button" onClick={() => handleDateSelection(currentYear, monthIndex)}
              className={`px-2 py-1.5 text-sm rounded-md transition-colors ${initialMonth === monthIndex && initialYear === currentYear ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}>
              {month.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div ref={triggerRef} onClick={() => !isDisabled && setShowDropdown(!showDropdown)}
        className={`flex items-center w-full justify-between p-3 border rounded-md ${isDisabled ? 'bg-gray-50' : 'bg-white'} ${showDropdown ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} cursor-pointer transition-all`}>
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value || label}</span>
        <Calendar className="h-4 w-4 text-primary ml-auto" />
      </div>
      {showDropdown && ReactDOM.createPortal(dropdownJsx, document.body)}
    </div>
  );
};


function CertificationsForm({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  
  // 1. Source of truth from Redux
  const reduxCertificatesList = useSelector(state => state.editResume.resumeData?.certifications) || [];
  
  // 2. Local state for fast UI
  const [localCertificatesList, setLocalCertificatesList] = useState(reduxCertificatesList);
  const [loading, setLoading] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 3. Sync local state with Redux
  useEffect(() => {
    setLocalCertificatesList(reduxCertificatesList);
  }, [reduxCertificatesList]);

  // 4. Debounced Redux update
  const debouncedReduxUpdate = useMemo(
    () => debounce((newList) => {
        dispatch(addResumeData({ ...resumeInfo, certifications: newList }));
        setHasUnsavedChanges(true);
    }, 500),
    [dispatch, resumeInfo]
  );
  
  // 5. Cleanup debounce
  useEffect(() => {
    return () => debouncedReduxUpdate.cancel();
  }, [debouncedReduxUpdate]);

  const AddNewCertificate = () => {
    const newList = [...localCertificatesList, { ...formFields }];
    setLocalCertificatesList(newList);
    setActiveCertificate(newList.length - 1);
    debouncedReduxUpdate(newList);
  };

  const RemoveCertificate = async (index) => {
    const newList = localCertificatesList.filter((_, i) => i !== index);
    
    // Update UI instantly
    setLocalCertificatesList(newList);
    dispatch(addResumeData({ ...resumeInfo, certifications: newList }));
    
    if (activeCertificate >= newList.length) {
      setActiveCertificate(Math.max(0, newList.length - 1));
    }
    
    try {
      await updateThisResume(resume_id, { data: { certifications: newList } });
      toast.success("Certification removed successfully.");
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("Error removing certification", { description: "Reverting change.", variant: "destructive" });
      setLocalCertificatesList(reduxCertificatesList);
    }
  };

  const onSave = async () => {
    setLoading(true);
    debouncedReduxUpdate.cancel();
    dispatch(addResumeData({ ...resumeInfo, certifications: localCertificatesList }));
    
    try {
      await updateThisResume(resume_id, { data: { certifications: localCertificatesList } });
      toast.success("Certifications updated successfully!");
      setHasUnsavedChanges(false);
      enanbledNext?.(true);
      enanbledPrev?.(true);
    } catch (error) {
      toast.error("Error updating certifications.", { description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    enanbledNext?.(false);
    enanbledPrev?.(false);
    
    const { name, value } = e.target;
    const newList = [...localCertificatesList];
    newList[index] = { ...newList[index], [name]: value };
    
    setLocalCertificatesList(newList);
    debouncedReduxUpdate(newList);
  };
  
  const getCertificateDescription = (cert) => cert.name || cert.issuer || `Certification ${localCertificatesList.indexOf(cert) + 1}`;
  
  return (
    <div className="bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
            <Award className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Professional Certifications</p>
            <p className="text-xs text-gray-400">Add credentials, issue dates, and verification links</p>
          </div>
        </div>
        {hasUnsavedChanges && (
          <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-500">
            Unsaved
          </span>
        )}
      </div>

      <div className="space-y-4 px-5 py-5">
        {localCertificatesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <Award className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">No certifications added yet</h3>
            <p className="mb-4 text-xs text-gray-400">Add professional certifications to strengthen trust and credibility</p>
            <Button onClick={AddNewCertificate} className="h-8 gap-1.5 bg-amber-600 px-4 text-xs text-white hover:bg-amber-700">
              <Plus className="h-3.5 w-3.5" /> Add Certification
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {localCertificatesList.map((item, index) => (
                <button
                  key={`tab-${index}`}
                  type="button"
                  onClick={() => setActiveCertificate(index)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                    activeCertificate === index
                      ? 'bg-amber-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  {getCertificateDescription(item)}
                </button>
              ))}
              <button
                type="button"
                onClick={AddNewCertificate}
                className="flex items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-amber-300 hover:text-amber-500"
              >
                <Plus className="h-3 w-3" /> Add More
              </button>
            </div>

            {localCertificatesList.map((item, index) => (
              <div key={`content-${index}`} className={`${activeCertificate === index ? "block" : "hidden"} overflow-hidden rounded-lg border border-gray-100`}>
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-700">
                    {getCertificateDescription(item)}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500" onClick={() => RemoveCertificate(index)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <div>
                    <FieldLabel icon={Award} label="Certification Name" required />
                    <Input name="name" onChange={(e) => handleChange(e, index)} value={item?.name || ""} className="h-9 border-gray-200 text-sm focus:border-amber-400" placeholder="e.g. AWS Certified Solutions Architect"/>
                  </div>
                  <div>
                    <FieldLabel icon={Building2} label="Issuing Organization" required />
                    <Input name="issuer" onChange={(e) => handleChange(e, index)} value={item?.issuer || ""} className="h-9 border-gray-200 text-sm focus:border-amber-400" placeholder="e.g. Amazon Web Services"/>
                  </div>
                  <div>
                    <FieldLabel icon={Calendar} label="Date Received" />
                    <DatePicker index={index} field="date" value={item?.date || ""} onChange={(e) => handleChange(e, index)} label="Select date"/>
                  </div>
                  <div>
                    <FieldLabel icon={LinkIcon} label="Credential Link" />
                    <Input name="credentialLink" onChange={(e) => handleChange(e, index)} value={item?.credentialLink || ""} className="h-9 border-gray-200 text-sm focus:border-amber-400" placeholder="https://www.credential.net/abc123"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        
      {localCertificatesList.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <Button variant="outline" onClick={AddNewCertificate} className="h-8 gap-1.5 border-amber-200 px-3 text-xs text-amber-600 hover:bg-amber-50">
            <Plus className="h-3.5 w-3.5" /> Add Another Certification
          </Button>
          <Button disabled={loading} onClick={onSave} className="h-8 gap-2 bg-amber-600 px-4 text-xs text-white hover:bg-amber-700">
            {loading ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving...</> : "Save Certifications"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CertificationsForm;
