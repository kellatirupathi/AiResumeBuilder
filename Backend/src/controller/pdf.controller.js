import { generatePDF } from '../services/pdf.service.js';
import { generateCoverLetterPDF as generateCoverLetterPdfBuffer } from '../services/coverLetterPdf.service.js';
import Resume from '../models/resume.model.js';
import CoverLetter from '../models/coverLetter.model.js';
import Notification from '../models/notification.model.js';
import { sendDriveLinkEmail } from '../services/email.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Generate and download PDF for a specific resume (Authenticated user)
export const generateResumePDF = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json(new ApiError(400, "Resume ID is required"));
    }
    
    // Find the resume by ID
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found"));
    }
    
    // Check if the resume belongs to the current user
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json(
        new ApiError(403, "You are not authorized to access this resume")
      );
    }
    
    // Generate PDF using the service
    const pdfBuffer = await generatePDF(resume.toObject());
    
    // Set up response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title || 'resume'}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF first, then fire Drive link email in background
    res.send(pdfBuffer);

    // Fire-and-forget: send Drive link email after response is sent
    const user = req.user;
    const driveLink = resume.googleDriveLink;
    const downloadLinkEnabled = user.notificationPreferences?.downloadLink !== false;
    if (driveLink && downloadLinkEnabled) {
      (async () => {
        let status = "sent";
        let errorMessage = "";
        try {
          await sendDriveLinkEmail(user.fullName, user.email, resume.title || "Resume", driveLink);
        } catch (emailErr) {
          status = "failed";
          errorMessage = emailErr.message;
          console.error("Drive link email failed:", emailErr.message);
        }
        await Notification.create({
          userId: user._id,
          userEmail: user.email,
          userName: user.fullName,
          type: "download-link",
          resumeId: resume._id,
          resumeTitle: resume.title || "",
          status,
          errorMessage,
        }).catch((e) => console.error("Notification log failed:", e.message));
      })();
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to generate PDF", [error.message], error.stack)
    );
  }
};

// --- MODIFIED FUNCTION ---
// Redirect to the Google Drive link instead of generating the PDF.
export const generatePublicResumePDF = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json(new ApiError(400, "Resume ID is required"));
    }
    
    // Track view count logic (remains the same)
    Resume.findByIdAndUpdate(resumeId, { $inc: { viewCount: 1 } })
        .exec()
        .catch(trackError => {
            console.error(`Failed to track view for resume ${resumeId}:`, trackError);
        });

    // Find the resume by ID, only selecting the googleDriveLink field
    const resume = await Resume.findById(resumeId).select('googleDriveLink');

    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found"));
    }

    // NEW LOGIC: REDIRECT TO GOOGLE DRIVE
    if (resume.googleDriveLink) {
        console.log(`Redirecting to Google Drive link: ${resume.googleDriveLink}`);
        // 302 Found: A temporary redirect
        return res.redirect(302, resume.googleDriveLink);
    } else {
        // Fallback or error message if the link hasn't been generated yet
        return res.status(404).send('PDF is not yet available for this resume. Please try again in a moment.');
    }

  } catch (error) {
    console.error("Error redirecting to public PDF:", error);
    return res.status(500).json(new ApiError(500, "Failed to retrieve public PDF", [error.message], error.stack));
  }
};

// --- Cover Letter PDF endpoints ---

export const generateCoverLetterPDF = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json(new ApiError(400, "Cover letter ID is required"));
    }

    const item = await CoverLetter.findById(id);
    if (!item) {
      return res.status(404).json(new ApiError(404, "Cover letter not found"));
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(new ApiError(403, "You are not authorized to access this cover letter"));
    }

    const pdfBuffer = await generateCoverLetterPdfBuffer(item.toObject());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${item.title || "cover-letter"}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating cover letter PDF:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to generate cover letter PDF", [error.message], error.stack));
  }
};

// Generate PDF on-the-fly for public requests — no Drive required
export const generatePublicCoverLetterPDFDirect = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    if (!slugOrId) {
      return res
        .status(400)
        .json(new ApiError(400, "Cover letter slug/ID is required"));
    }

    let item;
    try {
      item = await CoverLetter.findOne({
        $or: [{ publicSlug: slugOrId }, { _id: slugOrId }],
      });
    } catch {
      item = await CoverLetter.findOne({ publicSlug: slugOrId });
    }

    if (!item) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found"));
    }

    // Track view (non-blocking)
    CoverLetter.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } })
      .exec()
      .catch((trackError) => {
        console.error(
          `Failed to track view for cover letter ${item._id}:`,
          trackError
        );
      });

    const pdfBuffer = await generateCoverLetterPdfBuffer(item.toObject());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${item.title || "cover-letter"}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating public cover letter PDF:", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Failed to generate cover letter PDF",
          [error.message],
          error.stack
        )
      );
  }
};

export const generatePublicCoverLetterPDF = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    if (!slugOrId) {
      return res.status(400).json(new ApiError(400, "Cover letter slug/ID is required"));
    }

    CoverLetter.findOneAndUpdate(
      { $or: [{ publicSlug: slugOrId }, { _id: slugOrId }] },
      { $inc: { viewCount: 1 } }
    )
      .exec()
      .catch(() =>
        CoverLetter.findOneAndUpdate(
          { publicSlug: slugOrId },
          { $inc: { viewCount: 1 } }
        ).exec()
      )
      .catch((trackError) => {
        console.error(`Failed to track view for cover letter ${slugOrId}:`, trackError);
      });

    let item;
    try {
      item = await CoverLetter.findOne({
        $or: [{ publicSlug: slugOrId }, { _id: slugOrId }],
      }).select("googleDriveLink");
    } catch {
      item = await CoverLetter.findOne({ publicSlug: slugOrId }).select(
        "googleDriveLink"
      );
    }

    if (!item) {
      return res.status(404).json(new ApiError(404, "Cover letter not found"));
    }

    if (item.googleDriveLink) {
      return res.redirect(302, item.googleDriveLink);
    }
    return res
      .status(404)
      .send("Cover letter PDF is not yet available. Please try again in a moment.");
  } catch (error) {
    console.error("Error redirecting to public cover letter PDF:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to retrieve public cover letter PDF", [error.message], error.stack));
  }
};
