import axios from "axios";
import { API_BASE_URL } from "@/config/config";
import {
  removeResumeFromCaches,
  resolveApiData,
  setResumeListCache,
  upsertResumeInCaches,
} from "@/lib/queryCacheUtils";
import { handleUnauthorizedUserSession } from "@/lib/authSession";
import { queryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

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
    const createdResumePayload = resolveApiData(response.data);
    const createdResume = createdResumePayload?.resume || createdResumePayload;
    if (createdResume) {
      upsertResumeInCaches(createdResume);
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
    }
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
    setResumeListCache(resolveApiData(response.data) || []);
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
    const updatedResume = resolveApiData(response.data);
    if (updatedResume) {
      upsertResumeInCaches(updatedResume);
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.detail(resumeID) });
    }
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
    removeResumeFromCaches(resumeID);
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

export const generateResumeDriveLink = async (resumeId) => {
  try {
    const response = await axiosInstance.post(`resumes/generateDriveLink?id=${resumeId}`);
    const googleDriveLink = resolveApiData(response.data)?.googleDriveLink;
    if (googleDriveLink) {
      queryClient.setQueryData(queryKeys.resumes.detail(resumeId), (previous) =>
        previous
          ? {
              ...previous,
              googleDriveLink,
              driveOutOfSync: false,
            }
          : previous
      );
      queryClient.setQueryData(queryKeys.resumes.list, (previous = []) =>
        (Array.isArray(previous) ? previous : []).map((resume) =>
          resume?._id === resumeId
            ? { ...resume, googleDriveLink, driveOutOfSync: false }
            : resume
        )
      );
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to generate drive link"
    );
  }
};

export const cloneResume = async (resumeId, newTitle) => {
  try {
    const response = await axiosInstance.post(`resumes/${resumeId}/clone`, { newTitle });
    const clonedResume = resolveApiData(response.data);
    if (clonedResume) {
      upsertResumeInCaches(clonedResume);
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
    }
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
    const revertedResume = resolveApiData(response.data);
    if (revertedResume) {
      upsertResumeInCaches(revertedResume);
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.detail(resumeId) });
    }
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
