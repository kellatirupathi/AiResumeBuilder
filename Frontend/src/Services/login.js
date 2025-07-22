// import axios from "axios";
// import { VITE_APP_URL } from "@/config/config";

// const axiosInstance = axios.create({
//   // **FIX:** Added a slash before "api/"
//   baseURL: VITE_APP_URL + "/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // ... rest of the file remains the same ...

// const startUser = async () => {
//   try {
//     const response = await axiosInstance.get("users/");
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const registerUser = async (data) => {
//   try {
//     const response = await axiosInstance.post("users/register/", data);
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const loginUser = async (data) => {
//   try {
//     const response = await axiosInstance.post("users/login/", data);
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const logoutUser = async () => {
//   try {
//     const response = await axiosInstance.get("users/logout/");
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// export { startUser, registerUser, loginUser, logoutUser };




import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  // **FIX:** Added a slash before "api/"
  baseURL: VITE_APP_URL + "/api/",
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
    const response = await axiosInstance.post("users/register/", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("users/login/", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const logoutUser = async () => {
  try {
    const response = await axiosInstance.get("users/logout/");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const forgotPassword = async (data) => {
  try {
    const response = await axiosInstance.post("users/forgot-password", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Password reset failed"
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

export { startUser, registerUser, loginUser, logoutUser, forgotPassword, changePassword };
