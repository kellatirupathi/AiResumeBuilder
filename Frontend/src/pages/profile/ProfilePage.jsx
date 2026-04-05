import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Copy,
  AlertTriangle,
  Bot,
  MessageSquare,
  Send,
  Check,
  LayoutTemplate,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

import { updateProfile, generatePortfolio } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { useProfileQuery } from "@/hooks/useAppQueryData";
import { normalizeProfileData } from "@/lib/queryCacheUtils";
import {
  chatWithProfileAssistant,
  enhanceExperienceWithAi,
  enhanceProjectWithAi,
  generateExperienceWithAi,
  generateProjectWithAi,
  generateAiSummary,
} from "@/lib/profileAi";

// Components
import ProfilePersonalDetails from './components/ProfilePersonalDetails';
import ProfileSummary from './components/ProfileSummary';
import ProfileExperience from './components/ProfileExperience';
import ProfileProjects from './components/ProfileProjects';
import ProfileEducation from './components/ProfileEducation';
import ProfileSkills from './components/ProfileSkills';
import ProfileCertifications from './components/ProfileCertifications';
import ProfileAddSection from './components/ProfileAddSection';

const portfolioTemplates = [
  {
    id: 'portfolio-classic',
    name: 'Classic Portfolio',
    description: 'Clean and structured layout for a polished, traditional portfolio presentation.',
    previewUrl: 'https://res.cloudinary.com/dg8n2jeur/image/upload/v1755439652/Screenshot_2025-08-17_193545_calgbl.png'
  },
  {
    id: 'portfolio-modern',
    name: 'Modern Portfolio',
    description: 'Bolder visual treatment with a modern layout for a more product-style portfolio.',
    previewUrl: 'https://res.cloudinary.com/dg8n2jeur/image/upload/v1755439651/Screenshot_2025-08-17_193716_ftacb9.png'
  }
];

function ProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const profileData = useSelector(state => state.editUser.userData);
    const normalizedReduxProfile =
      profileData && typeof profileData === "object"
        ? normalizeProfileData(profileData)
        : null;
    // hasProfileData is true only when Redux holds a full profile document from the server.
    // A full profile always has '_id' (MongoDB ObjectId).
    // Minimal session data (from login: { id, email, fullName, ... }) does NOT have '_id'.
    // This prevents the form from rendering with empty fields while the profile fetch runs.
    const hasProfileData = Boolean(
      normalizedReduxProfile && '_id' in normalizedReduxProfile
    );
    const profileQuery = useProfileQuery({
      initialData: null,
      staleTime: 0,
      refetchOnMount: "always",
    });
    const isLoading = !profileQuery.isFetchedAfterMount && profileQuery.isFetching;
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [portfolioMode, setPortfolioMode] = useState(false);
    const [selectedPortfolioTemplate, setSelectedPortfolioTemplate] = useState(portfolioTemplates[0].id);
    const [portfolioConfirmOpen, setPortfolioConfirmOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [targetRole, setTargetRole] = useState("");
    const [assistantMessage, setAssistantMessage] = useState("");
    const [assistantMessages, setAssistantMessages] = useState([]);
    const [aiLoading, setAiLoading] = useState({
      summary: false,
      assistant: false,
    });
    const [experienceLoading, setExperienceLoading] = useState({});
    const [experienceGenerateLoading, setExperienceGenerateLoading] = useState({});
    const [projectLoading, setProjectLoading] = useState({});
    const [projectGenerateLoading, setProjectGenerateLoading] = useState({});
    const [experienceImpactQuestions, setExperienceImpactQuestions] = useState({});
    const [projectImpactQuestions, setProjectImpactQuestions] = useState({});
    const lastSavedData = useRef(null);
    const isInitialLoad = useRef(true);
    const sectionsInitialized = useRef(false);

    const buildProjectOptions = (profile, messageLower) => {
      const projects = profile.projects || [];
      const namedMatches = projects
        .map((project, index) => ({
          index,
          label: project.projectName || `Project ${index + 1}`,
          haystack: `${project.projectName || ""} ${project.techStack || ""}`.toLowerCase(),
        }))
        .filter((project) => project.label && messageLower.includes(project.label.toLowerCase()));

      if (namedMatches.length === 1) {
        return { type: "project", index: namedMatches[0].index, label: namedMatches[0].label };
      }

      if (namedMatches.length > 1) {
        return {
          type: "project",
          requiresSelection: true,
          options: namedMatches.map(({ index, label }) => ({ index, label })),
        };
      }

      if (projects.length === 1) {
        return {
          type: "project",
          index: 0,
          label: projects[0].projectName || "Project 1",
        };
      }

      if (projects.length > 1) {
        return {
          type: "project",
          requiresSelection: true,
          options: projects.map((project, index) => ({
            index,
            label: project.projectName || `Project ${index + 1}`,
          })),
        };
      }

      return { type: "project", unavailable: true };
    };

    const buildExperienceOptions = (profile, messageLower) => {
      const experiences = profile.experience || [];
      const namedMatches = experiences
        .map((experience, index) => ({
          index,
          label: experience.title || experience.companyName || `Experience ${index + 1}`,
          haystack: `${experience.title || ""} ${experience.companyName || ""}`.toLowerCase(),
        }))
        .filter((experience) => experience.label && messageLower.includes(experience.label.toLowerCase()));

      if (namedMatches.length === 1) {
        return { type: "experience", index: namedMatches[0].index, label: namedMatches[0].label };
      }

      if (namedMatches.length > 1) {
        return {
          type: "experience",
          requiresSelection: true,
          options: namedMatches.map(({ index, label }) => ({ index, label })),
        };
      }

      if (experiences.length === 1) {
        return {
          type: "experience",
          index: 0,
          label: experiences[0].title || experiences[0].companyName || "Experience 1",
        };
      }

      if (experiences.length > 1) {
        return {
          type: "experience",
          requiresSelection: true,
          options: experiences.map((experience, index) => ({
            index,
            label: experience.title || experience.companyName || `Experience ${index + 1}`,
          })),
        };
      }

      return { type: "experience", unavailable: true };
    };

    const hasText = (value) => typeof value === "string" && value.trim().length > 0;

    const getMissingExperienceFields = (item, mode = "generate") => {
      const missingFields = [];

      if (!hasText(item?.title)) {
        missingFields.push("Job Title");
      }

      if (!hasText(item?.companyName)) {
        missingFields.push("Company Name");
      }

      if (mode === "enhance" && !hasText(item?.workSummary)) {
        missingFields.push("Work Summary");
      }

      return missingFields;
    };

    const getMissingProjectFields = (item, mode = "generate") => {
      const missingFields = [];

      if (!hasText(item?.projectName)) {
        missingFields.push("Project Name");
      }

      if (!hasText(item?.techStack)) {
        missingFields.push("Tech Stack");
      }

      if (mode === "enhance" && !hasText(item?.projectSummary)) {
        missingFields.push("Project Summary");
      }

      return missingFields;
    };

    const showMissingFieldsError = (entityLabel, missingFields) => {
      toast.error(`${entityLabel} details are incomplete.`, {
        description: `Fill these fields first: ${missingFields.join(", ")}.`,
      });
    };

    const inferAssistantTarget = (message, profile) => {
      const messageLower = String(message || "").toLowerCase();

      if (/\bproject\b|\bprojects\b|\bproject summary\b/.test(messageLower)) {
        return buildProjectOptions(profile, messageLower);
      }

      if (/\bexperience\b|\bwork experience\b|\bwork summary\b|\bbullet points for job\b|\bbullet\b|\bbullets\b/.test(messageLower)) {
        return buildExperienceOptions(profile, messageLower);
      }

      if (/\bprofessional summary\b|\bprofile summary\b/.test(messageLower)) {
        return { type: "summary" };
      }

      if (/\bsummary\b/.test(messageLower) && !/\bproject\b|\bprojects\b|\bexperience\b|\bwork experience\b|\bwork summary\b/.test(messageLower)) {
        return { type: "summary" };
      }

      return null;
    };

    const getApplyButtonLabel = (target) => {
      if (!target) return null;
      if (target.type === "summary") return "Add to Summary";
      if (target.type === "project" && !target.requiresSelection && !target.unavailable) {
        return `Add to ${target.label}`;
      }
      if (target.type === "experience" && !target.requiresSelection && !target.unavailable) {
        return `Add to ${target.label}`;
      }
      if (target.type === "project") return "Add to Project";
      if (target.type === "experience") return "Add to Experience";
      return "Add to Profile";
    };

    const toggleAssistantSelector = (messageId, isOpen) => {
      setAssistantMessages((prev) =>
        prev.map((message) =>
          message.id === messageId ? { ...message, showSelector: isOpen } : message
        )
      );
    };

    const applyAssistantContent = (messageId, selection) => {
      const message = assistantMessages.find((entry) => entry.id === messageId);
      if (!message?.applyTarget) {
        return;
      }

      const target = selection || message.applyTarget;
      const content = message.content;

      if (target.unavailable) {
        toast.error(`No ${target.type} items exist yet to update.`);
        return;
      }

      if (target.requiresSelection) {
        toggleAssistantSelector(messageId, true);
        return;
      }

      if (target.type === "summary") {
        updateProfileState({ summary: content });
        toast.success("Added to Professional Summary.");
      }

      if (target.type === "project") {
        const nextProjects = (profileForAi.projects || []).map((project, index) =>
          index === target.index ? { ...project, projectSummary: content } : project
        );
        updateProfileState({ projects: nextProjects });
        toast.success(`Added to ${target.label || "project"}.`);
      }

      if (target.type === "experience") {
        const nextExperience = (profileForAi.experience || []).map((experience, index) =>
          index === target.index ? { ...experience, workSummary: content } : experience
        );
        updateProfileState({ experience: nextExperience });
        toast.success(`Added to ${target.label || "experience"}.`);
      }

      setAssistantMessages((prev) =>
        prev.map((entry) =>
          entry.id === messageId
            ? { ...entry, applied: true, showSelector: false }
            : entry
        )
      );
    };

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

    const initializeExpandedSections = () => {
      if (sectionsInitialized.current) {
        return;
      }

      const initialExpandedSections = {};
      sections.forEach(section => {
        initialExpandedSections[section.id] = true;
      });
      setExpandedSections(initialExpandedSections);
      sectionsInitialized.current = true;
    };

    useEffect(() => {
      if (
        !hasProfileData ||
        lastSavedData.current ||
        profileQuery.isFetching ||
        profileQuery.data
      ) {
        return;
      }

      lastSavedData.current = JSON.stringify(normalizedReduxProfile);
      isInitialLoad.current = false;
      initializeExpandedSections();
    }, [hasProfileData, normalizedReduxProfile, profileQuery.data, profileQuery.isFetching]);

    useEffect(() => {
      if (!profileQuery.data || isDirty) {
        return;
      }

      const fetchedProfile = normalizeProfileData(profileQuery.data);
      const serializedProfile = JSON.stringify(fetchedProfile);

      if (serializedProfile !== lastSavedData.current || !hasProfileData) {
        dispatch(addUserData(fetchedProfile));
      }

      lastSavedData.current = serializedProfile;
      isInitialLoad.current = false;
      initializeExpandedSections();
    }, [dispatch, hasProfileData, isDirty, profileQuery.data]);

    useEffect(() => {
      if (!profileQuery.isError) {
        return;
      }

      toast.error("Failed to load profile.", {
        description: profileQuery.error?.message,
      });
    }, [profileQuery.error?.message, profileQuery.isError]);

    // Track unsaved changes
    useEffect(() => {
        if (isInitialLoad.current) return;
        const currentData = JSON.stringify(normalizedReduxProfile || {});
        setIsDirty(currentData !== lastSavedData.current);
    }, [normalizedReduxProfile]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await updateProfile(normalizedReduxProfile || {});
            const savedProfile = normalizeProfileData(response.data || {});
            dispatch(addUserData(savedProfile));
            lastSavedData.current = JSON.stringify(savedProfile);
            setIsDirty(false);
            toast.success("Profile saved successfully!");
        } catch (error) {
            toast.error("Failed to save profile.", { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleGeneratePortfolio = async (templateName) => {
        setIsGenerating(true);
        const toastId = toast.loading("Generating your portfolio... This might take a moment.");
        try {
            const response = await generatePortfolio(templateName);
            const updatedProfile = normalizeProfileData(response.data || {});
            dispatch(addUserData(updatedProfile));
            lastSavedData.current = JSON.stringify(updatedProfile);
            setIsDirty(false);
            toast.success("Portfolio Generated & Saved! and Wait for 1-2 mins to build your Portfolio", {
                id: toastId,
                description: "Your new portfolio is live. The link has been updated in your portfolio.",
            });
            setPortfolioMode(false);
        } catch (error) {
            toast.error("Generation Failed", { id: toastId, description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const isSectionComplete = (sectionId) => {
      if (!normalizedReduxProfile) return false;
      switch (sectionId) {
        case 'details': return !!normalizedReduxProfile.firstName && !!normalizedReduxProfile.email;
        case 'summary': return !!normalizedReduxProfile.summary?.trim();
        case 'experience': return normalizedReduxProfile.experience?.length > 0;
        case 'projects': return normalizedReduxProfile.projects?.length > 0;
        case 'education': return normalizedReduxProfile.education?.length > 0;
        case 'skills': return normalizedReduxProfile.skills?.length > 0;
        case 'certifications': return normalizedReduxProfile.certifications?.length > 0;
        case 'add_section': return normalizedReduxProfile.additionalSections?.length > 0;
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

    const profileForAi = normalizedReduxProfile || {};
    const resolvedTargetRole = targetRole.trim() || profileForAi.jobTitle || "";

    const setAiTaskState = (key, value) => {
      setAiLoading((prev) => ({ ...prev, [key]: value }));
    };

    const updateProfileState = (partial) => {
      dispatch(addUserData({ ...profileForAi, ...partial }));
    };

    const handleGenerateSummary = async () => {
      setAiTaskState("summary", true);
      try {
        const summary = await generateAiSummary(profileForAi, resolvedTargetRole);
        updateProfileState({ summary });
        toast.success("AI summary generated.");
      } catch (error) {
        toast.error("Failed to generate summary.", { description: error.message });
      } finally {
        setAiTaskState("summary", false);
      }
    };

    const handlePortfolioReadyNo = () => {
      setPortfolioConfirmOpen(false);
      setPortfolioMode(false);
    };

    const handlePortfolioReadyYes = async () => {
      setPortfolioConfirmOpen(false);
      await handleGeneratePortfolio(selectedPortfolioTemplate);
    };

    const handleExperienceEnhance = async (index) => {
      const item = profileForAi.experience?.[index];
      if (!item) return;
      const missingFields = getMissingExperienceFields(item, "enhance");

      if (missingFields.length > 0) {
        showMissingFieldsError("Experience", missingFields);
        return;
      }

      setExperienceLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const response = await enhanceExperienceWithAi(profileForAi, item, resolvedTargetRole);
        const newExperience = (profileForAi.experience || []).map((entry, entryIndex) =>
          entryIndex === index
            ? {
                ...entry,
                title: response.title || entry.title,
                workSummary: response.workSummary || entry.workSummary,
              }
            : entry
        );
        updateProfileState({ experience: newExperience });
        setExperienceImpactQuestions((prev) => ({
          ...prev,
          [index]: response.impactQuestions || [],
        }));
        toast.success("Experience enhanced.");
      } catch (error) {
        toast.error("Failed to enhance experience.", { description: error.message });
      } finally {
        setExperienceLoading((prev) => ({ ...prev, [index]: false }));
      }
    };

    const handleExperienceGenerate = async (index) => {
      const item = profileForAi.experience?.[index];
      if (!item) return;
      const missingFields = getMissingExperienceFields(item, "generate");

      if (missingFields.length > 0) {
        showMissingFieldsError("Experience", missingFields);
        return;
      }

      setExperienceGenerateLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const response = await generateExperienceWithAi(item);
        const newExperience = (profileForAi.experience || []).map((entry, entryIndex) =>
          entryIndex === index
            ? {
                ...entry,
                title: response.title || entry.title,
                workSummary: response.workSummary || entry.workSummary,
              }
            : entry
        );
        updateProfileState({ experience: newExperience });
        toast.success("Experience summary generated.");
      } catch (error) {
        toast.error("Failed to generate experience summary.", { description: error.message });
      } finally {
        setExperienceGenerateLoading((prev) => ({ ...prev, [index]: false }));
      }
    };

    const handleProjectEnhance = async (index) => {
      const item = profileForAi.projects?.[index];
      if (!item) return;
      const missingFields = getMissingProjectFields(item, "enhance");

      if (missingFields.length > 0) {
        showMissingFieldsError("Project", missingFields);
        return;
      }

      setProjectLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const response = await enhanceProjectWithAi(profileForAi, item, resolvedTargetRole);
        const newProjects = (profileForAi.projects || []).map((entry, entryIndex) =>
          entryIndex === index
            ? {
                ...entry,
                projectSummary: response.projectSummary || entry.projectSummary,
              }
            : entry
        );
        updateProfileState({ projects: newProjects });
        setProjectImpactQuestions((prev) => ({
          ...prev,
          [index]: response.impactQuestions || [],
        }));
        toast.success("Project description enhanced.");
      } catch (error) {
        toast.error("Failed to enhance project.", { description: error.message });
      } finally {
        setProjectLoading((prev) => ({ ...prev, [index]: false }));
      }
    };

    const handleProjectGenerate = async (index) => {
      const item = profileForAi.projects?.[index];
      if (!item) return;
      const missingFields = getMissingProjectFields(item, "generate");

      if (missingFields.length > 0) {
        showMissingFieldsError("Project", missingFields);
        return;
      }

      setProjectGenerateLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const response = await generateProjectWithAi(item);
        const newProjects = (profileForAi.projects || []).map((entry, entryIndex) =>
          entryIndex === index
            ? {
                ...entry,
                projectSummary: response.projectSummary || entry.projectSummary,
              }
            : entry
        );
        updateProfileState({ projects: newProjects });
        toast.success("Project summary generated.");
      } catch (error) {
        toast.error("Failed to generate project summary.", { description: error.message });
      } finally {
        setProjectGenerateLoading((prev) => ({ ...prev, [index]: false }));
      }
    };

    const handleAssistantSend = async () => {
      const message = assistantMessage.trim();
      if (!message) {
        return;
      }

      const nextMessages = [
        ...assistantMessages,
        { id: `user-${Date.now()}`, role: "user", content: message }
      ];
      setAssistantMessages(nextMessages);
      setAssistantMessage("");
      setAiTaskState("assistant", true);

      try {
        const response = await chatWithProfileAssistant(profileForAi, message, resolvedTargetRole);
        setAssistantMessages([
          ...nextMessages,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response,
            applyTarget: inferAssistantTarget(message, profileForAi),
            applied: false,
            showSelector: false,
          },
        ]);
      } catch (error) {
        toast.error("Profile assistant failed.", { description: error.message });
        setAssistantMessages([
          ...nextMessages,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: "I could not generate a response right now. Try again in a moment.",
            applied: false,
            showSelector: false,
          },
        ]);
      } finally {
        setAiTaskState("assistant", false);
      }
    };

    const getSectionProps = (sectionId) => {
      if (sectionId === "summary") {
        return {
          onGenerateSummary: handleGenerateSummary,
          isAiLoading: aiLoading.summary || aiLoading.role,
          targetRole,
          onTargetRoleChange: setTargetRole,
        };
      }

      if (sectionId === "experience") {
        return {
          onGenerateExperience: handleExperienceGenerate,
          onEnhanceExperience: handleExperienceEnhance,
          loadingMap: experienceLoading,
          generateLoadingMap: experienceGenerateLoading,
          impactQuestions: experienceImpactQuestions,
          targetRole: resolvedTargetRole,
        };
      }

      if (sectionId === "projects") {
        return {
          onGenerateProject: handleProjectGenerate,
          onEnhanceProject: handleProjectEnhance,
          loadingMap: projectLoading,
          generateLoadingMap: projectGenerateLoading,
          impactQuestions: projectImpactQuestions,
          targetRole: resolvedTargetRole,
        };
      }

      if (sectionId === "skills") {
        return {};
      }

      return {};
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
                       onClick={() => setPortfolioMode(true)}
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
                    className={`text-white transition-all ${
                      isDirty
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-200 animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isSaving ? (
                      <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isDirty ? 'Save Changes' : 'Save Profile'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Unsaved changes banner */}
            {isDirty && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <span className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    You have unsaved changes. Click <strong>Save Changes</strong> to keep them.
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-amber-500 hover:bg-amber-600 text-white h-7 text-xs px-3"
                  >
                    {isSaving ? <LoaderCircle className="h-3 w-3 animate-spin" /> : 'Save now'}
                  </Button>
                </div>
              </div>
            )}

            {/* Main scrollable content */}
            <div className="w-full px-4 sm:px-6 lg:pl-6 lg:pr-0 pt-8">
                {portfolioMode ? (
                  <div className="max-w-6xl xl:pr-4">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                        <button
                          type="button"
                          onClick={() => setPortfolioMode(false)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Profile
                        </button>

                        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                              <LayoutTemplate className="h-3.5 w-3.5" />
                              Portfolio Mode
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                              Generate your portfolio without leaving the profile page
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                              Pick a template and generate your portfolio from this page. The generated portfolio link
                              will be added back into your profile after completion.
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 lg:w-[320px]">
                            <div className="text-sm font-semibold text-slate-900">Before you generate</div>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                              <li className="flex gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                <span>Portfolio content will use your current saved profile data.</span>
                              </li>
                              <li className="flex gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                <span>Save profile changes first if you edited sections recently.</span>
                              </li>
                              <li className="flex gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                <span>The generated portfolio link will be added back into your profile.</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 px-6 py-6 sm:px-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="min-w-0">
                          <div className="grid gap-5 lg:grid-cols-2">
                            {portfolioTemplates.map((template) => {
                              const isSelected = selectedPortfolioTemplate === template.id;

                              return (
                                <button
                                  key={template.id}
                                  type="button"
                                  onClick={() => setSelectedPortfolioTemplate(template.id)}
                                  className={`group overflow-hidden rounded-xl border bg-white text-left transition-all ${
                                    isSelected
                                      ? "border-emerald-500 ring-2 ring-emerald-100"
                                      : "border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
                                    <img
                                      src={template.previewUrl}
                                      alt={template.name}
                                      className="h-[220px] w-full object-cover"
                                    />
                                    {isSelected && (
                                      <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        Selected
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{template.name}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{template.description}</p>
                                      </div>
                                      <Sparkles className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-emerald-500" : "text-slate-300"}`} />
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="self-start rounded-xl border border-slate-200 bg-slate-50 p-5">
                          <div className="text-sm font-semibold text-slate-900">Selected Template</div>
                          <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                            {portfolioTemplates.find((template) => template.id === selectedPortfolioTemplate)?.name}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            Generate a portfolio from your saved profile data using the selected template.
                          </p>

                          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-sm font-medium text-slate-900">Profile readiness</div>
                            <div className="mt-3 flex items-center justify-between text-sm">
                              <span className="text-slate-500">Completed sections</span>
                              <span className="font-semibold text-slate-900">{completedSections}/{totalSections}</span>
                            </div>
                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              {completionPercentage}% profile completion
                            </div>
                          </div>

                          <div className="mt-6 space-y-3">
                            <Button
                              onClick={() => setPortfolioConfirmOpen(true)}
                              disabled={isSaving || isGenerating}
                              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              {isGenerating ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Github className="mr-2 h-4 w-4" />
                              )}
                              {isGenerating ? "Generating Portfolio..." : "Generate Portfolio"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
                <div className="xl:order-2 xl:sticky xl:top-24 self-start h-[calc(100vh-7rem)]">
                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Bot className="h-4 w-4 text-indigo-500" />
                    Profile Assistant
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Ask for summary rewrites, stronger bullets, role alignment, or missing impact ideas using your current profile as context.
                  </p>

                  <div className="mt-4 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 mb-4">
                    {assistantMessages.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                        Try: “Rewrite my summary for a backend developer role” or “What is weak in my current projects?”
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assistantMessages.map((message, index) => {
                          if (message.role === "user") {
                            return (
                              <div
                                key={message.id || `${message.role}-${index}`}
                                className="ml-6 rounded-2xl bg-indigo-600 px-4 py-3 text-sm leading-6 text-white"
                              >
                                {message.content}
                              </div>
                            );
                          }

                          return (
                            <div
                              key={message.id || `${message.role}-${index}`}
                              className="mr-6 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-200"
                            >
                              <div className="whitespace-pre-wrap">{message.content}</div>

                              {getApplyButtonLabel(message.applyTarget) && (
                                <div className="mt-3 space-y-2">
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:text-slate-400"
                                    onClick={() => applyAssistantContent(message.id)}
                                    disabled={message.applied}
                                  >
                                    {message.applied ? <Check className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
                                    <span>{message.applied ? "Added to Profile" : getApplyButtonLabel(message.applyTarget)}</span>
                                  </button>

                                  {!message.applied && message.applyTarget?.requiresSelection && (
                                    <button
                                      type="button"
                                      className="block text-xs font-medium text-slate-500 hover:text-slate-700"
                                      onClick={() => toggleAssistantSelector(message.id, !message.showSelector)}
                                    >
                                      Choose target
                                    </button>
                                  )}

                                  {message.showSelector && message.applyTarget?.options?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {message.applyTarget.options.map((option) => (
                                        <button
                                          key={`${message.id}-${option.index}`}
                                          type="button"
                                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                          onClick={() =>
                                            applyAssistantContent(message.id, {
                                              ...message.applyTarget,
                                              ...option,
                                              requiresSelection: false,
                                            })
                                          }
                                        >
                                          <PlusCircle className="h-3.5 w-3.5" />
                                          <span>{option.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {aiLoading.assistant && (
                          <div className="mr-6 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      value={assistantMessage}
                      onChange={(event) => setAssistantMessage(event.target.value)}
                      placeholder="Ask AI to improve any part of your profile..."
                      className="min-h-28"
                    />
                    <Button
                      className="w-full bg-slate-900 text-white hover:bg-slate-800"
                      onClick={handleAssistantSend}
                      disabled={aiLoading.assistant}
                    >
                      {aiLoading.assistant ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Ask Profile Assistant
                    </Button>
                  </div>
                </div>
              </div>

              <div className="min-w-0 xl:order-1 xl:pr-2">
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
                        <SectionComponent {...getSectionProps(section.id)} />
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
              </div>
                )}
            </div>
          </div>
          <Dialog open={portfolioConfirmOpen} onOpenChange={setPortfolioConfirmOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Ready to Generate?</DialogTitle>
                <DialogDescription>
                  For the best results, ensure your profile details are complete. This creates the most comprehensive portfolio.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={handlePortfolioReadyNo} disabled={isGenerating}>
                  I need to update my profile
                </Button>
                <Button type="button" onClick={handlePortfolioReadyYes} disabled={isGenerating} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  {isGenerating ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Yes, my profile is ready
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
    );
}

export default ProfilePage;
