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
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">
              Professional Certifications
              {hasUnsavedChanges && <span className="ml-2 text-sm text-orange-500 font-normal">(Unsaved changes)</span>}
            </h2>
          </div>
        </div>
        
        {localCertificatesList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
            <Award className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No certifications added yet</h3>
            <p className="text-gray-400 mb-4">Add your professional certifications to enhance your resume</p>
            <Button onClick={AddNewCertificate} className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" /> Add Certification
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
              {localCertificatesList.map((item, index) => (
                <Button key={`tab-${index}`} variant={activeCertificate === index ? 'default' : 'outline'} className={`flex items-center gap-2 whitespace-nowrap ${activeCertificate === index ? 'bg-primary' : 'border-primary text-primary'}`} onClick={() => setActiveCertificate(index)}>
                  <span className={`flex items-center justify-center ${activeCertificate === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>{index + 1}</span>
                  {getCertificateDescription(item)}
                </Button>
              ))}
              <Button variant="ghost" className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap" onClick={AddNewCertificate}>
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>

            {localCertificatesList.map((item, index) => (
              <div key={`content-${index}`} className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${activeCertificate === index ? "block" : "hidden"}`}>
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">{index + 1}</span>
                    <span>{getCertificateDescription(item)}</span>
                  </h3>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300" onClick={() => RemoveCertificate(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Award className="h-4 w-4 text-primary" />Certification Name*</label>
                    <Input name="name" onChange={(e) => handleChange(e, index)} value={item?.name || ""} className="border-gray-300 focus:border-primary" placeholder="e.g. AWS Certified Solutions Architect"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Issuing Organization*</label>
                    <Input name="issuer" onChange={(e) => handleChange(e, index)} value={item?.issuer || ""} className="border-gray-300 focus:border-primary" placeholder="e.g. Amazon Web Services"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Date Received</label>
                    <DatePicker index={index} field="date" value={item?.date || ""} onChange={(e) => handleChange(e, index)} label="Select date"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><LinkIcon className="h-4 w-4 text-primary" />Credential Link</label>
                    <Input name="credentialLink" onChange={(e) => handleChange(e, index)} value={item?.credentialLink || ""} className="border-gray-300 focus:border-primary" placeholder="e.g. https://www.credential.net/abc123"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {localCertificatesList.length > 0 && (
            <Button variant="outline" onClick={AddNewCertificate} className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add {localCertificatesList.length > 0 ? "Another" : ""} Certification
            </Button>
          )}
          {localCertificatesList.length > 0 && (
            <Button disabled={loading} onClick={onSave} className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2">
              {loading ? <><LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Certifications"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificationsForm;
