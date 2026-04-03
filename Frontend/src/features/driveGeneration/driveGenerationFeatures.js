import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle", // "idle" | "generating" | "done" | "error"
  resumeId: null,
  resumeTitle: null,
  googleDriveLink: null,
  error: null,
};

const driveGenerationSlice = createSlice({
  name: "driveGeneration",
  initialState,
  reducers: {
    startGeneration: (state, action) => {
      state.status = "generating";
      state.resumeId = action.payload.resumeId;
      state.resumeTitle = action.payload.resumeTitle;
      state.googleDriveLink = null;
      state.error = null;
    },
    generationSuccess: (state, action) => {
      state.status = "done";
      state.googleDriveLink = action.payload.googleDriveLink;
    },
    generationError: (state, action) => {
      state.status = "error";
      state.error = action.payload.error;
    },
    resetGeneration: (state) => {
      state.status = "idle";
      state.resumeId = null;
      state.resumeTitle = null;
      state.googleDriveLink = null;
      state.error = null;
    },
  },
});

export const { startGeneration, generationSuccess, generationError, resetGeneration } =
  driveGenerationSlice.actions;

export default driveGenerationSlice.reducer;
