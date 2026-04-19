import axios from "axios";
import { API_BASE_URL } from "@/config/config";
import { resolveApiData } from "@/lib/queryCacheUtils";
import { handleUnauthorizedUserSession } from "@/lib/authSession";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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

const handleError = (error, fallback = "Something Went Wrong") => {
  throw new Error(
    error?.response?.data?.message || error?.message || fallback
  );
};

export const uploadSourceResumePdf = async (file) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);
    const response = await axiosInstance.post(
      "cover-letters/upload-source-pdf",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to extract PDF text");
  }
};

export const createCoverLetter = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "cover-letters/createCoverLetter",
      payload
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllCoverLetters = async () => {
  try {
    const response = await axiosInstance.get(
      "cover-letters/getAllCoverLetters"
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getCoverLetter = async (id) => {
  try {
    const response = await axiosInstance.get(
      `cover-letters/getCoverLetter?id=${id}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateCoverLetter = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `cover-letters/updateCoverLetter?id=${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteCoverLetter = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `cover-letters/removeCoverLetter?id=${id}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const cloneCoverLetter = async (id, newTitle) => {
  try {
    const response = await axiosInstance.post(`cover-letters/${id}/clone`, {
      newTitle,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const saveCoverLetterVersion = async (id) => {
  try {
    const response = await axiosInstance.post(`cover-letters/${id}/version`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const revertCoverLetterToVersion = async (id, versionId) => {
  try {
    const response = await axiosInstance.put(
      `cover-letters/${id}/revert/${versionId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const generateCoverLetterDriveLink = async (id) => {
  try {
    const response = await axiosInstance.post(
      `cover-letters/generateDriveLink?id=${id}`
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to generate drive link");
  }
};

export const getPublicCoverLetter = async (slugOrId) => {
  try {
    const response = await axiosInstance.get(
      `cover-letters/public/${slugOrId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const trackPublicCoverLetterView = async (slugOrId) => {
  try {
    await axiosInstance.post(`cover-letters/public/view/${slugOrId}`);
  } catch (error) {
    console.error(
      "Failed to track cover letter view:",
      error?.response?.data?.message || error?.message
    );
  }
};

export const downloadCoverLetterPDF = async (id) => {
  try {
    const detail = await getCoverLetter(id);
    const data = resolveApiData(detail);

    const response = await axiosInstance.get(
      `pdf/cover-letter/download?id=${id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    let filename = "cover-letter.pdf";
    if (data?.title) {
      filename = `${data.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    return true;
  } catch (error) {
    console.error("Error downloading cover letter PDF:", error);
    handleError(error, "Failed to download cover letter");
  }
};
