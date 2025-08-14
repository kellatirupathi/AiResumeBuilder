// C:\Users\NxtWave\Downloads\code\Backend\src\controller\resume.controller.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Resume from "../models/resume.model.js";
import { generatePDF } from '../services/pdf.service.js';
import { uploadOrUpdatePdf } from '../services/drive.service.js';

// MODIFIED: Helper to handle PDF generation and upload
const generateAndUpload = async (resume) => {
    try {
        // MODIFIED: Populate the user's full name before proceeding
        await resume.populate('user', 'fullName');
        const userFullName = resume.user?.fullName;

        if (!userFullName) {
            console.error(`Could not find user's full name for resume ${resume._id}`);
            return; // Exit if user name can't be found
        }
        
        console.log(`Generating PDF for resume: ${resume._id}`);
        const pdfBuffer = await generatePDF(resume.toObject());
        
        console.log(`Uploading/Updating PDF to Google Drive for resume: ${resume._id}`);
        // MODIFIED: Pass the user's full name to the upload service
        const { fileId, webViewLink } = await uploadOrUpdatePdf(
            resume._id.toString(), 
            userFullName,
            pdfBuffer, 
            resume.googleDriveFileId
        );

        // Update the resume document with the new Drive info
        resume.googleDriveFileId = fileId;
        resume.googleDriveLink = webViewLink;
        await resume.save();
        console.log(`Saved Google Drive link for resume: ${resume._id}`);
    } catch (error) {
        console.error(`Failed to generate or upload PDF for resume ${resume._id}:`, error);
    }
};

const start = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Welcome to Resume Builder API"));
};

const createResume = async (req, res) => {
  const { title, themeColor } = req.body;

  if (!title || !themeColor) {
    return res
      .status(400)
      .json(new ApiError(400, "Title and themeColor are required."));
  }

  try {
    const resume = await Resume.create({
      title,
      themeColor,
      user: req.user._id,
      firstName: "",
      lastName: "",
      email: "",
      summary: "",
      jobTitle: "",
      phone: "",
      address: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
    });
    
    // Fire-and-forget the PDF generation and upload process
    generateAndUpload(resume);

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

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }

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
    console.log("Database update request started");
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body, $currentDate: { updatedAt: true } },
      { new: true }
    );

    if (!updatedResume) {
      console.log("Resume not found or unauthorized");
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Resume not found or unauthorized"));
    }
    
    // Fire-and-forget the PDF generation and upload process
    generateAndUpload(updatedResume);
    
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
};

const removeResume = async (req, res) => {
  const id = req.query.id;

  try {
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
    
    await Resume.findByIdAndUpdate(
      resumeId,
      { $inc: { viewCount: 1 } },
      { new: false }
    );

    return res.status(200).json(new ApiResponse(200, null, "View tracked successfully."));

  } catch(error) {
    console.error("Error tracking resume view:", error);
    return res.status(200).json(new ApiResponse(200, null, "View tracking failed on server."));
  }
};

const cloneResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle } = req.body;

    const originalResume = await Resume.findOne({ _id: id, user: req.user._id }).lean();

    if (!originalResume) {
      return res.status(404).json(new ApiError(404, "Original resume not found or unauthorized."));
    }
    
    const clonedData = { ...originalResume };
    
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.versions; 
    
    clonedData.title = newTitle || `Copy of ${originalResume.title}`;
    clonedData.viewCount = 0;

    const newResume = await Resume.create(clonedData);
    
    return res.status(201).json(new ApiResponse(201, newResume, `Resume cloned as "${clonedData.title}".`));
  } catch (error) {
    console.error("Error cloning resume:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error", [error.message], error.stack));
  }
};

const saveVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findOne({ _id: id, user: req.user._id });

        if (!resume) {
            return res.status(404).json(new ApiError(404, "Resume not found or unauthorized."));
        }

        const resumeDataSnapshot = { ...resume.toObject() };
        delete resumeDataSnapshot._id;
        delete resumeDataSnapshot.versions;
        
        resume.versions.push({ resumeData: resumeDataSnapshot });

        if (resume.versions.length > 10) {
            resume.versions.shift();
        }

        await resume.save();
        return res.status(200).json(new ApiResponse(200, resume, "Version saved successfully."));

    } catch (error) {
        console.error("Error saving version:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error", [error.message], error.stack));
    }
};

const revertToVersion = async (req, res) => {
    try {
        const { id, versionId } = req.params;
        const resume = await Resume.findOne({ _id: id, user: req.user._id });

        if (!resume) {
            return res.status(404).json(new ApiError(404, "Resume not found or unauthorized."));
        }
        
        const versionToRestore = resume.versions.id(versionId);

        if (!versionToRestore) {
            return res.status(404).json(new ApiError(404, "Version not found."));
        }
        
        const { resumeData } = versionToRestore;
        
        Object.keys(resumeData).forEach(key => {
            if (key !== '_id' && key !== 'user' && key !== 'createdAt' && key !== 'versions') {
                resume[key] = resumeData[key];
            }
        });

        resume.updatedAt = new Date();
        await resume.save();

        return res.status(200).json(new ApiResponse(200, resume, "Resume reverted successfully."));
    } catch (error) {
        console.error("Error reverting version:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error", [error.message], error.stack));
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
  trackResumeView,
  cloneResume,
  saveVersion,
  revertToVersion
};
