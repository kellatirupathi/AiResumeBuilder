// features/resume/resumeFeatures.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumeData: ""
};

export const resumeSlice = createSlice({
  name: "editResume",
  initialState,
  reducers: {
    // Original action for complete resume updates (keep for compatibility)
    addResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    
    // New granular update actions for specific form sections
    updateExperienceField: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData?.experience?.[index]) {
        state.resumeData.experience[index][field] = value;
      }
    },
    
    updateProjectField: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData?.projects?.[index]) {
        state.resumeData.projects[index][field] = value;
      }
    },
    
    updateEducationField: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData?.education?.[index]) {
        state.resumeData.education[index][field] = value;
      }
    },
    
    updateCertificationField: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData?.certifications?.[index]) {
        state.resumeData.certifications[index][field] = value;
      }
    },
    
    // Actions for adding/removing items from arrays
    addExperienceItem: (state, action) => {
      if (!state.resumeData.experience) {
        state.resumeData.experience = [];
      }
      state.resumeData.experience.push(action.payload);
    },
    
    removeExperienceItem: (state, action) => {
      const index = action.payload;
      if (state.resumeData?.experience) {
        state.resumeData.experience = state.resumeData.experience.filter((_, i) => i !== index);
      }
    },
    
    addProjectItem: (state, action) => {
      if (!state.resumeData.projects) {
        state.resumeData.projects = [];
      }
      state.resumeData.projects.push(action.payload);
    },
    
    removeProjectItem: (state, action) => {
      const index = action.payload;
      if (state.resumeData?.projects) {
        state.resumeData.projects = state.resumeData.projects.filter((_, i) => i !== index);
      }
    },
    
    addEducationItem: (state, action) => {
      if (!state.resumeData.education) {
        state.resumeData.education = [];
      }
      state.resumeData.education.push(action.payload);
    },
    
    removeEducationItem: (state, action) => {
      const index = action.payload;
      if (state.resumeData?.education) {
        state.resumeData.education = state.resumeData.education.filter((_, i) => i !== index);
      }
    },
    
    addCertificationItem: (state, action) => {
      if (!state.resumeData.certifications) {
        state.resumeData.certifications = [];
      }
      state.resumeData.certifications.push(action.payload);
    },
    
    removeCertificationItem: (state, action) => {
      const index = action.payload;
      if (state.resumeData?.certifications) {
        state.resumeData.certifications = state.resumeData.certifications.filter((_, i) => i !== index);
      }
    }
  },
});

// Export all actions
export const { 
  addResumeData,
  updateExperienceField,
  updateProjectField,
  updateEducationField,
  updateCertificationField,
  addExperienceItem,
  removeExperienceItem,
  addProjectItem,
  removeProjectItem,
  addEducationItem,
  removeEducationItem,
  addCertificationItem,
  removeCertificationItem
} = resumeSlice.actions;

export default resumeSlice.reducer;
