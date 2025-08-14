import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import FloatingResumeScore from "./FloatingResumeScore";
import {
  ArrowLeft,
  ArrowRight,
  HomeIcon,
  User,
  FileText,
  Briefcase,
  FolderGit,
  GraduationCap,
  BadgePlus,
  CheckCircle2,
  Eye,
  ChevronRight,
  Award,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";
import CertificationsForm from "./form-components/CertificationsForm";
import ManageAdditionalSections from "./form-components/ManageAdditionalSections";
import { addResumeData } from "@/features/resume/resumeFeatures";
import AIReviewModal from "./AIReviewModal";

function ResumeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const { resume_id } = useParams();
  const navigate = useNavigate();
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const sections = [
    { name: "Details", icon: <User className="h-4 w-4" /> },
    { name: "Summary", icon: <FileText className="h-4 w-4" /> },
    { name: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderGit className="h-4 w-4" /> },
    { name: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { name: "Skills", icon: <BadgePlus className="h-4 w-4" /> },
    { name: "Certifications", icon: <Award className="h-4 w-4" /> },
    { name: "Add Section", icon: <PlusCircle className="h-4 w-4" /> },
  ];

  useEffect(() => {
    setEnabledPrev(currentIndex > 0);
    setEnabledNext(currentIndex < sections.length - 1);
  }, [currentIndex, sections.length]);

  const calculateProgress = () => {
    if (!resumeInfo) return 0;
    const totalPossibleSections = 7 + (resumeInfo?.additionalSections?.length || 0);
    if (totalPossibleSections === 0) return 0;

    let completed = 0;
    
    if (resumeInfo.firstName && resumeInfo.lastName) completed++;
    if (resumeInfo.summary) completed++;
    if (resumeInfo.experience && resumeInfo.experience.length > 0) completed++;
    if (resumeInfo.projects && resumeInfo.projects.length > 0) completed++;
    if (resumeInfo.education && resumeInfo.education.length > 0) completed++;
    if (resumeInfo.skills && resumeInfo.skills.length > 0) completed++;
    if (resumeInfo.certifications && resumeInfo.certifications.length > 0) completed++;
    if (resumeInfo.additionalSections) {
      completed += resumeInfo.additionalSections.filter(s => s.content?.trim()).length;
    }
    
    return Math.round((completed / totalPossibleSections) * 100);
  };
  
  const progressPercent = calculateProgress();

  return (
    <div className="space-y-6 bg-gray-100 min-h-screen">
      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-3 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-primary hover:text-white transition-colors duration-300 px-2 border-gray-200 text-gray-700">
              <HomeIcon className="h-4 w-4" /> 
              <span className="text-xs">Dashboard</span>
            </Button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo}/> 
          <Button variant="outline" size="sm" onClick={() => setReviewModalOpen(true)} className="flex items-center gap-1.5 hover:bg-indigo-500 hover:text-white transition-colors duration-300 px-3 border-indigo-500 text-indigo-600">
            <Sparkles className="h-4 w-4" /> 
            <span className="text-xs font-semibold">AI Review</span>
          </Button>
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
            <CheckCircle2 className={`h-4 w-4 ${progressPercent === 100 ? 'text-green-500' : 'text-gray-600'}`} />
            <span>{progressPercent}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors duration-300 px-2 min-w-0"
            onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}
          >
            <Eye className="h-4 w-4" /> 
            <span className="text-xs">Preview</span>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className={`flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 px-2 min-w-0 ${!enanbledPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!enanbledPrev}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            <ArrowLeft className="h-4 w-4" /> 
            <span className="text-xs">Prev</span>
          </Button>
          
          <Button
            size="sm"
            className={`flex items-center gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-sm transition-all duration-300 text-white px-2 min-w-0 ${!enanbledNext ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!enanbledNext}
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            <span className="text-xs">Next</span> 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <FloatingResumeScore resumeInfo={resumeInfo} />
      <AIReviewModal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} resumeInfo={resumeInfo} />

      <div className="hidden sm:flex justify-start overflow-x-auto py-2 no-scrollbar">
        <div className="flex items-center">
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 px-2 ${
                  currentIndex === idx 
                    ? "bg-primary text-white shadow-sm" 
                    : currentIndex > idx
                    ? "text-primary bg-gray-50"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                } transition-all duration-300 whitespace-nowrap rounded-md`}
                onClick={() => setCurrentIndex(idx)}
              >
                {section.icon}
                <span className="text-xs font-medium">{section.name}</span>
              </Button>
              
              {idx < sections.length - 1 && (
                <ChevronRight className={`h-4 w-4 mx-1 ${
                  currentIndex > idx ? "text-primary" : "text-gray-300"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="sm:hidden flex justify-between items-center px-4 py-2">
        <div className="flex space-x-1">
          {sections.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-primary' : idx < currentIndex ? 'bg-primary/40' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(idx)}
            ></div>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentIndex + 1} of {sections.length}
        </div>
      </div>

      <div className="transition-all duration-500 transform max-w-3xl mx-auto px-4 md:px-0">
        <div className={currentIndex === 0 ? 'block' : 'hidden'}><PersonalDetails resumeInfo={resumeInfo} enanbledNext={setEnabledNext} /></div>
        <div className={currentIndex === 1 ? 'block' : 'hidden'}><Summary resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} /></div>
        <div className={currentIndex === 2 ? 'block' : 'hidden'}><Experience resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} /></div>
        <div className={currentIndex === 3 ? 'block' : 'hidden'}><Project resumeInfo={resumeInfo} setEnabledNext={setEnabledNext} setEnabledPrev={setEnabledPrev} /></div>
        <div className={currentIndex === 4 ? 'block' : 'hidden'}><Education resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} /></div>
        <div className={currentIndex === 5 ? 'block' : 'hidden'}><Skills resumeInfo={resumeInfo} enanbledNext={setEnabledNext} /></div>
        <div className={currentIndex === 6 ? 'block' : 'hidden'}><CertificationsForm resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} /></div>
        
        <div className={currentIndex === 7 ? 'block' : 'hidden'}>
          <ManageAdditionalSections resumeInfo={resumeInfo} />
        </div>
      </div>
      
      <div className="flex justify-between mt-6 sm:hidden bg-white p-4 rounded-lg shadow-md fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100">
        <Button size="sm" variant="outline" className={`flex items-center gap-1 border-primary text-primary px-2 min-w-0 ${!enanbledPrev ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!enanbledPrev} onClick={() => setCurrentIndex(currentIndex - 1)}> <ArrowLeft className="h-4 w-4" /> <span className="text-xs">Prev</span> </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1 border-green-500 text-green-600 px-2 min-w-0" onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}> <Eye className="h-4 w-4" /> <span className="text-xs">Preview</span> </Button>
        <Button size="sm" className={`flex items-center gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-sm transition-all duration-300 text-white px-2 min-w-0 ${!enanbledNext ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!enanbledNext} onClick={() => setCurrentIndex(currentIndex + 1)}> <span className="text-xs">Next</span> <ArrowRight className="h-4 w-4" /> </Button>
      </div>
      
      <div className="h-16 sm:hidden"></div>
    </div>
  );
}

export default ResumeForm;
