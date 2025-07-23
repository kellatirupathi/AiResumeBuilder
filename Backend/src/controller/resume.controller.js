// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import Resume from "../models/resume.model.js";

// const start = async (req, res) => {
//   return res
//     .status(200)
//     .json(new ApiResponse(200, null, "Welcome to Resume Builder API"));
// };

// const createResume = async (req, res) => {
//   const { title, themeColor } = req.body;

//   // Validate that the title and themeColor are provided
//   if (!title || !themeColor) {
//     return res
//       .status(400)
//       .json(new ApiError(400, "Title and themeColor are required."));
//   }

//   try {
//     // Create a new resume with empty fields for other attributes
//     const resume = await Resume.create({
//       title,
//       themeColor,
//       user: req.user._id, // Set the user ID from the authenticated user
//       firstName: "",
//       lastName: "",
//       email: "",
//       summary: "",
//       jobTitle: "",
//       phone: "",
//       address: "",
//       experience: [],
//       education: [], // Initialize as an empty array
//       skills: [],
//       projects: [],
//     });

//     return res
//       .status(201)
//       .json(new ApiResponse(201, { resume }, "Resume created successfully"));
//   } catch (error) {
//     console.error("Error creating resume:", error);
//     return res
//       .status(500)
//       .json(
//         new ApiError(500, "Internal Server Error", [error.message], error.stack)
//       );
//   }
// };

// const getALLResume = async (req, res) => {
//   try {
//     const resumes = await Resume.find({ user: req.user });
//     return res
//       .status(200)
//       .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
//   } catch (error) {
//     console.error("Error fetching resumes:", error);
//     return res
//       .status(500)
//       .json(new ApiError(500, "Internal Server Error", [], error.stack));
//   }
// };

// const getResume = async (req, res) => {
//   try {
//     const { id } = req.query;

//     if (!id) {
//       return res.status(400).json(new ApiError(400, "Resume ID is required."));
//     }

//     // Find the resume by ID
//     const resume = await Resume.findById(id);

//     if (!resume) {
//       return res.status(404).json(new ApiError(404, "Resume not found."));
//     }

//     // Check if the resume belongs to the current user
//     if (resume.user.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json(
//           new ApiError(403, "You are not authorized to access this resume.")
//         );
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, resume, "Resume fetched successfully"));
//   } catch (error) {
//     console.error("Error fetching resume:", error);
//     return res
//       .status(500)
//       .json(new ApiError(500, "Internal Server Error", [], error.stack));
//   }
// };

// const updateResume = async (req, res) => {
//   console.log("Resume update request received:");
//   const id = req.query.id;

//   try {
//     // Find and update the resume with the provided ID and user ID
//     console.log("Database update request started");
//     const updatedResume = await Resume.findOneAndUpdate(
//       { _id: id, user: req.user._id },
//       { $set: req.body, $currentDate: { updatedAt: true } }, // Set updatedAt to current date
//       { new: true } // Return the modified document
//     );

//     if (!updatedResume) {
//       console.log("Resume not found or unauthorized");
//       return res
//         .status(404)
//         .json(new ApiResponse(404, null, "Resume not found or unauthorized"));
//     }

//     console.log("Resume updated successfully:");

//     return res
//       .status(200)
//       .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
//   } catch (error) {
//     console.error("Error updating resume:", error);
//     return res
//       .status(500)
//       .json(
//         new ApiError(500, "Internal Server Error", [error.message], error.stack)
//       );
//   }

//   // return res.status(200).json({ message: "Hello World" });
// };

// const removeResume = async (req, res) => {
//   const id = req.query.id;

//   try {
//     // Check if the resume exists and belongs to the current user
//     const resume = await Resume.findOneAndDelete({
//       _id: id,
//       user: req.user._id,
//     });

//     if (!resume) {
//       return res
//         .status(404)
//         .json(
//           new ApiResponse(
//             404,
//             null,
//             "Resume not found or not authorized to delete this resume"
//           )
//         );
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, null, "Resume deleted successfully"));
//   } catch (error) {
//     console.error("Error while deleting resume:", error);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, null, "Internal Server Error"));
//   }
// };

