// C:\Users\NxtWave\Downloads\AiResumeBuilder-3\Frontend\src\App.jsx

import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "./features/user/userFeatures";
import { resetGeneration } from "./features/driveGeneration/driveGenerationFeatures";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useSessionUserQuery } from "@/hooks/useAppQueryData";

function DriveGenerationNotifier() {
  const dispatch = useDispatch();
  const { status, resumeTitle, error } = useSelector((state) => state.driveGeneration);
  const prevStatus = useRef("idle");

  useEffect(() => {
    if (prevStatus.current === "generating" && status === "done") {
      toast.success(`"${resumeTitle}" link is ready!`, {
        description: "Your resume is now publicly accessible. Use Share Resume from Edit Resume or View Resume.",
        duration: 6000,
      });
      dispatch(resetGeneration());
    } else if (prevStatus.current === "generating" && status === "error") {
      toast.error("Failed to generate resume link", {
        description: error || "Please try again from Edit Resume or View Resume.",
        duration: 6000,
      });
      dispatch(resetGeneration());
    }
    prevStatus.current = status;
  }, [status]);

  return null;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduxUser = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const sessionQuery = useSessionUserQuery();
  const sessionUser = sessionQuery.data;
  const user = sessionUser || reduxUser;

  useEffect(() => {
    if (sessionUser) {
      dispatch(addUserData(sessionUser));
      return;
    }

    if (sessionQuery.isSuccess && !sessionUser) {
      dispatch(addUserData(""));
      navigate("/");
    }

    if (sessionQuery.isError) {
      console.log("Session check failed:", sessionQuery.error?.message);
      dispatch(addUserData(""));
      navigate("/");
    }
  }, [dispatch, navigate, sessionQuery.error?.message, sessionQuery.isError, sessionQuery.isSuccess, sessionUser]);

  useEffect(() => {
    if (user?.userType !== "external" && user?.niatIdVerified === false && location.pathname !== "/complete-profile") {
      navigate("/complete-profile");
    }
  }, [location.pathname, navigate, user?.niatIdVerified, user?.userType]);

  // Dark mode logic
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("prefersDarkMode") === "true";
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("prefersDarkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  const isEditResumePage = location.pathname.includes('/dashboard/edit-resume');
  const isViewResumePage = location.pathname.includes('/dashboard/view-resume');
  const isProfilePage = location.pathname === '/profile';
  const isDashboardPage = location.pathname === '/dashboard';
  const isDocumentationPage = location.pathname === '/app/documentation';
  const isATSPage     = location.pathname === '/app/ats-checker';
  const isResumesPage        = location.pathname === '/app/resumes';
  const isChangePasswordPage = location.pathname === '/change-password';
  const isNotificationsPage = location.pathname === '/notifications';
  const shouldHideHeader = isEditResumePage || isViewResumePage || isProfilePage || isDashboardPage || isDocumentationPage || isATSPage || isResumesPage || isChangePasswordPage || isNotificationsPage;

  if (sessionQuery.isPending && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <LoaderCircle className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (user) {
    return (
      <>
        <DriveGenerationNotifier />
        {!shouldHideHeader && <Header user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        <Outlet context={{ darkMode, toggleDarkMode }} />
        <Toaster />
      </>
    );
  }
  
  return null;
}

export default App;
