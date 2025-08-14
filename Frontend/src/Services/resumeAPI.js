import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: `${VITE_APP_URL.replace(/\/$/, '')}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const createNewResume = async (data) => {
  try {
    const resumeData = {
      ...data.data,
      template: data.data.template || "modern",
    };
    
    const response = await axiosInstance.post(
      "resumes/createResume",
      resumeData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getAllResumeData = async () => {
  try {
    const response = await axiosInstance.get("resumes/getAllResume");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getResumeData = async (resumeID) => {
  try {
    const response = await axiosInstance.get(
      `resumes/getResume?id=${resumeID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const updateThisResume = async (resumeID, data) => {
  try {
    const response = await axiosInstance.put(
      `resumes/updateResume?id=${resumeID}`,
      data.data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const deleteThisResume = async (resumeID) => {
  try {
    const response = await axiosInstance.delete(
      `resumes/removeResume?id=${resumeID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getPublicResumeData = async (resumeID) => {
  try {
    const response = await axiosInstance.get(
      `resumes/public/${resumeID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const downloadResumePDF = async (resumeID) => {
  try {
    const resumeResponse = await getResumeData(resumeID);
    const resumeData = resumeResponse.data;
    
    const response = await axiosInstance.get(
      `pdf/download?id=${resumeID}`,
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement('a');
    link.href = url;
    
    let filename = 'resume.pdf';
    if (resumeData?.firstName && resumeData?.lastName) {
      filename = `${resumeData.firstName}_${resumeData.lastName}_Resume.pdf`;
    } else if (resumeData?.firstName) {
      filename = `${resumeData.firstName}_Resume.pdf`;
    } else {
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
    }
    
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to download resume"
    );
  }
};

const trackPublicResumeView = async (resumeID) => {
  try {
    await axiosInstance.post(`resumes/public/view/${resumeID}`);
    console.log(`Tracked view for resume: ${resumeID}`);
  } catch (error) {
    console.error(
      "Failed to track resume view:",
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export const cloneResume = async (resumeId, newTitle) => {
  try {
    const response = await axiosInstance.post(`resumes/${resumeId}/clone`, { newTitle });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export const saveResumeVersion = async (resumeId) => {
  try {
    const response = await axiosInstance.post(`resumes/${resumeId}/version`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export const revertToVersion = async (resumeId, versionId) => {
  try {
    const response = await axiosInstance.put(`resumes/${resumeId}/revert/${versionId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export {
  getAllResumeData,
  deleteThisResume,
  getResumeData,
  updateThisResume,
  createNewResume,
  downloadResumePDF,
  getPublicResumeData,
  trackPublicResumeView
};
