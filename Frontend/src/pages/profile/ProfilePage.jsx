import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Button } from '@/components/ui/button';
import { 
  LoaderCircle, 
  Save, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  FileText, 
  Briefcase, 
  FolderGit, 
  GraduationCap, 
  BadgePlus, 
  Award, 
  PlusCircle,
  ArrowRight,
  ChevronDown,
  Settings,
  Layers,
  Github,
  ExternalLink,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

import { getProfile, updateProfile, generatePortfolio } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import SelectPortfolioTemplateModal from './components/SelectPortfolioTemplateModal'; // <-- NEW IMPORT

// Components
import ProfilePersonalDetails from './components/ProfilePersonalDetails';
import ProfileSummary from './components/ProfileSummary';
import ProfileExperience from './components/ProfileExperience';
import ProfileProjects from './components/ProfileProjects';
import ProfileEducation from './components/ProfileEducation';
import ProfileSkills from './components/ProfileSkills';
import ProfileCertifications from './components/ProfileCertifications';
import ProfileAddSection from './components/ProfileAddSection';

function ProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const profileData = useSelector(state => state.editUser.userData);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false); // <-- NEW STATE FOR MODAL

    const sections = [
      { id: 'details', name: 'Personal Details', icon: User, component: ProfilePersonalDetails },
      { id: 'summary', name: 'Professional Summary', icon: FileText, component: ProfileSummary },
      { id: 'experience', name: 'Work Experience', icon: Briefcase, component: ProfileExperience },
      { id: 'projects', name: 'Projects', icon: FolderGit, component: ProfileProjects },
      { id: 'education', name: 'Education', icon: GraduationCap, component: ProfileEducation },
      { id: 'skills', name: 'Skills & Expertise', icon: BadgePlus, component: ProfileSkills },
      { id: 'certifications', name: 'Certifications', icon: Award, component: ProfileCertifications },
      { id: 'add_section', name: 'Additional Sections', icon: PlusCircle, component: ProfileAddSection },
    ];

    useEffect(() => {
        setIsLoading(true);
        getProfile()
            .then(response => {
                const fetchedData = response.data || {};
                const profileWithDefaults = {
                  ...fetchedData,
                  experience: fetchedData.experience || [],
                  projects: fetchedData.projects || [],
                  education: fetchedData.education || [],
                  skills: fetchedData.skills || [],
                  certifications: fetchedData.certifications || [],
                  additionalSections: fetchedData.additionalSections || []
                };
                dispatch(addUserData(profileWithDefaults));
                
                // Initialize expanded sections
                const initialExpandedSections = {};
                sections.forEach(section => {
                  initialExpandedSections[section.id] = true;
                });
                setExpandedSections(initialExpandedSections);
            })
            .catch(error => toast.error("Failed to load profile.", { description: error.message }))
            .finally(() => setIsLoading(false));
    }, [dispatch]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await updateProfile(profileData);
            dispatch(addUserData(response.data));
            toast.success("Profile saved successfully!");
        } catch (error) {
            toast.error("Failed to save profile.", { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleGeneratePortfolio = async (templateName) => { // <-- MODIFIED to accept templateName
        setTemplateModalOpen(false); // Close the modal
        setIsGenerating(true);
        const toastId = toast.loading("Generating your portfolio... This might take a moment.");
        try {
            const response = await generatePortfolio(templateName); // <-- PASS templateName
            dispatch(addUserData(response.data));
            toast.success("Portfolio Generated & Saved!", {
                id: toastId,
                description: "Your new portfolio is live. The link has been updated in your profile.",
            });
        } catch (error) {
            toast.error("Generation Failed", { id: toastId, description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const isSectionComplete = (sectionId) => {
      if (!profileData) return false;
      switch (sectionId) {
        case 'details': return !!profileData.firstName && !!profileData.email;
        case 'summary': return !!profileData.summary?.trim();
        case 'experience': return profileData.experience?.length > 0;
        case 'projects': return profileData.projects?.length > 0;
        case 'education': return profileData.education?.length > 0;
        case 'skills': return profileData.skills?.length > 0;
        case 'certifications': return profileData.certifications?.length > 0;
        case 'add_section': return profileData.additionalSections?.length > 0;
        default: return false;
      }
    };
    
    const toggleSection = (sectionId) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
    };
    
    const totalSections = sections.length;
    const completedSections = sections.filter(section => isSectionComplete(section.id)).length;
    const completionPercentage = Math.round((completedSections / totalSections) * 100);

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setShowMobileNav(false);
        
        // Make sure section is expanded
        if (!expandedSections[sectionId]) {
          toggleSection(sectionId);
        }
      }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <LoaderCircle className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Fixed sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-20 hidden lg:block">
            <div className="p-6">
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline" 
                className="w-full justify-start text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
              
              <div className="mb-6">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Completion</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completionPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 dark:bg-indigo-600 transition-all duration-500" 
                    style={{width: `${completionPercentage}%`}}
                  ></div>
                </div>
              </div>
              
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isComplete = isSectionComplete(section.id);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg text-sm text-left transition-colors"
                    >
                      <div className="flex items-center">
                        <Icon className={`h-4 w-4 mr-3 ${isComplete ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        <span className={`${isComplete ? 'font-medium text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {section.name}
                        </span>
                      </div>
                      {isComplete && <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          
          {/* Mobile floating navigation button */}
          <div className="fixed bottom-4 right-4 z-30 lg:hidden">
            <button 
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            >
              <Layers className="h-5 w-5" />
            </button>
            
            {showMobileNav && (
              <div className="absolute bottom-14 right-0 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Completion</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completionPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 dark:bg-indigo-600" 
                      style={{width: `${completionPercentage}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="p-2 max-h-80 overflow-y-auto">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isComplete = isSectionComplete(section.id);
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="w-full flex items-center justify-between p-2 rounded-md text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <Icon className={`h-4 w-4 mr-2 ${isComplete ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                          <span className={`${isComplete ? 'font-medium text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {section.name}
                          </span>
                        </div>
                        {isComplete && <CheckCircle className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />}
                      </button>
                    );
                  })}
                </div>
                
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start text-gray-600 dark:text-gray-300 text-sm"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="lg:pl-64">
            {/* Top sticky header */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="lg:hidden flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/dashboard')} 
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                </div>
                
                <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden lg:block">My Profile</h1>
                
                <div className="flex items-center gap-3">
                   <Button
                       onClick={() => setTemplateModalOpen(true)} // <-- MODIFIED onClick
                       disabled={isSaving || isGenerating}
                       size="sm"
                       className="bg-emerald-600 hover:bg-emerald-700 text-white"
                   >
                       {isGenerating ? (
                           <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                       ) : (
                           <Github className="h-4 w-4 mr-2" />
                       )}
                       Generate Portfolio
                   </Button>

                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving} 
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isSaving ? (
                      <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main scrollable content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {sections.map((section) => {
                const SectionComponent = section.component;
                const isComplete = isSectionComplete(section.id);
                const isExpanded = expandedSections[section.id];
                const Icon = section.icon;
                
                return (
                  <div 
                    id={section.id}
                    key={section.id} 
                    className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden scroll-mt-20"
                  >
                    <div 
                      className={`flex items-center justify-between p-4 cursor-pointer ${
                        isComplete ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800/30' : 
                        'bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-md p-2 ${
                          isComplete ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400' : 
                          'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                            {section.name}
                            {isComplete && (
                              <span className="ml-2 inline-flex items-center bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                                <CheckCircle className="h-3 w-3 mr-1" /> Complete
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                      
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isExpanded && (
                      <div className="p-5">
                        <SectionComponent />
                      </div>
                    )}
                  </div>
                );
              })}
              
              
            </div>
          </div>
        {/* NEW: Template selection modal */}
        <SelectPortfolioTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
          onSelect={handleGeneratePortfolio}
          loading={isGenerating}
        />
        </div>
    );
}

export default ProfilePage;