// const getPublicResume = async (req, res) => {
//   try {
//     const { resumeId } = req.params;

//     if (!resumeId) {
//       return res.status(400).json(new ApiError(400, "Resume ID is required."));
//     }
    
//     // Find the resume by ID without user authentication
//     const resume = await Resume.findById(resumeId);

//     if (!resume) {
//       return res.status(404).json(new ApiError(404, "Resume not found."));
//     }
    
//     return res.status(200).json(new ApiResponse(200, resume, "Public resume data fetched successfully."));

//   } catch(error) {
//     console.error("Error fetching public resume:", error);
//     return res.status(500).json(new ApiError(500, "Internal Server Error", [], error.stack));
//   }
// }

// export {
//   start,
//   createResume,
//   getALLResume,
//   getResume,
//   updateResume,
//   removeResume,
//   getPublicResume
// };


import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Resume from "../models/resume.model.js";

const start = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Welcome to Resume Builder API"));
};

const createResume = async (req, res) => {
  const { title, themeColor } = req.body;

  // Validate that the title and themeColor are provided
  if (!title || !themeColor) {
    return res
      .status(400)
      .json(new ApiError(400, "Title and themeColor are required."));
  }

  try {
    // Create a new resume with empty fields for other attributes
    const resume = await Resume.create({
      title,
      themeColor,
      user: req.user._id, // Set the user ID from the authenticated user
      firstName: "",
      lastName: "",
      email: "",
      summary: "",
      jobTitle: "",
      phone: "",
      address: "",
      experience: [],
      education: [], // Initialize as an empty array
      skills: [],
      projects: [],
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { resume }, "Resume created successfully"));
  } catch (error) {
    console.error("Error creating resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

const getALLResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user });
    return res
      .status(200)
      .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const getResume = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json(new ApiError(400, "Resume ID is required."));
    }

    // Find the resume by ID
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }

    // Check if the resume belongs to the current user
    if (resume.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, "You are not authorized to access this resume.")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, resume, "Resume fetched successfully"));
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const updateResume = async (req, res) => {
  console.log("Resume update request received:");
  const id = req.query.id;

  try {
    // Find and update the resume with the provided ID and user ID
    console.log("Database update request started");
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body, $currentDate: { updatedAt: true } }, // Set updatedAt to current date
      { new: true } // Return the modified document
    );

    if (!updatedResume) {
      console.log("Resume not found or unauthorized");
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Resume not found or unauthorized"));
    }

    console.log("Resume updated successfully:");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
  } catch (error) {
    console.error("Error updating resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }

  // return res.status(200).json({ message: "Hello World" });
};

const removeResume = async (req, res) => {
  const id = req.query.id;

  try {
    // Check if the resume exists and belongs to the current user
    const resume = await Resume.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            "Resume not found or not authorized to delete this resume"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Resume deleted successfully"));
  } catch (error) {
    console.error("Error while deleting resume:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const getPublicResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json(new ApiError(400, "Resume ID is required."));
    }
    
    // Find the resume by ID without user authentication
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }
    
    return res.status(200).json(new ApiResponse(200, resume, "Public resume data fetched successfully."));

  } catch(error) {
    console.error("Error fetching public resume:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
}

const trackResumeView = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json(new ApiError(400, "Resume ID is required."));
    }
    
    // Find and update the view count atomically
    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { $inc: { viewCount: 1 } },
      { new: false } // We don't need the updated document back
    );

    if (!resume) {
      // Don't send an error, just log it. The viewer shouldn't know if tracking failed.
      console.warn(`Attempted to track view for non-existent resume ID: ${resumeId}`);
      return res.status(200).json(new ApiResponse(200, null, "View tracking skipped."));
    }
    
    return res.status(200).json(new ApiResponse(200, null, "View tracked successfully."));

  } catch(error) {
    console.error("Error tracking resume view:", error);
    // Don't send a 500 error to the viewer, just a success response to not break their experience.
    return res.status(200).json(new ApiResponse(200, null, "View tracking failed on server."));
  }
};

export {
  start,
  createResume,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
  getPublicResume,
  trackResumeView
};
