// C:\Users\NxtWave\Downloads\code\Frontend\src\Services\login.js
import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: `${VITE_APP_URL.replace(/\/$/, '')}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const startUser = async () => {
  try {
    const response = await axiosInstance.get("users/");
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
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const logoutUser = async () => {
  try {
    const response = await axiosInstance.get("users/logout");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

// --- START: MODIFIED PASSWORD RESET FLOW ---
const requestPasswordReset = async (data) => {
  try {
    // We only need to send the email
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
// --- END: MODIFIED PASSWORD RESET FLOW ---

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

// --- NEW PROFILE API FUNCTIONS ---
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
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to update profile"
    );
  }
};

export {
  startUser,
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
};
