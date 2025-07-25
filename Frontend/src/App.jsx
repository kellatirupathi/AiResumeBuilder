import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";
import { LoaderCircle } from "lucide-react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Auth check logic
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode === 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
          navigate("/");
        }
      } catch (error) {
        console.log("Auth check failed:", error.message);
        dispatch(addUserData(""));
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchResponse();
  }, [dispatch, navigate]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <LoaderCircle className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (user) {
    return (
      <Provider store={resumeStore}>
        {!isEditResumePage && <Header user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        <Outlet />
        <Toaster />
      </Provider>
    );
  }
  
  return null;
}

export default App;
