import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Trash2, 
  Award, 
  Calendar, 
  Building2,
  LoaderCircle,
  Plus,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Link as LinkIcon
} from "lucide-react";
import { updateThisResume } from "@/Services/resumeAPI";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const formFields = {
  name: "",
  issuer: "",
  date: "",
  credentialLink: "",
};

// ... DatePicker and other helpers can remain the same if they are here ...
// For brevity, I'll assume they are correct or in a separate file. 
// If they are in this file, just keep them as they are.
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);


function CertificationsForm({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  
  // *** FIX: Read certifications directly from Redux store ***
  const certificatesList = useSelector(state => state.editResume.resumeData?.certifications) || [];
  
  const [loading, setLoading] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSorting, setIsSorting] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(0);

  // Helper function to dispatch updates to Redux
  const setCertificatesList = (newList) => {
    dispatch(addResumeData({ ...resumeInfo, certifications: newList }));
  };

  useEffect(() => {
    // This effect handles closing the date picker on outside clicks
    const handleClickOutside = (event) => {
      if (!event.target.closest('.date-picker-container') && !event.target.closest('.date-picker-trigger')) {
        setDatePickerOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const AddNewCertificate = () => {
    const newList = [...certificatesList, { ...formFields }];
    setCertificatesList(newList);
    setActiveCertificate(newList.length - 1);
  };

  // *** START: MODIFIED CODE for permanent deletion ***
  const RemoveCertificate = async (index) => {
    const originalList = [...certificatesList]; // Save original list for revert on failure
    const newList = certificatesList.filter((_, i) => i !== index);
    
    // Immediately update UI via Redux
    setCertificatesList(newList);
    
    if (activeCertificate >= newList.length) {
      setActiveCertificate(Math.max(0, newList.length - 1));
    }
    
    const data = {
      data: {
        certifications: newList,
      },
    };

    // Save changes to the backend
    try {
      await updateThisResume(resume_id, data);
      toast("Certification removed", {
        description: "Your certification has been successfully removed.",
        icon: <Trash2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      toast("Error removing certification", {
        description: "Could not save the change. Please try again.",
        variant: "destructive",
      });
      // Revert UI change if API call fails
      setCertificatesList(originalList);
    }
  };
  // *** END: MODIFIED CODE ***

  const sortCertificates = () => {
    setIsSorting(true);
    const sorted = [...certificatesList].sort((a, b) => {
      if (a.date && b.date) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        }
      }
      return sortOrder === "desc"
        ? (b.name || "").localeCompare(a.name || "")
        : (a.name || "").localeCompare(b.name || "");
    });
    setCertificatesList(sorted);
    setTimeout(() => {
      setIsSorting(false);
      toast("Certifications sorted.", { duration: 2000 });
    }, 500);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setTimeout(sortCertificates, 0);
  };
  
  const onSave = () => {
    setLoading(true);
    const data = { data: { certifications: certificatesList } };
    
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => {
          toast("Certifications updated.", { description: "Your credentials have been saved." });
        })
        .catch(error => {
          toast("Error updating certifications.", { description: error.message, variant: "destructive" });
        })
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
    const list = [...certificatesList];
    list[index] = { ...list[index], [name]: value };
    setCertificatesList(list);
  };
  
  const handleDateSelection = (index, field, year, month) => {
    const formattedDate = `${MONTHS[month]} ${year}`;
    handleChange({ target: { name: field, value: formattedDate } }, index);
    setDatePickerOpen(null);
  };

  const DatePicker = ({ index, field, value }) => {
    const isOpen = datePickerOpen === `${index}-${field}`;
    const initialDate = value ? new Date(value.split(' ').join(' 1, ')) : new Date();
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

    return (
        <div className="relative w-full">
            <div className="date-picker-trigger flex items-center w-full relative cursor-pointer border border-gray-300 rounded-md px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 transition-all" onClick={() => setDatePickerOpen(isOpen ? null : `${index}-${field}`)}>
                {value ? <span>{value}</span> : <span className="text-gray-400">Select date</span>}
                <Calendar className="h-4 w-4 text-primary ml-auto" />
            </div>
            {isOpen && (
                <div className="date-picker-container absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-72">
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <button type="button" onClick={() => setCurrentYear(y => y-1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronDown /></button>
                          <span className="mx-2 font-medium">{currentYear}</span>
                          <button type="button" onClick={() => setCurrentYear(y => y+1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronUp /></button>
                        </div>
                      </div>
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS.map((month, monthIndex) => (
                            <button key={month} type="button" onClick={() => handleDateSelection(index, field, currentYear, monthIndex)} className={`px-2 py-1.5 text-sm rounded-md transition-colors ${currentMonth === monthIndex ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}>{month}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
  };

  const getCertificateDescription = (cert) => cert.name || cert.issuer || `Certification ${certificatesList.indexOf(cert) + 1}`;
  
  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Professional Certifications</h2>
          </div>
          {certificatesList.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="border-primary/60 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort {sortOrder === 'desc' ? "Newest" : "Oldest"} First
              {sortOrder === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
            </Button>
          )}
        </div>
        <p className="text-gray-500 mb-6">Add your professional certifications to enhance your resume</p>
        
        {certificatesList.length === 0 ? (
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
              {certificatesList.map((item, index) => (
                <Button key={`tab-${index}`} variant={activeCertificate === index ? 'default' : 'outline'} className={`flex items-center gap-2 whitespace-nowrap ${activeCertificate === index ? 'bg-primary' : 'border-primary text-primary'}`} onClick={() => setActiveCertificate(index)}>
                  <span className={`flex items-center justify-center ${activeCertificate === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>{index + 1}</span>
                  {getCertificateDescription(item)}
                </Button>
              ))}
              <Button variant="ghost" className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap" onClick={AddNewCertificate}>
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>

            {certificatesList.map((item, index) => (
              <div key={`content-${index}`} className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${activeCertificate === index ? 'block' : 'hidden'}`}>
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
                    <DatePicker index={index} field="date" value={item?.date || ""} onChange={(e) => handleChange(e, index)} />
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
          {certificatesList.length > 0 && (
            <Button variant="outline" onClick={AddNewCertificate} className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add {certificatesList.length > 0 ? "Another" : ""} Certification
            </Button>
          )}
          {certificatesList.length > 0 && (
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