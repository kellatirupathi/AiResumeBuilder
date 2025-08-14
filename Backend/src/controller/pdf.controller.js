// C:\Users\NxtWave\Downloads\code\Backend\src\controller\pdf.controller.js
import { generatePDF } from '../services/pdf.service.js';
import Resume from '../models/resume.model.js';
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
    
    // Send the PDF
    res.send(pdfBuffer);
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
