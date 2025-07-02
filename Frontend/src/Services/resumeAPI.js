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

// ... rest of the file remains the same ...

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

export {
  getAllResumeData,
  deleteThisResume,
  getResumeData,
  updateThisResume,
  createNewResume,
  downloadResumePDF
};
