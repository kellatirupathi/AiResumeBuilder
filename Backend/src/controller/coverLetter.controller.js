import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CoverLetter from "../models/coverLetter.model.js";
import Resume from "../models/resume.model.js";
import { generateAndUploadCoverLetterDriveLink } from "../services/coverLetterDrive.service.js";
import { extractTextFromPdfBuffer } from "../services/pdfExtract.service.js";

const buildSenderFromResume = (resume) => ({
  senderName: `${resume?.firstName || ""} ${resume?.lastName || ""}`.trim(),
  senderEmail: resume?.email || "",
  senderPhone: resume?.phone || "",
  senderAddress: resume?.address || "",
  senderLinkedin: resume?.linkedinUrl || "",
  senderPortfolio: resume?.portfolioUrl || "",
});

const generatePublicSlug = () =>
  crypto.randomBytes(6).toString("hex");

export const createCoverLetter = async (req, res) => {
  const {
    title,
    template,
    themeColor,
    sourceResumeId,
    uploadedResumeFileId,
    uploadedResumeFileName,
    uploadedResumeText,
    senderName,
    senderEmail,
    senderPhone,
    senderAddress,
    senderLinkedin,
    senderPortfolio,
    jobTitle,
    companyName,
    hiringManagerName,
    jobDescription,
    tone,
    generatedContent,
  } = req.body;

  if (!title) {
    return res
      .status(400)
      .json(new ApiError(400, "Title is required."));
  }

  try {
    let senderFields = {
      senderName: senderName || "",
      senderEmail: senderEmail || "",
      senderPhone: senderPhone || "",
      senderAddress: senderAddress || "",
      senderLinkedin: senderLinkedin || "",
      senderPortfolio: senderPortfolio || "",
    };

    // If a sourceResumeId is provided, hydrate sender details from the resume
    if (sourceResumeId) {
      const resume = await Resume.findOne({
        _id: sourceResumeId,
        user: req.user._id,
      });
      if (resume) {
        senderFields = buildSenderFromResume(resume);
      }
    }

    const coverLetter = await CoverLetter.create({
      user: req.user._id,
      title,
      template: template || "classic",
      themeColor: themeColor || "#1c2434",
      sourceResumeId: sourceResumeId || null,
      uploadedResumeFileId: uploadedResumeFileId || null,
      uploadedResumeFileName: uploadedResumeFileName || null,
      uploadedResumeText: uploadedResumeText || "",
      ...senderFields,
      jobTitle: jobTitle || "",
      companyName: companyName || "",
      hiringManagerName: hiringManagerName || "",
      jobDescription: jobDescription || "",
      tone: tone || "formal",
      generatedContent: generatedContent || {
        greeting: "",
        openingParagraph: "",
        bodyParagraphs: [],
        closingParagraph: "",
        signature: "",
      },
      publicSlug: generatePublicSlug(),
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, { coverLetter }, "Cover letter created successfully")
      );
  } catch (error) {
    console.error("Error creating cover letter:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

export const getAllCoverLetters = async (req, res) => {
  try {
    const items = await CoverLetter.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Cover letters fetched successfully"));
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

export const getCoverLetter = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json(new ApiError(400, "Cover letter ID is required."));
    }

    const item = await CoverLetter.findById(id);
    if (!item) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found."));
    }
    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(new ApiError(403, "You are not authorized to access this cover letter."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, item, "Cover letter fetched successfully"));
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

export const updateCoverLetter = async (req, res) => {
  const id = req.query.id;

  try {
    const existing = await CoverLetter.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Cover letter not found or unauthorized"));
    }

    const updatePayload = { ...req.body };
    if (existing.googleDriveLink) {
      updatePayload.driveOutOfSync = true;
    }

    const updated = await CoverLetter.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updatePayload, $currentDate: { updatedAt: true } },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Cover letter updated successfully"));
  } catch (error) {
    console.error("Error updating cover letter:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

export const removeCoverLetter = async (req, res) => {
  const id = req.query.id;

  try {
    const item = await CoverLetter.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            "Cover letter not found or not authorized to delete"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Cover letter deleted successfully"));
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const cloneCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle } = req.body;
    const original = await CoverLetter.findOne({
      _id: id,
      user: req.user._id,
    }).lean();

    if (!original) {
      return res
        .status(404)
        .json(new ApiError(404, "Original cover letter not found or unauthorized."));
    }

    const cloned = { ...original };
    delete cloned._id;
    delete cloned.createdAt;
    delete cloned.updatedAt;
    delete cloned.versions;
    cloned.googleDriveFileId = null;
    cloned.googleDriveLink = null;
    cloned.driveOutOfSync = false;
    cloned.publicSlug = generatePublicSlug();
    cloned.title = newTitle || `Copy of ${original.title}`;
    cloned.viewCount = 0;

    const newItem = await CoverLetter.create(cloned);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newItem,
          `Cover letter cloned as "${cloned.title}".`
        )
      );
  } catch (error) {
    console.error("Error cloning cover letter:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [error.message], error.stack));
  }
};

export const saveVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CoverLetter.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found or unauthorized."));
    }

    const snapshot = { ...item.toObject() };
    delete snapshot._id;
    delete snapshot.versions;

    item.versions.push({ coverLetterData: snapshot });
    if (item.versions.length > 10) {
      item.versions.shift();
    }

    await item.save();
    return res
      .status(200)
      .json(new ApiResponse(200, item, "Version saved successfully."));
  } catch (error) {
    console.error("Error saving version:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [error.message], error.stack));
  }
};

