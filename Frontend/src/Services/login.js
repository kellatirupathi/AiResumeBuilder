// C:\Users\NxtWave\Downloads\code\Frontend\src\Services\login.js
import axios from "axios";
import { API_BASE_URL } from "@/config/config";
import {
  resolveApiData,
  setNotificationPreferencesCache,
  setUserCaches,
} from "@/lib/queryCacheUtils";
import { handleUnauthorizedUserSession } from "@/lib/authSession";
import { queryClient } from "@/lib/queryClient";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      handleUnauthorizedUserSession();
    }

    return Promise.reject(error);
  }
);

const startUser = async () => {
  try {
    const response = await axiosInstance.get("users/");
    const userData = resolveApiData(response.data);
    if (userData) {
      setUserCaches(userData);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getSessionUser = async () => {
  try {
    const response = await axiosInstance.get("users/session");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post("users/register", data);
    const userData = resolveApiData(response.data);
    if (userData) {
      setUserCaches(userData);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("users/login", data);
    const userData = resolveApiData(response.data);
    if (userData) {
      setUserCaches(userData);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const googleLogin = async (credential) => {
    try {
        const response = await axiosInstance.post("users/google-login", { credential });
        const userData = resolveApiData(response.data);
        if (userData) {
          setUserCaches(userData);
        }
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message || "Google sign-in failed."
        );
    }
};

const logoutUser = async () => {
  try {
    const response = await axiosInstance.get("users/logout");
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("nxtresume-query-cache");
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const requestPasswordReset = async (data) => {
  try {
    const response = await axiosInstance.post("users/forgot-password", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Password reset request failed"
    );
  }
};

const resetPassword = async (data) => {
    try {
      const response = await axiosInstance.post("users/reset-password", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Password reset failed"
      );
    }
  };

const changePassword = async (data) => {
  try {
    const response = await axiosInstance.post("users/change-password", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Password change failed"
    );
  }
};

const getProfile = async () => {
  try {
    const response = await axiosInstance.get("users/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to fetch profile"
    );
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("users/profile", profileData);
    const updatedProfile = resolveApiData(response.data);
    if (updatedProfile) {
      setUserCaches(updatedProfile);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to update profile"
    );
  }
};

export const generatePortfolio = async (templateName) => {
    try {
        const response = await axiosInstance.post("users/profile/generate-portfolio", { templateName });
        const updatedProfile = resolveApiData(response.data);
        if (updatedProfile) {
          setUserCaches(updatedProfile);
        }
        return response.data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message || "Portfolio generation failed"
        );
    }
};

const getNotificationPreferences = async () => {
  try {
    const response = await axiosInstance.get("users/notification-preferences");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to fetch notification preferences"
    );
  }
};

const updateNotificationPreferences = async (prefs) => {
  try {
    const response = await axiosInstance.patch("users/notification-preferences", prefs);
    const updatedPreferences = resolveApiData(response.data);
    setNotificationPreferencesCache(updatedPreferences);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to update notification preferences"
    );
  }
};

// <-- MODIFIED: ADDED NEW FUNCTION -->
const completeProfile = async (data) => {
  try {
    const response = await axiosInstance.post("users/complete-profile", data);
    const userData = resolveApiData(response.data);
    if (userData) {
      setUserCaches(userData);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to complete profile."
    );
  }
};

export {
  startUser,
  getSessionUser,
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  completeProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
};
