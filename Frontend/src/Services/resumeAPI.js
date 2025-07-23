// import axios from "axios";
// import { VITE_APP_URL } from "@/config/config";

// const axiosInstance = axios.create({
//   baseURL: VITE_APP_URL + "/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// const createNewResume = async (data) => {
//   try {
//     // Ensure template is included in the data
//     const resumeData = {
//       ...data.data,
//       template: data.data.template || "modern", // Default to modern template if not specified
//     };
    
//     const response = await axiosInstance.post(
//       "resumes/createResume",
//       resumeData
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const getAllResumeData = async () => {
//   try {
//     const response = await axiosInstance.get("resumes/getAllResume");
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const getResumeData = async (resumeID) => {
//   try {
//     const response = await axiosInstance.get(
//       `resumes/getResume?id=${resumeID}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const updateThisResume = async (resumeID, data) => {
//   try {
//     const response = await axiosInstance.put(
//       `resumes/updateResume?id=${resumeID}`,
//       data.data
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const deleteThisResume = async (resumeID) => {
//   try {
//     const response = await axiosInstance.delete(
//       `resumes/removeResume?id=${resumeID}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// const getPublicResumeData = async (resumeID) => {
//   try {
//     const response = await axiosInstance.get(
//       `resumes/public/${resumeID}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Something Went Wrong"
//     );
//   }
// };

// // Function to download a resume as PDF
// const downloadResumePDF = async (resumeID) => {
//   try {
//     // First get the resume data to access firstName and lastName
//     const resumeResponse = await getResumeData(resumeID);
//     const resumeData = resumeResponse.data;
    
//     // Using axios with responseType: 'blob' to handle binary data
//     const response = await axiosInstance.get(
//       `pdf/download?id=${resumeID}`,
//       { responseType: 'blob' }
//     );
    
//     // Create a URL for the blob
//     const url = window.URL.createObjectURL(new Blob([response.data]));
    
//     // Create a temporary link element
//     const link = document.createElement('a');
//     link.href = url;
    
//     // Generate filename using firstName and lastName if available
//     let filename = 'resume.pdf';
//     if (resumeData?.firstName && resumeData?.lastName) {
//       filename = `${resumeData.firstName}_${resumeData.lastName}_Resume.pdf`;
//     } else if (resumeData?.firstName) {
//       filename = `${resumeData.firstName}_Resume.pdf`;
//     } else {
//       // Try to get filename from Content-Disposition header as fallback
//       const contentDisposition = response.headers['content-disposition'];
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename="(.+)"/);
//         if (filenameMatch && filenameMatch.length === 2) {
//           filename = filenameMatch[1];
//         }
//       }
//     }
    
//     link.setAttribute('download', filename);
    
//     // Append to body, click and remove
//     document.body.appendChild(link);
//     link.click();
//     setTimeout(() => {
//       document.body.removeChild(link);
//       // Clean up the URL object
//       window.URL.revokeObjectURL(url);
//     }, 100);
    
//     return true;
//   } catch (error) {
//     console.error("Error downloading PDF:", error);
//     throw new Error(
//       error?.response?.data?.message || error?.message || "Failed to download resume"
//     );
//   }
// };

// export {
//   getAllResumeData,
//   deleteThisResume,
//   getResumeData,
//   updateThisResume,
//   createNewResume,
//   downloadResumePDF,
//   getPublicResumeData
// };




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
    // Ensure template is included in the data
    const resumeData = {
      ...data.data,
      template: data.data.template || "modern", // Default to modern template if not specified
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

// Function to download a resume as PDF
const downloadResumePDF = async (resumeID) => {
  try {
    // First get the resume data to access firstName and lastName
    const resumeResponse = await getResumeData(resumeID);
    const resumeData = resumeResponse.data;
    
    // Using axios with responseType: 'blob' to handle binary data
    const response = await axiosInstance.get(
      `pdf/download?id=${resumeID}`,
      { responseType: 'blob' }
    );
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename using firstName and lastName if available
    let filename = 'resume.pdf';
    if (resumeData?.firstName && resumeData?.lastName) {
      filename = `${resumeData.firstName}_${resumeData.lastName}_Resume.pdf`;
    } else if (resumeData?.firstName) {
      filename = `${resumeData.firstName}_Resume.pdf`;
    } else {
      // Try to get filename from Content-Disposition header as fallback
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
    }
    
    link.setAttribute('download', filename);
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      // Clean up the URL object
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
    // Fire-and-forget POST request. We don't need to handle the response content.
    await axiosInstance.post(`resumes/public/view/${resumeID}`);
    console.log(`Tracked view for resume: ${resumeID}`);
  } catch (error) {
    // Log the error silently. We don't want to disrupt the user viewing the resume.
    console.error(
      "Failed to track resume view:",
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