export const revertToVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;
    const item = await CoverLetter.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!item) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found or unauthorized."));
    }

    const versionToRestore = item.versions.id(versionId);
    if (!versionToRestore) {
      return res.status(404).json(new ApiError(404, "Version not found."));
    }

    const { coverLetterData } = versionToRestore;
    Object.keys(coverLetterData).forEach((key) => {
      if (
        key !== "_id" &&
        key !== "user" &&
        key !== "createdAt" &&
        key !== "versions"
      ) {
        item[key] = coverLetterData[key];
      }
    });

    item.updatedAt = new Date();
    await item.save();

    return res
      .status(200)
      .json(new ApiResponse(200, item, "Cover letter reverted successfully."));
  } catch (error) {
    console.error("Error reverting version:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [error.message], error.stack));
  }
};

export const generateDriveLink = async (req, res) => {
  const { id } = req.query;
  try {
    const item = await CoverLetter.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!item) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found or unauthorized."));
    }
    await generateAndUploadCoverLetterDriveLink(item);
    await CoverLetter.findByIdAndUpdate(id, { driveOutOfSync: false });
    const updated = await CoverLetter.findById(id);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          googleDriveLink: updated.googleDriveLink,
          driveOutOfSync: false,
        },
        "Drive link generated successfully"
      )
    );
  } catch (error) {
    console.error("Error generating drive link:", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Failed to generate drive link",
          [error.message],
          error.stack
        )
      );
  }
};

export const uploadSourceResumePdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file || !file.buffer) {
      return res
        .status(400)
        .json(new ApiError(400, "No PDF file uploaded."));
    }

    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json(new ApiError(400, "Only PDF files are supported."));
    }

    const text = await extractTextFromPdfBuffer(file.buffer);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          fileName: file.originalname,
          fileSize: file.size,
          extractedText: text,
        },
        "PDF text extracted successfully"
      )
    );
  } catch (error) {
    console.error("Error extracting PDF:", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "Failed to extract PDF text",
          [error.message],
          error.stack
        )
      );
  }
};

// --- Public endpoints ---

export const getPublicCoverLetter = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId) {
      return res
        .status(400)
        .json(new ApiError(400, "Cover letter slug or ID is required."));
    }

    const item = await CoverLetter.findOne({
      $or: [{ publicSlug: slugOrId }, { _id: slugOrId }],
    }).catch(() => CoverLetter.findOne({ publicSlug: slugOrId }));

    if (!item) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, item, "Public cover letter fetched."));
  } catch (error) {
    console.error("Error fetching public cover letter:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

export const trackCoverLetterView = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    if (!slugOrId) {
      return res
        .status(400)
        .json(new ApiError(400, "Cover letter slug or ID is required."));
    }

    await CoverLetter.findOneAndUpdate(
      { $or: [{ publicSlug: slugOrId }, { _id: slugOrId }] },
      { $inc: { viewCount: 1 } },
      { new: false }
    ).catch(() =>
      CoverLetter.findOneAndUpdate(
        { publicSlug: slugOrId },
        { $inc: { viewCount: 1 } },
        { new: false }
      )
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "View tracked successfully."));
  } catch (error) {
    console.error("Error tracking cover letter view:", error);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "View tracking failed on server."));
  }
};
